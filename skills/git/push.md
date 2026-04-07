# Git Push

Validate all branch commits and push to remote.

## Steps

### Step 1: Identify branch and commits

```bash
git branch --show-current
```

If on `main` or `master` → error: "Cannot push directly to main. Use a feature branch." and stop.

Determine base branch and fetch latest refs:

```bash
git fetch origin
```

Use `main`, if it doesn't exist try `master`. If neither works, ask the developer.

Find all commits on the branch:

```bash
git log --oneline $(git merge-base origin/$BASE_BRANCH HEAD)..HEAD
```

If no commits → error: "No commits to push — branch is at the base." and stop.

### Step 2: Validate commit messages

Check every branch commit message for violations:

```bash
git log --format="%H %s" $(git merge-base origin/$BASE_BRANCH HEAD)..HEAD
```

Reject if any message:
- Starts with `wip` or `WIP` (case-insensitive)
- Contains `Co-Authored-By` or `Co-authored-by`

If violations found → list them and stop. Suggest using `/git commit squash` to clean up.

### Step 3: Push

**Confirmation gate:** Show branch name and commit count. If `-y` or `--yes` → proceed. Otherwise → ask "Push N commit(s) to `origin/<branch>`?" and wait.

```bash
git push -u origin <branch-name>
```

### Step 4: Report result

Show the push result and remote branch URL if available.
