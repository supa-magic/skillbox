# install.yml Schema

Reference for the universal `install.yml` manifest format used by `spm`.

## Top-Level Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | yes | Package name in kebab-case |
| `version` | string | no | Semantic version (default: `1.0.0`) |
| `description` | string | yes | One-line description of the package |
| `license` | string | no | License identifier (e.g., `MIT`) |
| `compatibility` | list | no | List of compatible tools or runtimes (e.g., `Claude Code CLI`, `node@22`) |
| `requires` | list | no | List of required tools or runtimes with optional version (e.g., `node@18`, `gh`) |
| `setup` | string | no | Path to post-install instructions (e.g., `SETUP.md`) |

## Content Sections

Include only non-empty sections. Omit sections with no entries. Sections are listed in alphabetical order.

### agents

List of agent definition files (relative to `install.yml`).

```yaml
agents:
  - code-reviewer.md
  - pr-summarizer.md
```

### hooks

Map of hook entries. Each key is a hook name, with `source` (relative to `install.yml` or full path/URL for external sources) and `files` (list of files to include). Use `./` when files live alongside `install.yml`.

```yaml
hooks:
  retro-game-sounds:
    source: ./
    files:
      - player.mjs
      - attention.wav
      - complete.wav
```

### rules

List of rule files (relative to `install.yml`).

```yaml
rules:
  - architecture.md
  - naming-conventions.md
```

### skills

Map of skill entries. Each key is a skill alias, with `source` (relative to `install.yml` or full path/URL for external sources) and `files` (list of files to include). Use `./` when files live alongside `install.yml`.

```yaml
skills:
  git:
    source: ./
    files:
      - SKILL.md
      - references/command.md
```

## Validation Rules

1. `name` must be kebab-case: `^[a-z][a-z0-9]*(-[a-z0-9]+)*$`
2. `version` must be valid semver (e.g., `1.0.0`, `2.1.3`)
3. `description` must be a non-empty string
4. `license` must be a valid SPDX identifier if present
5. `compatibility` must be a list of strings if present
6. `requires` must be a list of strings in `tool` or `tool@version` format if present
7. `hooks` and `skills` entries must be maps of name → `{ source, files }` object
8. All `files` entries and path lists (agents, rules) must be relative (no leading `/`); `source` may be a relative path or full URL
9. Omit empty sections entirely (don't write `agents: []` or `skills: {}`)

## Examples

### Simple hook package

```yaml
name: retro-game-sounds
version: 1.0.0
description: Retro game sound effects for AI coding assistant hooks
license: MIT
compatibility:
  - Claude Code CLI
  - node@18

hooks:
  retro-game-sounds:
    source: ./
    files:
      - player.mjs
      - attention.wav
      - compacted.wav
      - complete.wav
      - error.wav
      - subagent-complete.wav

setup: SETUP.md
```

### Skillset with skills and rules

```yaml
name: nextjs-fsd
version: 1.0.0
description: Next.js project with Feature-Sliced Design architecture

rules:
  - fsd-architecture.md
  - nextjs-conventions.md

skills:
  git:
    source: ./
    files:
      - SKILL.md
      - commit.md
      - branch.md

setup: SETUP.md
```

### Full package with all sections

```yaml
name: full-stack-workflow
version: 1.0.0
description: Complete full-stack development workflow
license: MIT
compatibility:
  - Claude Code CLI
  - node@22
requires:
  - node@22
  - gh
  - jq

agents:
  - code-reviewer.md

hooks:
  pre-commit:
    source: ./
    files:
      - lint-check.sh

rules:
  - architecture.md

skills:
  git:
    source: https://github.com/example/skills/git
    files:
      - SKILL.md
      - commit.md
  testing:
    source: ./
    files:
      - SKILL.md

setup: SETUP.md
```
