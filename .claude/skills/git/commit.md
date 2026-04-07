# Git Commit

Smart commit with auto-grouping of changes.

## Commit Message Format

Structure: `<emoji><type>(<scope>): <description>`

| Emoji | Type | Use for |
|-------|------|---------|
| 📦 | feat | New feature |
| 🛠️ | fix | Bug fix |
| 🔨 | refactor | Code change that neither fixes bug nor adds feature |
| 🚀 | perf | Performance or optimization |
| 🧪 | test | Adding or updating tests |
| 🎨 | style | Formatting, whitespace (no code logic change) |
| 📃 | docs | Documentation only |
| 🧹 | chore | Maintenance, dependencies update |
| ✨ | ai | AI related changes |
| 🏗️ | build | Build system, external dependencies |
| ⚙️ | ci | CI/CD configuration |
| 🎏 | merge | Git branch merge |
| 🔙 | revert | Revert previous commit |

Rules:
- `<type>` = required, lowercase
- `<scope>` = optional, lowercase, component/feature name
- `<description>` = required, max 50 chars, imperative mood, lowercase start
- `<body>` = optional, explain what and why (not how)
- `<footer>` = optional, references (e.g., `Closes #123`)
- Breaking change: add `!` after type, e.g. `feat!: remove deprecated API`

Examples: `📦feat(auth): add login screen`, `🛠️fix(build): correct asset copy path`, `🧹chore: update lynx sdk to 3.7.0`

## Steps

### Step 1: Check branch name

!`git branch --show-current`

Verify current branch follows naming convention (`<type>/<issue>/<description>`).
If invalid → warn user before proceeding.

### Step 2: Analyze changes

!`git status`
!`git diff --staged`
!`git diff`

| Scenario | Action |
|----------|--------|
| Files already staged | Commit staged files only |
| No files staged | Analyze all changes, group, create separate commits |

Analyze git changes and create a commit message. Use present tense and explain "why" something has changed, not just "what" has changed.

### Step 3: Group changes into logical commits

Group by the most natural boundary — whichever produces the clearest commits:

1. **By feature/component** — files that implement the same feature or touch the same component go together (e.g., a new API endpoint + its route registration + its types)
2. **By type** — if changes span many components but share a type, group by type (e.g., all test files in one commit, all dependency updates in another)
3. **Single commit** — if all changes are cohesive (one feature, one fix), use a single commit

Prefer fewer commits over many tiny ones. When in doubt, one well-described commit is better than three artificial groupings.

### Step 4: Create commit(s)

Use the message format above. Always pass the commit message via a HEREDOC to avoid issues with emojis, special characters, and multi-line messages:

```bash
git commit -m "$(cat <<'EOF'
<emoji><type>(<scope>): <description>

<optional body>

<optional footer>
EOF
)"
```

**Confirmation gate:** Show the planned commit message(s) and files. If `-y` → proceed. Otherwise → ask "Proceed with commit?" and wait.

### Step 5: Report result

Show the developer the commit SHA(s) and message(s) created.
