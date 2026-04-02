# Retro Game Sounds

## Pre Install

- Node.js v18+
- Linux: `aplay` from `alsa-utils`

## Post Install

Write `hooks.json` with the following content:

```json
{
  "hooks": {
    "post_cascade_response": [
      {
        "command": "node .claude/hooks/retro-game-sounds/player.mjs complete",
        "show_output": false
      }
    ],
    "pre_user_prompt": [
      {
        "command": "node .claude/hooks/retro-game-sounds/player.mjs attention",
        "show_output": false
      }
    ],
    "post_run_command": [
      {
        "command": "node .claude/hooks/retro-game-sounds/player.mjs complete",
        "show_output": false
      }
    ]
  }
}
```

### Troubleshooting

- **No sound on Linux**: Install `alsa-utils` (`sudo apt install alsa-utils`)
- **No sound on macOS**: `afplay` is built-in, check system volume
- **No sound on Windows**: PowerShell `Media.SoundPlayer` is built-in, check system volume
