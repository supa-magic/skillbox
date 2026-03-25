# Git Branch

Create a new branch from a GitHub issue or description.

## Steps

### Step 1: Load branch naming spec

Read and follow [references/conventional-branch.md](./references/conventional-branch.md).

Extended format used in this project: `<type>/<issue>/<short-description>`

- `<issue>` = GitHub issue number without `#` (e.g., `12`)
- `<short-description>` = 2-4 words, kebab-case

Examples: `feature/12/add-user-login`, `fix/34/validation-error`, `chore/78/update-dependencies`

### Step 2: Fetch GitHub issue (if issue number provided)

If no issue number is provided, ask the developer for a short description of the branch purpose to generate the branch name from.

```bash
gh issue view <number>
```

If the issue is not found → error: "Issue #`<number>` not found. Verify the issue number and try again." and stop.

Get issue labels (bug, enhancement, etc.) and title/description.

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
