---
name: skill
description: Interactive skill creator and refiner. Use when developer wants to create a new Claude skill, build a skill, scaffold a skill, refine or improve an existing skill, or says "new skill". Walks through use case definition, structure planning, SKILL.md generation, and validation.
user-invocable: true
argument-hint: "[skill-name] [--refine] [-y]"
license: MIT
compatibility: "Claude Code CLI"
metadata:
  author: supa-magic
  version: 1.0.0
  category: development
  tags: [skill-creation, workflow-automation, scaffolding]
  documentation: https://github.com/supa-magic/skillbox/blob/main/claude/skill/references/the-complete-guide-to-building-skills-for-claude.md
  support: https://github.com/supa-magic/skillbox/issues
---

# /skill $ARGUMENTS

Interactive workflow to create or refine Claude skills.

## Usage

```
/skill                              Create new skill (ask for name)
/skill deploy-checker               Create "deploy-checker" (if exists → prompt to refine)
/skill deploy-checker --refine      Refine existing "deploy-checker" skill
/skill deploy-checker -y            Create, skip confirmations
/skill deploy-checker --refine -y   Refine, skip confirmations
```

| Argument | Format | Default | Effect |
|----------|--------|---------|--------|
| `skill-name` | Positional, kebab-case | — | Pre-sets the skill name |
| `--refine` | Flag | `false` | Refine an existing skill instead of creating |
| `-y`, `--yes` | Flag | `false` | Skip all confirmation gates |

## Instructions

### Step 1: Parse Arguments

Extract from `$ARGUMENTS`:

1. Collect all non-flag tokens → join with hyphens to form `skill-name` (e.g., `my cool skill` → `my-cool-skill`)
2. `--refine` anywhere → `mode = refine`
3. `-y` or `--yes` anywhere → `skip_confirmations = true`
4. If `$ARGUMENTS` is empty → all values unset, `mode = create`

**Validate `skill-name`** (if provided):
- Convert to lowercase and replace spaces/underscores with hyphens
- Check it matches kebab-case pattern: `^[a-z][a-z0-9]*(-[a-z0-9]+)*$`
- If invalid after normalization → error: "Invalid skill name `<raw-input>`. Skill names must be kebab-case (e.g., `deploy-checker`). Suggested: `<normalized>`" and stop.

Store parsed values and reference them throughout — do NOT re-parse later.

### Step 2: Route to Workflow

**If `mode = refine`:**
- If `skill-name` is empty → error: "Skill name required for refine mode. Usage: `/skill <skill-name> --refine`" and stop.
- Verify `.claude/skills/<skill-name>/SKILL.md` exists. If not → error: "Skill `<skill-name>` not found." and stop.
- Read `claude/skill/refine.md` and follow all steps.

**If `skill-name` was provided and `mode = create`:**
- Check if `.claude/skills/<skill-name>/SKILL.md` already exists
- If it exists and `skip_confirmations` → set `mode = refine`, read `claude/skill/refine.md` and follow all steps
- If it exists → ask:
  > Skill **`<skill-name>`** already exists. Would you like to refine it instead? [Y/n]
  - If yes (or default) → set `mode = refine`, read `claude/skill/refine.md` and follow all steps
  - If no → error: "Skill already exists. Choose a different name." and stop.
- If it does NOT exist → read `claude/skill/create.md` and follow all steps

**If `skill-name` was NOT provided:**
- Read `claude/skill/create.md` and follow all steps

## Troubleshooting

### Error: Invalid skill name
Cause: Name contains spaces, uppercase, underscores, or starts with a number.
Solution: Normalize to kebab-case — lowercase, replace spaces/underscores with hyphens. Present the suggested name to the developer.

### Error: Skill folder exists but no SKILL.md
Cause: Partial or corrupted skill — folder was created but SKILL.md was never written or was deleted.
Solution: Treat as a new skill. Warn the developer that the folder exists with orphaned files, ask whether to overwrite or choose a different name.

### Error: Skill not found (refine mode)
Cause: `--refine` was used but `.claude/skills/<skill-name>/SKILL.md` does not exist.
Solution: Suggest switching to create mode or check the skill name for typos. List available skills with a glob of `.claude/skills/*/SKILL.md`.
