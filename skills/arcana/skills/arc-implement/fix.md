# Implement — Bug Fix

Short implementation cycle for bug fixes. Groups related skills into tiered agent calls. Single skills run directly in main chat.

**Agent tiers:**
- `arc:archmage` — deep reasoning, code generation (opus)
- `arc:mage` — analysis, enrichment, tests (sonnet)
- `arc:apprentice` — validation, checks, execution (haiku)

## Pipeline

```
main            — create ticket (if no ticket-id)
[gate]

/arc:mage       — AC Phase: read bug → prd update → ac update → ac validate
[gate]

/arc:archmage   — Fix Phase: test write → code → test validate
[gate]

/arc:mage       — Verify Phase: ac verify
[gate]

main            — code review-request
[gate]
/arc:archmage   — code review-resolve (on demand)
[gate]
                  merge → main (HUMAN)
```

## Steps

### Step 0: Gather Bug Details and Create Ticket (main — if no ticket-id)

If the developer provided a `ticket-id` → skip this step.

If `--fix` was called without a ticket-id → interactive mode:

> **What's the bug?** Describe what's broken — expected vs actual behavior.

Wait for response.

> **How to reproduce?** Steps to trigger the bug (or "unknown").

Wait for response.

> **Which feature/area is affected?** (or "not sure")

Wait for response.

From the collected details:
1. Summarize into a structured bug report (what's broken, reproduction steps, affected area)
2. Use the issue tracker skill (configured in `project-context.md`) to create a bug ticket
3. Store the created `ticket-id` for the rest of the pipeline

**Gate:** If not `--yes` → show the created ticket and ask: "Proceed?"

### Step 1: AC Phase (arc:mage)

```
/arc:mage
Read .arcana/project-context.md, AC files for {ticket-id}, and bug report from tracker.
Run in order:
  1. Analyze the bug report — identify what's broken, reproduction steps, affected feature.
  2. If PRD is vague or missing context for this bug → prd update.
  3. ac update — add scenario covering the bug (describe expected behavior, not the bug).
  4. ac validate — verify new scenario quality.
     If fail → ac update → ac validate (loop, max {--max-retries}).
Flags: {pass --yes and --max-retries}.
Write result to .arcana/{feature}/{ticket-id}/ac-phase-result.md.
```

**Gate:** Read ac-phase-result.md. If FAILED → stop. If not `--yes` → show new AC scenario and ask: "Proceed?"

### Step 2: Fix Phase (arc:archmage)

```
/arc:archmage
Read .arcana/project-context.md, AC files for {ticket-id},
test/references/testing-strategy.md, relevant example references from project-context,
production code and test files for the feature.
Run in order:
  1. test write — write test that reproduces the bug (should be RED before fix).
  2. code — fix the bug (test should go GREEN).
  3. test validate — run tests.
     If red → fix code or tests → test validate (loop, max {--max-retries}).
Flags: {pass --yes and --max-retries}.
Write result to .arcana/{feature}/{ticket-id}/fix-phase-result.md.
```

**Gate:** Read fix-phase-result.md. If FAILED → stop. If not `--yes` → show results and ask: "Proceed?"

### Step 3: Verify Phase (arc:mage)

```
/arc:mage
Read .arcana/project-context.md, AC files for {ticket-id},
production code and test files for the feature.
Run: ac verify.
If partial → fix code → ac verify (loop, max {--max-retries}).
Flags: {pass --yes and --max-retries}.
Write result to .arcana/{feature}/{ticket-id}/verify-phase-result.md.
```

**Gate:** Read verify-phase-result.md. If FAILED → stop. If not `--yes` → show verify report and ask: "Proceed?"

### Step 4: PR (main)

Run `/arc:code review-request {ticket-id}` directly in main chat.

**Gate:** If not `--yes` → show PR link.

### Step 5: PR Resolution (arc:archmage — on demand)

When review comments appear:

```
/arc:archmage
Read .arcana/project-context.md, AC files for {ticket-id},
PR comments and review status for {pr-id}.
Run: code review-resolve.
Flags: {pass --yes and --max-retries}.
Write result to .arcana/{feature}/{ticket-id}/review-resolve-result.md.
```

Without `--yes` → developer invokes `/arc:code review-resolve {pr-id}` manually.

### Step 6: Merge

**Always human.** Merge is irreversible. Agent does not press the merge button.
