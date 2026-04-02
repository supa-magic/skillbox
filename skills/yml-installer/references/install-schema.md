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
| `setup` | string or map | no | Setup instructions — a single file path (`SETUP.md`) or a map of provider-specific files |

## Content Sections

Include only non-empty sections. Omit sections with no entries. Sections are listed in alphabetical order.

### agents

List of agent definition files. Paths can be relative to `install.yml` or full URLs for external sources.

```yaml
agents:
  - code-reviewer.md
  - https://github.com/awesome-skills/fe/test-writer.md
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

List of rule files. Paths can be relative to `install.yml` or full URLs for external sources.

```yaml
rules:
  - ./code-style.md
  - https://github.com/awesome-skills/fe/architecture.md
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
8. All paths (agents, rules, files, source) can be relative to `install.yml` or full URLs for external sources
9. Omit empty sections entirely (don't write `agents: []` or `skills: {}`)
10. `setup` must be either a string (single file path) or a map of `provider: path` entries. Valid provider keys: `claude`, `cursor`, `windsurf`, `cline`, `opencode`

## Setup

The `setup` field supports two formats:

### Single file (all providers in one file)

```yaml
setup: SETUP.md
```

### Per-provider files

```yaml
setup:
  claude: setup/claude.md
  cursor: setup/cursor.md
  windsurf: setup/windsurf.md
  cline: setup/cline.md
  opencode: setup/opencode.md
```

The installer picks the right file based on the detected provider. Only include providers that need setup.

Valid provider keys: `claude`, `cursor`, `windsurf`, `cline`, `opencode`.

### Setup file structure

Setup files are **agent instructions** — they tell the spawned Claude what config files to generate. The spawned Claude writes files into `.spm/<name>/` (sandboxed with `acceptEdits`), then spm moves/merges them to the provider's config location. This avoids granting elevated permissions to arbitrary setup content.

Each setup file **must** use structured phases:

| Section | Required | Description |
|---------|----------|-------------|
| `## Pre Install` | no | Prerequisites to check **before** `spm install` — required tools, runtimes, platform dependencies |
| `## Post Install` | no | Instructions for the spawned Claude to **generate config files** in the working directory. spm handles moving/merging to the correct provider location |

At least one phase (`## Pre Install` or `## Post Install`) must be present. Both may be included.

**Provider config targets** (spm moves files automatically):

| Provider | Config file | Target path |
|----------|------------|-------------|
| `claude` | `settings.json` | `.claude/settings.json` |
| `cursor` | `hooks.json` | `.cursor/hooks.json` |
| `windsurf` | `hooks.json` | `.windsurf/hooks.json` |
| `cline` | `hooks/*` | `.clinerules/hooks/*` |
| `opencode` | `plugins/*.mjs` | `.opencode/plugins/*.mjs` |

**Per-provider file example** (`setup/claude.md`):

```markdown
# <Package Name>

## Pre Install

- Node.js v18+

## Post Install

Write `settings.json` with the following content:

\`\`\`json
{
  "hooks": { ... }
}
\`\`\`
```

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

setup:
  claude: setup/claude.md
  cursor: setup/cursor.md
  windsurf: setup/windsurf.md
  cline: setup/cline.md
  opencode: setup/opencode.md
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
  - https://github.com/awesome-skills/fe/test-writer.md
  - code-reviewer.md

hooks:
  pre-commit:
    source: ./
    files:
      - lint-check.sh

rules:
  - ./architecture.md
  - https://github.com/awesome-skills/fe/naming-conventions.md

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
