# Post Install

## Step 1: Enable commitlint (optional)

By default `/git push` validates commit messages manually (rejects WIP, Co-Authored-By). You can optionally add [commitlint](https://commitlint.js.org/) for full Conventional Commits linting.

If `@commitlint/cli` is in `devDependencies` and a `commit-msg` git hook runs commitlint (check `.git/hooks/commit-msg`, `.husky/commit-msg`, `.lefthook.yml`, `.simple-git-hooks.json`, or similar) → already enforced at commit time, skip to Step 2.

If neither `package.json` nor `npx` available → skip to Step 2.

Ask the developer: "Would you like to enable commitlint for commit message validation?"

If **No** → skip to Step 2.

### Install commitlint

If `@commitlint/cli` is already in `devDependencies` → skip to "Patch push.md".

If project has `package.json` → install as dev dependency:

```bash
npm install -D @commitlint/cli @commitlint/config-conventional
```

Add `commitlint.config.js` to the project root:

```js
export default { extends: ['@commitlint/config-conventional'] }
```

If project has no `package.json` but system has `npx` → no install needed, will run via `npx commitlint@latest`.

### Patch push.md

Insert the following as a new step between "Validate commit messages" and "Push":

```markdown
### Step N: Lint with commitlint

Run commitlint against all branch commits:

\```bash
git log --format="%s" $(git merge-base origin/$BASE_BRANCH HEAD)..HEAD | while read -r msg; do echo "$msg" | commitlint; done
\```

If commitlint is not installed locally, use `npx commitlint@latest` instead of `commitlint`.

If any commit fails linting → show the errors and stop. Suggest using `/git squash` to rewrite commits.
```

## Step 2: Apply shell preprocessing (optional)

Some AI coding assistants support shell preprocessing — commands that run before the prompt reaches the model, injecting output as static context. This saves tool-call round trips for commands that always run.

**Known providers with shell preprocessing support:**

| Provider | Syntax |
|----------|--------|
| Claude Code | `` !`command` `` |
| Open Code | `` !`command` `` |

If the target provider is not listed or does not support shell preprocessing, skip this step.

### How to apply

Replace bash code blocks with the provider's preprocessing syntax. The surrounding text stays the same — only the code block changes.

**Single command — before:**

````markdown
```bash
git branch --show-current
```
````

**Single command — after (using `` !`...` `` syntax):**

```markdown
!`git branch --show-current`
```

**Multiple commands in one block — before:**

````markdown
```bash
git status
git diff --staged
git diff
```
````

**Multiple commands in one block — after:** each command becomes its own preprocessed line:

```markdown
!`git status`
!`git diff --staged`
!`git diff`
```

**Do NOT preprocess** commands that contain `<placeholders>` or depend on prior step results. These must stay as bash blocks for the AI to execute at runtime.

### Replacements to apply

| File | Step | Command(s) |
|------|------|------------|
| `commit.md` | 2 | `git branch --show-current` |
| `commit.md` | 3 | `git status`, `git diff --staged`, `git diff` |
| `push.md` | 1 | `git branch --show-current` |
