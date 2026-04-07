# Arcana Init

Unified onboarding and context management. First run does full setup (external skills + codebase scan). Subsequent runs refresh or refine the context.

## Routing

1. Check if `.arcana/project-context.md` exists
   - **No** → full onboarding (Step 1 → Step 7)
   - **Yes + `--refresh`** → rescan codebase (Step 3 → Step 5, preserve Required Skills and Model Assignment sections)
   - **Yes + `--refine`** → interactive refinement (Step 6)
   - **Yes + no flags** → warn: "Project context already exists. Use `--refresh` to rescan or `--refine` to edit sections." Ask to proceed with full re-init or stop.

## Steps

### Step 1: Detect Project Tooling (Interactive)

Read [setup.md](setup.md) for the full list of required/recommended tools and detection hints.

1. Auto-detect what's possible from the codebase (git remote, config files, CI pipelines — see detection hints in the catalog)
2. Present findings and ask to confirm or adjust:

> **Detected tooling:**
> - Issue tracker: {detected or "not detected"}
> - Git hosting: {detected or "not detected"}
>
> Correct? Or tell me what to change.

Wait for response. Map answers to skills from the catalog.

### Step 2: Install External Skills

Map the detected tooling from Step 1 to skillbox packages:

| Detected Tool | Skillbox Package | Install Command |
|---------------|-----------------|-----------------|
| GitHub (git hosting) | `git` | `spm install https://github.com/supa-magic/skillbox/tree/main/skills/git` |
| GitHub (issue tracker) | `github` | `spm install https://github.com/supa-magic/skillbox/tree/main/skills/github` |
| GitLab | — | Not yet available in skillbox, suggest creating via `/skill create` |
| Bitbucket | — | Not yet available in skillbox, suggest creating via `/skill create` |
| Jira | — | Not yet available in skillbox, suggest creating via `/skill create` |
| Linear | — | Not yet available in skillbox, suggest creating via `/skill create` |

For each required component (git hosting skill, issue tracker skill):
1. Check if the corresponding skill is already installed (look for SKILL.md in `.claude/skills/`)
2. If not installed and a skillbox package exists → offer to install it
3. If no skillbox package exists → suggest creating via `/skill create`

**Confirmation gate:** If `-y` → install all. Otherwise → show the install commands and ask: "Install these skills?" Wait for confirmation.

### Step 3: Detect Analysis Tools

Before scanning, check which analysis tools are available:

1. **LSP** — check if an LSP tool is available. If available, prefer it for discovering types, exports, module boundaries, and symbol references.
2. **AST parsers** — check if the project has AST-capable tooling installed (e.g., `ts-morph`, `@babel/parser`, `jscodeshift`, `tree-sitter`). If available, use them for extracting function signatures, import graphs, and module dependencies.

Record which tools are available — use them in Step 4.

### Step 4: Scan Codebase

Read-only scan. Does not modify source code. When LSP or AST tools are available, prefer them over grep for structural queries. Fall back to glob/grep when no analysis tools are available.

Investigate:

- **Stack:** framework, versions, language, runtime, package manager
- **Test runner:** Jest / Vitest / Playwright — what's configured
- **API type:** GraphQL / REST + OpenAPI / tRPC / unspecified REST
- **Project structure:** folder layout, patterns, conventions
- **Existing features/modules:** scope and boundaries
- **Linter, formatter:** ESLint, Biome, Prettier config
- **CI configuration:** what runs on push/PR
- **PRD/AC locations:** where requirements docs live (if any exist)
- **Decisions directory:** where ADRs live (if any exist)
- **Project rules:** existing conventions and guidelines (see Step 4b)

### Step 4b: Detect and Reconcile Project Rules

Scan for existing project conventions and rules. These may live in different locations depending on the AI provider or project setup:

```
CLAUDE.md, .claude/rules/          ← Claude Code
AGENT.md                           ← other AI providers
.cursorrules, .cursor/rules/       ← Cursor
.github/copilot-instructions.md   ← GitHub Copilot
rules/, docs/conventions/          ← generic project rules
.eslintrc, biome.json, .editorconfig ← tool-enforced rules
```

Read all discovered rule files. Focus on rules related to:
- **Testing conventions** — how to write tests, what to mock, naming, structure
- **Code conventions** — naming, patterns, architecture rules
- **Workflow rules** — commit conventions, PR process, review process

**Reconcile testing rules with Arcana methodology:**

For each discovered testing rule, classify it:

1. **Compatible** — rule aligns with Arcana methodology (e.g., "test behavior not implementation", "use integration tests") → adopt, record in project-context
2. **Complementary** — rule adds specifics not covered by Arcana (e.g., "test files next to source", "use `describe` blocks for grouping") → adopt, record in project-context
3. **Conflicting** — rule contradicts Arcana methodology (e.g., "mock all dependencies", "100% code coverage required", "unit test every function")

**On conflict:**

Present each conflict to the developer:

> **Conflict detected:**
> - Project rule: "{rule}" (source: `{file}`)
> - Arcana principle: "{principle}" (source: `testing-strategy.md`)
>
> Options:
> 1. **Keep project rule** — Arcana adapts to this project's approach
> 2. **Use Arcana principle** — update/remove the project rule
> 3. **Incompatible** — this conflict is fundamental, Arcana testing workflow may not be suitable for this project

If the developer selects option 3 for any critical conflict → warn:

> ⚠️ **Fundamental conflict with Arcana testing methodology.** The workflow may produce results that contradict your project's established practices. Consider using Arcana selectively (e.g., AC and planning skills only, without the test workflow).

Record all resolutions in project-context under a `## Project Rules` section.

### Step 5: Configure Model Assignment

Ask the developer about model preferences:

> Arcana uses three agent tiers with different model assignments:
>
> **arc:apprentice (Haiku):** ac validate, ac verify, test validate, code review-request
> **arc:mage (Sonnet):** ac enrich, ac update, plan, test write, test review, test mutate, skill-up
> **arc:archmage (Opus):** prd create, code, code review-resolve
>
> Default models are for Claude. For other providers, map to equivalent tiers:
> - OpenAI: archmage=gpt-4o, mage=gpt-4o-mini, apprentice=gpt-4o-mini
> - Google: archmage=gemini-pro, mage=gemini-flash, apprentice=gemini-flash
>
> Use these defaults, or customize?

On `--refresh` → preserve existing model assignment, skip this step.

### Step 6: Write Project Context

Write or update `.arcana/project-context.md`:

```markdown
# Project Context

Generated by `/arc:project init`. Read by all Arcana skills.

## Stack
- Framework: {e.g., Next.js 14}
- Language: {e.g., TypeScript 5.4}
- Runtime: {e.g., Node.js 20}
- Package manager: {e.g., pnpm}

## Testing
- Test runner: {e.g., Vitest}
- E2E runner: {e.g., Playwright}
- Test directory: {e.g., src/**/*.test.ts}

## API
- Type: {GraphQL | REST + OpenAPI | tRPC | unspecified REST}

## Project Structure
- Source: {e.g., src/}
- Features: {e.g., src/features/}
- Shared: {e.g., src/shared/}
- Architecture: {e.g., FSD, module-based, flat}

## PRD and AC
- Features directory: {e.g., docs/features/}
- Decisions directory: {e.g., docs/decisions/}

## Conventions
- {Key patterns observed in the codebase}
- {Naming conventions}
- {Import patterns}

## CI
- {What runs on push}
- {What runs on PR}

## Project Rules
- Sources: {list of rule files found — e.g., CLAUDE.md, .claude/rules/, .cursorrules}
- Adopted: {compatible/complementary rules — e.g., "test files co-located with source", "use describe blocks"}
- Resolved conflicts: {conflicts and resolutions — e.g., "mock all deps → use Arcana boundary mocking (developer chose option 2)"}
- Warnings: {any fundamental incompatibilities noted}

## Required Skills

- [x] git: {hosting} (installed)         <- PR, branches
- [x] tracker: {tracker} (installed)     <- tickets

## Agent Tiers

| Tier | Model | Skills |
|------|-------|--------|
| arc:archmage | {opus} | prd create, code, code review-resolve |
| arc:mage | {sonnet} | ac enrich, ac update, plan, test write, test review, test mutate, skill-up |
| arc:apprentice | {haiku} | ac validate, ac verify, test validate, code review-request |
```

Also create `.arcana/.gitignore` if it doesn't exist:
```
# Temp working files per feature/ticket — not committed
*/
!project-context.md
!.gitignore
```

**Confirmation gate:** If `-y` → write. Otherwise → show project context and ask: "Write project context to `.arcana/project-context.md`?" Wait for confirmation.

### Step 6 (--refine): Interactive Refinement

When `--refine` is passed and project-context exists:

1. Read current `.arcana/project-context.md`
2. Show section list:

> Which sections would you like to update?
> 1. Stack
> 2. Testing
> 3. API
> 4. Project Structure
> 5. PRD and AC
> 6. Conventions
> 7. CI
> 8. Required Skills (re-run tooling detection + install)
> 9. Model Assignment

3. Wait for selection
4. For selected sections:
   - **1-7:** Show current value, ask for corrections, update
   - **8:** Re-run Step 1 + Step 2 (tooling detection and installation)
   - **9:** Re-run Step 5 (model assignment)
5. Write updated project-context

### Step 7: Update Provider Configuration File

Add Arcana skill entries to the project's AI provider configuration file so skills are discoverable. Detect which file to update:

```
CLAUDE.md                          ← Claude Code
.cursor/rules/*.md or .cursorrules ← Cursor
AGENT.md                           ← other providers
```

If no configuration file exists → skip this step.

Add or update an **Arcana** section with available commands:

```markdown
## Arcana

- `/arc:implement {ticket-id} [--fix] [--yes]` — Full implementation cycle or bug fix
- `/arc:implement prd:{feature} [--yes]` — Implement all tickets from PRD
- `/arc:project init|audit|adr|skill-up` — Configure and maintain Arcana
- `/arc:prd create|update` — Product requirements and AC
- `/arc:ac validate|enrich|update|verify` — Manage acceptance criteria
- `/arc:code {ticket-id}` — Write production code
- `/arc:test write|validate|review|mutate` — Write and audit tests
- `/arc:plan {ticket-id}` — Investigation and planning
```

**Confirmation gate:** If `-y` → write. Otherwise → show changes and ask: "Update {file}?" Wait for confirmation.

### Step 8: Output

> **Arcana Init Complete:**
> - Stack: {framework} + {language}
> - Test runner: {runner}
> - API type: {type}
> - External skills: {installed list}
> - Model assignment: {default | custom}
> - Project context: `.arcana/project-context.md`
>
> Next: `/arc:project audit` to verify everything is ready.
