#!/usr/bin/env node

import { execFile } from "node:child_process"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { platform } from "node:os"

const __dirname = dirname(fileURLToPath(import.meta.url))
const sound = process.argv[2]

if (!sound) {
  console.error("Usage: node player.mjs <sound-name>")
  process.exit(1)
}

if (!/^[a-z0-9-]+$/.test(sound)) {
  console.error("Invalid sound name — only lowercase letters, digits, and hyphens allowed")
  process.exit(1)
}

const file = resolve(__dirname, `${sound}.wav`)
const os = platform()

const players = {
  win32: ["powershell", ["-c", `(New-Object Media.SoundPlayer '${file}').PlaySync()`]],
  darwin: ["afplay", [file]],
  linux: ["aplay", ["-q", file]],
}

const player = players[os]

if (!player) {
  console.error(`Unsupported platform: ${os}`)
  process.exit(1)
}

execFile(player[0], player[1], (err) => {
  if (err) {
    console.error(`Failed to play sound: ${err.message}`)
    process.exit(1)
  }
})
