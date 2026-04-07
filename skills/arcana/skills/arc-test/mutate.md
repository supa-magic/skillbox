# Test Mutate

AI-driven mutation testing. Audits test quality — does not write tests, only identifies gaps.

Mutation testing intentionally breaks code (changes `>` to `>=`, `&&` to `||`, removes lines) and checks whether tests catch the breakage. If tests stay green after a mutation — the test doesn't actually verify that behavior.

**No contradiction with requirements-driven testing.** Mutation testing is not a tool for writing tests. It is an auditor of tests already written from requirements. A surviving mutant = a gap in AC.

```
Tests from AC → mutation tool mutates business logic
                      ↓
             Surviving mutant = missing AC scenario
                      ↓
             Return to /arc:ac update → add scenario → /arc:test write
```

## Steps

### Step 1: Locate AC, Code, and Tests

1. Read `.arcana/project-context.md` for AC file locations, test runner, framework, and active example references
2. Find AC files for `ticket-id`
3. Find production code and test files relevant to the feature

### Step 2: Identify Mutation Targets

Read AC to determine which files contain critical business logic. Only mutate business logic — NOT UI components, NOT config files, NOT formatting utilities.

```
✅ Mutate:  Business logic, access control, calculations, state machines, validators
❌ Skip:    UI components, utility formatting, config files, type definitions
```

### Step 3: Configure Mutation Tool

Check `.arcana/project-context.md` for the configured mutation testing tool. If example references exist → load the relevant example file for configuration patterns.

Generate a mutation config targeting only the identified files (2-3 files per ticket). Key performance settings:
- Only run tests relevant to each mutation (not the full suite)
- Only mutate files changed since last run
- Combined: minutes instead of hours

### Step 4: Run Mutation Testing

Execute mutation testing. Monitor for completion.

### Step 5: Analyze Survivors

For each surviving mutant, provide a concrete recommendation:

```
Surviving mutant: `plan === 'pro'` → `plan !== 'pro'`
File: src/lib/accessControl.ts:42
Gap in AC: no scenario describes behavior for free-plan user
           attempting to use a premium feature.
Recommendation: add scenario to ac/edge-cases.md
```

**Mutation score** = killed mutants / total mutants × 100%

### Step 6: Write Report

Write mutation report to `.arcana/{feature}/{ticket-id}/mutate-report.md`.

Report format:

```markdown
# Mutation Testing Report — {ticket-id}

**Mutation Score:** {score}%
**Date:** {date}
**Files mutated:** {list}

## Surviving Mutants

### Mutant 1
- File: {path}:{line}
- Mutation: `{original}` → `{mutated}`
- Gap: {what AC scenario is missing}
- Recommendation: {which AC file to update and what to add}

### ...

## Summary

{total} mutants, {killed} killed, {survived} survived.
{Recommendations for AC updates.}
```

**Confirmation gate:** If `-y` → write report. Otherwise → show report and ask: "Write mutation report to `.arcana/{feature}/{ticket-id}/mutate-report.md`?" Wait for confirmation.

### Step 7: Output

> **Mutation Testing — {ticket-id}:** {score}% mutation score
> {killed} killed, {survived} survived out of {total} mutants
> Report: `.arcana/{feature}/{ticket-id}/mutate-report.md`

**On surviving mutants:** orchestrator routes to `/arc:ac update` to add missing scenarios → `/arc:test write` to generate tests → `/arc:test mutate` again to verify.

## When to Use

```
✅ During test writing — locally, as AC quality validation
✅ Before major release — audit critical modules
✅ On schedule — once a week, not on every push
❌ On entire codebase — too slow and noisy
```
