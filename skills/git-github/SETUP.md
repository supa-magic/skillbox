# Post Install

## Step 1: Ensure GitHub CLI is installed

Check if `gh` is available:

```bash
gh --version
```

If `gh` is found → skip to Step 2.

If `gh` is not found → install it:

| Platform | Command |
|----------|---------|
| macOS (Homebrew) | `brew install gh` |
| Windows (winget) | `winget install --id GitHub.cli` |
| Windows (scoop) | `scoop install gh` |
| Linux (apt) | See below |

**Linux (apt):**

```bash
(type -p wget >/dev/null || (sudo apt update && sudo apt-get install wget -y)) \
  && sudo mkdir -p -m 755 /etc/apt/keyrings \
  && out=$(mktemp) && wget -nv -O$out https://cli.github.com/packages/githubcli-archive-keyring.gpg \
  && cat $out | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
  && sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
  && sudo apt update \
  && sudo apt install gh -y
```

After installing, verify authentication:

```bash
gh auth status
```

If not authenticated → print to terminal and stop:

```
🗝️ GitHub CLI is not authenticated. Run `gh auth login` to authenticate before using this skill.
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
