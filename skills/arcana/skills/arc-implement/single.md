# Implement — Single Ticket

Full implementation cycle for one ticket. Groups related skills into tiered agent calls to share context. Single skills run directly in main chat.

**Agent tiers:**
- `arc:archmage` — deep reasoning, code generation (opus)
- `arc:mage` — analysis, enrichment, tests (sonnet)
- `arc:apprentice` — validation, checks, execution (haiku)

## Pipeline

```
/arc:mage       — AC Phase: ac validate → ac enrich → ac validate
[gate]

main            — plan
[gate]

/arc:archmage   — Code: code
[gate]

/arc:mage       — Test Phase: test write → test review → test validate → test mutate → ac verify
[gate]

main            — code review-request
[gate]
/arc:archmage   — code review-resolve (on demand)
[gate]
                  merge → main (HUMAN)
                  project skill-up (post-merge)
```

If `--test-first` → Test Phase (arc:mage) runs before Code Phase (arc:archmage). Mage writes tests first, then archmage writes code to make them pass.

## Steps

### Step 1: AC Phase (arc:mage)

```
/arc:mage
Read .arcana/project-context.md and AC files for {ticket-id}.
Run in order: ac validate → ac enrich → ac validate.
If ac validate fails → ac update → ac validate (loop, max {--max-retries}).
If --skip=ac-enrich → skip ac enrich.
Flags: {pass --yes and --max-retries}.
Write result to .arcana/{feature}/{ticket-id}/ac-phase-result.md.
```

**Gate:** Read ac-phase-result.md. If FAILED → stop, show report. If not `--yes` → show enriched AC and ask: "Proceed?"

### Step 2: Plan (main)

Run `/arc:plan {ticket-id}` directly in main chat.

If plan recommends splitting → stop, suggest `/arc:prd update`.

**Gate:** If not `--yes` → show plan and ask: "Proceed?"

### Step 3: Code (arc:archmage)

If `--test-first` → skip to Step 4 first, then return here.

```
/arc:archmage
Read .arcana/project-context.md, AC files for {ticket-id},
plan from .arcana/{feature}/{ticket-id}/plan.md.
Run: code.
Flags: {pass --yes}.
Write result to .arcana/{feature}/{ticket-id}/code-phase-result.md.
```

**Gate:** Read code-phase-result.md. If not `--yes` → show changes and ask: "Proceed?"

### Step 4: Test Phase (arc:mage)

```
/arc:mage
Read .arcana/project-context.md, AC files for {ticket-id},
test/references/testing-strategy.md, relevant example references from project-context,
production code and test files for the feature.
Run in order: test write → test review → test validate → test mutate → ac verify.
If test review needs work → test write → test review (loop, max {--max-retries}).
If test validate red → fix code or tests → test validate (loop, max {--max-retries}).
If test mutate survivors → ac update → test write → test mutate (loop, max {--max-retries}).
If ac verify partial → fix code → ac verify (loop, max {--max-retries}).
If --skip=test-review → skip test review.
If --skip=test-mutate → skip test mutate.
Flags: {pass --yes and --max-retries}.
Write result to .arcana/{feature}/{ticket-id}/test-phase-result.md.
```

**Gate:** Read test-phase-result.md. If FAILED → stop, show report. If not `--yes` → show test results and ask: "Proceed?"

### Step 5: PR (main)

Run `/arc:code review-request {ticket-id}` directly in main chat.

**Gate:** If not `--yes` → show PR link.

### Step 6: PR Resolution (arc:archmage — on demand)

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

### Step 7: Merge

**Always human.** Merge is irreversible. Agent does not press the merge button.

### Step 8: Skill-Up

With `--yes` → run `/arc:project skill-up` after merge.
Without `--yes` → developer invokes manually.

## --stop Flag

`--stop={phase}` runs in `--yes` mode until the specified phase, then switches to pair mode.

Phase names for `--stop`:
```
ac-validate, ac-enrich, plan, code, test-write, test-review,
test-validate, test-mutate, ac-verify, code-review-request, code-review-resolve
```

Example: `--yes --stop=code-review-request` → autopilot through coding and testing, then pair mode for PR review.

## --skip Flag

`--skip={phase}` skips a phase entirely. Can be repeated.

Skippable phases:
```
ac-enrich, test-review, test-mutate
```

Other phases are mandatory and cannot be skipped.
