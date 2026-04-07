# Ship

Ship experimental changes by analyzing your diff, creating a GitHub issue, branching, committing, and opening a PR.

If `-y` is passed, all sub-skill invocations inherit `-y`.

### Step 1: Verify branch and analyze changes

Verify the current branch is `main`:

!`git branch --show-current`

If not on `main` — stop and tell the developer: "Ship works only from the main branch. Switch to main first or use the individual commands (issue create, branch, commit, pull-request create)."

Check for changes:

!`git status --short`
!`git diff --stat`
!`git diff --cached --stat`

Read the key changed files to understand the implementation. Focus on:

- New files added
- Significant modifications
- Patterns in the changes (new feature? fix? refactor?)

If there are no changes (no uncommitted and no staged changes) — stop and tell the developer there's nothing to ship.

### Step 2: Summarize and gather context

Present a concise summary to the developer:

- What was added/changed/fixed (2-3 bullet points)
- Files affected
- Type assessment: feature / bug fix / chore

**Confirmation gate:** Say "Here's what I see in your changes: [summary]. I'll create a GitHub issue from this." If `-y` → proceed. Otherwise → ask "Anything you want to add or correct?" and wait.

### Step 3: Create issue

Invoke `/github issue create` — use the change summary and developer input from Step 2 as context. Skip the initial "What do you want to build?" question and go directly to drafting the issue.

Use `[x]` (checked) for acceptance criteria since the work is already done.

Capture the **issue number** from the output.

### Step 4: Create branch

Create a branch from the issue number using the appropriate skill or MCP tool.

This creates a properly named branch and switches to it — uncommitted changes carry over.

#### Dependency: branch creation

If no matching skill or MCP tool is available for creating branches, ask the developer:

> I need to create a branch but couldn't find a skill or MCP server for that. How would you like to proceed?
>
> 1. **Install one** — `npx @supa-magic/spm install https://github.com/supa-magic/skillbox/tree/main/skills/git`
> 2. **Create a new skill** for branch management
> 3. **Search online** for a community skill or MCP server
> 4. **Tell me what to do** — provide the branch name to use

### Step 5: Commit

Commit the changes on the new branch using the appropriate skill or MCP tool.

#### Dependency: commit

If no matching skill or MCP tool is available for committing, ask the developer:

> I need to commit changes but couldn't find a skill or MCP server for that. How would you like to proceed?
>
> 1. **Install one** — `npx @supa-magic/spm install https://github.com/supa-magic/skillbox/tree/main/skills/git`
> 2. **Create a new skill** for commit management
> 3. **Search online** for a community skill or MCP server
> 4. **Tell me what to do** — commit manually and confirm when done

### Step 6: Create PR

Invoke `/github pull-request create` — it reads the issue number from the branch name and generates the PR title and description.

### Step 7: Output

Show the results:

```
Shipped!

Issue:  <issue-url>
PR:     <pr-url>
Branch: <branch-name>
```
