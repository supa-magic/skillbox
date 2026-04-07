# React Testing Library — Component Testing Examples

React Testing Library enforces testing through the user's perspective — it doesn't expose internal state, instance, or implementation details. This is a "pit of success" that makes it hard to write bad tests.

## Two Users of a Component

```
End user              → sees DOM, clicks buttons, reads text
Developer-consumer    → passes props, receives callbacks
```

Tests interact with a component only through these two interfaces. Everything else is an implementation detail.

## What to Test vs What Not to Test

```
✅ Test:                    ❌ Don't test:
Props                       Internal state (isOpen, currentIndex)
Rendered output             Method names (handleClick, setOpenIndex)
User events                 CSS class names
HTTP requests               Child component names
```

## The Third User Problem

When tests check implementation details, a third user appears — the test-user. Code starts being written for the test, not for real users. React Testing Library prevents this by design.

## Query Priority

Prefer queries that reflect how users interact with the page:

```
1. getByRole        — accessible role (button, heading, textbox)
2. getByLabelText   — form fields
3. getByText        — visible text content
4. getByTestId      — last resort
```

## Async Patterns

```typescript
// Wait for element to appear (API response, animation, etc.)
await screen.findByText('Dashboard loaded')

// Assert element is NOT present after action
await waitForElementToBeRemoved(() => screen.queryByText('Loading...'))
```
