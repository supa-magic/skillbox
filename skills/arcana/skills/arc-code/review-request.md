# Code Review Request

Create PR from feature branch. Generate description from AC + plan + diff. Link ticket. Optionally start watcher.

## Steps

### Step 1: Gather Context

1. Read `.arcana/project-context.md` for conventions
2. Read AC files for the ticket
3. Read plan from `.arcana/{feature}/{ticket-id}/plan.md`
4. Read git diff of the feature branch against main

### Step 2: Generate PR Description

Build PR description from:
- **AC scenarios** — what this PR implements (link to AC files)
- **Plan summary** — what was changed and why
- **Diff summary** — files changed, key decisions

Description structure:

```markdown
## What
{Brief description of the behavior this PR implements}

## AC Scenarios
{List of scenarios from AC this PR covers, with links}

## Changes
{Summary of key changes by file/area}

## What's NOT in this PR
{Scope boundaries — what's deferred to other tickets}

## Testing
{How to verify — which AC scenarios to check}
```

### Step 3: Create PR

**Confirmation gate:** If `-y` → create PR. Otherwise → show PR title and description, then ask: "Create this PR?" Wait for confirmation.

Create a pull request using the appropriate skill or MCP tool:
- Title: concise, references ticket-id
- Description: generated in Step 2
- Link ticket in tracker (if tracker skill configured) → move to "in review"

#### Dependency: pull request creation

If no matching skill or MCP tool is available for creating pull requests, ask the developer:

> I need to create a pull request but couldn't find a skill or MCP server for that. How would you like to proceed?
>
> 1. **Install one** — `npx @supa-magic/spm install https://github.com/supa-magic/skillbox/tree/main/skills/github`
> 2. **Create a new skill** for PR management
> 3. **Search online** for a community skill or MCP server
> 4. **Tell me what to do** — create the PR manually and provide the URL

### Step 4: Start Watcher (--yes only)

If `--yes` flag was passed → start the watcher in background. The watcher polls PR status and automates the review cycle.

Watcher checks via the appropriate skill or MCP tool:

```
reviews              — approvals + changes requested
reviewRequests       — who hasn't reviewed yet
statusCheckRollup    — CI checks
mergeable            — conflicts
reviewDecision       — final status
comments             — unresolved threads
```

Ready-to-merge conditions (ALL must be true):
```
✅ Required approvals met
✅ All comment threads resolved
✅ All CI checks green
✅ No changes requested active
✅ Branch up to date with main (if required)
✅ No merge conflicts
```

Watcher cycle:
- CHANGES_REQUESTED or CI failed → **automatically invoke** `/arc:code review-resolve {pr-id} --yes`
- Resolve pushes fixes → wait for re-review
- Unresolved threads remain → **automatically invoke** `/arc:code review-resolve` again
- All conditions met → notify developer "PR ready to merge"
- PR merged → check `.arcana/{feature}/wave-status.md` → start next ticket if wave-based
- PR merged or closed → watcher stops

The watcher is the bridge between request and resolve — it detects review state changes and triggers resolve automatically. Without the watcher (no `--yes`), the developer invokes `/arc:code review-resolve` manually.

### Step 5: Output

> **PR Created — {ticket-id}:** {PR URL}
> Title: {title}
> Ticket: {ticket-id} → in review
> Watcher: {running | not started (use --yes)}

## Examples

### Example 1: Standard PR creation

User says: `/arc:code review-request TASK-512`
Actions:
1. Read AC, plan, diff
2. Generate description linking 3 AC scenarios
3. Show description, ask to confirm
4. Create PR via appropriate skill, update ticket status
Result: PR created, developer handles review manually

### Example 2: Autopilot PR with watcher

User says: `/arc:code review-request TASK-512 -y`
Actions:
1. Generate description
2. Create PR immediately
3. Start watcher — polls every N minutes
4. Watcher detects review comments → invokes `/arc:code review-resolve`
5. All conditions met → notifies developer
Result: PR created, watcher running in background
