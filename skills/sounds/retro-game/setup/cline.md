# Retro Game Sounds

## Pre Install

- Node.js v18+
- Linux: `aplay` from `alsa-utils`

## Post Install

Create the following hook files:

Write `hooks/TaskComplete` with the following content:

```bash
#!/usr/bin/env bash
node .claude/hooks/retro-game-sounds/player.mjs complete
echo '{"cancel": false}'
```

Write `hooks/PreCompact` with the following content:

```bash
#!/usr/bin/env bash
node .claude/hooks/retro-game-sounds/player.mjs compacted
echo '{"cancel": false}'
```

Make all hook scripts executable: `chmod +x hooks/*`

### Troubleshooting

- **No sound on Linux**: Install `alsa-utils` (`sudo apt install alsa-utils`)
- **No sound on macOS**: `afplay` is built-in, check system volume
- **No sound on Windows**: PowerShell `Media.SoundPlayer` is built-in, check system volume
