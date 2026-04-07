# AC Verify

Goal-backward verification — check that CODE satisfies REQUIREMENTS. Not about tests being green — about AC being fully implemented.

Different from `/arc:ac validate`: validate checks AC quality, verify checks code against AC.
Different from `/arc:test validate`: tests can be green but AC covered only 70%. Verify walks each scenario and checks: is this implemented? Is there a test? Does the test check this specific behavior?

## Steps

### Step 1: Locate AC Files and Code

1. Read `.arcana/project-context.md` to find AC file locations and project conventions
2. Find AC files for `ticket-id`
3. If no AC files found → error and stop
4. Read the production code and test files relevant to the feature

### Step 2: Verify Each Scenario

For every scenario in the AC files, check three things:

1. **Implemented in code?** — is the behavior described in the scenario actually implemented in production code?
2. **Has a test?** — is there an automated test that covers this scenario?
3. **Test checks this behavior?** — does the test verify exactly what the scenario describes, not something else?

Mark each scenario:
- **DONE** — implemented, tested, test verifies the behavior
- **PARTIAL** — implemented but no test, or test doesn't verify the specific behavior
- **MISSING** — not implemented in code

### Step 3: Write Report

Write verification report to `.arcana/{feature}/{ticket-id}/verify-report.md`.

Report format:

```markdown
# AC Verification Report — {ticket-id}

**Status:** COMPLETE | PARTIAL | INCOMPLETE
**Date:** {date}
**AC files verified:** {list of files}

## Per-Scenario Results

### {ac-file}: {scenario-name}
- Implemented: YES | NO — {evidence: file and line}
- Test exists: YES | NO — {evidence: test file and name}
- Test verifies behavior: YES | NO — {explanation}
- **Status:** DONE | PARTIAL | MISSING

### ...

## Summary

{number} scenarios total
- DONE: {number}
- PARTIAL: {number} — {list what's missing}
- MISSING: {number} — {list what's not implemented}

## Recommendations

{What to do next — which scenarios need implementation or tests}
```

**Confirmation gate:** If `-y` → write report and output summary. Otherwise → show report and ask: "AC verification complete. Write report to `.arcana/{feature}/{ticket-id}/verify-report.md`?" Wait for confirmation.

### Step 4: Output

> **AC Verification — {ticket-id}:** {COMPLETE|PARTIAL|INCOMPLETE}
> {done} done, {partial} partial, {missing} missing out of {total} scenarios
> Report: `.arcana/{feature}/{ticket-id}/verify-report.md`
