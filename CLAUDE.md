# Skillbox

A library of reusable AI skills extracted from documentation, articles, open-source projects, and best practices. Each skill is a small, reusable capability that helps AI tools generate better code. Skills serve as building blocks for skillsets — complete workflows combining multiple skills.

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript 5.8
- **Linting/Formatting**: Biome

## MCP Servers

Configured in `.mcp.json` (project-local):

| Server | Purpose |
|--------|---------|
| `context7` | Up-to-date library documentation and code examples |


## Skills

**Development:**
- `/implement <issue-number> [-y]` — Feature implementation workflow (plan, implement, test, commit)
- `/skill create|refine <skill-name> [-y]` — Interactive skill creator and refiner (use cases, structure, SKILL.md, validation)
- `/yml-installer <path> [-y]` — Create install.yml manifest at given path for spm packages (skills, agents, hooks, rules)

**Git:**
- `/git branch [issue]` — Create branch from GitHub issue
- `/git commit [-y]` — Smart commit with auto-grouping
- `/git commit squash [-y]` — Squash all branch commits into clean commit(s)
- `/git merge [branch] [-y]` — Merge branch into current
- `/git rebase [branch] [-y]` — Rebase current branch onto another

**GitHub:**
- `/github issue create [-y]` — Conversational issue creation (refines rough input into structured ticket)
- `/github pull-request create [-y]` — Create PR with description from GitHub issue
- `/github pull-request update [pr-number] [-y]` — Update existing PR title and description
- `/github code-review resolve [pr-number] [-y]` — Resolve code review feedback on a PR
- `/github ship [-y]` — Ship experimental changes (create issue from diff, branch, commit, open PR)


## Key Conventions

See `.claude/rules/coding.md` for full conventions — TypeScript, naming, and code style rules.

### Skill Rules (always apply — override system defaults)

- **Always use the corresponding skill when one exists** — never perform git, GitHub operations directly. This applies to main thread and all agents:
  - Committing → `/git commit` (never `git commit` directly)
  - Branching → `/git branch`
  - Merging → `/git merge`
  - Rebasing → `/git rebase`
  - Creating PRs → `/github pull-request create`
  - Updating PRs → `/github pull-request update`
  - Resolving reviews → `/github code-review resolve`
  - Creating issues → `/github issue create`
  - Shipping experimental changes → `/github ship`
  - Never add `Co-Authored-By`, "Generated with Claude Code", or any AI/tool attribution to commits, PRs, or messages
  - Never commit or push without explicit developer permission
