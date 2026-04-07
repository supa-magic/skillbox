# AC Update

Fix existing AC based on feedback. Pure writer — takes instructions, updates AC files.

## Steps

### Step 1: Identify Feedback Source

Determine where the feedback is coming from:

1. **`/arc:ac validate` report** — criterion failed, scenario needs rewriting. Read `.arcana/{feature}/{ticket-id}/validate-report.md` for specific failures.
2. **`/arc:test mutate` report** — surviving mutant = gap in AC, need to add scenario. Read `.arcana/{feature}/{ticket-id}/mutate-report.md` for mutant analysis.
3. **Human feedback** — code review comments, PM changed requirements, developer notes. Read from conversation context.

### Step 2: Locate AC Files

1. Read `.arcana/project-context.md` to find AC file locations and project conventions
2. Find AC files for `ticket-id`
3. If no AC files found → error and stop

### Step 3: Apply Changes

Based on feedback source:

**From `/arc:ac validate` (criterion failed):**
- Read the validate report to identify which scenarios failed and which criteria
- Rewrite failed scenarios to meet all four criteria (Falsifiable, Observable, Testable, Implementation-free)
- Do not change scenarios that passed

**From `/arc:test mutate` (surviving mutant):**
- Read the mutate report to identify the gap in AC
- Add new scenario that covers the behavior exposed by the surviving mutant
- Append to the appropriate AC file (error-states.md, validation.md, or edge-cases.md)

**From human feedback:**
- Apply the requested changes directly
- If feedback is ambiguous → ask for clarification before modifying

### Step 4: Write Updated AC

**Confirmation gate:** If `-y` → write updated AC files. Otherwise → show the changes (old vs new for modified scenarios, new content for added scenarios), then ask: "Apply these changes to AC files?" Wait for confirmation.

### Step 5: Output

> **AC Update — {ticket-id}:** {number} scenarios modified, {number} scenarios added
> - Modified: {list of changed scenarios with file names}
> - Added: {list of new scenarios with file names}
> - Feedback source: {validate report | mutate report | human}
>
> Run `/arc:ac validate {ticket-id}` to verify updated scenarios meet quality standards.
