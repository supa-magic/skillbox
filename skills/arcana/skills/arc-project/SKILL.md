---
name: arc:project
description: >
  Configure and maintain the Arcana skillset for a project. Init does full onboarding
  (install external skills + scan codebase), audit checks everything is in place,
  skill-up analyzes completed tasks and proposes improvements. Use when onboarding Arcana
  to a new project, checking configuration, or after completing a task cycle.
  Triggers on "arc:project init", "arc:project audit", "arc:project skill-up",
  "arc:project adr", "init arcana", "setup arcana", "scan project", "audit skills",
  "improve skills", "what can we improve", "create ADR", "document decision".
user-invocable: true
argument-hint: "init|audit|adr|skill-up [-y]"
license: MIT
metadata:
  author: supa-magic
  version: 1.0.0
  category: workflow
  tags: [configuration, setup, audit, meta, self-improvement]
---

# /arc:project $ARGUMENTS

Configure and maintain the Arcana skillset for a project.

## Usage

```
/arc:project init               First run: full onboarding (setup + scan)
/arc:project init --refresh     Rescan codebase after stack changes
/arc:project init --refine      Interactively update specific sections
/arc:project audit              Check that everything is in place
/arc:project adr "WebSocket vs Polling"    Create ADR
/arc:project skill-up           Analyze completed task and propose improvements
/arc:project skill-up -y        Apply improvements without confirmation
```

| Argument | Format | Default | Effect |
|----------|--------|---------|--------|
| `init` \| `audit` \| `adr` \| `skill-up` | Subcommand (first token) | — | Determines workflow (required) |
| `--refresh` | Flag (init only) | `false` | Rescan codebase, preserve skills and model config |
| `--refine` | Flag (init only) | `false` | Interactively update specific sections |
| `-y`, `--yes` | Flag | `false` | Skip confirmation gates |

## Instructions

### Step 1: Parse Arguments

1. First non-flag token → `subcommand` (`init`, `audit`, `adr`, or `skill-up`). If missing or not one of these → error: "Subcommand required. Usage: `/arc:project init|audit|adr|skill-up`" and stop.
2. `--refresh` anywhere → `force_refresh = true` (only relevant for `init`)
3. `--refine` anywhere → `refine_mode = true` (only relevant for `init`)
4. `-y` or `--yes` anywhere → `skip_confirmations = true`

### Step 2: Route to Subcommand

Read the corresponding sub-instruction file and follow all steps:

| Subcommand | File | Purpose |
|------------|------|---------|
| `init` | [init.md](init.md) | Full onboarding, rescan, or refine project context |
| `audit` | [audit.md](audit.md) | Verify skills installed, project-context current |
| `skill-up` | [skill-up.md](skill-up.md) | Post-task analysis, propose skill improvements |
| `adr` | [adr.md](adr.md) | Create Architecture Decision Record |

## Typical Workflow

```
First time:     /arc:project init            → full onboarding (skills + scan)
                /arc:project audit           → verify everything is ready

Added a tool:   /arc:project init --refine   → update Required Skills section
                /arc:project audit           → verify

Changed stack:  /arc:project init --refresh  → rescan codebase

Fine-tune:      /arc:project init --refine   → update specific sections

After task:     /arc:project skill-up        → analyze, improve
```

## Troubleshooting

### Error: project-context.md not found
Cause: `/arc:project init` hasn't been run yet.
Solution: Run `/arc:project init` to onboard Arcana (installs skills + scans codebase).

### Error: External skill not found
Cause: Required skill not installed.
Solution: Run `/arc:project init --refine` and select "Required Skills" to re-detect and install, or install manually via `spm`.
