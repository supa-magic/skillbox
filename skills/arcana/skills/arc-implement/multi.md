# Implement — Multi-Ticket (PRD)

Implement all tickets from a PRD. Builds a dependency graph, runs tickets in waves. Each ticket runs as a separate `arc:archmage` agent with the full single-ticket cycle in one context (no nested agents).

**Agent tiers:**
- `arc:archmage` — each ticket in a wave gets its own archmage (full cycle: AC → plan → code → test → verify → PR)
- `arc:mage` — not used directly (archmage handles everything per ticket)
- `arc:apprentice` — not used directly

## Steps

### Step 1: Read PRD and Tickets

1. Read `.arcana/project-context.md` for project structure
2. Find the PRD for `feature-name`
3. Find all tickets associated with this PRD (via tracker skill or AC file references)
4. If no tickets found → error: "No tickets found for `{feature-name}`. Run `/arc:prd create {feature-name}` first." and stop

### Step 2: Build Dependency Graph

Analyze ticket dependencies and group into waves:

```
Wave 1 (parallel):  Tickets with no dependencies
Wave 2 (parallel):  Tickets that depend only on Wave 1
Wave 3 (parallel):  Tickets that depend only on Wave 1 + 2
...
```

Write wave status to `.arcana/{feature}/wave-status.md`:

```markdown
# Wave Status — {feature-name}

## Wave 1 (parallel)
- [ ] {ticket-id}: {title} — not started
- [ ] {ticket-id}: {title} — not started

## Wave 2 (depends on Wave 1)
- [ ] {ticket-id}: {title} — blocked

## Wave 3 (depends on Wave 2)
- [ ] {ticket-id}: {title} — blocked
```

**Confirmation gate:** If not `--yes` → show dependency graph and ask: "Proceed with this execution order?" Wait for confirmation.

### Step 3: Execute Waves

For each wave, launch all tickets as separate `arc:archmage` agents:

**With `--yes`:**

```
For each ticket in wave:
  /arc:archmage
  Read .arcana/project-context.md, AC files for {ticket-id},
  test/references/testing-strategy.md, relevant example references from project-context.
  Execute full single-ticket cycle in this context:
    1. ac validate → ac enrich → ac validate
    2. plan
    3. code
    4. test write → test review → test validate → test mutate
    5. ac verify
    6. code review-request
  Handle all feedback loops internally (max {--max-retries}).
  Flags: --yes --max-retries={N}.
  Write result to .arcana/{feature}/{ticket-id}/full-cycle-result.md.
```

- Tickets within a wave run in parallel (independent of each other)
- Each archmage has its own context — no interference between tickets
- When all tickets in a wave are merged → start next wave

**Without `--yes` (pair mode):**
- Execute tickets sequentially within each wave
- Developer confirms at each gate

Update `.arcana/{feature}/wave-status.md` as tickets progress:
```
- [x] {ticket-id}: {title} — merged
- [ ] {ticket-id}: {title} — PR open, review in progress
```

### Step 4: Wave Transitions

Monitor wave progress:
- Ticket merged → update wave-status.md → check if all tickets in current wave are done
- All tickets in current wave merged → start next wave automatically
- Ticket blocked (failed after max retries) → block the entire wave, do NOT start dependent waves

**Failure escalation:**
- Mark the failed ticket as `blocked` in wave-status.md with the reason
- Mark all dependent waves as `waiting` (not `blocked` — they can proceed once the blocker is resolved)
- Notify the developer with: which ticket failed, which phase failed, what the error was, and which waves are waiting
- Developer resolves the issue manually, then re-invokes `/arc:implement {ticket-id} --yes` for the failed ticket
- Once the failed ticket's PR is merged → resume dependent waves

### Step 5: Completion

When all waves are complete:
1. Update wave-status.md → all done
2. Invoke `/arc:project skill-up` to analyze the full feature cycle

### Step 6: Output

> **Implement PRD — {feature-name}:**
> Waves: {number}
> Tickets: {total} ({completed} done, {in-progress} in progress, {blocked} blocked)
> Status: `.arcana/{feature}/wave-status.md`

## Example

```
/arc:implement prd:checkout --yes

  1. Build dependency graph → .arcana/checkout/wave-status.md
  2. Wave 1 (parallel — 3 archmage agents):
     /arc:archmage TASK-101 → full cycle → PR
     /arc:archmage TASK-102 → full cycle → PR
     /arc:archmage TASK-103 → full cycle → PR
  3. All Wave 1 PRs merged → start Wave 2:
     /arc:archmage TASK-104 → full cycle → PR
  4. Wave 2 merged → start Wave 3:
     /arc:archmage TASK-105 → full cycle → PR
  5. All done → /arc:project skill-up
```
