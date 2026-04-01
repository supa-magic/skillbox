# Retro Game Sounds

Play retro game sound effects on AI coding assistant hook events.

Supported tools: **Claude Code**, **Cursor**, **Windsurf**, **Cline**, **OpenCode**.

## Sound Mapping

| When                          | Sound               |
|-------------------------------|----------------------|
| Agent finished responding     | `complete.wav`       |
| Waiting for input / idle      | `attention.wav`      |
| Tool failed with error        | `error.wav`          |
| Subagent completed            | `subagent-complete.wav` |
| Before context compaction     | `compacted.wav`      |

## Prerequisites

- **Node.js** (v18+)
- **Linux only**: `aplay` (from `alsa-utils`, usually pre-installed)

## Test

Run manually to verify sounds work on your system:

```bash
node player.mjs complete
node player.mjs attention
node player.mjs error
```

---

## Claude Code

**Config file**: `~/.claude/settings.json` (user-level) or `.claude/settings.json` (project-level)

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node /absolute/path/to/player.mjs complete"
          }
        ]
      }
    ],
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node /absolute/path/to/player.mjs attention"
          }
        ]
      }
    ],
    "PostToolUseFailure": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node /absolute/path/to/player.mjs error"
          }
        ]
      }
    ],
    "SubagentStop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node /absolute/path/to/player.mjs subagent-complete"
          }
        ]
      }
    ],
    "PreCompact": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node /absolute/path/to/player.mjs compacted"
          }
        ]
      }
    ]
  }
}
```

**Debug**: Run `/hooks` to verify configuration, or press `Ctrl+O` for verbose mode.

---

## Cursor

**Config file**: `.cursor/hooks.json` (project-level) or `~/.cursor/hooks.json` (user-level)

```json
{
  "version": 1,
  "hooks": {
    "stop": [
      {
        "command": "node /absolute/path/to/player.mjs complete"
      }
    ],
    "afterFileEdit": [
      {
        "command": "node /absolute/path/to/player.mjs attention"
      }
    ]
  }
}
```

> Cursor supports: `stop`, `afterFileEdit`, `beforeShellExecution`, `beforeMCPExecution`, `beforeReadFile`.

---

## Windsurf

**Config file**: `.windsurf/hooks.json` (workspace) or `~/.codeium/windsurf/hooks.json` (user-level)

```json
{
  "hooks": {
    "post_cascade_response": [
      {
        "command": "node /absolute/path/to/player.mjs complete",
        "show_output": false
      }
    ],
    "pre_user_prompt": [
      {
        "command": "node /absolute/path/to/player.mjs attention",
        "show_output": false
      }
    ],
    "post_run_command": [
      {
        "command": "node /absolute/path/to/player.mjs complete",
        "show_output": false
      }
    ]
  }
}
```

> Windsurf supports: `pre/post_read_code`, `pre/post_write_code`, `pre/post_run_command`, `pre/post_mcp_tool_use`, `pre_user_prompt`, `post_cascade_response`.

---

## Cline

**Config location**: `~/Documents/Cline/Hooks/` (macOS/Linux) or `.clinerules/hooks/` (project-level)

Create one file per event (filename = event name, no extension):

**`~/Documents/Cline/Hooks/TaskComplete`**:
```bash
#!/usr/bin/env bash
node /absolute/path/to/player.mjs complete
echo '{"cancel": false}'
```

**`~/Documents/Cline/Hooks/PreCompact`**:
```bash
#!/usr/bin/env bash
node /absolute/path/to/player.mjs compacted
echo '{"cancel": false}'
```

Make scripts executable:
```bash
chmod +x ~/Documents/Cline/Hooks/*
```

> Cline supports: `TaskStart`, `TaskResume`, `TaskCancel`, `TaskComplete`, `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `PreCompact`.

---

## OpenCode

**Config location**: `.opencode/plugins/` (project-level) or `~/.config/opencode/plugins/` (global)

**`.opencode/plugins/retro-sounds.mjs`**:
```javascript
export default async ({ $ }) => ({
  hooks: {
    "session.idle": async () => {
      await $`node /absolute/path/to/player.mjs attention`
    },
    "session.compacted": async () => {
      await $`node /absolute/path/to/player.mjs compacted`
    },
    "session.error": async () => {
      await $`node /absolute/path/to/player.mjs error`
    },
  },
})
```

> OpenCode supports: `session.created`, `session.idle`, `session.deleted`, `session.error`, `session.compacted`, `tool.execute.before`, `tool.execute.after`, `file.edited`.

---

## Troubleshooting

- **No sound on Linux**: Install `alsa-utils` (`sudo apt install alsa-utils`)
- **No sound on macOS**: `afplay` is built-in, check system volume
- **No sound on Windows**: PowerShell `Media.SoundPlayer` is built-in, check system volume
- **Path**: Replace `/absolute/path/to/player.mjs` with `~/.spm/retro-game/player.mjs` (default install location)
