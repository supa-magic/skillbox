# Post Install

## Step 1: Ensure GitHub CLI is installed

Check if `gh` is available:

```bash
gh --version
```

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
  && out=$(mktemp) && wget -nv -O "$out" https://cli.github.com/packages/githubcli-archive-keyring.gpg \
  && sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg < "$out" > /dev/null \
  && sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
  && sudo apt update \
  && sudo apt install gh -y
```

Verify authentication:

```bash
gh auth status
```

If not authenticated → print to terminal and stop:

```
GitHub CLI is not authenticated. Run `gh auth login` to authenticate before using this skill.
```

## Step 2: Apply shell preprocessing (optional)

Some AI coding assistants support shell preprocessing — commands that run before the prompt reaches the model, injecting output as static context. This saves tool-call round trips for commands that always run.

**Known providers with shell preprocessing support:**

| Provider | Syntax |
|----------|--------|
| Claude Code | `` !`command` `` |
| Open Code | `` !`command` `` |

If the target provider is not listed or does not support shell preprocessing, skip this step.

### Replacements to apply

| File | Step | Command(s) |
|------|------|------------|
| `create-pr.md` | 3 | `git log main..HEAD --oneline`, `git diff main..HEAD --stat` |
| `update-pr.md` | 4 | `git log main..HEAD --oneline`, `git diff main..HEAD --stat` |
| `ship.md` | 1 | `git branch --show-current` |
