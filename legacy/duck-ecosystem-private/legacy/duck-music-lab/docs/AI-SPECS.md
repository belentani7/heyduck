# AI Layer Specifications

## Melody Generator

**Input:** Prompt (mood, tempo, key, duration)
**Output:** MIDI notes (4+ bars)

Example:
```
Prompt: "upbeat pop, 140 BPM, C major, 4 bars"
Output: [C4, E4, G4, E4, C4, D4, E4, F4, ...]
```

## Voice Cloning

**Input:** 30s sample voice + lyrics
**Output:** Singing in cloned voice

Supports:
- 10+ languages
- 5 emotional styles
- Pitch/tempo adjustment

## Doc Organizer

**Input:** Project metadata
**Output:** Organized, tagged project

Auto-detects:
- Genre
- BPM
- Key
- Suggested tags

## Production Assistant

Guided workflow:
1. **Arrangement:** Suggests track layout
2. **Mixing:** EQ/compression tips
3. **Mastering:** Final polish checklist
4. **Export:** Format recommendations

