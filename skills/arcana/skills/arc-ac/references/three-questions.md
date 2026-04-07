# Three-Question Algorithm for Implicit Scenarios

Meta-algorithm for discovering implicit scenarios in any feature. Checklists don't work — features are too different. Ready-made templates don't cover all of software development. These three universal questions work for any feature.

## The Three Questions

### Question 1: What can go wrong externally?

Focus: network, server, external dependencies, data from API.

Things to consider:
- Network disconnected or slow
- API returned 500, 404, 403, 409, 429
- Data came back empty or in unexpected format
- Timeout on long operations
- External service unavailable (payment gateway, email service)
- WebSocket disconnected

### Question 2: What can go wrong internally?

Focus: user input, component state, transitions between states, race conditions.

Things to consider:
- Empty or invalid input
- Forbidden characters or injection attempts
- Double-click / duplicate submission
- Unexpected state (undo on empty history, redo after new actions)
- Transitions between states that shouldn't be possible
- Form submitted while previous submission is still in progress

### Question 3: What happens at boundaries?

Focus: empty, maximum, concurrent, first/last, zero values.

Things to consider:
- Empty list, empty search results, no data
- Maximum length, maximum items, maximum file size
- Concurrent actions by multiple users
- First element, last element, only element
- Zero values, negative values
- URL with invalid parameters

## Examples by Feature Type

### Registration Form

```
External:
  POST /api/register returned 500 → show error, preserve form data
  Email already exists (409) → specific error message

Internal:
  Empty fields → submit button disabled
  Invalid email → error message on blur
  Double-click "Register" → second request not sent

Boundaries:
  Password exactly 8 chars (minimum) → form submits
  Password 7 chars → form does not submit
```

### Real-time Chat

```
External:
  Message not sent (no network) → error indicator on message
  WebSocket disconnected → show "No connection", auto-reconnect

Internal:
  Empty message → send button disabled
  Enter key sends message

Boundaries:
  Very long message (>1000 chars) → character counter or limit
  Two messages sent simultaneously → both arrive in correct order
```

### Canvas Editor (Miro-like)

```
External:
  Auto-save failed → user warned, unsaved work not lost
  Image upload too large → clear error message

Internal:
  Undo on empty history → nothing happens, no crash
  Redo after new actions → redo unavailable (history cut off)

Boundaries:
  Maximum zoom → can't zoom further
  1000 objects on canvas → performance doesn't degrade critically
```

### Filter with Search

```
External:
  API returned error on filter → current data stays, show error

Internal:
  Filter with zero results → empty state with "Reset filters" button
  Filter saved in URL → applied on page reload

Boundaries:
  All filters selected at once → works correctly, no hang
  URL with invalid filter value → resets to default without error
```

### Meeting Scheduler

```
External:
  POST /api/meetings returned 409 (schedule conflict) → specific error
  User timezone changed → meetings recalculated correctly

Internal:
  Meeting ends after midnight → correctly shows next day's date
  Recurring meeting → each occurrence editable independently

Boundaries:
  All-day meeting → no start/end time, only date
  Meeting 5 minutes before another → warning but not blocked
```

## Mapping Answers to AC Files

Each question maps to a specific AC file in the feature's `ac/` directory:

```
Question 1 (external) → ac/error-states.md
Question 2 (internal) → ac/validation.md or ac/happy-path.md
Question 3 (boundaries) → ac/edge-cases.md
```

This mapping matches the standard AC file structure (actual path from `.arcana/project-context.md`):

```
{ac-directory}/
  happy-path.md     ← main scenarios
  validation.md     ← answers to question 2
  error-states.md   ← answers to question 1
  edge-cases.md     ← answers to question 3
```

## Stopping Criteria

Implicit scenarios are theoretically infinite. Stop when:

1. All three questions asked and answers recorded as AC
2. Every state covered (success, loading, error, empty)
3. Critical paths covered by E2E-level scenarios
4. New scenarios stop adding confidence — risk of their absence is minimal
