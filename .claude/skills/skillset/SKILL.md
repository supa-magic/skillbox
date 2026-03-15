---
name: skillset
description: Create skillset manifest (skillset.yml) with skills, agents, hooks, MCP, memory, and rules. Use when developer wants to create a new skillset, scaffold a skill collection, or says "new skillset", "create skillset".
user-invocable: true
argument-hint: "<name> [provider] [-y]"
license: MIT
compatibility: "Claude Code CLI"
metadata:
  author: supa-magic
  version: 1.0.0
  category: workflow
  tags: [skillset, manifest, scaffolding, workflow]
---

# /skillset $ARGUMENTS

Create a skillset manifest with interactive section collection.

## Usage

```
/skillset my-project                  Create skillset in claude/my-project/
/skillset my-project cursor           Create skillset in cursor/my-project/
/skillset my-project claude -y        Create, skip confirmations
```

| Argument | Format | Default | Effect |
|----------|--------|---------|--------|
| `name` | Positional (1st) | — | Skillset name (kebab-case), becomes folder and YAML `name` field |
| `provider` | Positional (2nd) | `claude` | Provider folder to create skillset in |
| `-y`, `--yes` | Flag | `false` | Skip all confirmation gates |

## Instructions

### Step 1: Parse Arguments

Extract from `$ARGUMENTS`:

1. First non-flag token → `name`
2. Second non-flag token → `provider` (default: `claude`)
3. `-y` or `--yes` anywhere → `skip_confirmations = true`

**Validate `name`** (required):
- If empty → error: "Skillset name required. Usage: `/skillset <name> [provider] [-y]`" and stop.
- Convert to lowercase, replace spaces/underscores with hyphens
- Must match: `^[a-z][a-z0-9]*(-[a-z0-9]+)*$`
- If invalid → error: "Invalid name `<raw>`. Must be kebab-case. Suggested: `<normalized>`" and stop.

**Validate `provider`:**
- Convert to lowercase, replace spaces/underscores with hyphens
- Must match: `^[a-z][a-z0-9]*(-[a-z0-9]+)*$`
- If invalid → error: "Invalid provider `<raw>`. Must be kebab-case." and stop.

**Check target:** If `<provider>/<name>/skillset.yml` already exists → error: "Skillset `<name>` already exists at `<provider>/<name>/`." and stop.

Store: `name`, `provider`, `skip_confirmations`. Reference throughout.

### Step 2: Collect Description

Ask:

> What does this skillset do? One-line description (e.g., "Next.js project with Feature-Sliced Design architecture"):

Wait for response. Store as `description`.

### Step 3: Collect Skills

Ask:

> Which skills should this skillset include?
>
> For each skill, provide:
> - **Alias** — short name (e.g., `git`, `testing`)
> - **Source** — path or URL (e.g., `claude/skill`, `ComposioHQ/awesome-claude-skills/lint`)
> - **Files** — list of files to include from that source
>
> Enter skills one at a time, or paste multiple. Type **done** when finished.

Collect entries in a loop. For each entry, parse:
- `alias`: kebab-case key
- `source`: source path string
- `files`: list of file paths

Keep collecting until the developer types "done" or equivalent ("that's it", "no more", "finished", etc.).

If no skills provided → leave `skills` empty (it will be omitted from the generated YAML in Step 5).

### Step 4: Collect Remaining Sections

For each remaining section, ask one at a time:

**Agents:**
> Any agent definitions to include? Provide paths (e.g., `agents/code-reviewer.md`), or **skip**.

**Hooks:**
> Any hooks to include? Provide paths (e.g., `hooks/pre-commit.md`), or **skip**.

**MCP:**
> Any MCP server configs to include? Provide paths (e.g., `mcp/server.json`), or **skip**.

**Memory:**
> Any memory files to include? Provide paths (e.g., `memory/project-patterns.md`), or **skip**.

**Rules:**
> Any rules to include? Provide paths (e.g., `rules/architecture.md`), or **skip**.

For each section: if the developer says "skip", "none", "no", or equivalent → set to empty list `[]`.

### Step 5: Generate skillset.yml

Read the template at `claude/skillset/assets/skillset-template.yml` for structure reference. Read `claude/skillset/references/skillset-schema.md` for field validation.

Build the YAML content:

```yaml
name: <name>
version: 1.0.0
description: "<description>"
provider: <provider>
setup: SETUP.md

skills:
  <alias>:
    source: <source>
    files:
      - <file1>
      - <file2>

agents:
  - <path>

hooks:
  - <path>

mcp:
  - <path>

memory:
  - <path>

rules:
  - <path>
```

Rules:
- Omit empty sections entirely (don't write `skills: {}` or `agents: []`)
- Always include `version: 1.0.0`, `setup: SETUP.md`
- Quote the `description` value

### Step 6: Generate SETUP.md

Create installation instructions based on collected sections. The SETUP.md should:

1. List prerequisites (Claude Code CLI, Git)
2. For each skill in `skills`: list all files to copy and their target location under `.claude/skills/<alias>/`
3. For each non-empty section (`agents`, `hooks`, `mcp`, `memory`, `rules`): list files to copy and their target location
4. Include a verification step

Use `claude/skillset/assets/setup-template.md` as structural reference, but generate concrete content — replace all template placeholders with actual file paths from the collected data.

### Step 7: Review and Confirm

Present the generated files:

> Here's the skillset manifest:
>
> **`<provider>/<name>/skillset.yml`**
> ```yaml
> <full yaml content>
> ```
>
> **`<provider>/<name>/SETUP.md`**
> <summary of setup instructions>
>
> Want to change anything, or should I create these files?

**Confirmation gate:** If `skip_confirmations` → proceed. Otherwise → wait for confirmation. If changes requested → apply, re-present, loop.

### Step 8: Write Files

1. Create directory `<provider>/<name>/` (relative to project root)
2. Write `<provider>/<name>/skillset.yml`
3. Write `<provider>/<name>/SETUP.md`

### Step 9: Output

> Skillset **`<name>`** created:
>
> **Files:**
> - `<provider>/<name>/skillset.yml`
> - `<provider>/<name>/SETUP.md`

## Examples

### Example 1: Basic skillset with skills and rules

User says: `/skillset nextjs-fsd`

Actions:
1. Parse: name=`nextjs-fsd`, provider=`claude`
2. Ask for description → "Next.js project with Feature-Sliced Design architecture"
3. Collect skills → `git` (skillbox/git), `testing` (skillbox/testing)
4. Collect sections → rules: `rules/fsd-architecture.md`, rest skipped
5. Generate `skillset.yml` and `SETUP.md`
6. Write to `claude/nextjs-fsd/`

Result:
```
claude/nextjs-fsd/
├── skillset.yml
└── SETUP.md
```

### Example 2: Full skillset with all sections

User says: `/skillset my-app cursor -y`

Actions:
1. Parse: name=`my-app`, provider=`cursor`
2. Collect all sections interactively
3. Generate files, skip confirmations
4. Write to `cursor/my-app/`

Result:
```
cursor/my-app/
├── skillset.yml
└── SETUP.md
```

## Troubleshooting

### Error: Skillset already exists
Cause: `<provider>/<name>/skillset.yml` already exists.
Solution: Choose a different name or delete the existing skillset first.

### Error: Invalid name or provider
Cause: Name or provider contains spaces, uppercase, or special characters.
Solution: Normalize to kebab-case — lowercase, replace spaces/underscores with hyphens.
