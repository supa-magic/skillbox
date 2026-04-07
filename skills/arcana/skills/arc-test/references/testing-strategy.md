# Testing Strategy Reference

Universal testing strategy — not tied to a specific project, stack, or architecture. Tests are written from requirements, not from code.

> "Write tests. Not too many. Mostly integration." — Kent C. Dodds

## Core Principle

**Tests must be written so that any major code refactoring can be done confidently — knowing that if tests are green, product behavior hasn't changed.**

A test should know nothing about the internal structure of the code. Only about what the user sees and does.

```
Frontend:
  Renamed a component                → test should NOT break
  Migrated architecture              → test should NOT break
  Changed internal state management  → test should NOT break
  Changed store structure            → test should NOT break

Backend:
  Renamed internal service class     → test should NOT break
  Switched ORM / query builder       → test should NOT break
  Moved handler to another module    → test should NOT break
  Replaced cache layer               → test should NOT break
  Refactored DB schema (same API)    → test should NOT break

Changed what user sees / API returns → test SHOULD break ✅
Changed business logic               → test SHOULD break ✅
Changed validation rules             → test SHOULD break ✅
Changed HTTP status codes            → test SHOULD break ✅
```

## Test Levels

```
         More expensive / Slower / More confidence
                           ↑
                  ┌──────────────────┐
                  │       E2E        │
                  ├──────────────────┤
                  │    Integration   │  ← bulk of tests
                  ├──────────────────┤
                  │       Unit       │
                  ├──────────────────┤
                  │      Static      │
                  └──────────────────┘
                           ↓
            Cheaper / Faster / Less confidence
```

**What each level can and cannot do:**

```
Static (type checker + linter)
  ✅ Typos, types, syntax errors
  ❌ Cannot verify business logic

Unit
  ✅ Edge cases of isolated logic
  ❌ Cannot verify dependencies are called correctly

Integration
  ✅ Feature behavior end-to-end — component + store + API + result
  ❌ Cannot verify data going to backend is correct

E2E
  ✅ Critical path through real application
  ❌ Too expensive for every edge case
```

## Decision Matrix

Top-down — from most expensive to cheapest. Levels do NOT duplicate each other.

| AC Type | Unit | Integration | E2E |
|---------|------|-------------|-----|
| Critical path (payment, auth) | — | ✅ edge cases | ✅ happy path |
| Observable behavior (form, list, dialog) | — | ✅ | — |
| Isolated logic with edge cases | ✅ | ✅ display | — |
| Error/Empty/Loading state | — | ✅ with network mocking | — |
| Visual bug (spacing, color) | — | — | — |

**Rules:**
1. E2E covered happy path → Integration does NOT repeat it, covers edge cases
2. Integration covered behavior → Unit does NOT duplicate, only covers isolated logic
3. Shared utilities used across project → Unit test mandatory regardless of integration coverage

**Three properties of a good test:**
```
Fast      — developer runs before commit, doesn't wait hours for CI
Reliable  — flaky test is worse than no test (team starts ignoring)
Isolating — when it fails, clear where the problem is
```

## Mocking Rules

Mock at the boundary, not at the module level. Each module-level mock is a hole in integration — replacing a module means the test doesn't verify that parts work together. Test passes, integration breaks.

```
✅ Mock:       System boundary, external services (email, payment), animations
❌ Don't mock: Business logic, child components, hooks, store, your own services
```

**Where the boundary is depends on the project's test infrastructure:**

```
Real dependencies (DB, cache, queue in containers)
  → boundary = external services outside your control (payment API, email, SMS)
  → everything inside the container stack is real

Network mocking (intercept HTTP/GraphQL at the network layer)
  → boundary = network edge — application code is real, server responses are mocked

Module mocking (replace imports)
  → boundary = module boundary — AVOID, breaks integration confidence
```

The principle is the same regardless of infrastructure: keep as much of the real stack as possible, mock only what's beyond your control. The closer the boundary is to the external world — the more confidence the test provides.

For tool-specific patterns, consult the relevant example file from `project-context.md`.

## Element Selection Strategy

Tests must not depend on HTML structure, CSS classes, or DOM nesting. These are implementation details — they change during refactoring while user-visible behavior stays the same.

**Priority (highest to lowest):**

```
1. Role + name     → getByRole('button', { name: /save/i })
2. Label           → getByLabelText('Email')
3. Text content    → getByText('Order confirmed')
4. Placeholder     → getByPlaceholderText('Search...')
5. test-id         → getByTestId('checkout-submit')  ← last resort
```

**Before reaching for test-id, exhaust the alternatives:**

```
Two similar buttons on the page?
  → In different sections? → scope by parent role:
    getByRole('form', { name: /shipping/i }) → getByRole('button', { name: /save/i })
  → Can text differ? → "Save address" vs "Save payment" — role+name is enough
  → Icon without text? → aria-label is required for a11y anyway — use it
  → Nothing works → test-id via prop
```

If an element can't be found through role, text, or label — that's a signal that accessibility is lacking, not that test-id is needed.

### test-id Rules

**test-id is page context, not component context.** A component doesn't know where it's used. The page does.

```
❌ Component hardcodes test-id — duplicates when reused
  <button data-testid="submit">

✅ Component accepts test-id as a prop — page provides unique context
  <SubmitButton testId="checkout-submit" />
  <SubmitButton testId="newsletter-subscribe" />
```

- Never hardcode test-id inside reusable components
- Pass test-id from the page/parent level where the usage context is known
- test-id must be unique per page — use semantic prefixes: `{feature}-{element}`
- If AC requires test-id, the AC should specify which page-level identifier to use

### Edge Cases

**Dynamic lists** — assign test-id at the page level with the entity identifier:
```
testId={`order-item-${order.id}`}    ← page passes the id
```

**Modals and portals** — render outside the parent DOM tree. Role + aria-label is more reliable than DOM nesting:
```
getByRole('dialog', { name: /confirm deletion/i })
```

**Shadow DOM (web components)** — standard selectors don't pierce shadow boundaries. test-id inside shadow root is invisible from outside. Use aria attributes or piercing selectors provided by the test framework.

## Test Writing Algorithm

5-step process for writing any test:

```
Step 1: Decide what to test
        "What would be worst to break?"
        → Password recovery flow

Step 2: Narrow to specific behavior
        "What exactly should happen?"
        → When entering new password and confirmation,
          PATCH /api/auth/password is sent with token from URL

Step 3: Identify code users
        → Developer renders ResetPasswordForm with token from URL
        → End user enters password and clicks "Save"

Step 4: Write manual testing instructions
        → Open page with valid token in URL
        → Enter new password and confirmation
        → Click "Save Password"
        → Verify PATCH request sent with correct token
        → Verify "Password changed successfully" appears
        → Verify redirect to /login after 3 seconds

Step 5: Translate to automated test
        → Each item from step 4 becomes a line of test code
```

Step 4 is Given/When/Then as manual instructions. Step 5 is their translation to code. Chain: AC from PRD → step 4 → test.

## Implementation Details

> "Implementation details are things that users of your code don't use, don't see, and don't even know about." — Kent C. Dodds

Two users of any component:
```
End user              → sees DOM, clicks buttons, reads text
Developer-consumer    → passes props/arguments, receives callbacks/results
```

Test interacts with code only through these two interfaces. Everything else is an implementation detail.

```
✅ Test:                    ❌ Don't test:
Props / arguments           Internal state
Rendered output / return    Method / function names
User events                 CSS class names
HTTP requests               Child component names
```

**False Negative** — test breaks, app works fine. Happens on refactoring: rename internal state, test breaks. Component works the same — user noticed nothing. Test lied.

**False Positive** — test passes, app is broken. Test checks method was called — it was. But the method now receives wrong arguments. Broken in prod.

```
Bad test  → either breaks when it shouldn't (false negative)
          → or doesn't break when it should (false positive)
Good test → breaks only when behavior is actually broken
```

**The third user problem:** when tests check implementation details, a third user appears — the test-user. Code starts being written for the test, not for real users. A good testing library makes creating the third user physically difficult — it doesn't expose internal state or implementation details. This is a "pit of success."

## Bug Coverage

**Rule:** every bug must first be covered by a test, then fixed. This prevents recurrence.

```
1. Reproduce bug manually — understand exact scenario
2. Write test that reproduces bug → RED
3. Verify it fails for the right reason
4. Fix bug → GREEN
5. Test describes expected behavior, not bug details
```

Step 5 is critical — the test should describe the expected behavior, not the specific bug. This way it protects against a class of problems, not just one specific case.

**Where to cover a bug:**
```
Bug in isolated logic (wrong calculation, wrong validation)
  → Unit test on the function

Bug in component integration (doesn't update, doesn't react)
  → Integration test

Bug in critical path (payment, auth)
  → E2E test + Integration test
```

**When you can skip the test:**
```
⚠️ Typo in text
⚠️ Visual bug (spacing, color)
⚠️ One-line fix with zero regression risk
```

## Code Coverage vs Use Case Coverage

**Code Coverage** — lines of code that executed during tests.
**Use Case Coverage** — usage scenarios covered by tests.

These are different things. 100% code coverage doesn't guarantee a working application:

```
function scheduleMessage(text, sendAt) {
  if (!text) throw new Error('Empty message')
  if (sendAt < now()) throw new Error('Past date')
  return api.schedule({ text, sendAt })
}

// Test 1: empty text → error ✅
// Test 2: past date → error ✅
// Coverage: 100%
// BUT: use case "what if sendAt === null" — not covered
```

```
Bad question:  "Is this code branch covered?"
Good question: "Is this usage scenario tested?"
```

Automated use case coverage report doesn't exist — it must be compiled manually from AC. This is why tests must come from requirements, not from code analysis.

## Starting from Zero

If a project has no tests at all:

```
1. Ask the team: "What would be worst to break?"
   → Prioritized list of features

2. Write one E2E test on the most critical happy path
   → One test often covers several top features

3. Add integration tests for edge cases E2E didn't cover

4. Add unit tests for complex business logic

5. Don't chase 100% coverage — add tests where bugs appear
```
