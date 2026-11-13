# 🦆 DUCK Music Lab

**Unified DAW for the browser.** Ableton Live + Logic Pro + FL Studio merged. Web Audio API + AI melody/voice generation.

## Features

- **DAW Engine:** Web Audio API + timeline + sequencer
- **Plugins:** Built-in synths, effects (reverb, delay, EQ, compress)
- **AI Layer:** Melody generator, voice cloning, smart doc organization
- **Assets:** 10K+ samples, 5K+ presets, organized by genre
- **Collaboration:** Real-time multi-user projects
- **Export:** WAV/MP3/FLAC, stems, direct to Spotify/YouTube

## Quick Start

```bash
npm install
npm run dev
# Open http://localhost:5173
```

## Stack

- **Frontend:** React 19 + TypeScript + TailwindCSS + GSAP
- **Backend:** Node.js + Express + WebSocket
- **Audio:** Tone.js + Web Audio API
- **AI:** Eleven Labs (voice) + lightweight transformer (melody)

## Architecture

```
duck-music-lab/
├── src/
│   ├── core/           ← DAW engine
│   ├── modules/        ← Plugins, effects, AI
│   ├── ui/             ← Drawer system
│   ├── ai/             ← ML integrations
│   └── export/         ← Distribution
├── public/             ← Static assets
├── docs/               ← Documentation
└── tests/              ← Test suite
```

## Roadmap

- **Week 1-2:** Core DAW (audio engine, timeline, basic synth)
- **Week 2-3:** Plugins & effects system
- **Week 3-4:** AI layer (melody gen, voice clone)
- **Week 4-5:** Assets browser + presets
- **Week 5-6:** UI polish (drawer system, keyboard shortcuts)
- **Week 6-7:** Collaboration (WebSocket sync)
- **Week 7-8:** Export & distribution integrations

## For Artists

Start with a prompt:
```
"upbeat pop, 140 BPM, C major, 4 bars"
```

AI generates:
1. Melodic loop
2. Drum pattern
3. Bass line

Then:
1. Clone your voice
2. Add effects (reverb, EQ, compress)
3. Master chain
4. Export + upload to Spotify

**All in < 2 hours from blank project.**

## Resources

- [Master Plan](MASTER-PLAN.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Plugin Development](docs/PLUGIN-DEV.md)
- [AI Specs](docs/AI-SPECS.md)

## Author

Pedro Belentani · [@belentani7](https://github.com/belentani7)

## License

MIT
