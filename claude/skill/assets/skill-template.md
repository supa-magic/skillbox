# Skill Template

Use this template as the base structure when generating new skills. Adapt sections as needed — remove what doesn't apply, add what's missing.

## Template

```markdown
---
name: <kebab-case-name>
description: <what it does>. <when to use it — include specific trigger phrases>.
user-invocable: true
argument-hint: "[args]"
license: MIT                                          # Optional: omit if not open-source
allowed-tools: "Bash(python:*) Bash(npm:*) WebFetch"  # Optional: omit if no tool restrictions needed
compatibility: "Requires Node.js 18+, gh CLI"         # Optional: omit if no environment requirements
metadata:
  author: <author or company>
  version: 1.0.0
  category: <productivity|development|workflow|testing|devops|documentation>
  tags: [<tag1>, <tag2>]
  mcp-server: <server-name>                           # Optional: omit if no MCP dependency
  documentation: https://example.com/docs             # Optional: omit if no external docs
  support: support@example.com                        # Optional: omit if no support contact
---

# /skill-name $ARGUMENTS

<one-line summary>

## Usage

\```
/skill-name
    <command> [args]       Description of command
    <command> [args]       Description of command

    -y, --yes              Skip confirmations
\```

| Argument | Format | Default | Effect |
|----------|--------|---------|--------|
| `<arg>` | Positional | — | <effect> |
| `-y`, `--yes` | Flag | `false` | Skip all confirmation gates |

## Rules

See [references/rules.md](references/rules.md) — applies to ALL operations.

## Instructions

### Step 1: <First Step>

<Clear, actionable instructions.>

### Step 2: <Second Step>

<Clear, actionable instructions.>

**Confirmation gate:** If `-y` → proceed. Otherwise → ask "<question>" and wait.

### Step N: Output

> <Expected output format shown to the developer>

## Examples

### Example 1: <Common scenario>
User says: "<typical invocation>"
Actions:
1. <action 1>
2. <action 2>
Result: <expected outcome>

## Troubleshooting

### Error: <Common error>
Cause: <Why it happens>
Solution: <How to fix>
```

## Folder Structure

Skills follow this layout based on the official Anthropic docs:

```
skill-name/
├── SKILL.md              # Required — main skill file
├── action-one.md         # Optional — sub-instruction file (at root)
├── action-two.md         # Optional — sub-instruction file (at root)
├── scripts/              # Optional — executable code
│   └── validate.sh
├── references/           # Optional — reference material (rules, docs, schemas)
│   ├── rules.md
│   └── api-patterns.md
└── assets/               # Optional — templates, fonts, icons
    └── report-template.md
```

## Adaptation Notes

- **User-invocable skills:** Include `## Usage`, `argument-hint`, and `user-invocable: true`
- **Auto-triggered skills:** Omit `## Usage`, `argument-hint`, and `user-invocable`. Use `# Skill Name` instead of `# /skill-name $ARGUMENTS`
- **Single-action skills:** Put all instructions in SKILL.md directly
- **Multi-action skills:** Use SKILL.md as a dispatcher that routes to sub-instruction files at root (like `git/SKILL.md` routes to `commit.md`, `branch.md`, etc.)
- **Rules section:** Only include if the skill has shared rules across subcommands — reference a `references/rules.md` file
- **Examples section:** Include 2-3 concrete scenarios showing user input → actions → result
- **Troubleshooting:** Only include if there are known failure modes worth documenting
- **Confirmation gates:** Required for destructive or hard-to-reverse actions. Use `-y` / `--yes` flag to skip (project convention)
- **Progressive disclosure:** Keep SKILL.md focused. Move detailed reference docs to `references/`, templates to `assets/`
