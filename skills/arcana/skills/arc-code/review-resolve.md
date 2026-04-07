# Code Review Resolve

Handle review comments on a PR. Classify each comment, then fix code or respond with explanation.

Works with both human reviewers and automated reviewers (code analysis tools, linters, AI reviewers).

## Steps

### Step 1: Gather Context

1. Read `.arcana/project-context.md` for conventions
2. Fetch PR comments and review status using the appropriate skill or MCP tool
3. Fetch code analysis reports if available (via appropriate skills configured in `project-context.md`)
4. Read AC files for the ticket (for context when classifying comments)

#### Dependency: pull request comments

If no matching skill or MCP tool is available for fetching PR comments, ask the developer:

> I need to read pull request comments but couldn't find a skill or MCP server for that. How would you like to proceed?
>
> 1. **Install one** — `npx @supa-magic/spm install https://github.com/supa-magic/skillbox/tree/main/skills/github`
> 2. **Create a new skill** for PR management
> 3. **Search online** for a community skill or MCP server
> 4. **Tell me what to do** — paste the review comments here

### Step 2: Classify Each Comment

For every unresolved comment or review request, classify it:

**Relevant (bug, pattern violation, missed edge case):**
- Comment points to a real issue — code bug, violation of project patterns, missing edge case from AC
- Action: fix the code, push commit

**Not relevant (stylistic preference, not aligned with AC):**
- Comment is a style preference that doesn't affect behavior, or requests something outside the AC scope
- Action: respond with explanation referencing AC and project conventions

**Question:**
- Reviewer is asking for clarification, not requesting a change
- Action: respond with context from AC and plan

### Step 3: Fix and Respond

For each classified comment:

1. **Relevant** → fix the code, create a commit, mark thread as resolved
2. **Not relevant** → write a response explaining why (reference AC, project conventions, or plan), leave thread for reviewer to close
3. **Question** → answer with context from AC, plan, and code

Push all fix commits to the feature branch using the appropriate skill or MCP tool.

### Step 4: Verify

After fixing:
- Check that CI checks still pass (or wait for them)
- Verify no new conflicts with main

**Confirmation gate:** If `-y` → push fixes and responses. Otherwise → show summary of classifications and actions, then ask: "Push fixes and responses?" Wait for confirmation.

### Step 5: Output

> **Code Review Resolved — #{pr-id}:**
> - Relevant (fixed): {number} — {brief list}
> - Not relevant (responded): {number}
> - Questions (answered): {number}
> - Commits pushed: {number}
>
> Waiting for re-review.

## Feedback Loop

The resolve cycle repeats until PR is approved:

```
Review comments → classify → fix/respond → push → wait for re-review → repeat
```

Maximum 3 iterations by default (configurable via `--max-retries`). After the third cycle → stop and escalate to the developer.

## Examples

### Example 1: Mixed review comments

User says: `/arc:code review-resolve 456`
PR has 4 comments:
1. "This function doesn't handle null input" → **Relevant** — fix, add null check
2. "I'd prefer using reduce here instead of forEach" → **Not relevant** — respond: forEach matches project patterns per conventions
3. "Why did you choose this approach?" → **Question** — answer with context from plan
4. "Missing error handling for API timeout" → **Relevant** — fix, add timeout handling
Actions: 2 fix commits pushed, 2 responses written
Result: 2 threads resolved, 2 awaiting reviewer

### Example 2: Automated review (code analysis tool)

User says: `/arc:code review-resolve 456 -y`
Code analysis tool flagged 3 issues:
1. Cognitive complexity too high → **Relevant** — extract helper function
2. Duplicate code block → **Relevant** — extract shared utility
3. Missing JSDoc on exported function → **Not relevant** — project doesn't use JSDoc per conventions
Actions: 2 fix commits pushed immediately, 1 response
Result: Fixes pushed, response posted
