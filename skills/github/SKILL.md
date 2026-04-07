---
name: github
description: GitHub commands for issues, PRs, code reviews, and shipping. Use when developer needs to create issues, fetch issue context (title, description, comments), create/update PRs, address review comments, or ship experimental changes. Also use when another skill or agent needs ticket context — invoke issue fetch. Requires gh CLI.
user-invocable: true
argument-hint: "issue|pull-request|code-review|ship [action] [args] [-y]"
license: MIT
compatibility: "Requires gh CLI (GitHub CLI) installed and authenticated"
metadata:
  author: supa-magic
  version: 1.0.0
  category: development
  tags: [github, pull-requests, issues, code-review, workflow]
  requires: gh
---

# /github $ARGUMENTS

GitHub workflow commands using `gh` CLI.

## Sub-skills

- **issue create** — conversational issue creation from rough ideas
- **issue fetch** — fetch issue title, description, and comments as structured context. Use when any skill or agent needs ticket information (e.g., for planning, coding, or PR creation)
- **pull-request create** — create PR with description derived from the linked issue
- **pull-request update** — update existing PR title and description
- **code-review resolve** — classify and resolve review comments on a PR
- **ship** — ship experimental changes: create issue from diff, branch, commit, and open PR

## Usage

```
/github
    issue create              Conversational issue creation
    issue fetch [number]      Fetch issue title, description, and comments for context
    issue update              Update existing issue
    pull-request create       Create PR from current branch
    pull-request update [n]   Update PR title and description
    code-review resolve [n]   Resolve code review feedback
    ship                      Ship experimental changes (issue -> branch -> commit -> PR)

    -y, --yes                 Skip confirmations
```

| Argument | Format | Default | Effect |
|----------|--------|---------|--------|
| `command` | Positional (1st token) | — | Entity to operate on (`issue`, `pull-request`, `code-review`, `ship`) |
| `action` | Positional (2nd token) | — | Subcommand (e.g., `create`, `update`, `resolve`). Can be omitted when only one action exists (`code-review` defaults to `resolve`) |
| `args` | Positional (remaining tokens) | — | Passed to the subcommand (e.g., PR number) |
| `-y`, `--yes` | Flag | `false` | Skip all confirmation gates |

## Rules

See [references/rules.md](./references/rules.md) — applies to ALL github operations.

## Instructions

### Step 1: Parse Arguments

Extract from `$ARGUMENTS`:

1. First non-flag token → `command` (one of: `issue`, `pull-request`, `code-review`, `ship`)
2. If `command` has subcommands: next token → `action`. If omitted and only one action exists for the command, default to it (e.g., `code-review` defaults to `resolve`)
3. Remaining non-flag tokens → passed to the subcommand as positional args (e.g., PR number)
4. `-y` or `--yes` anywhere → skip all confirmation gates

If no command is provided, list the available commands and ask the developer which one to run.

If the command or action is not recognized, show:

> Unknown command `<command> <action>`. Available commands: `issue create`, `issue update`, `pull-request create`, `pull-request update`, `code-review resolve`, `ship`.

### Step 2: Route to Subcommand

Read the command-specific instruction file and follow it exactly:

- **issue create** → Read [issue-create.md](./issue-create.md) and follow all steps
- **issue fetch** → Read [issue-fetch.md](./issue-fetch.md) and follow all steps
- **issue update** → _Not yet implemented_
- **pull-request create** → Read [pull-request-create.md](./pull-request-create.md) and follow all steps
- **pull-request update** → Read [pull-request-update.md](./pull-request-update.md) and follow all steps
- **code-review resolve** → Read [code-review-resolve.md](./code-review-resolve.md) and follow all steps
- **ship** → Read [ship.md](./ship.md) and follow all steps

## Examples

### Example 1: Create an issue from a rough idea

User says: `/github issue create` (or `/github issue` when only `create` is implemented)

Actions:
1. Ask developer to describe the problem or feature
2. Refine into structured issue with acceptance criteria
3. Confirm and create via `gh issue create`

Result: `Created issue #42: https://github.com/org/repo/issues/42`

### Example 2: Create a PR

User says: `/github pull-request create`

Actions:
1. Resolve issue number from branch name
2. Fetch issue details
3. Generate PR title and description
4. Confirm and create via `gh pr create`

Result: `Created PR #43: https://github.com/org/repo/pull/43`

### Example 3: Ship experimental changes

User says: `/github ship`

Actions:
1. Analyze uncommitted changes on main
2. Create issue, branch, commit, and PR in sequence
3. Each step invokes the appropriate skill

Result: Issue, branch, commit, and PR created in one flow

## Troubleshooting

### Error: gh CLI not found
Cause: GitHub CLI is not installed.
Solution: Run the SETUP.md post-install steps or install manually: `brew install gh` (macOS), `winget install GitHub.cli` (Windows).

### Error: gh not authenticated
Cause: `gh auth status` shows not logged in.
Solution: Run `gh auth login` to authenticate.

### Error: No PR found for current branch
Cause: `pull-request update` or `code-review resolve` was used but no PR exists for the branch.
Solution: Create a PR first with `/github pull-request create`.
