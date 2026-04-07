# Test Validate

Run tests. Pure execution — does not write or generate anything.

## Steps

### Step 1: Identify Test Files

1. Read `.arcana/project-context.md` for test runner configuration
2. Find test files relevant to `ticket-id` — tests written by `/arc:test write` or existing tests covering the feature

### Step 2: Run Tests in Parallel

Launch test processes in parallel where possible:

```
Process 1: E2E tests (if E2E runner configured)        — separate process
Process 2: Integration + Unit (test runner)             — separate process
Process 3: Linting + type checking                      — separate process
```

Use the test runner and E2E runner from `project-context.md`. Run each with the project's configured commands.

### Step 3: Collect Results

For each test, record:
- Test name and file
- Status: PASS or FAIL
- Error message and stack trace (if FAIL)
- Duration

### Step 4: Output

Report format:

```
# Test Results — {ticket-id}

**Status:** GREEN | RED
**Date:** {date}

## Results

### E2E ({passed}/{total})
- ✅ {test name} ({duration})
- ❌ {test name} — {error summary}

### Integration ({passed}/{total})
- ✅ {test name} ({duration})
- ❌ {test name} — {error summary}

### Unit ({passed}/{total})
- ✅ {test name} ({duration})
- ❌ {test name} — {error summary}

### Static
- Type checking: PASS | FAIL
- Linting: PASS | FAIL

## Failed Test Details

### {test name}
File: {path}
Error: {full error message}
```

> **Tests — {ticket-id}:** {GREEN|RED}
> E2E: {passed}/{total} | Integration: {passed}/{total} | Unit: {passed}/{total}

**On RED:** the orchestrator analyzes the error and routes to:
- `/arc:code` — if the bug is in production code
- `/arc:test write` — if the bug is in the test itself
