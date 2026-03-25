# Refine Skill

Workflow for improving an existing skill.

Before starting, read `./references/skill-guidelines.md` for writing rules, conventions, and the validation checklist. Reference it throughout this workflow.

## Steps

### Step 1: Analyze Existing Skill

Read `<skill-name>/SKILL.md` and all supporting files in the skill folder.

Evaluate against the validation checklist in `./references/skill-guidelines.md` and identify:

1. **Folder structure issues** — reference material at skill root instead of `references/`, files in wrong location
2. **Frontmatter issues** — missing fields, naming problems, description too vague
3. **Content issues** — vague instructions, missing error handling, missing examples, excessive length, missing sections
4. **Argument issues** — missing `-y` flag for skills with confirmation gates, undocumented arguments
5. **Triggering issues** (auto-triggered only) — description too broad/narrow, missing trigger phrases
6. **Shell preprocessing opportunities** — bash blocks with static commands that could be preprocessed (see `./references/skill-guidelines.md` § Shell Preprocessing)

Present findings:

> Here's my analysis of **`<skill-name>`**:
>
> **Current state:** <brief summary of what the skill does>
>
> **Issues found:**
> 1. <issue 1>
> 2. <issue 2>
> ...
>
> **Suggested improvements:**
> 1. <improvement 1>
> 2. <improvement 2>
> ...
>
> Want me to apply these changes, or do you have specific things you'd like to change?

**Confirmation gate:** If `skip_confirmations` → apply all suggested improvements. Otherwise → wait for response. If developer requests specific changes, note them.

### Step 2: Apply Changes

Apply the confirmed improvements:

1. Fix folder structure — move reference material (rules, docs, schemas) into `references/` if not already there; sub-instruction files can stay at root
2. Edit `SKILL.md` — fix structure, improve instructions, add missing sections (including Examples if absent)
3. Update supporting files if needed — `references/rules.md`, sub-instruction files, reference docs
4. Update frontmatter — ensure `description`, `argument-hint`, and other fields are accurate
5. Follow all rules from `./references/skill-guidelines.md`
6. Use `./assets/skill-template.md` as structural reference when restructuring

### Step 3: Optimize with shell preprocessing (optional)

If the target provider supports shell preprocessing (see `./references/skill-guidelines.md` § Shell Preprocessing):

1. Scan all skill files for bash code blocks
2. Identify eligible blocks — static commands with no `<placeholders>` or dynamic arguments
3. Suggest replacements using the provider's preprocessing syntax

Present findings:

> **Shell preprocessing opportunities:**
> - `<file>` Step N: `<command>` → eligible
> - `<file>` Step N: `<command>` → skipped (dynamic argument)
>
> Apply these optimizations?

If the target provider is unknown or does not support shell preprocessing, skip this step.

### Step 4: Update CLAUDE.md (if needed)

If the refinement changed the skill's description, arguments, or invocation pattern, update the corresponding entry in `CLAUDE.md` to match. If the skill is user-invocable and has no entry in CLAUDE.md, add one.

### Step 5: Re-validate

Run the full validation checklist from `./references/skill-guidelines.md`.

If any checks fail, fix them.

### Step 6: Write and Confirm

**Confirmation gate:** If `skip_confirmations` → write changes. Otherwise → show a diff summary of what changed, then ask:

> Here are the changes. Apply them?

Wait for confirmation. Once confirmed, write all modified files.

### Step 7: Output

> Skill **`<skill-name>`** refined:
>
> **Changes:**
> - <change 1>
> - <change 2>
> ...
>
> **Files modified:**
> - `<skill-name>/SKILL.md`
> - <other files if changed>
