---
name: arc:code
description: >
  Write production code and manage code reviews. Implements from plan and AC with atomic commits.
  Review-request creates a PR, review-resolve handles review feedback.
  Use when implementing a task, writing feature code, creating PRs, or resolving review comments.
  Triggers on "/arc:code", "implement code", "write code for task", "code task", "continue implementation",
  "create PR", "open pull request", "resolve review", "handle PR comments".
user-invocable: true
argument-hint: "{ticket-id} | review-request {ticket-id} | review-resolve {pr-id} [-y]"
license: MIT
metadata:
  author: supa-magic
  version: 1.0.0
  category: development
  tags: [coding, implementation, pull-request, code-review, feature-development]
---

# /arc:code $ARGUMENTS

Write production code and manage code reviews.

## Usage

```
/arc:code JRA-123                      Implement task, confirm before committing
/arc:code JRA-123 -y                   Implement task, commit without confirmation
/arc:code review-request JRA-123       Create PR for ticket, confirm before creating
/arc:code review-request JRA-123 -y    Create PR + start watcher (autopilot)
/arc:code review-resolve 456           Resolve review comments on PR #456
/arc:code review-resolve 456 -y        Resolve comments without confirmation
```

| Argument | Format | Default | Effect |
|----------|--------|---------|--------|
| `subcommand` | Positional (1st token) | — | If `review-request` or `review-resolve`, routes to subcommand. Otherwise treated as `ticket-id` for implementation |
| `ticket-id` or `pr-id` | Positional | — | Ticket ID (for implement/review-request) or PR number (for review-resolve) |
| `-y`, `--yes` | Flag | `false` | Skip confirmations. For `review-request`: also starts watcher in background |

## Instructions

### Step 1: Parse Arguments

1. First non-flag token → check if it's `review-request` or `review-resolve`
   - If yes → that's the `subcommand`, next token is the `id`
   - If no → treat it as `ticket-id`, subcommand is `implement` (default)
2. If no arguments → error: "Ticket ID required. Usage: `/arc:code JRA-123` or `/arc:code review-request JRA-123`" and stop
3. `-y` or `--yes` anywhere → `skip_confirmations = true`

### Step 2: Route to Subcommand

| Subcommand | File | Purpose |
|------------|------|---------|
| _(default)_ | Follow steps below | Write production code from plan and AC |
| `review-request` | [review-request.md](review-request.md) | Create PR from AC + plan + diff via appropriate skill |
| `review-resolve` | [review-resolve.md](review-resolve.md) | Classify review comments, fix or respond |

If routed to a sub-instruction file → read it and follow all steps, then stop.

### Step 3: Check for Resume (implement only)

Check if `.arcana/{feature}/{ticket-id}/progress.md` exists:
- If exists → read it. Resume from where the previous session stopped. Skip already-completed steps.
- If not → fresh start.

### Step 4: Gather Context

1. Read `.arcana/project-context.md` for project structure and conventions
2. Read AC files for the ticket
3. Read plan from `.arcana/{feature}/{ticket-id}/plan.md`
4. If no plan exists → invoke `/arc:plan {ticket-id}` internally to create one, then read it
5. Read existing codebase files listed in the plan

### Step 5: Implement

Write production code following the plan:
- Follow the order of changes from the plan
- Follow existing patterns identified in the plan
- Follow conventions from `.arcana/project-context.md`
- Only production code — do NOT write tests (that's `/arc:test write`)
- Atomic commits — each commit is a logical unit of change

### Step 6: Update Progress

After each logical step, update `.arcana/{feature}/{ticket-id}/progress.md`:

```markdown
# Progress — {ticket-id}

**Status:** in-progress | complete
**Last updated:** {date}

## Completed Steps
- [x] {step from plan} — {files changed}
- [x] {step from plan} — {files changed}

## Remaining Steps
- [ ] {step from plan}

## Notes
{Any decisions made during implementation, deviations from plan, blockers}
```

This file enables resume if context is lost. The next session reads it and continues.

### Step 7: Commit

**Confirmation gate:** If `-y` → commit changes. Otherwise → show summary of changes and ask: "Commit these changes?" Wait for confirmation.

Commit to the feature branch. Use the project's git skill if configured, otherwise commit directly.

### Step 8: Output

> **Code — {ticket-id}:** {complete|in-progress}
> Files changed: {number}
> Commits: {number}
> Progress: `.arcana/{feature}/{ticket-id}/progress.md`
>
> Next: `/arc:test write {ticket-id}` to generate tests from AC.

## Examples

### Example 1: Fresh implementation

User says: `/arc:code TASK-512`
Actions:
1. No progress.md found → fresh start
2. Read plan — 3 files to change, follows existing form pattern
3. Implement step by step, update progress after each
4. Show changes, ask to commit
Result: Production code committed, progress.md shows complete

### Example 2: Resume after context loss

User says: `/arc:code TASK-512`
Actions:
1. Found progress.md — 2 of 4 steps complete
2. Read remaining steps from plan
3. Continue from step 3
4. Complete implementation
Result: Remaining code committed, progress.md updated to complete

### Example 3: Create a PR

User says: `/arc:code review-request TASK-512`
Actions:
1. Read AC, plan, diff
2. Generate PR description linking AC scenarios
3. Create PR via appropriate skill
Result: PR created, developer handles review manually

### Example 4: Resolve review comments

User says: `/arc:code review-resolve 456`
Actions:
1. Fetch PR comments, classify each
2. Fix relevant issues, respond to non-relevant ones
3. Push fix commits
Result: 2 threads resolved, 2 responses posted

## Troubleshooting

### Error: No AC files found
Cause: No AC for this ticket — coding without requirements.
Solution: Run `/arc:prd create` or `/arc:ac enrich` first. Code without AC risks implementing the wrong behavior.

### Error: Plan recommends splitting the task
Cause: Task is too large for one context window.
Solution: Follow the plan's recommendation — use `/arc:prd update` to split into smaller tickets, then `/arc:code` each one separately.

### Implementation diverges from plan
Cause: During coding, the plan turns out to be wrong or incomplete.
Solution: Update progress.md with notes about the divergence. The plan is a guide, not a contract — adapt as needed but document why.

### Error: No feature branch
Cause: Attempting to create PR from main/master.
Solution: Create a feature branch first. `/arc:code` should have created one during implementation.
