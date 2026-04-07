---
name: git
description: Git commands for branching, committing, merging, pushing, rebasing, and squashing. Use when developer needs to create branches, commit changes, push, merge or rebase branches, or squash commits.
user-invocable: true
argument-hint: "branch [create]|commit [squash]|merge|push|rebase [args] [-y]"
context: fork
license: MIT
compatibility: "Any AI coding assistant that supports skills (Claude Code, Open Code, etc.)"
metadata:
  author: supa-magic
  version: 2.0.0
  category: development
  tags: [git, version-control, branching, commits, workflow]
---

# /git $ARGUMENTS

Git workflow commands.

## Usage

```
/git
    branch create [issue]  Create branch from issue tracker ticket
    commit create         Smart commit with auto-grouping (create can be omitted)
    commit squash         Squash all branch commits into clean commit(s)
    merge [branch]        Merge branch into current (default: main)
    push                  Validate commits and push to remote
    rebase [branch]       Rebase current branch onto another (default: main)

    -y, --yes             Skip confirmations
```

| Argument | Format | Default | Effect |
|----------|--------|---------|--------|
| `command` | Positional (1st token) | — | Which subcommand to run |
| `args` | Positional (remaining tokens) | — | Passed to the subcommand (e.g., issue number, branch name) |
| `-y`, `--yes` | Flag | `false` | Skip all confirmation gates |

## Rules

These rules apply to ALL git operations — main thread and all agents.

- Critical git actions (`commit`, `merge`, `push`, `rebase`, `reset`) require developer confirmation unless `-y` was passed
- Never skip hooks (`--no-verify`, `--no-gpg-sign`) unless explicitly requested
- Never use `git push --force` to main/master — warn user if requested

## Instructions

### Step 1: Parse Arguments

Extract from `$ARGUMENTS`:

1. First non-flag token → `command` (one of: `branch`, `commit`, `merge`, `push`, `rebase`)
2. If `command` is `branch`: next token may be a subcommand (`create`). If omitted or if the next token looks like an issue number, default to `create`
3. If `command` is `commit`: next token may be a subcommand (`create` or `squash`). If omitted, default to `create`
4. Remaining non-flag tokens → passed to the subcommand as positional args
5. `-y` or `--yes` anywhere → skip all confirmation gates

If no command is provided, list the available commands and ask the developer which one to run.

If the command is not recognized, show:

> Unknown command `<command>`. Available commands: `branch`, `commit`, `merge`, `push`, `rebase`.

### Step 2: Route to Subcommand

Read the command-specific instruction file and follow it exactly:

- **branch create** → Read [branch.md](./branch.md) and follow all steps
- **commit create** → Read [commit.md](./commit.md) and follow all steps
- **commit squash** → Read [commit-squash.md](./commit-squash.md) and follow all steps
- **merge** → Read [merge.md](./merge.md) and follow all steps
- **push** → Read [push.md](./push.md) and follow all steps
- **rebase** → Read [rebase.md](./rebase.md) and follow all steps

## Examples

### Example 1: Create a branch from an issue

User says: `/git branch 42` (or `/git branch create 42`)

Actions:
1. Fetch ticket #42 from the project's issue tracker using the appropriate skill or MCP tool
2. Determine branch type from labels (e.g., `enhancement` → `feature/`)
3. Generate branch name: `feature/42/add-user-auth`
4. Create and switch to branch

Result: `Switched to a new branch 'feature/42/add-user-auth'`

### Example 2: Commit staged changes

User says: `/git commit`

Actions:
1. Verify branch naming convention
2. Detect staged files
3. Analyze changes and draft commit message
4. Show planned commit for confirmation
5. Create commit

Result: `[feature/42/add-user-auth abc1234] feat(auth): add login endpoint`

### Example 3: Push branch to remote

User says: `/git push`

Actions:
1. Verify not on main
2. List branch commits
3. Validate commit messages (no WIP, no Co-Authored-By)
4. Confirm push with developer
5. Push to remote

Result: `Pushed 3 commit(s) to origin/feature/42/add-user-auth`

### Example 4: Squash branch commits before PR

User says: `/git commit squash`

Actions:
1. Verify not on main, working tree is clean
2. Find merge-base and list 5 branch commits
3. Confirm squash with developer
4. Soft reset to base, unstage all files
5. Invoke `/git commit` to create clean commit(s)

Result: `5 commits squashed into 1 clean commit`

## Troubleshooting

### Error: Uncommitted changes block operation
Cause: Merge, rebase, or squash requires a clean working tree but there are unstaged changes.
Solution: Ask the developer to commit or stash changes first. Do not auto-stash without permission.

### Error: Wrong branch
Cause: Developer is on main/master and tries to squash or commit branch-specific changes.
Solution: Warn that the operation targets the current branch. Ask the developer to switch to the correct branch first.

### Error: No changes to commit
Cause: `git status` shows no staged or unstaged changes.
Solution: Inform the developer there is nothing to commit. Do not create empty commits.
