---
name: skill
description: Interactive skill creator and refiner. Use when developer wants to create a new skill, build a skill, scaffold a skill, refine or improve an existing skill, or says "new skill". Walks through use case definition, structure planning, SKILL.md generation, and validation.
user-invocable: true
argument-hint: "create|refine <skill-name> [-y]"
license: MIT
compatibility: "Any AI coding assistant that supports skills (Claude Code, Open Code, etc.)"
metadata:
  author: supa-magic
  version: 1.0.0
  category: development
  tags: [skill-creation, workflow-automation, scaffolding]
  documentation: https://github.com/supa-magic/skillbox/blob/main/claude/skill/references/the-complete-guide-to-building-skills-for-claude.md
  support: https://github.com/supa-magic/skillbox/issues
---

# /skill $ARGUMENTS

Interactive workflow to create or refine skills.

## Usage

```
/skill create deploy-checker          Create "deploy-checker" skill
/skill create deploy-checker -y       Create, skip confirmations
/skill refine deploy-checker          Refine existing "deploy-checker" skill
/skill refine deploy-checker -y       Refine, skip confirmations
```

| Argument | Format | Default | Effect |
|----------|--------|---------|--------|
| `create` \| `refine` | Subcommand (first token) | `create` | Determines workflow |
| `skill-name` | Positional, kebab-case | — | Target skill name (required) |
| `-y`, `--yes` | Flag | `false` | Skip all confirmation gates |

## Instructions

### Step 1: Parse Arguments

Extract from `$ARGUMENTS`:

1. First non-flag token → `subcommand` (`create` or `refine`). If missing or not one of these → default to `create` and treat the token as `skill-name` instead.
2. Next non-flag token(s) → join with hyphens to form `skill-name` (e.g., `my cool skill` → `my-cool-skill`)
3. `-y` or `--yes` anywhere → `skip_confirmations = true`
4. If `$ARGUMENTS` is empty → error: "Skill name required. Usage: `/skill create <skill-name>` or `/skill refine <skill-name>`" and stop.

**Validate `skill-name`** (required):
- If `skill-name` is empty → error: "Skill name required. Usage: `/skill create <skill-name>` or `/skill refine <skill-name>`" and stop.
- Convert to lowercase and replace spaces/underscores with hyphens
- Check it matches kebab-case pattern: `^[a-z][a-z0-9]*(-[a-z0-9]+)*$`
- If invalid after normalization → error: "Invalid skill name `<raw-input>`. Skill names must be kebab-case (e.g., `deploy-checker`). Suggested: `<normalized>`" and stop.

Store parsed values and reference them throughout — do NOT re-parse later.

### Step 2: Route to Workflow

**If `subcommand = refine`:**
- Verify `<skill-name>/SKILL.md` exists in the skills directory. If not → error: "Skill `<skill-name>` not found." and stop.
- Read `./refine.md` and follow all steps.

**If `subcommand = create`:**
- Check if `<skill-name>/SKILL.md` already exists in the skills directory
- If it exists → ask:
  > Skill **`<skill-name>`** already exists. Would you like to refine it instead? [Y/n]
  - If yes (or default) → set `subcommand = refine`, read `./refine.md` and follow all steps
  - If no → error: "Skill already exists. Choose a different name." and stop.
- If it does NOT exist → read `./create.md` and follow all steps

## Troubleshooting

### Error: Invalid skill name
Cause: Name contains spaces, uppercase, underscores, or starts with a number.
Solution: Normalize to kebab-case — lowercase, replace spaces/underscores with hyphens. Present the suggested name to the developer.

### Error: Skill folder exists but no SKILL.md
Cause: Partial or corrupted skill — folder was created but SKILL.md was never written or was deleted.
Solution: Treat as a new skill. Warn the developer that the folder exists with orphaned files, ask whether to overwrite or choose a different name.

### Error: Skill not found (refine mode)
Cause: `/skill refine <name>` was used but `<skill-name>/SKILL.md` does not exist in the skills directory.
Solution: Suggest switching to create mode or check the skill name for typos. List available skills with a glob of `*/SKILL.md` in the skills directory.
