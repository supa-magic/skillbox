# Arcana Setup

Reference for required and recommended tools. Loaded by `/arc:project init` during the setup phase to determine what needs installing.

## Required Components

These components are essential — without them the full Arcana workflow cannot function.

| Component | Role | Why required |
|-----------|------|--------------|
| **Git hosting skill** | PR creation, branch management, code review | `/arc:code review-request`, `/arc:code review-resolve` depend on it |
| **Issue tracker skill** | Ticket creation, status updates, linking PRs | `/arc:prd create`, `/arc:implement` depend on it |

## Recommended CLI Tools

Prefer official CLI tools over MCP servers — CLIs are lighter on tokens and more predictable.

### Git Hosting

| Tool | CLI | Install | Detect |
|------|-----|---------|--------|
| GitHub | `gh` | `gh auth login` | remote origin contains `github.com` |
| GitLab | `glab` | `glab auth login` | remote origin contains `gitlab.com` OR `.gitlab-ci.yml` exists |
| Bitbucket | `bb` | `pip install bitbucket-cli` | remote origin contains `bitbucket.org` OR `bitbucket-pipelines.yml` exists |

### Issue Trackers

| Tool | CLI | Install | Detect |
|------|-----|---------|--------|
| GitHub Issues | `gh` (built-in) | same as git hosting | remote origin contains `github.com` |
| Jira | `jira-cli` | `npm install -g jira-cli` | `.jira.yml` exists OR Jira ticket pattern in commits (`PROJ-123`) |
| Linear | `linear` | `npm install -g @linear/cli` | Linear ticket pattern in commits (`ENG-123`) |
| Other | — | ask developer | — |

### Test Tooling (recommended based on stack)

| Category | Tool | When to recommend | Detect |
|----------|------|-------------------|--------|
| Network mocking (JS/TS) | MSW | JS/TS projects with API calls | `msw` in dependencies |
| In-memory DB (JS/TS) | @mswjs/data | Unspecified REST without schema | `@mswjs/data` in dependencies |
| Mutation testing (JS/TS) | Stryker | Projects with business logic tests | `@stryker-mutator/*` in dependencies |
| Component testing (React) | React Testing Library | React projects | `@testing-library/react` in dependencies |
| Component testing (Vue) | Vue Testing Library | Vue projects | `@testing-library/vue` in dependencies |
| Component testing (Angular) | Angular Testing Library | Angular projects | `@testing-library/angular` in dependencies |
| Accessibility (JS/TS) | jest-axe / vitest-axe | Public-facing products | `jest-axe` or `vitest-axe` in dependencies |
| Visual regression | Chromatic / Percy | Design systems, UI-heavy products | `chromatic` or `@percy/cli` in dependencies |


### Contract Safety (recommended based on API type)

| API Type | Approach | Tool |
|----------|----------|------|
| GraphQL | Codegen from SDL schema | `graphql-codegen` |
| tRPC | Auto-generated types | built-in |
| REST + OpenAPI | Codegen from schema | `openapi-typescript` |
| gRPC + Protobuf | Codegen from proto | `protoc` / `buf` |
| Unspecified REST | In-memory typed DB | `@mswjs/data` (JS/TS) |

## Setup Flow (used by init.md)

1. **Auto-detect** — scan git remote, config files, dependencies, CI pipelines using the detection hints above
2. **Present findings** — show what was detected, what's missing
3. **Ask developer** — for anything not auto-detected (especially tracker choice)
4. **Install** — use `spm install https://github.com/supa-magic/skillbox/tree/main/skills/{skill}` for Arcana skills, suggest CLI install commands for tools
5. **Record** — write installed tools and their example references to `project-context.md`

## Example References

When tools are installed, record which example reference files are available for the project in `project-context.md`. Skills load only the relevant examples.

```
test/references/examples/
  msw.md                     ← network mocking patterns (JS/TS)
  mswjs-data.md              ← in-memory DB for contract safety (JS/TS)
  stryker.md                 ← mutation testing configuration
  react-testing-library.md   ← component testing (React)
  jest-axe.md                ← accessibility testing (JS/TS)
```

Skills read `project-context.md` → find which examples are active → load only those files.
