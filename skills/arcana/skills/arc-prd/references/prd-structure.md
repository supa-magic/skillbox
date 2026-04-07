# PRD and AC Structure

Templates and conventions for PRD, AC files, and task slicing.

## PRD Template

```markdown
# {Feature Name}

## Problem and Goal
What problem does this solve? Why now?

## Users
Who are the target users? What are their needs?

## Scope
### What's included
- ...

### What's NOT included
- ...

## User Journey
Prose description of the main user flow.

## Success Metrics
How do we know this is working? Measurable outcomes.

## Non-functional Requirements
Performance, security, accessibility, compatibility.

## Dependencies
External services, other features, team dependencies.

## Open Questions
Unresolved decisions or unknowns.

## Change History
| Date | Change | Reason |
|------|--------|--------|
| {date} | Initial version | — |
```

## AC File Structure

AC files live alongside the PRD. Actual directory path comes from `.arcana/project-context.md`.

```
{feature}/
  prd.md              ← PRD (read by PM and developer for context)
  ac/
    happy-path.md     ← main scenarios (read by developer and agent for tests)
    validation.md     ← input validation, state transitions
    error-states.md   ← external failures (network, API, services)
    edge-cases.md     ← boundary conditions
```

**PRD and AC have different audiences:**
- `prd.md` — read by PM and developer for understanding context
- `ac/*.md` — read by developer and agent for generating tests

Not every feature needs all four AC files. Small features may only need `happy-path.md`.

## AC Format

Every scenario follows Given/When/Then:

```
Scenario: {descriptive name}
  Given: {precondition — state before action}
  When:  {action — what the user does}
  Then:  {expected result — what the user sees}
```

Multiple Then clauses allowed. Each must be independently verifiable.

**Example — happy-path.md:**

```markdown
# Checkout — Happy Path

## Scenario 1: Successful card payment
  Given: user is authenticated, cart has items
  When:  fills address and card details, clicks "Pay"
  Then:  redirected to /orders/{id}/success
         cart is cleared
         confirmation email sent

## Scenario 2: Order summary before payment
  Given: user is on checkout page
  When:  page loads
  Then:  shows item list with quantities and prices
         shows total including tax and shipping
         shows estimated delivery date
```

## Task Slicing Rules

### Vertical slices — by behavior, not by layers

```
❌ By layers (bad):
   Task 1: Checkout UI components
   Task 2: Checkout API endpoints
   → Nothing can be verified until both are done

✅ By behavior (good):
   Task 1: User creates a meeting (happy path)
   Task 2: Schedule conflict handling
   Task 3: Recurring meetings
   → Each can be deployed and verified independently
```

### Happy path is always the first task

It unblocks everything else. Error handling, edge cases, and optimizations come after.

### AC files naturally group into tasks

```
ac/happy-path.md     → Task 1
ac/validation.md     → Task 2 (can be parallel with Task 1)
ac/error-states.md   → Task 3 (depends on Task 1)
ac/edge-cases.md     → Task 4 (last)
```

### Task sizing

Tasks must be small enough for one skill to complete in one context window. A large task = agent loses context mid-work = poor result.

Sizing signals:
- Plan + AC + affected code should fit in ~50% of the context window (rest is for work)
- One vertical slice, 1-3 main files changed
- A task a developer would do in 2-4 hours

If a task looks too large → split into subtasks. Each subtask is an independent vertical slice with its own AC.

### Task ticket structure

```markdown
# {TICKET-ID}: {Feature} — {behavior slice}

PRD: {path}/prd.md
AC:  {path}/ac/{file}.md

## What we're doing
{Brief description of the behavior this task implements}

## Scenarios from AC
- Scenario 1: {name}
- Scenario 3: {name}

## What's NOT in this task
- {behavior} → {TICKET-ID}
- {behavior} → {TICKET-ID}
```

## What Lives in Git vs What Doesn't

```
In git (permanent):
  {features-directory}/{feature}/prd.md
  {features-directory}/{feature}/ac/*.md

NOT in git (temp, gitignored):
  .arcana/{feature}/{ticket-id}/*.md  (plans, reports, progress)
```

PRD and AC are permanent documentation. They survive after tickets are closed. Six months later, when the feature needs changes — open the same PRD, add scenarios, create new Epic.
