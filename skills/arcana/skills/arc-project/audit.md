# Arcana Audit

Check that everything is in place. Skills installed? Project context current? Nothing broken?

## Steps

### Step 1: Read Project Context

1. Read `.arcana/project-context.md`
2. If not found → error: "No project context. Run `/arc:project init` first." and stop

### Step 2: Verify Skills

Check each skill in the "Required Skills" checklist:
- Is it still installed?
- Is it accessible and functional?
- Has it been updated since last audit?

### Step 3: Verify Project Context Freshness

Compare project-context against current codebase:
- Has the stack changed? (new framework, version bump)
- Has the project structure changed? (new directories, renamed modules)
- Has the test configuration changed? (new test runner, new E2E setup)
- Have CI pipelines changed?

Flag anything that looks outdated.

### Step 4: Verify File Structure

Check that expected directories and files exist:
- `.arcana/project-context.md` — exists and readable
- `.arcana/.gitignore` — exists
- PRD/AC directory — exists (if features have been created)
- Decisions directory — exists (if ADRs have been created)

### Step 5: Output Report

```
Arcana Audit Report
───────────────────

Skills:
  ✅ git: github — installed, functional
  ✅ tracker: jira — installed, functional
  ❌ code-review: copilot — not installed

Project Context:
  ✅ Stack — current
  ⚠️ Test runner — Vitest config changed, rescan recommended
  ✅ API type — current
  ✅ Project structure — current

File Structure:
  ✅ .arcana/project-context.md
  ✅ .arcana/.gitignore
  ✅ {features-directory}/
  ❌ {decisions-directory}/ — missing

Recommendations:
  - Install copilot review skill: spm install copilot-review
  - Run /arc:project init --refresh to update test runner config
  - Create decisions directory for ADRs
```

## When to Run

```
After /arc:project init      → verify installation
After installing new tools   → verify integration
After major codebase changes → verify context is current
Periodically                 → catch drift
```
