# Test Write

Generate tests from AC scenarios. Does not run tests — only writes test files.

## Steps

### Step 1: Locate AC and Code

1. Read `.arcana/project-context.md` for AC file locations, test runner, API type, framework, conventions, and active example references
2. Find AC files for `ticket-id`
3. If no AC files found → error and stop
4. Read production code relevant to the feature

### Step 2: Apply Decision Matrix

For each AC scenario, determine the test level using the decision matrix (top-down, no duplication between levels). See `## Decision Matrix` in [references/testing-strategy.md](references/testing-strategy.md).

```
1. Critical user path (money, auth, irreversible action with business impact)?
   YES → E2E test (happy path only)
   NO  → skip E2E

2. Observable feature behavior (form, list, dialog, async operation)?
   YES → Integration test (bulk of all tests)
        Covers edge cases that E2E didn't cover
   NO  → skip Integration

3. Isolated logic used in multiple places across the project?
   (utilities, formatting, validation, calculations)
   YES → Unit test (mandatory regardless of integration coverage)

4. Isolated logic used only here?
   NO  → Integration already covers it
   YES, but complex with many edge cases? → Unit test
```

**Key rules:**
- E2E covered happy path → Integration does NOT repeat it, covers edge cases instead
- Integration covered behavior → Unit does NOT duplicate it, only covers isolated logic
- Shared utilities (formatPrice, validateEmail, parseDate) → Unit test mandatory even if integration covers them

### Step 3: Apply Mocking Rules

See `## Mocking Rules` in [references/testing-strategy.md](references/testing-strategy.md).

```
✅ Mock:     Network boundary, external services (email, payment), animations
❌ Don't mock: Business logic, child components, hooks, store
```

Mock at the network boundary, not at the module level. The entire application chain should be real — only the backend response is replaced.

If `project-context.md` specifies a network mocking tool with example references → load the relevant example file for implementation patterns.

### Step 4: Apply Optional Layers

Check `.arcana/project-context.md` for optional testing layers enabled for the project:

- **Visual regression** — enable for design systems, UI kits, public landing pages
- **Accessibility** — enable for public products, enterprise/government, design systems

If enabled and example references exist → load relevant example files and generate corresponding tests alongside the main test files.
If not configured → skip.

### Step 5: Write Test Files

For each AC scenario, write the test following the 5-step algorithm from [references/testing-strategy.md](references/testing-strategy.md) (`## Test Writing Algorithm`).

Produce a mapping showing which AC scenario maps to which test at which level:

```
AC scenario → test file : test name → level (E2E / Integration / Unit)
```

**Confirmation gate:** If `-y` → write test files and commit. Otherwise → show the mapping and test structure, then ask: "Write these test files?" Wait for confirmation.

Commit test files to the feature branch with a dedicated test commit.

### Step 6: Output

> **Tests Written — {ticket-id}:**
> - E2E: {number} tests
> - Integration: {number} tests
> - Unit: {number} tests
> - Optional: {visual regression / a11y if enabled}
>
> **Mapping:**
> {AC scenario → test → level for each}
>
> Run `/arc:test validate {ticket-id}` to execute tests.
