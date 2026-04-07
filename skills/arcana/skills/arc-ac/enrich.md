# AC Enrich

Add implicit scenarios using the three-question algorithm. Does NOT modify existing scenarios — only adds new ones.

## Steps

### Step 1: Locate AC Files and Gather Context

1. Read `.arcana/project-context.md` to find AC file locations and project conventions
2. Find the feature directory associated with `ticket-id`
3. Collect all existing AC files for the feature
4. If no AC files found → error and stop
5. Read the codebase (read-only) for context — existing components, patterns, API contracts relevant to the feature

### Step 2: Apply Three-Question Algorithm

For the feature described in the AC files, systematically ask three questions. See [references/three-questions.md](references/three-questions.md) for the full algorithm with examples.

1. **What can go wrong externally?** — network failures, API errors, empty data from server, timeouts, external dependency failures
2. **What can go wrong internally?** — invalid user input, forbidden characters, duplicate submissions, unexpected state transitions
3. **What happens at boundaries?** — empty lists, maximum lengths, concurrent actions, first/last element, zero values

For each answer, formulate a new scenario in Given/When/Then format.

### Step 3: Map Scenarios to AC Files

New scenarios are added to the appropriate AC file based on their source question:

```
Question 1 (external) → {ac-directory}/error-states.md
Question 2 (internal) → {ac-directory}/validation.md
Question 3 (boundaries) → {ac-directory}/edge-cases.md
```

If the target AC file does not exist → create it.
If an implicit scenario is already covered by an existing scenario → skip it.

### Step 4: Write Enriched AC

**Confirmation gate:** If `-y` → write enriched AC files. Otherwise → show all new scenarios grouped by file, then ask: "Add these scenarios to the AC files?" Wait for confirmation. If developer requests changes → revise and re-present.

Append new scenarios to the end of each target AC file. Do NOT modify or reorder existing scenarios.

### Step 5: Output

> **AC Enrichment — {ticket-id}:** {number} new scenarios added
> - `error-states.md`: {number} scenarios (external failures)
> - `validation.md`: {number} scenarios (internal edge cases)
> - `edge-cases.md`: {number} scenarios (boundary conditions)
>
> Run `/arc:ac validate {ticket-id}` to verify new scenarios meet quality standards.
