# Retro Game Sounds

## Pre Install

- Node.js v18+
- Linux: `aplay` from `alsa-utils`

## Post Install

Write `plugins/retro-sounds.mjs` with the following content:

```javascript
export default async ({ $ }) => ({
  hooks: {
    "session.idle": async () => {
      await $`node .claude/hooks/retro-game-sounds/player.mjs attention`
    },
    "session.compacted": async () => {
      await $`node .claude/hooks/retro-game-sounds/player.mjs compacted`
    },
    "session.error": async () => {
      await $`node .claude/hooks/retro-game-sounds/player.mjs error`
    },
  },
})
```

### Troubleshooting

- **No sound on Linux**: Install `alsa-utils` (`sudo apt install alsa-utils`)
- **No sound on macOS**: `afplay` is built-in, check system volume
- **No sound on Windows**: PowerShell `Media.SoundPlayer` is built-in, check system volume
