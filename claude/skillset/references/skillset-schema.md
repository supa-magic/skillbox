# Skillset YAML Schema

Reference for the `skillset.yml` manifest format.

## Top-Level Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | yes | Skillset name in kebab-case |
| `version` | string | no | Semantic version (default: `1.0.0`) |
| `description` | string | yes | One-line description of the skillset |
| `provider` | string | yes | Provider name (e.g., `claude`, `cursor`) |
| `setup` | string | yes | Path to setup instructions (always `SETUP.md`) |

## Section Fields

### skills

Map of skill entries. Each key is a skill alias, each value has:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `source` | string | yes | Source path — `<provider>/<skill>` for local (e.g., `claude/skill`), or `<org>/<repo>/<path>` for external |
| `files` | list | yes | List of file paths relative to the skill source |

```yaml
skills:
  skill:
    source: claude/skill
    files:
      - SKILL.md
      - create.md
      - refine.md
```

### agents

List of agent definition file paths (relative to skillset root).

```yaml
agents:
  - agents/code-reviewer.md
  - agents/pr-summarizer.md
```

### hooks

List of hook definition file paths (relative to skillset root).

```yaml
hooks:
  - hooks/pre-commit.md
  - hooks/post-push.md
```

### mcp

List of MCP server configuration file paths (relative to skillset root).

```yaml
mcp:
  - mcp/nextjs-server.json
```

### memory

List of memory file paths (relative to skillset root).

```yaml
memory:
  - memory/project-patterns.md
```

### rules

List of rule file paths (relative to skillset root).

```yaml
rules:
  - rules/fsd-architecture.md
```

## Validation Rules

1. `name` must be kebab-case
2. `version` must be valid semver
3. `provider` must be non-empty
4. `skills` entries must have both `source` and `files`
5. All file paths in `agents`, `hooks`, `mcp`, `memory`, `rules` must be relative (no leading `/`)
6. `setup` must always be `SETUP.md`
