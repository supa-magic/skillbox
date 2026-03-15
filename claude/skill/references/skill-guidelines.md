# Skill Guidelines

Rules, conventions, and validation for building Claude skills. Derived from Anthropic's Complete Guide to Building Skills for Claude.

## Folder Structure

Every skill follows this standard structure:

```
skill-name/
├── SKILL.md           # Required — main skill file
├── action.md          # Optional — sub-instruction files at root
├── scripts/           # Optional — executable code (Python, Bash, etc.)
├── references/        # Optional — reference material (rules, docs, schemas)
└── assets/            # Optional — templates, fonts, icons used in output
```

File placement guide:
- `SKILL.md` is required — the main skill entry point
- Sub-instruction files (workflow steps Claude follows) live at the skill root alongside SKILL.md
- Reference material (rules, domain docs, API schemas, etc.) goes in `references/`
- Executable scripts go in `scripts/`
- Templates and static assets go in `assets/`

## Frontmatter Rules

### Required Fields

```yaml
---
name: skill-name-in-kebab-case
description: What it does and when to use it. Include specific trigger phrases.
---
```

### Field Requirements

**name** (required):
- kebab-case only — no spaces, capitals, or underscores
- Must match folder name
- Must NOT contain "claude" or "anthropic" (reserved)

**description** (required):
- MUST include BOTH: what the skill does AND when to use it (trigger conditions)
- Under 1024 characters
- No XML angle brackets (`<` `>`) — security restriction (frontmatter appears in system prompt)
- Include specific phrases users would say
- Mention relevant file types if applicable

**user-invocable** (optional):
- Set `true` for slash-command skills
- Omit entirely for auto-triggered skills

**argument-hint** (optional):
- Only for user-invocable skills that accept arguments
- Shows argument format: `"[name] [-y]"`

**license** (optional):
- Use if making skill open source (e.g., MIT, Apache-2.0)

**compatibility** (optional):
- 1-500 characters
- Environment requirements: intended product, required packages, network access

**metadata** (optional):
- Custom key-value pairs (author, version, mcp-server)

### Description Examples

Good:
```
# Specific and actionable
description: Analyzes Figma design files and generates developer handoff documentation. Use when user uploads .fig files, asks for "design specs", "component documentation", or "design-to-code handoff".

# Includes trigger phrases
description: Manages Linear project workflows including sprint planning, task creation, and status tracking. Use when user mentions "sprint", "Linear tasks", "project planning", or asks to "create tickets".
```

Bad:
```
# Too vague
description: Helps with projects.

# Missing triggers
description: Creates sophisticated multi-page documentation systems.

# Too technical, no user triggers
description: Implements the Project entity model with hierarchical relationships.
```

## Writing Style

- **Write for AI consumption** — the skill is read by another Claude instance, not a human. Focus on information that would be beneficial and non-obvious to Claude. Consider what procedural knowledge, domain-specific details, or reusable assets would help Claude execute tasks more effectively.
- **Use imperative/infinitive form** (verb-first instructions), not second person. Use objective, instructional language (e.g., "To accomplish X, do Y" rather than "You should do X"). This maintains consistency and clarity for AI consumption.
- **No duplication** — information should live in either SKILL.md or references files, not both. Prefer references files for detailed information unless it's truly core to the skill. Keep only essential procedural instructions and workflow guidance in SKILL.md.
- **Large references** — if reference files are large (>10k words), include grep search patterns in SKILL.md so Claude can find relevant sections without loading the entire file.

## Writing Quality Rules

1. **Be specific and actionable** — "Run `scripts/validate.py --input {file}`" not "Validate the data"
2. **Include error handling** — anticipate failures and provide recovery steps
3. **Use progressive disclosure** — keep SKILL.md focused on core instructions, move detailed docs to `references/`
4. **Reference bundled resources clearly** — "Before writing queries, consult `references/api-patterns.md` for rate limiting guidance"
5. **Put critical instructions at the top** — don't bury important rules
6. **Use numbered steps and bullet points** — not prose paragraphs
7. **Include confirmation gates** — for destructive or hard-to-reverse actions
8. **Show expected outputs** — so the developer knows what success looks like
9. **Add examples** — concrete scenarios with user input and expected skill behavior
10. **Keep SKILL.md under 5,000 words** — move detailed reference to `references/` files

## Project-Specific Conventions

Match the patterns used by existing skills in this project:

- Use `## Usage` with a code block showing commands/arguments
- Use `### Step N:` for workflow steps
- Use blockquotes (`>`) for messages shown to the developer
- Use **Confirmation gate:** pattern for actions needing approval
- Use `-y` / `--yes` flag convention for skipping confirmations
- Reference sub-instruction files with "Read `.claude/skills/<skill>/file.md` and follow all steps"
- Use fenced code blocks for commands with expected output descriptions
- Follow `.claude/rules/coding.md` conventions in any generated code

## Validation Checklist

### Structure Validation
- [ ] Folder named in kebab-case
- [ ] SKILL.md file exists with exact casing (not SKILL.MD, skill.md, etc.)
- [ ] No README.md inside skill folder
- [ ] Reference material (rules, docs, schemas) in `references/`, not at skill root
- [ ] Executable scripts in `scripts/`
- [ ] YAML frontmatter has `---` delimiters (opening and closing)
- [ ] `name` field is kebab-case, no spaces, no capitals
- [ ] `name` matches folder name
- [ ] `name` does not contain "claude" or "anthropic"
- [ ] `description` includes WHAT it does AND WHEN to use it
- [ ] `description` is under 1024 characters
- [ ] No XML angle brackets (`<` `>`) in frontmatter

### Content Validation
- [ ] Instructions are clear and actionable (not vague)
- [ ] Steps are numbered and sequential
- [ ] Error handling included for likely failure points
- [ ] Examples provided for common scenarios
- [ ] References to bundled files use correct paths
- [ ] SKILL.md is under 5,000 words

### Triggering Validation (auto-triggered skills only — skip for user-invocable)
- [ ] Description includes specific trigger phrases
- [ ] Description mentions relevant file types (if applicable)
- [ ] Description is specific enough to avoid over-triggering
- [ ] Description is broad enough to catch paraphrased requests

## Troubleshooting

### Skill doesn't trigger automatically
Cause: Description field is too vague or missing trigger phrases.
Solution: Add specific phrases users would say. Include file types if relevant. Ask Claude "When would you use the `<skill-name>` skill?" to debug.

### Skill triggers on unrelated queries
Cause: Description is too broad.
Solution: Add negative triggers ("Do NOT use for..."), be more specific about scope, or clarify the domain.

### Instructions not followed consistently
Cause: Instructions are too verbose, ambiguous, or buried.
Solution: Put critical instructions at top, use bullet points, move detailed docs to `references/`, add "CRITICAL:" prefix for must-follow rules.

### Skill is too large
Cause: Too much content in SKILL.md.
Solution: Move detailed documentation to `references/` directory. Keep SKILL.md under 5,000 words. Use progressive disclosure — link to reference files instead of inlining.

### Large context issues
Cause: Skill content too large or too many skills enabled simultaneously.
Solution: Optimize SKILL.md size, move detailed docs to `references/`, keep SKILL.md under 5,000 words, consider skill "packs" for related capabilities.
