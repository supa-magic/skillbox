# Retro Game Sounds

## Pre Install

- Node.js v18+
- Linux: `aplay` from `alsa-utils`

## Post Install

Write `settings.json` with the following content:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/retro-game-sounds/player.mjs complete"
          }
        ]
      }
    ],
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/retro-game-sounds/player.mjs attention"
          }
        ]
      }
    ],
    "PostToolUseFailure": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/retro-game-sounds/player.mjs error"
          }
        ]
      }
    ],
    "SubagentStop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/retro-game-sounds/player.mjs subagent-complete"
          }
        ]
      }
    ],
    "PermissionRequest": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/retro-game-sounds/player.mjs permission"
          }
        ]
      }
    ],
    "PreCompact": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/retro-game-sounds/player.mjs compacted"
          }
        ]
      }
    ]
  }
}
```
### Verification

Run `/hooks` to verify configuration, or press `Ctrl+O` for verbose mode.

### Troubleshooting

- **No sound on Linux**: Install `alsa-utils` (`sudo apt install alsa-utils`)
- **No sound on macOS**: `afplay` is built-in, check system volume
- **No sound on Windows**: PowerShell `Media.SoundPlayer` is built-in, check system volume
