---
name: arc:ac
description: >
  Manage Acceptance Criteria — validate quality, enrich with implicit scenarios, update from
  feedback, and verify code satisfies requirements. Use when working with AC files in
  Given/When/Then format. Triggers on "validate AC", "enrich AC", "update AC", "verify AC",
  "check acceptance criteria", "add edge cases to AC", "does code match AC",
  "/arc:ac validate", "/arc:ac enrich", "/arc:ac update", "/arc:ac verify".
user-invocable: true
argument-hint: "validate|enrich|update|verify {ticket-id} [-y]"
license: MIT
metadata:
  author: supa-magic
  version: 1.0.0
  category: workflow
  tags: [acceptance-criteria, validation, enrichment, requirements, testing, bdd]
---

# /arc:ac $ARGUMENTS

Manage Acceptance Criteria — validate, enrich, update, verify.

## Usage

```
/arc:ac validate JRA-123          Validate AC quality for ticket
/arc:ac enrich JRA-123            Add implicit scenarios (edge cases, errors, boundaries)
/arc:ac update JRA-123            Fix AC from feedback (validate report, mutate report, human)
/arc:ac verify JRA-123            Verify code satisfies AC requirements
```

| Argument | Format | Default | Effect |
|----------|--------|---------|--------|
| `validate` \| `enrich` \| `update` \| `verify` | Subcommand (first token) | — | Determines workflow (required) |
| `ticket-id` | Positional | — | Ticket identifier — used to locate AC files and output directory |
| `-y`, `--yes` | Flag | `false` | Skip confirmation gates |

## Instructions

### Step 1: Parse Arguments

1. First non-flag token → `subcommand` (`validate`, `enrich`, `update`, or `verify`). If missing or not one of these → error: "Subcommand required. Usage: `/arc:ac validate|enrich|update|verify {ticket-id}`" and stop.
2. Next non-flag token → `ticket-id`. If missing → error: "Ticket ID required. Usage: `/arc:ac {subcommand} {ticket-id}`" and stop.
3. `-y` or `--yes` anywhere → `skip_confirmations = true`

### Step 2: Route to Subcommand

Read the corresponding sub-instruction file and follow all steps:

| Subcommand | File | Purpose |
|------------|------|---------|
| `validate` | [validate.md](validate.md) | Check AC quality — pure validator, does not fix |
| `enrich` | [enrich.md](enrich.md) | Add implicit scenarios — does not modify existing |
| `update` | [update.md](update.md) | Fix AC from feedback — modifies existing scenarios |
| `verify` | [verify.md](verify.md) | Check code satisfies AC — goal-backward verification |

## Shared Context

All subcommands share this context:

**Project context:** `.arcana/project-context.md` — read first. Contains AC file locations, project structure, and conventions. All subcommands read this file before locating AC files.

**AC file structure** (standard layout, actual paths from project-context):
```
{ac-directory}/
  happy-path.md     ← main scenarios
  validation.md     ← input validation, state transitions
  error-states.md   ← external failures (network, API, services)
  edge-cases.md     ← boundary conditions
```

**Report output location:** `.arcana/{feature}/{ticket-id}/` (temp, gitignored)

**AC format — Given/When/Then:**
```
Scenario: {descriptive name}
  Given: {precondition — state before action}
  When:  {action — what the user does}
  Then:  {expected result — what the user sees}
```

## Troubleshooting

### Error: No AC files found
Cause: AC files don't exist yet, or the ticket-to-feature mapping is unclear.
Solution: Ensure AC files exist at the location specified in `.arcana/project-context.md` and the ticket references them. Run `/arc:prd create` first if no PRD/AC exist.

### Error: Cannot determine feature for ticket
Cause: No `.arcana/project-context.md` or no clear link between ticket-id and feature directory.
Solution: Run `/arc:project init` to scan the project, or specify the AC file path in the ticket description.
