# AC Validation Criteria

Reference material for `/arc:ac validate`. Four criteria for individual scenarios, plus a completeness checklist for the full AC set.

## Four Quality Criteria

Each AC scenario must pass ALL four criteria. If any one fails, the scenario is invalid.

### Criterion 1: Falsifiable

> Can you write code that satisfies the requirement but violates this AC?

- YES → AC is useful (it adds a constraint beyond the requirement)
- NO → AC is a duplicate of the requirement → rewrite

**Examples:**

```
Requirement: User can submit the registration form

❌ FAIL: "Registration form works correctly"
   → Cannot satisfy the requirement while violating this AC — it's a paraphrase, not a constraint

✅ PASS: "After successful submission, user sees 'Check your email'"
   → Can build a form that submits but shows no message — AC is violated, therefore useful

✅ PASS: "Submit button is disabled when email is empty"
   → Can build a form that allows empty email submission — AC adds a real constraint
```

```
Requirement: User can enable dark theme

❌ FAIL: "Dark theme works correctly"
   → Paraphrase, not falsifiable

✅ PASS: "After toggling, data-theme attribute on <html> changes to 'dark'"
✅ PASS: "Theme choice persists after page reload"
✅ PASS: "System theme applies automatically if user hasn't chosen"
```

### Criterion 2: Observable

> Is the result visible to the end user or the developer-consumer?

Two users of any component:
- **End user** — sees DOM, clicks buttons, reads text
- **Developer-consumer** — passes props, receives callbacks

If the AC describes something neither user can see → it tests an implementation detail.

- YES → AC is valid
- NO → AC tests an implementation detail → rewrite

**Examples:**

```
❌ FAIL: "ThemeProvider calls setTheme('dark') when toggled"
   → setTheme is an internal method — no user sees it

✅ PASS: "All text elements use color from CSS variable --text-primary"
   → Observable effect that can be verified

❌ FAIL: "Component calls handleSubmit on click"
   → handleSubmit is an internal handler

✅ PASS: "On click 'Submit', form data is sent to /api/register"
   → HTTP request is an observable effect
```

**What to test vs what not to test:**

```
✅ Test:                    ❌ Don't test:
Props                       Internal state (isOpen, currentIndex)
Rendered output             Method names (handleClick, setOpenIndex)
User events                 CSS class names
HTTP requests               Child component names
```

### Criterion 3: Testable

> Can this be verified in an automated test without subjective judgment?

- YES → AC is valid
- NO → AC is subjective → make it concrete

**Examples:**

```
❌ FAIL: "Dark theme looks nice and is comfortable for the eyes"
   → "Looks nice" cannot be automated

✅ PASS: "Text-on-background contrast meets WCAG AA (4.5:1)"
   → Measurable, automatable

❌ FAIL: "Form error state is user-friendly"
   → "User-friendly" is subjective

✅ PASS: "On validation error, each invalid field shows error text below it"
   → Concrete, verifiable
```

### Criterion 4: Implementation-free

> Does the AC describe behavior in business language without referencing code internals?

No class names, API endpoints, database tables, internal method names, or framework-specific terms.

- YES → AC is valid
- NO → AC is coupled to implementation → rewrite in business language

**Examples:**

```
❌ FAIL: "WHEN a POST request is sent to /api/users"
   → References specific API endpoint

✅ PASS: "WHEN a new user registers"
   → Business language, implementation-agnostic

❌ FAIL: "Redux store updates userSlice.isAuthenticated to true"
   → References internal store structure

✅ PASS: "After login, user sees the dashboard with their name"
   → Describes what the user observes
```

## Completeness Checklist

After validating individual scenarios, check the AC set as a whole. For any feature with async operations or data loading, ALL of these states must be covered:

```
Success state  — data loaded, action completed successfully
Loading state  — data loading, action in progress
Error state    — request failed, action could not complete
Empty state    — no data, list is empty, no results
```

**Example — "Transaction History" feature:**

```
✅ Success: Transaction list with date, amount, and status
✅ Loading: Skeleton of 5 rows while data loads
✅ Error:   "Could not load history" + "Retry" button
✅ Empty:   "No transactions yet" + link to add funds

If any state is missing → AC set is incomplete.
```

**When completeness check applies:**
- Features that fetch data from API → all four states
- Features with form submission → success + error (loading and empty may be N/A)
- Pure UI features with no async → completeness check is N/A
