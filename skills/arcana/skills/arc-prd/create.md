# PRD Create

Interactive session with the developer. Always pair mode — cannot run with `--yes`. Requirements need human input at every step.

## Steps

### Step 1: Check for Existing PRD

1. Read `.arcana/project-context.md` for project structure and conventions
2. Check if PRD directory for `feature-name` already exists
3. If exists → error: "PRD for `{feature-name}` already exists. Use `/arc:prd update {feature-name}` instead." and stop

### Step 2: Gather Requirements (Interactive)

Ask the developer to describe the feature. Accept rough notes, bullet points, anything:

> What should **{feature-name}** do? Describe the problem, who it's for, and what success looks like. Rough notes are fine — I'll shape it into a structured PRD.

Wait for response. Ask follow-up questions to clarify:
- What problem does this solve?
- Who are the users?
- What's in scope / out of scope?
- What does success look like? (metrics)
- Any non-functional requirements? (performance, security, accessibility)
- Any dependencies or blockers?

### Step 3: Draft PRD

Write the PRD following the template in [references/prd-structure.md](references/prd-structure.md).

Show the draft to the developer:

> Here's the PRD for **{feature-name}**. Review and let me know what to change.

Wait for approval. Revise as needed. Loop until developer confirms.

### Step 4: Write AC Scenarios

Based on the approved PRD, write AC scenarios in Given/When/Then format. Start with happy path, then add validation, error states, and edge cases.

Organize scenarios into AC files:
```
ac/happy-path.md     ← main user journey
ac/validation.md     ← input rules, state transitions
ac/error-states.md   ← external failures
ac/edge-cases.md     ← boundary conditions
```

Not every feature needs all four files. Small features may only need happy-path.md.

Show AC scenarios to the developer:

> Here are the Acceptance Criteria. Each scenario is in Given/When/Then format. Review and let me know what to change or add.

Wait for approval. Revise as needed. Loop until developer confirms.

### Step 5: Slice into Tasks

Split the feature into tasks. Each task is a vertical slice — a complete piece of behavior that can be deployed and verified independently.

Rules from [references/prd-structure.md](references/prd-structure.md):
- **Happy path is always the first task** — unblocks everything else
- Each task references a specific AC file and lists which scenarios it implements
- Each task explicitly states what is NOT included → which task covers it
- Tasks sliced by behavior, not by layers (not "UI task" + "API task")
- Tasks must be small enough for one skill to complete in one context window
- If a task looks too large → split into subtasks, each with its own AC

Show the task breakdown to the developer:

> Here's how I'd break this into tasks. Each task is a vertical slice with its own AC scenarios. Review the order and scope.

Wait for approval. Revise as needed.

### Step 6: Write Files

Write PRD and AC files to the repository.

### Step 7: Create Tickets (if tracker available)

If a tracker skill is configured in `.arcana/project-context.md`:
1. Create Epic for the feature via the tracker skill
2. Create tickets for each task via the tracker skill
3. Each ticket contains: link to PRD, link to AC file, list of scenarios it implements, what's NOT included

If no tracker skill → skip this step, inform the developer.

### Step 8: Output

> **PRD Created — {feature-name}:**
> - PRD: `{path}/prd.md`
> - AC files: {list}
> - Tasks: {number} tasks
> - Tickets: {list of ticket IDs, or "skipped — no tracker configured"}
