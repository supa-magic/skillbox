# Arcana Skill-Up

Post-task analysis. Runs after a task is completed (after merge). Analyzes how the cycle went and proposes improvements to skills and rules.

With `--yes` mode: watcher triggers automatically after merge.
Without `--yes`: developer invokes manually.

## Steps

### Step 1: Gather Task History

Collect artifacts from the completed task:
- `.arcana/{feature}/{ticket-id}/` — plan, progress, reports (validate, verify, mutate)
- PR comments and review history (via git skill)
- Commit history for the feature branch
- Any feedback from the developer during the cycle

### Step 2: Analyze Patterns

Look for systemic patterns across the task execution:

**Efficiency:**
- Where did the skill spend the most time searching or iterating?
- Were there unnecessary loops (validate → update → validate)?
- Did the plan accurately predict the scope?

**Quality:**
- What came up in code review that the skills should have caught?
- Were there recurring patterns in review comments?
- Did mutation testing find gaps that AC should have covered?

**Knowledge gaps:**
- Did the skill lack project-specific knowledge that caused mistakes?
- Are there codebase patterns that should be documented in project-context?
- Were there conventions that the skill violated?

### Step 3: Formulate Proposals

For each pattern found, propose a concrete improvement:

```markdown
## Proposal: {title}

**Problem:** {what went wrong or could be better}
**Evidence:** {specific example from the task — PR comment, failed test, extra iteration}
**Suggestion:** {what to change — which skill, which rule, which reference}
**Impact:** {what improves if this is applied}
```

Types of improvements:
- **Project-context update** — add convention, pattern, or knowledge to `.arcana/project-context.md`
- **Skill rule addition** — add a rule to a skill's reference file
- **New reference material** — document a pattern for skills to follow
- **Workflow adjustment** — change skill execution order or conditions

### Step 4: Present and Apply

**Confirmation gate:** If `-y` → apply all proposals. Otherwise → show each proposal and ask: "Apply this improvement?" Developer selects which are relevant.

For each approved proposal:
- Update the appropriate file (project-context, skill reference, etc.)
- Record what was changed and why

### Step 5: Output

> **Skill-Up — {ticket-id}:**
> Analyzed: {number} artifacts
> Proposals: {number} total, {number} applied, {number} skipped
>
> Applied:
> - {proposal title} → {file changed}
> - {proposal title} → {file changed}

## Examples

### Example 1: Recurring review pattern

After TASK-512, code review consistently flagged missing error boundaries in React components.
Proposal: add "always wrap async components in error boundaries" to project-context conventions.
Impact: `/arc:code` will follow this pattern in future tasks.

### Example 2: AC gap exposed by mutation testing

`/arc:test mutate` found surviving mutants in access control logic across 3 tasks.
Proposal: add "access control edge cases" to the three-questions algorithm for features touching permissions.
Impact: `/arc:ac enrich` will catch these scenarios earlier.

### Example 3: Inefficient planning

`/arc:plan` consistently underestimated scope for tasks touching the legacy API layer.
Proposal: add note to project-context that legacy API modules are more complex than they appear — plan should flag them as high-risk.
Impact: `/arc:plan` gives better estimates, `/arc:implement` can warn about large tasks earlier.
