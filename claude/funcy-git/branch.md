# Git Branch

Create a new branch from a GitHub issue or description.

## Branch Naming Convention

Format: `<type>/<issue>/<short-description>`

| Type | Use for |
|------|---------|
| `feature/` | New features |
| `fix/` | Bug fixes |
| `hotfix/` | Urgent fixes (e.g., security patches) |
| `release/` | Preparing a release (e.g., `release/v1.2.0`) |
| `chore/` | Non-code tasks (dependencies, docs) |

Rules:
- `<issue>` = GitHub issue number without `#` (e.g., `12`)
- `<short-description>` = 2-4 words, kebab-case
- No spaces, uppercase, or special characters

Examples: `feature/12/add-user-login`, `fix/34/validation-error`, `chore/78/update-dependencies`

## Steps

### Step 1: Fetch GitHub issue (if issue number provided)

If no issue number is provided, ask the developer for a short description of the branch purpose to generate the branch name from.

```bash
gh issue view <number>
```

If the issue is not found → error: "Issue #`<number>` not found. Verify the issue number and try again." and stop.

Get issue labels (bug, enhancement, etc.) and title/description.

### Step 2: Generate branch name

Determine prefix from issue labels AND description context:

- New feature, functionality → `feature/`
- Bug fix → `fix/`
- Urgent production fix → `hotfix/`
- Maintenance, cleanup, dependencies → `chore/`

If no labels are present or labels don't map to a known prefix, infer from the issue title/description. If still ambiguous, default to `feature/` and confirm with the developer.

### Step 3: Validate description length

- MUST be 2-4 words only (kebab-case)
- Count words: split by `-` and verify count is between 2-4
- If longer → shorten it, keep only key terms

### Step 4: Confirm branch name

**Confirmation gate:** Show the generated branch name. If `-y` → proceed. Otherwise → ask "Create branch `<branch-name>`?" and wait.

### Step 5: Create branch

```bash
git checkout -b <branch-name>
```

If the branch already exists → error: "Branch `<branch-name>` already exists. Switch to it with `git checkout <branch-name>` or choose a different name." and stop.

### Step 6: Report result

Inform the developer the branch was created and is now the active branch. Show the branch name.
