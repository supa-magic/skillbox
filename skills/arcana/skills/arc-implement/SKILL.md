---
name: arc:implement
description: >
  Orchestrator — full implementation cycle from requirements to PR. Runs skills in the correct
  order with feedback loops. Handles single tickets, all tickets from a PRD, or bug fixes.
  Use when implementing a feature end-to-end, running the full development cycle for a ticket,
  or fixing a bug.
  Triggers on "arc:implement", "implement task", "implement ticket", "implement feature",
  "full cycle", "implement issue", "work on ticket", "fix bug", "fix issue".
user-invocable: true
argument-hint: "{ticket-id} | prd:{feature-name} [--fix] [--yes] [--stop=phase] [--skip=phase] [--test-first] [--max-retries=N]"
license: MIT
metadata:
  author: supa-magic
  version: 1.0.0
  category: workflow
  tags: [orchestrator, implementation, full-cycle, automation]
---

# /arc:implement $ARGUMENTS

Orchestrator — full implementation cycle from requirements to PR.

## Usage

```
/arc:implement JRA-123                                     Pair mode — confirm at each gate
/arc:implement JRA-123 --yes                               Recommended path, no pauses
/arc:implement JRA-123 --yes --skip=test-mutate            Skip mutation testing
/arc:implement JRA-123 --yes --stop=code-review-request     Autopilot until PR, then pair mode
/arc:implement JRA-123 --skip=test-mutate --skip=ac-enrich Pair mode, skip mutations and enrich
/arc:implement JRA-123 --test-first                        TDD: test → code instead of code → test
/arc:implement JRA-123 --fix                               Bug fix with existing ticket
/arc:implement --fix                                       Bug fix — interactive, ask for details
/arc:implement JRA-123 --fix --yes                         Bug fix, autopilot
/arc:implement prd:checkout --yes                           All tickets from PRD, autopilot
```

| Argument | Format | Default | Effect |
|----------|--------|---------|--------|
| `ticket-id` | Positional | — | Single ticket to implement |
| `prd:{feature-name}` | Positional | — | Implement all tickets from a PRD |
| `--fix` | Flag | `false` | Bug fix — short cycle (no plan, enrich, or mutate). With ticket-id or interactive |
| `--yes`, `-y` | Flag | `false` | Follow recommended path without pausing |
| `--stop={phase}` | Flag | — | Autopilot UNTIL this phase, then switch to pair mode |
| `--skip={phase}` | Flag (repeatable) | — | Skip phase entirely |
| `--test-first` | Flag | `false` | TDD/RDT order: test → code instead of code → test |
| `--max-retries={N}` | Flag | `3` | Max iterations in feedback loops |

## Instructions

### Step 1: Parse Arguments

1. Parse flags: `--fix`, `--yes`, `--stop`, `--skip`, `--test-first`, `--max-retries`
2. First non-flag token → `target`:
   - Starts with `prd:` → multi-ticket mode, extract `feature-name`
   - Looks like a ticket ID (e.g., `JRA-123`, `#42`) → single ticket mode
   - `--fix` without target → interactive bug fix mode (gather details from developer)
   - Otherwise → single ticket mode, treat as `ticket-id`
3. If no target and no `--fix` → error: "Target required. Usage: `/arc:implement {ticket-id}` or `/arc:implement prd:{feature-name}`" and stop

### Step 2: Route by Mode

| Mode | Target | File |
|------|--------|------|
| Bug fix | `ticket-id` + `--fix` | [fix.md](fix.md) — short cycle for bug fixes |
| Single ticket | `ticket-id` | [single.md](single.md) — full cycle for one ticket |
| Multi-ticket (PRD) | `prd:{feature-name}` | [multi.md](multi.md) — build dependency graph, run waves |

## The --yes Flag

`--yes` does NOT disable analysis. Every skill still thinks, classifies, and forms a recommendation. `--yes` only removes the pause — the skill follows the recommended path without waiting for developer input.

```
Pair mode (without --yes):
  1. Skill analyzes → forms recommendation
  2. Shows recommendation to developer
  3. Waits: "agree" / "no, do it differently"

--yes mode:
  1. Skill analyzes → forms recommendation (same logic)
  2. Executes recommended path without waiting
```

Quality does not drop in `--yes` mode. Analysis always happens — `--yes` is about speed, not quality.

## Feedback Loops

**Full cycle (single.md):**
```
/arc:ac validate → fail           → /arc:ac update → /arc:ac validate
/arc:test review → needs work     → /arc:test write → /arc:test review
/arc:test validate → red          → /arc:code or /arc:test write → /arc:test validate
/arc:test mutate → survivors      → /arc:ac update → /arc:test write → /arc:test mutate
/arc:ac verify → partial          → /arc:code → /arc:ac verify
/arc:code review-resolve → comments → fix/respond → push → /arc:code review-resolve
```

**Bug fix (fix.md) — shorter loops:**
```
/arc:ac validate → fail           → /arc:ac update → /arc:ac validate
/arc:test validate → red          → /arc:code or /arc:test write → /arc:test validate
/arc:ac verify → partial          → /arc:code → /arc:ac verify
/arc:code review-resolve → comments → fix/respond → push → /arc:code review-resolve
```

Each loop: maximum `--max-retries` iterations (default 3). After that → stop and escalate to the developer.

## Troubleshooting

### Error: No project context
Cause: `.arcana/project-context.md` doesn't exist.
Solution: Run `/arc:project init` first.

### Error: Task too large
Cause: `/arc:plan` determined the task exceeds one context window.
Solution: Use `/arc:prd update` to split the task into smaller tickets, then `/arc:implement` each one.

### Stuck in a feedback loop
Cause: A skill keeps failing after max retries (e.g., tests stay red, AC keeps failing validation).
Solution: Orchestrator stops and shows the developer what's failing. Manual intervention needed — the issue may be in the AC, the code, or the test setup.
