# Fetch Issue

Fetch a GitHub issue's title, description, and comments as structured context for other skills and agents.

### Step 1: Fetch Issue

```bash
gh issue view {issue-number} --json number,title,body,labels,state,comments
```

If the command fails → error: "Could not fetch issue #{issue-number}. Verify it exists and `gh` is authenticated." and stop.

### Step 2: Format Output

Return structured context:

```markdown
# Issue #{number}: {title}

**State:** {state}
**Labels:** {labels}

## Description

{body}

## Comments ({count})

### Comment by {author} — {created_at}

{body}

---

### Comment by {author} — {created_at}

{body}
```

If no comments → omit the Comments section entirely.

### Step 3: Output

Print the formatted context. Do not summarize or truncate — return the full content so the consuming skill has complete information.
