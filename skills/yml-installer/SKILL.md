---
name: yml-installer
description: Create install.yml manifest for packages installable via spm. Supports skills, agents, hooks, and rules. Use when developer wants to create an install manifest, or says "new install", "create install.yml".
user-invocable: true
argument-hint: "<path> [-y]"
license: MIT
compatibility: "Any AI coding assistant that supports skills (Claude Code, OpenCode, etc.)"
metadata:
  author: supa-magic
  version: 1.0.0
  category: workflow
  tags: [install, manifest, spm, package, workflow]
---

# /yml-installer $ARGUMENTS

Create a universal `install.yml` manifest for any package type.

## Usage

```
/yml-installer skills/sounds/retro-game       Create install.yml at given path
/yml-installer skills/sounds/retro-game -y    Create, skip confirmations
```

| Argument | Format | Default | Effect |
|----------|--------|---------|--------|
| `path` | Positional (1st) | — | Path to the folder where install.yml will be created |
| `-y`, `--yes` | Flag | `false` | Skip all confirmation gates |

## Instructions

### Step 1: Parse Arguments

Extract from `$ARGUMENTS`:

1. First non-flag token → `path`
2. `-y` or `--yes` anywhere → `skip_confirmations = true`

**Validate `path`** (required):
- If empty → error: "Path required. Usage: `/yml-installer <path> [-y]`" and stop.
- Verify the directory exists → if not, error: "Directory `<path>` does not exist." and stop.

**Derive `name`** from the last segment of the path (e.g., `skills/sounds/retro-game` → `retro-game`):
- Convert to lowercase, replace spaces/underscores with hyphens
- Must match: `^[a-z][a-z0-9]*(-[a-z0-9]+)*$`
- If invalid → error: "Folder name `<raw>` is not valid kebab-case." and stop.

**Check target:** If `<path>/install.yml` already exists → error: "`install.yml` already exists at `<path>/`." and stop.

Store: `path`, `name`, `skip_confirmations`. Reference throughout.

### Step 2: Collect Description

Ask:

> What does this package do? Describe it briefly:

Wait for response. **Refine** the user's input into a concise, polished one-line description — fix grammar, remove filler words, capitalize properly. Store the refined version as `description`.

### Step 3: Collect Metadata

Ask:

> Any additional metadata?
>
> - **License** — e.g., `MIT`, `Apache-2.0` (or **skip**)
> - **Compatibility** — list of compatible tools/runtimes (e.g., `Claude Code CLI`, `node@22`) (or **skip**)
> - **Requires** — tools or runtimes needed before install, use `tool@version` format (e.g., `node@18`, `gh`) (or **skip**)

For each: if the developer says "skip", "none", "no", or equivalent → omit from manifest.

Store as `license`, `compatibility`, `requires`.

### Step 4: Collect Agents

Ask:

> Any agent definitions to include? Provide file paths (e.g., `code-reviewer.md`), or **skip**.

Collect file paths. If the developer says "skip", "none", "no", or equivalent → set to empty list `[]`.

### Step 5: Collect Hooks

Ask:

> Any hooks to include?
>
> For each hook, provide:
> - **Name** — hook name (e.g., `retro-game-sounds`, `pre-commit`)
> - **Source** — relative to `install.yml` (use `./` for local) or full path/URL for external
> - **Files** — list of files to include
>
> Enter hooks one at a time, or paste multiple. Type **done** when finished.

Collect entries in a loop. For each entry, parse:
- `name`: kebab-case key
- `source`: relative path (default `./`) or full path/URL for external
- `files`: list of file paths

Keep collecting until the developer types "done" or equivalent.

If no hooks provided → leave `hooks` empty (it will be omitted from the generated YAML in Step 9).

### Step 6: Collect Rules

Ask:

> Any rules to include? Provide file paths (e.g., `architecture.md`), or **skip**.

Collect file paths. If the developer says "skip", "none", "no", or equivalent → set to empty list `[]`.

### Step 7: Collect Skills

Ask:

> Any skills to include?
>
> For each skill, provide:
> - **Alias** — short name (e.g., `git`, `testing`)
> - **Source** — relative to `install.yml` (use `./` for local) or full path/URL for external
> - **Files** — list of files to include (e.g., `SKILL.md`, `references/command.md`)
>
> Enter skills one at a time, or paste multiple. Type **done** when finished.

Collect entries in a loop. For each entry, parse:
- `alias`: kebab-case key
- `source`: relative path (default `./`) or full path/URL for external
- `files`: list of file paths

Keep collecting until the developer types "done" or equivalent.

If no skills provided → leave `skills` empty (it will be omitted from the generated YAML in Step 9).

### Step 8: Collect Setup

Ask:

> Does this package need setup instructions?
>
> - **single** — one `SETUP.md` with all providers
> - **per-provider** — separate file per provider (e.g., `setup/claude.md`, `setup/cursor.md`)
> - **no** — skip (no manual setup needed)

If `per-provider`, ask:

> Which providers need setup? (claude, cursor, windsurf, cline, opencode)

Store as `setup_mode` (`single`, `per-provider`, or `none`) and `setup_providers` (list of selected providers).

### Step 9: Generate install.yml

Read the template at `./assets/install-template.yml` for structure reference. Read `./references/install-schema.md` for field validation.

Build the YAML content:

```yaml
name: <name>
version: 1.0.0
description: "<description>"
license: <license>
compatibility:
  - <tool-or-runtime>
requires:
  - <tool@version>

agents:
  - <file>

hooks:
  <name>:
    source: <./ or full-path/url>
    files:
      - <file1>
      - <file2>

rules:
  - <file>

skills:
  <alias>:
    source: <./ or full-path/url>
    files:
      - <file1>
      - <file2>

setup: SETUP.md
# or per-provider:
setup:
  claude: setup/claude.md
  cursor: setup/cursor.md
```

Rules:
- Omit empty sections entirely (don't write `agents: []`, `skills: {}`, `hooks: {}`, `compatibility: []`, `requires: []`)
- Always include `version: 1.0.0`
- Quote the `description` value
- Only include `license` if provided
- Only include `compatibility` if provided
- Only include `requires` if provided
- Only include `setup` if `setup_mode` is not `none`
  - `single` → `setup: SETUP.md`
  - `per-provider` → `setup:` map with `<provider>: setup/<provider>.md` entries
- Content sections in alphabetical order: `agents`, `hooks`, `rules`, `skills`

### Step 10: Generate setup files (if applicable)

If `setup_mode` is `none`, skip this step.

Setup files are **agent instructions** — the spawned Claude writes config files into `.spm/<name>/` (sandboxed), then spm moves/merges them to the provider's config location. No elevated permissions needed.

Each setup file **must** use structured phases:

1. Title: `# <name>` — brief description
2. `## Pre Install` (include if there are prerequisites) — checks **before** `spm install`:
   - Required tools, runtimes, platform dependencies (e.g., Node.js v18+, `alsa-utils` on Linux)
3. `## Post Install` (include if there are post-install steps) — instructions for the spawned Claude to **write config files** in the working directory:
   - Tell the agent exactly what file to create and its content
   - spm handles moving/merging to the correct provider location
   - Include verification steps and troubleshooting if applicable

At least one phase (`## Pre Install` or `## Post Install`) must be present.

**If `single`:** Generate one `SETUP.md` with all providers as subsections under `## Post Install` (e.g., `### Claude Code`, `### Cursor`).

**If `per-provider`:** Generate one file per selected provider in a `setup/` directory (e.g., `setup/claude.md`, `setup/cursor.md`). Each file contains only that provider's instructions.

### Step 11: Review and Confirm

Present the generated files:

> Here's the install manifest:
>
> **`install.yml`**
> ```yaml
> <full yaml content>
> ```
>
> **`SETUP.md`** (if generated)
> <summary of setup instructions>
>
> Want to change anything, or should I create these files?

**Confirmation gate:** If `skip_confirmations` → proceed. Otherwise → wait for confirmation. If changes requested → apply, re-present, loop.

### Step 12: Write Files

1. Write `<path>/install.yml`
2. If `single` → write `<path>/SETUP.md`
3. If `per-provider` → create `<path>/setup/` directory, write `<path>/setup/<provider>.md` for each provider

### Step 13: Output

> Package **`<name>`** manifest created at `<path>/`:
>
> **Files:**
> - `<path>/install.yml`
> - `<path>/SETUP.md` (if single setup)
> - `<path>/setup/<provider>.md` (if per-provider setup)
>
> Install with: `spm i <github-url-to-this-directory>`

## Examples

### Example 1: Simple hook package

User says: `/yml-installer skills/sounds/retro-game`

Actions:
1. Parse: path=`skills/sounds/retro-game`, name=`retro-game`
2. Ask for description → "Retro game sound effects for AI coding assistant hooks"
3. Collect metadata → license: MIT, compatibility: Claude Code CLI, node@18
4. Collect agents → skip
5. Collect hooks → `retro-game-sounds`: source=`./`, files=`player.mjs`, `attention.wav`, `complete.wav`, `error.wav`
6. Collect rules → skip
7. Collect skills → skip
8. Setup → per-provider: claude, cursor, windsurf, cline, opencode
9. Generate `install.yml` and `setup/*.md` files
10. Write files

Result (`skills/sounds/retro-game/install.yml`):
```yaml
name: retro-game
version: 1.0.0
description: "Retro game sound effects for AI coding assistant hooks"
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
      - complete.wav
      - error.wav

setup:
  claude: setup/claude.md
  cursor: setup/cursor.md
  windsurf: setup/windsurf.md
  cline: setup/cline.md
  opencode: setup/opencode.md
```

### Example 2: Skillset with skills and rules

User says: `/yml-installer skillsets/nextjs-fsd -y`

Actions:
1. Parse: path=`skillsets/nextjs-fsd`, name=`nextjs-fsd`, skip_confirmations=true
2. Collect description → "Next.js with Feature-Sliced Design"
3. Collect metadata → skip all
4. Collect agents → skip
5. Collect hooks → skip
6. Collect rules → `fsd-architecture.md`
7. Collect skills → `git`: source=`./`, files=`SKILL.md`, `commit.md`, `branch.md`
8. Setup → yes
9. Generate files, skip confirmations
10. Write files

Result (`skillsets/nextjs-fsd/install.yml`):
```yaml
name: nextjs-fsd
version: 1.0.0
description: "Next.js with Feature-Sliced Design"

rules:
  - fsd-architecture.md

skills:
  git:
    source: ./
    files:
      - SKILL.md
      - commit.md
      - branch.md

setup: SETUP.md
```

## Troubleshooting

### Error: install.yml already exists
Cause: `install.yml` already exists in the current directory.
Solution: Delete or rename the existing file, or edit it manually.

### Error: Invalid name
Cause: Name contains spaces, uppercase, or special characters.
Solution: Normalize to kebab-case — lowercase, replace spaces/underscores with hyphens.
