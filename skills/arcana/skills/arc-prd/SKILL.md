---
name: arc:prd
description: >
  Create and update Product Requirements Documents with Acceptance Criteria.
  PRD lives in the repository as source of truth. AC written in Given/When/Then format.
  Use when starting a new feature, creating requirements, writing AC scenarios,
  or updating existing requirements. Triggers on "arc:prd create", "arc:prd update",
  "create PRD", "new feature", "write requirements", "update PRD", "requirements changed".
user-invocable: true
argument-hint: "create|update {feature-name} [-y]"
license: MIT
metadata:
  author: supa-magic
  version: 1.0.0
  category: workflow
  tags: [prd, requirements, acceptance-criteria, bdd, feature-planning]
---

# /arc:prd $ARGUMENTS

Create and update Product Requirements Documents with Acceptance Criteria.

## Usage

```
/arc:prd create checkout           Interactive PRD creation for "checkout" feature
/arc:prd update checkout           Cascade update when requirements change
/arc:prd update checkout -y        Update, skip confirmations
```

| Argument | Format | Default | Effect |
|----------|--------|---------|--------|
| `create` \| `update` | Subcommand (first token) | — | Determines workflow (required) |
| `feature-name` | Positional | — | Feature identifier — used for directory and file naming |
| `-y`, `--yes` | Flag | `false` | Skip confirmation gates (NOT available for `create` — always pair mode) |

## Instructions

### Step 1: Parse Arguments

1. First non-flag token → `subcommand` (`create` or `update`). If missing or not one of these → error: "Subcommand required. Usage: `/arc:prd create|update {feature-name}`" and stop.
2. Next non-flag token(s) → `feature-name`. If missing → error: "Feature name required. Usage: `/arc:prd {subcommand} {feature-name}`" and stop.
3. `-y` or `--yes` anywhere → `skip_confirmations = true`
4. If `subcommand = create` and `skip_confirmations = true` → ignore the flag. `/arc:prd create` is always pair mode — requirements need human input.

### Step 2: Route to Subcommand

Read the corresponding sub-instruction file and follow all steps:

| Subcommand | File | Purpose |
|------------|------|---------|
| `create` | [create.md](create.md) | Interactive PRD + AC creation (always pair mode) |
| `update` | [update.md](update.md) | Cascade update of PRD + AC + ticket marking |

## Shared Context

**Project context:** `.arcana/project-context.md` — read first for project structure, conventions, and external skill configuration (tracker, git).

**PRD and AC structure** (actual paths from project-context). See [references/prd-structure.md](references/prd-structure.md) for templates and conventions:
```
{features-directory}/{feature}/
  prd.md                ← PRD (permanent, in git)
  ac/
    happy-path.md       ← main scenarios
    validation.md       ← input validation
    error-states.md     ← external failures
    edge-cases.md       ← boundary conditions
```

**External skill dependencies:**
- **Tracker skill** (Jira, GitHub Issues, Linear) — for creating Epic + tickets. Delegated via external skill configured in project-context.
- If tracker skill not installed → warn and skip ticket creation. PRD + AC still written to repo.

## Troubleshooting

### Error: Tracker skill not configured
Cause: No tracker skill installed or configured in `.arcana/project-context.md`.
Solution: Run `/arc:project init` to install and configure a tracker skill. PRD and AC can still be created without a tracker — tickets are skipped.

### Error: Feature already exists (create mode)
Cause: PRD directory for this feature already exists.
Solution: Use `/arc:prd update {feature-name}` instead, or choose a different feature name.
