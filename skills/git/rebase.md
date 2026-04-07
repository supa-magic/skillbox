# Git Rebase

Rebase current branch onto another branch.

## Steps

### Step 1: Fetch and confirm

If no branch argument was provided, default to `main`.

!`git fetch origin`

**Confirmation gate:** Show which branch the current branch will be rebased onto. If `-y` or `--yes` → proceed. Otherwise → ask "Rebase `<current>` onto `origin/<branch>`?" and wait.

### Step 2: Rebase

```bash
git rebase origin/<branch-name>   # default: main
```

### Step 3: Resolve conflicts (if any)

1. **Analyze both sides** (rebase swaps ours/theirs vs merge):
   - Ours = the upstream branch being rebased onto (target branch commits)
   - Theirs = your commits being replayed on top

2. **Resolve wisely:**
   - Preserve your implementation logic from "theirs" (your replayed commits)
   - Integrate upstream changes from "ours" (imports, renamed functions, refactors)
   - If upstream refactored code → adapt your changes to the new structure
   - If both modified same logic → combine intentions, prefer cleaner solution

3. **After resolving each conflict:**
   ```bash
   git add <resolved-file>
   git rebase --continue
   ```
   Repeat for each conflicting commit until rebase completes.

4. **If stuck:** `git rebase --abort` and ask for help.

### Step 4: Report result

Inform the developer whether the rebase succeeded or if conflicts were resolved. Show the current branch status.
