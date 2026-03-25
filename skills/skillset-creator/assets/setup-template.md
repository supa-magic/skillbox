# Setup: {{name}}

## Prerequisites

- AI coding assistant installed (Claude Code, Open Code, Cursor, etc.)
- Git initialized in your project

## Installation

### 1. Copy skill files

Copy the following files into your provider's skill directory:

{{skill_files}}

### 2. Copy agents

{{#agents}}
Copy agent definitions to your project:

{{agent_files}}
{{/agents}}
{{^agents}}
No agents configured.
{{/agents}}

### 3. Copy hooks

{{#hooks}}
Copy hook definitions to your project:

{{hook_files}}
{{/hooks}}
{{^hooks}}
No hooks configured.
{{/hooks}}

### 4. Configure MCP servers

{{#mcp}}
Copy MCP server configurations:

{{mcp_files}}
{{/mcp}}
{{^mcp}}
No MCP servers configured.
{{/mcp}}

### 5. Copy memory files

{{#memory}}
Copy memory files to your project:

{{memory_files}}
{{/memory}}
{{^memory}}
No memory files configured.
{{/memory}}

### 6. Copy rules

{{#rules}}
Copy rule files to your project:

{{rule_files}}
{{/rules}}
{{^rules}}
No rules configured.
{{/rules}}

## Verification

After installation, verify by running any included skill (e.g., `/git commit`) to confirm files are in place.
