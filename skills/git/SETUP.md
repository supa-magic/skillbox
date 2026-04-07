# Post Install

## Step 1: Apply shell preprocessing (optional)

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
