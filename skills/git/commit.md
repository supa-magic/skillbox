# Git Commit

Smart commit with auto-grouping of changes.

## Rules

- Always verify branch name follows naming convention before committing
- Never add `Co-Authored-By` or AI/Claude references to commit messages
- Never commit sensitive files (`.env`, credentials, secrets)
- Prefer staging specific files over `git add -A` or `git add .`

## Steps

### Step 1: Load commit message spec

Read and follow [references/conventional-commits.md](./references/conventional-commits.md).

### Step 2: Check branch name

!`git branch --show-current`

Verify current branch follows naming convention (`<type>/<issue>/<description>`).
If invalid → warn user before proceeding.

### Step 3: Analyze changes

!`git status`
!`git diff --staged`
!`git diff`

| Scenario | Action |
|----------|--------|
| Files already staged | Commit staged files only |
| No files staged | Analyze all changes, group, create separate commits |

Analyze git changes and create a commit message. Use present tense and explain "why" something has changed, not just "what" has changed.

### Step 4: Group changes into logical commits

Group by the most natural boundary — whichever produces the clearest commits:

1. **By feature/component** — files that implement the same feature or touch the same component go together (e.g., a new API endpoint + its route registration + its types)
2. **By type** — if changes span many components but share a type, group by type (e.g., all test files in one commit, all dependency updates in another)
3. **Single commit** — if all changes are cohesive (one feature, one fix), use a single commit

Prefer fewer commits over many tiny ones. When in doubt, one well-described commit is better than three artificial groupings.

### Step 5: Create commit(s)

Always pass the commit message via a HEREDOC to avoid issues with special characters and multi-line messages:

```bash
git commit -m "$(cat <<'EOF'
<type>(<scope>): <description>

<optional body>

<optional footer>
EOF
)"
```

**Confirmation gate:** Show the planned commit message(s) and files. If `-y` or `--yes` → proceed. Otherwise → ask "Proceed with commit?" and wait.

### Step 6: Report result

Show the developer the commit SHA(s) and message(s) created.
