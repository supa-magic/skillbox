---
name: yml-installer
description: Create install.yml manifest for packages installable via spm. Supports skills, agents, hooks, and rules. Use when developer wants to create an install manifest, or says "new install", "create install.yml".
user-invocable: true
argument-hint: "<path> [-y]"
license: MIT
compatibility: "Any AI coding assistant that supports skills (Claude Code, Open Code, etc.)"
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

Follow the full instructions in `skills/yml-installer/SKILL.md`.

Reference files:
- Template: `skills/yml-installer/assets/install-template.yml`
- Schema: `skills/yml-installer/references/install-schema.md`
