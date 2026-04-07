# jest-axe / vitest-axe — Accessibility Testing Examples

Automated accessibility auditing using axe-core. Catches common a11y violations (missing alt text, missing labels, color contrast issues, incorrect ARIA usage).

## When to Enable

```
✅ Enable:  Public-facing products, enterprise/government apps, design systems
⚠️ Consider: Internal tools with diverse user base
❌ Skip:    Internal admin tools, scripts, CLI tools
```

## Basic Usage

```typescript
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

it('login form has no a11y violations', async () => {
  const { container } = render(<LoginForm />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## What It Catches

- Missing `alt` attributes on images
- Missing `label` associations on form controls
- Insufficient color contrast
- Incorrect ARIA roles and attributes
- Missing landmark regions
- Duplicate IDs

## What It Doesn't Catch

- Keyboard navigation flow
- Screen reader announcement order
- Focus management after dynamic content changes
- Cognitive accessibility issues

These require manual testing or E2E tests with screen reader simulation.
