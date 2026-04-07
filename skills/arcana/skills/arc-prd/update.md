# PRD Update

Cascade update when requirements change. Modifies PRD → updates affected AC → marks tickets that need review.

## Steps

### Step 1: Locate Existing PRD

1. Read `.arcana/project-context.md` for project structure
2. Find PRD directory for `feature-name`
3. If not found → error: "No PRD found for `{feature-name}`. Use `/arc:prd create {feature-name}` first." and stop
4. Read existing PRD and all AC files

### Step 2: Gather Changes

Ask the developer what changed:

> What changed in **{feature-name}**? Describe the requirement changes — I'll cascade updates through PRD, AC, and tickets.

Wait for response. If changes are unclear → ask follow-up questions.

### Step 3: Update PRD

Apply changes to `prd.md`:
- Update affected sections
- Add entry to change history with date and description
- Do not rewrite unchanged sections

**Confirmation gate:** If `-y` → proceed. Otherwise → show the PRD diff and ask: "Apply these changes to the PRD?" Wait for confirmation.

### Step 4: Update Affected AC

Determine which AC scenarios are affected by the PRD changes:
- Modified requirements → update corresponding scenarios
- New requirements → add new scenarios to appropriate AC file
- Removed requirements → mark scenarios as removed (do not delete — comment out with reason)

**Confirmation gate:** If `-y` → proceed. Otherwise → show AC changes and ask: "Apply these AC changes?" Wait for confirmation.

### Step 5: Mark Affected Tickets

If a tracker skill is configured:
1. Identify which tickets are affected by the AC changes
2. Add a comment to each affected ticket via the tracker skill explaining what changed
3. If new tasks needed → create new tickets

If no tracker skill → list affected tasks in the output for the developer to update manually.

### Step 6: Output

> **PRD Updated — {feature-name}:**
> - PRD: updated {number} sections
> - AC: {number} scenarios modified, {number} added, {number} removed
> - Tickets affected: {list of ticket IDs or "no tracker configured — manual update needed"}
> - Change: {brief description of what changed}
