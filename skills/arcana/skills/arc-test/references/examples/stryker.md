# Stryker — Mutation Testing Configuration

Stryker Mutator for JavaScript/TypeScript projects. Integrates with Jest and Vitest.

## Config Generation

Generate `stryker.config.js` targeting only identified business logic files (2-3 files per ticket):

```javascript
export default {
  testRunner: '{jest|vitest}',      // match project test runner
  coverageAnalysis: 'perTest',      // only run relevant tests per mutation
  incremental: true,                // only mutate changed files
  mutate: [
    'src/lib/{identified-file-1}.ts',
    'src/features/{feature}/model/{identified-file-2}.ts',
    // NOT: components, formatting utilities, configs
  ]
}
```

## Performance Settings

- `perTest` — only runs tests relevant to each mutation (not the full suite)
- `incremental` — only mutates files changed since last run
- Combined: minutes instead of hours

## What to Mutate

```
✅ Mutate:  Business logic, access control, calculations, state machines, validators
❌ Skip:    UI components, utility formatting, config files, type definitions
```

## Installation

```bash
# Jest
npm install --save-dev @stryker-mutator/core @stryker-mutator/jest-runner

# Vitest
npm install --save-dev @stryker-mutator/core @stryker-mutator/vitest-runner
```
