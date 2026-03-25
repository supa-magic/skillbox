# Conventional Branch 1.0.0

> Source: https://conventional-branch.github.io/

## Summary

Conventional Branch is a specification for standardized Git branch naming that enhances readability and automation. It makes branches more readable and actionable through consistent naming patterns.

## Structure

```
<type>/<description>
```

## Types

| Type | Purpose |
|------|---------|
| `main` | Primary development branch (`main`, `master`, `develop`) |
| `feature` or `feat` | New features |
| `bugfix` or `fix` | Bug fixes |
| `hotfix` | Urgent production fixes |
| `release` | Release preparation (e.g., `release/v1.2.0`) |
| `chore` | Non-code tasks (dependencies, docs) |

## Rules

1. Use only lowercase letters (a-z), numbers (0-9), hyphens, and dots (dots for version numbers in release branches only)
2. No consecutive, leading, or trailing hyphens or dots
3. Keep names descriptive yet concise
4. Include ticket/issue numbers when applicable (e.g., `feature/issue-123-new-login`)

## Examples

- `feature/add-login-page`
- `bugfix/fix-header-bug`
- `hotfix/security-patch`
- `release/v1.2.0`
- `chore/update-dependencies`
- `feature/issue-123-new-login`
