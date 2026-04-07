# Create Skill

Workflow for creating a new skill from scratch.

Before starting, read `./references/skill-guidelines.md` for writing rules, conventions, and the validation checklist. Reference it throughout this workflow.

## Steps

### Step 1: Gather Intent

**If `skill-name` was provided:** Acknowledge the name and ask:

> What should this skill do? Describe the workflow, use cases, and what problem it solves. Rough notes are fine — I'll shape it into a proper skill.

**If `skill-name` was NOT provided:** Ask:

> What skill do you want to build? Describe what it should do, the workflows it enables, and the problems it solves. Rough notes, bullet points — anything works.

Wait for the developer's response. Do NOT proceed until they reply.

### Step 2: Define Use Cases and Structure

Take the developer's raw input and define:

1. **2-3 concrete use cases** — each with:
   - Trigger: what the user says or does
   - Steps: what the skill does in sequence
   - Result: what the outcome looks like

2. **Skill category** — which fits best:
   - **Document & asset creation** — produces consistent outputs (code, documents, designs)
   - **Workflow automation** — multi-step processes with consistent methodology
   - **MCP enhancement** — workflow guidance layered on top of MCP tool access

3. **Skill name** — if not already provided, derive a kebab-case name from the use cases

4. **Invocation style:**
   - **User-invocable** (`user-invocable: true`) — triggered by `/skill-name` slash command
   - **Auto-triggered** (no `user-invocable` field) — the AI loads it automatically based on context matching the description

5. **Arguments & flags** (only for user-invocable skills):
   - Positional arguments, flags, defaults, and effects
   - Always include `-y` / `--yes` if the skill has confirmation gates (project convention)
   - Set `argument-hint` in frontmatter to reflect all arguments
   - Skip if auto-triggered or no arguments

6. **Reusable resources** — for each use case, analyze what would be needed when executing the workflow repeatedly:
   - Would the same code be rewritten each time? → `scripts/` (deterministic, token-efficient)
   - Would the AI need to re-discover schemas, APIs, or domain knowledge? → `references/` (loaded as needed)
   - Would the same boilerplate or templates be used? → `assets/` (used in output, not loaded into context)
   - Does the skill have multiple subcommands? → sub-instruction files alongside SKILL.md (like `branch.md`, `commit.md`)
   - Does the skill have shared rules across subcommands? → `references/rules.md`

7. **Dependencies:**
   - MCP servers (e.g., context7, GitHub, Linear)
   - CLI tools (e.g., `gh`, `npm`, `docker`)
   - Other skills it should invoke (e.g., `/git commit`)
   - External APIs or services

Present the analysis:

> Here's what I'm thinking for **`<skill-name>`**:
>
> **Category:** <category>
> **Invocation:** <user-invocable / auto-triggered>
>
> **Use cases:**
> 1. <use case 1>
> 2. <use case 2>
> 3. <use case 3>
>
> **Arguments & flags:**
> | Argument | Format | Default | Effect |
> |----------|--------|---------|--------|
> | ... | ... | ... | ... |
> *(or "None — skill takes no arguments")*
>
> **Files:**
> ```
> <skill-name>/
> ├── SKILL.md
> ├── <sub-instruction files if needed>
> └── references/
>     └── <reference files if needed>
> ```
>
> **Dependencies:** <list or "None">
>
> Anything you'd like to change or add before I draft the skill?

**Confirmation gate:** If `skip_confirmations` → proceed. Otherwise → wait for response. If developer requests changes, revise and re-present. Loop until confirmed.

### Step 3: Draft the SKILL.md

Read the template at `./assets/skill-template.md` and use it as the base structure.

Apply all rules from `./references/skill-guidelines.md`:
- Frontmatter rules (name, description, fields)
- Folder structure rules
- Writing style (imperative form, write for AI consumption)
- Writing quality rules
- Project-specific conventions

**Frontmatter fields — fill ALL fields. Mark optional ones only if genuinely not applicable:**
- `name` (required) — kebab-case, matches folder name
- `description` (required) — what it does + when to use it (under 1024 chars, no XML angle brackets)
- `user-invocable` — `true` for slash-command skills, omit for auto-triggered
- `argument-hint` — only for user-invocable skills with arguments
- `license` (optional) — default to `MIT` for open-source skills
- `allowed-tools` (optional) — restrict tool access if the skill should not use all tools (e.g., `"Bash(python:*) WebFetch"`)
- `compatibility` (optional) — environment requirements: runtime, CLI tools, network access (e.g., `"Requires Node.js 18+, gh CLI"`)
- `metadata` — always include:
  - `author` — creator name or organization
  - `version` — semantic version, start at `1.0.0`
  - `category` — one of: `productivity`, `development`, `workflow`, `testing`, `devops`, `documentation`
  - `tags` — list of descriptive tags for discoverability
  - `mcp-server` (optional) — informational label for MCP server the skill is designed for
  - `documentation` (optional) — URL to external docs
  - `support` (optional) — support contact email or URL

The skill is read by an AI coding assistant, not a human. Focus on including information that would be beneficial and non-obvious to the AI — procedural knowledge, domain-specific details, and references to reusable assets.

Adapt the template to the skill being created — remove sections that don't apply, add sections as needed.

### Step 4: Generate Supporting Files

If the skill needs additional files (determined in Step 2), generate them:

- **`<action>.md`** — sub-instruction files at skill root for each subcommand (follow pattern from `git/commit.md`, `github/create-issue.md`)
- **`references/rules.md`** — shared rules across subcommands (follow pattern from `git/references/rules.md`)
- **`references/<file>.md`** — detailed documentation, API patterns, domain-specific reference material
- **`scripts/<file>.py|.sh`** — executable validation or processing scripts
- **`assets/<file>`** — templates used by the skill

File placement guide:
- Sub-instructions (workflow files the AI follows step-by-step) → skill root alongside SKILL.md
- Reference material (rules, docs, schemas loaded as needed) → `references/`
- Executable code → `scripts/`
- Templates and static assets → `assets/`

### Step 5: Validate

Run the full validation checklist from `./references/skill-guidelines.md` (section: Validation Checklist).

Present the validation results. If any checks fail, fix them and re-validate.

### Step 6: Write Files

**Confirmation gate:** If `skip_confirmations` → proceed to write. Otherwise → show the complete SKILL.md content and any supporting files, then ask:

> Here's the complete skill. Want to change anything, or should I create it?

Wait for confirmation. If changes requested, apply them, re-present, and ask again.

Once confirmed, write all files to `.claude/skills/<skill-name>/`.

### Step 7: Update CLAUDE.md

**If the skill is user-invocable**, add it to the `## Skills` section in `CLAUDE.md`:

1. Read the current `CLAUDE.md` to find the `## Skills` section and its sub-sections
2. Find the most relevant existing sub-section (e.g., **Development**, **Git**, **GitHub**) based on the skill's purpose
3. If no sub-section fits, create a new one with an appropriate heading
4. Add the entry in the same format as existing entries:

```markdown
- `/<skill-name> [args]` — <one-line description>
```

**Confirmation gate:** If `skip_confirmations` → update CLAUDE.md. Otherwise → ask:

> Should I add this skill to CLAUDE.md under **<sub-section>**?

### Step 8: Output

> Skill **`<skill-name>`** created:
>
> **Files:**
> - `.claude/skills/<skill-name>/SKILL.md`
> - <other files>
>
> **Test it:** `/<skill-name>` (or describe a trigger phrase for auto-triggered skills)
