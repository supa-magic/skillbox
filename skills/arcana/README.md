# Arcana

Full-cycle AI development methodology — from requirements to merge. Arcana is not a tool, it's a **development process** that happens to be executed by AI agents.

## Core Philosophy

**Tests come from requirements, not from code.**

A test written from code is a tautology — if the code has a bug, the test locks it in as correct behavior. A test written from acceptance criteria catches the bug because it describes what *should* happen, not what *does* happen.

```
Business requirements
  -> PRD in the repository (what, why, for whom)
    -> Acceptance Scenarios (Given/When/Then)
      -> Tests written from scenarios, not from code
        -> Confident refactoring at any time
```

The criterion: if you can do a major refactoring (rename components, restructure folders, change state management) and all tests stay green — the tests are good. If tests break on refactoring that doesn't change behavior — they test implementation details.

## Skills

| Skill | Purpose |
|-------|---------|
| `arc:project` | Configure Arcana for a project (init, audit, ADR, skill-up) |
| `arc:prd` | Create and update Product Requirements Documents |
| `arc:ac` | Manage Acceptance Criteria (validate, enrich, update, verify) |
| `arc:plan` | Investigation and implementation planning |
| `arc:code` | Write production code and manage code reviews |
| `arc:test` | Write, review, run, and audit tests |
| `arc:implement` | Orchestrator — runs the full cycle or bug fix |

## Agents

Three execution tiers — differ only in model assignment:

| Agent | Default Model | Used For |
|-------|--------------|----------|
| `arc:archmage` | Opus | Code generation, PRD creation, code review resolution |
| `arc:mage` | Sonnet | AC enrichment, planning, test writing, reviews, analysis |
| `arc:apprentice` | Haiku | Validation, verification, test execution |

Models are reconfigured during `/arc:project init` based on the AI provider.

## Getting Started

### New project (no code yet)

```
1. /arc:project init              Setup Arcana, scan (empty) codebase, install tools
2. /arc:prd create {feature}      Write PRD for the first feature
3. /arc:implement prd:{feature}   Implement all tickets from the PRD
```

### Existing project with code and tests

```
1. /arc:project init              Scan codebase, detect stack, reconcile existing rules
2. /arc:project audit             Verify everything is in place
3. /arc:implement {ticket-id}     Start using Arcana for the next ticket
```

Arcana adapts to your existing conventions. During init, it detects project rules (CLAUDE.md, .cursorrules, etc.) and reconciles them with the methodology. If your testing conventions conflict — you decide what to keep.

### Fixing a bug

```
/arc:implement BUG-123 --fix     Existing ticket
/arc:implement --fix             Interactive — asks for bug details, creates ticket
```

### Implementing from a PRD (multi-ticket)

```
/arc:implement prd:checkout --yes     All tickets, autopilot
```

Builds a dependency graph, runs tickets in parallel waves. Each ticket gets its own `arc:archmage` agent with the full cycle.

## Using Skills Standalone

Every skill works independently — you don't have to use the full orchestrator:

```
/arc:ac validate JRA-123        Just check AC quality
/arc:test write JRA-123         Just write tests from AC
/arc:test review JRA-123        Just audit existing tests
/arc:plan JRA-123               Just investigate and plan
/arc:code JRA-123               Just write code
/arc:project adr "REST vs gRPC" Just create an ADR
```

This is useful when:
- You want to run one phase manually instead of the full pipeline
- You're iterating on AC before starting implementation
- You want to audit test quality on existing tests (not written by Arcana)
- You need a plan before committing to the full cycle

## Key Concepts

**Requirements-driven testing** — tests are written from AC scenarios, never from code inspection. This ensures tests survive refactoring and catch real behavioral bugs.

**Boundary mocking** — mock at the system boundary (network, external services), not at the module level. The closer the boundary to the external world, the more confidence the test provides.

**Element selection priority** — tests select elements by role, label, or text — not by HTML structure or CSS classes. `data-testid` is a last resort, passed as a prop from the page level.

**Vertical slicing** — tasks are sliced by behavior, not by layers. Each ticket is a complete user-visible feature, independently deployable.

**Feedback loops with retries** — each quality gate (AC validation, test execution, mutation testing) loops until passing or max retries. The agent doesn't silently skip failures.

## Installation

```bash
npx @supa-magic/spm@latest install https://github.com/supa-magic/skillbox/tree/main/skills/arcana
```

Or install spm globally:

```bash
npm install @supa-magic/spm@latest -g
spm install https://github.com/supa-magic/skillbox/tree/main/skills/arcana
```

Then run `/arc:project init` to configure Arcana for your project.
