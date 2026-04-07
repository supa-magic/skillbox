---
name: arc:plan
description: >
  Read-only investigation of a task. Scans codebase, reads ticket from tracker,
  produces an implementation plan. Does not modify any files. Use when estimating
  a task, preparing for implementation, or answering "what will this task affect?".
  Triggers on "arc:plan", "plan task", "analyze task", "what does this task affect",
  "estimate task", "investigate ticket".
user-invocable: true
argument-hint: "{ticket-id} [-y]"
license: MIT
metadata:
  author: supa-magic
  version: 1.0.0
  category: workflow
  tags: [planning, investigation, estimation, task-analysis]
---

# /arc:plan $ARGUMENTS

Read-only investigation — scans codebase, produces implementation plan. Does not modify files.

## Usage

```
/arc:plan JRA-123          Investigate task and produce plan, confirm before writing
/arc:plan JRA-123 -y       Investigate and write plan without confirmation
```

| Argument | Format | Default | Effect |
|----------|--------|---------|--------|
| `ticket-id` | Positional | — | Ticket identifier — used to fetch task details and locate AC |
| `-y`, `--yes` | Flag | `false` | Write plan without pausing for confirmation |

## Instructions

### Step 1: Parse Arguments

Extract `ticket-id` from arguments. If missing → error: "Ticket ID required. Usage: `/arc:plan JRA-123`" and stop.

### Step 2: Gather Context

1. Read `.arcana/project-context.md` for project structure, conventions, and external skill configuration
2. Fetch ticket details from tracker via external tracker skill (description, comments, links, assignee). If tracker skill not configured → ask developer for task description
3. Find AC files linked to the ticket
4. Write task summary to `.arcana/{feature}/{ticket-id}/task.md`:

```markdown
# Task — {ticket-id}

**Title:** {title from tracker}
**Description:** {description}
**AC:** {path to AC files}

## Comments
{Relevant comments from tracker participants — hints, context, decisions}

## Links
{Related tickets, PRD links, design links}
```

### Step 3: Investigate Codebase (Read-Only)

Scan the codebase to understand what the task will affect. Do NOT modify any files.

Investigate:
- Which files and components will be affected
- Existing patterns in the code that must be followed
- API contracts, types, and interfaces involved
- Test infrastructure (existing test files, test utilities, fixtures)
- Dependencies between modules

### Step 4: Assess Complexity

Evaluate task size. If the task is too large for one context window:
- Recommend splitting via `/arc:prd create` or `/arc:prd update`
- Identify natural split points (vertical slices)

Signals that a task is too large:
- Plan + AC + affected code exceed ~50% of context window
- More than 3-5 main files need changes
- Multiple independent behaviors bundled in one ticket

### Step 5: Write Plan

Write implementation plan to `.arcana/{feature}/{ticket-id}/plan.md`:

```markdown
# Implementation Plan — {ticket-id}

## Affected Files
- `{path}` — {what changes and why}
- `{path}` — {what changes and why}

## Order of Changes
1. {First change — why this order}
2. {Second change}
3. {Third change}

## Existing Patterns to Follow
- {Pattern observed in codebase — reference file}
- {Convention from project-context}

## Complexity Assessment
- Estimated scope: {small | medium | large}
- Main files affected: {number}
- Risk areas: {list}

## Risks and Pitfalls
- {Deprecated API, missing tests, rate limits, known bugs in affected modules}
- {External dependencies that might affect implementation}
```

**Confirmation gate:** If `-y` → write plan. Otherwise → show plan and ask: "Write plan to `.arcana/{feature}/{ticket-id}/plan.md`?" Wait for confirmation. If developer requests changes → revise and re-present.

### Step 6: Output

> **Plan — {ticket-id}:** {title}
> Scope: {small|medium|large} — {number} files affected
> Risks: {brief list or "none identified"}
> Plan: `.arcana/{feature}/{ticket-id}/plan.md`
> Task: `.arcana/{feature}/{ticket-id}/task.md`

## Examples

### Example 1: Standard task planning

User says: `/arc:plan TASK-512`
Actions:
1. Fetch TASK-512 from tracker — "Scheduling: create meeting (happy path)"
2. Find AC in `ac/happy-path.md` — 3 scenarios
3. Scan codebase — find calendar module, API routes, existing form components
4. Write task.md with tracker details
5. Write plan.md — 4 files affected, follows existing form pattern, small scope
Result: Plan ready for `/arc:code TASK-512`

### Example 2: Task too large

User says: `/arc:plan TASK-600 -y`
Actions:
1. Fetch TASK-600 — "Complete checkout flow with payments"
2. Find AC — 15 scenarios across 4 AC files
3. Scan codebase — 8+ files affected, multiple independent behaviors
4. Assess: task too large for one context window
5. Write plan with recommendation to split
Result: Plan written with split recommendation — suggest `/arc:prd update` to break into smaller tickets

## Troubleshooting

### Error: Tracker skill not configured
Cause: No tracker skill in `.arcana/project-context.md`.
Solution: Run `/arc:project init` to configure, or provide task description manually in the conversation.

### Error: No AC files found for ticket
Cause: Ticket doesn't reference AC files, or AC not written yet.
Solution: Run `/arc:prd create` or `/arc:ac enrich` first. Plan can still be created without AC but will lack scenario-level detail.
