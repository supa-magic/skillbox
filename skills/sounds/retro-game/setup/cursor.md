# Retro Game Sounds

## Pre Install

- Node.js v18+
- Linux: `aplay` from `alsa-utils`

## Post Install

Write `hooks.json` with the following content:

```json
{
  "version": 1,
  "hooks": {
    "stop": [
      {
        "command": "node .claude/hooks/retro-game-sounds/player.mjs complete"
      }
    ],
    "afterFileEdit": [
      {
        "command": "node .claude/hooks/retro-game-sounds/player.mjs attention"
      }
    ]
  }
}
```

### Troubleshooting

- **No sound on Linux**: Install `alsa-utils` (`sudo apt install alsa-utils`)
- **No sound on macOS**: `afplay` is built-in, check system volume
- **No sound on Windows**: PowerShell `Media.SoundPlayer` is built-in, check system volume
