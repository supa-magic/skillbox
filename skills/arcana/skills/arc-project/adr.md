# ADR — Create Architecture Decision Record

Documents context, options considered, decision made, and consequences.

## Steps

### Step 1: Parse Arguments

1. Remaining non-flag tokens after `adr` → `title`. If missing → error: "Title required. Usage: `/arc:project adr \"WebSocket vs Polling\"`" and stop.
2. `-y` or `--yes` anywhere → `skip_confirmations = true`

### Step 2: Gather Context

1. Read `.arcana/project-context.md` for project structure and conventions
2. Find existing ADR directory and count existing ADRs to determine the next sequence number
3. Read the codebase for context relevant to the decision (if needed)

### Step 3: Discuss the Decision (Interactive)

If `skip_confirmations` is false → ask the developer for context:

> What's the decision about? Describe the problem, the options you're considering, and any constraints. I'll shape it into a structured ADR.

Wait for response. Ask follow-up questions if needed:
- What problem triggered this decision?
- What options were considered?
- What constraints matter? (performance, cost, team expertise, timeline)
- What was decided and why?
- What are the consequences?

If `skip_confirmations` is true → infer context from the codebase and title, draft the ADR, and write it.

### Step 4: Write ADR

Determine ADR path from project-context. Default pattern: `{decisions-directory}/{NNN}-{slug}.md`

ADR format:

```markdown
# {NNN}. {Title}

**Date:** {date}
**Status:** accepted

## Context

{What is the problem? What forces are at play? Why does this decision need to be made now?}

## Options Considered

### Option 1: {name}
{Description, pros, cons}

### Option 2: {name}
{Description, pros, cons}

### Option 3: {name} (if applicable)
{Description, pros, cons}

## Decision

{What was decided and why. Reference the winning option.}

## Consequences

### Positive
- {benefit}

### Negative
- {trade-off}

### Neutral
- {side effect that's neither good nor bad}
```

**Confirmation gate:** If `-y` → write file. Otherwise → show the ADR and ask: "Write this ADR?" Wait for confirmation. Revise if needed.

### Step 5: Output

> **ADR Created:** `{path}/{NNN}-{slug}.md`
> Decision: {one-line summary of what was decided}

## Examples

### Example 1: Interactive ADR

User says: `/arc:project adr "State Management"`
Actions:
1. Ask developer about the decision
2. Developer explains: choosing between Redux Toolkit, Zustand, and Jotai
3. Draft ADR with all three options, pros/cons, decision
4. Show draft, get approval
5. Write to `{decisions-directory}/003-state-management.md`
Result: ADR documenting why Zustand was chosen

### Example 2: Quick ADR from context

User says: `/arc:project adr "REST vs GraphQL" -y`
Actions:
1. Read codebase — find existing REST endpoints, no GraphQL setup
2. Infer context from project structure
3. Draft ADR with options and inferred decision
4. Write immediately
Result: ADR written based on codebase evidence

## Troubleshooting

### Error: Cannot find decisions directory
Cause: No ADR directory configured in project-context, or directory doesn't exist.
Solution: Run `/arc:project init` to scan project structure, or create the directory manually.
