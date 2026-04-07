# Git Branch

Create a new branch from an issue tracker ticket or description.

## Steps

### Step 1: Load branch naming spec

Read and follow [references/conventional-branch.md](./references/conventional-branch.md).

Extended format used in this project: `<type>/<issue>/<short-description>`

- `<issue>` = ticket/issue number without `#` (e.g., `12`)
- `<short-description>` = 2-4 words, kebab-case

Examples: `feature/12/add-user-login`, `fix/34/validation-error`, `chore/78/update-dependencies`

### Step 2: Fetch ticket (if issue number provided)

If no issue number is provided, ask the developer for a short description of the branch purpose to generate the branch name from. Skip to Step 3.

Fetch the ticket description and labels from the project's issue tracker using the appropriate skill or MCP tool.

If the issue is not found → error: "Issue #`<number>` not found. Verify the issue number and try again." and stop.

#### Dependency: issue tracker

If no matching skill or MCP tool is available for fetching ticket information, ask the developer:

> I need to fetch ticket details but couldn't find a skill or MCP server for that. How would you like to proceed?
>
> 1. **Install one** — `npx @supa-magic/spm install https://github.com/supa-magic/skillbox/tree/main/skills/<skill-name>`
> 2. **Create a new skill** for issue tracker integration
> 3. **Search online** for a community skill or MCP server
> 4. **Tell me what to do** — provide the ticket title and labels manually

### Step 3: Generate branch name

Determine type prefix from issue labels AND description context. If no labels or ambiguous, infer from the issue title/description. If still unclear, default to `feature/` and confirm with the developer.

Validate description: 2-4 words, kebab-case. If longer → shorten, keep only key terms.

### Step 4: Confirm branch name

**Confirmation gate:** Show the generated branch name. If `-y` or `--yes` → proceed. Otherwise → ask "Create branch `<branch-name>`?" and wait.

### Step 5: Create branch

```bash
git switch -c <branch-name>
```

If the branch already exists → error: "Branch `<branch-name>` already exists. Switch to it with `git switch <branch-name>` or choose a different name." and stop.

### Step 6: Report result

Inform the developer the branch was created and is now the active branch. Show the branch name.
