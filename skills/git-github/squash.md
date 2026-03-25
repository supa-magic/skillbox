# Git Squash

Squash all commits on the current branch into clean commit(s) via `/git commit`.

## Steps

### Step 1: Identify base branch

```bash
git branch --show-current
```

If on `main` or `master` → error: "Cannot squash on the main branch. Switch to a feature branch first." and stop.

Check for uncommitted changes:

```bash
git status --porcelain
```

If there are uncommitted changes → error: "Working tree has uncommitted changes. Commit or stash them before squashing." and stop.

Determine the base branch by checking which branch the current branch diverged from:

```bash
git merge-base main HEAD
```

If `main` doesn't exist, try `master`. If neither works, ask the developer.

### Step 2: Show what will be squashed

List all commits that will be squashed:

```bash
git log --oneline <merge-base>..HEAD
```

If there are no commits (HEAD equals merge-base) → error: "No commits to squash — branch is already at the base." and stop.

**Confirmation gate:** Show the commit count and list. If `-y` or `--yes` → proceed. Otherwise → ask "Squash these N commits?" and wait.

### Step 3: Soft reset to base

Reset all commits while keeping changes staged:

```bash
git reset --soft <merge-base>
```

This undoes all commits on the branch but preserves every change in the working tree as staged.

### Step 4: Unstage all files

```bash
git restore --staged .
```

This moves all changes from staged to unstaged, so `/git commit` can analyze and group them fresh.

### Step 5: Create clean commit(s)

Invoke `/git commit` to analyze all changes and create clean, well-grouped commit(s).
