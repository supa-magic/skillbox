# Commit Squash

Squash all commits on the current branch into clean commit(s) via `/git commit`.

## Steps

### Step 1: Identify base branch

!`git branch --show-current`
!`git status --porcelain`

If on `main` or `master` → error: "Cannot squash on the main branch. Switch to a feature branch first." and stop.

If there are uncommitted changes → note them. They will be included in the squash — after soft reset, all branch changes (committed and uncommitted) end up as unstaged changes together.

Determine the merge-base. Try `main` first, fall back to `master` if it doesn't exist:

!`git merge-base main HEAD` — if this fails, try `git merge-base master HEAD`. If neither works, ask the developer.

### Step 2: Analyze all branch commits

List all commits that will be squashed:

```bash
git log --oneline <merge-base>..HEAD
```

If there are no commits (HEAD equals merge-base) → error: "No commits to squash — branch is already at the base." and stop.

**Analyze each commit** — read the diff of every commit to understand what it actually changed, not just the message (messages like "wip" are meaningless):

```bash
git show --stat <commit-sha>
```

For commits with unclear messages, inspect the actual changes to determine the logical group they belong to.

### Step 3: Plan logical groups

Group all changes across all commits by the most natural boundary — the same grouping rules as `/git commit`:

1. **By feature/component** — files that implement the same feature go together
2. **By type** — if changes span many components but share a type (all tests, all configs), group by type
3. **Single commit** — if all changes are cohesive, use a single commit

Present the grouping plan to the developer:

> **Squash plan — {N} commits → {M} clean commit(s):**
>
> 1. `<emoji><type>(<scope>): <description>` — {list of files/changes}
> 2. `<emoji><type>(<scope>): <description>` — {list of files/changes}
> ...

**Confirmation gate:** If `-y` or `--yes` → proceed. Otherwise → ask "Squash these N commits into M clean commits?" and wait.

### Step 4: Soft reset to base

Reset all commits while keeping changes staged:

```bash
git reset --soft <merge-base>
```

This undoes all commits on the branch but preserves every change in the working tree as staged.

### Step 5: Unstage all files

```bash
git restore --staged .
```

This moves all changes from staged to unstaged, so `/git commit` can analyze and group them fresh.

### Step 6: Create clean commit(s)

Invoke `/git commit` to create the planned commit(s). The grouping plan from Step 3 guides the commit structure — `/git commit` should follow it, not re-analyze from scratch.
