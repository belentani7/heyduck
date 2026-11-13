# Duck Lab Music Creator

Professional Cyberpunk DAW Studio built with Next.js 16, React 19, TypeScript 5, and Web Audio API.

## Features

- **Multi-track Recording/Playback** - Audio and MIDI tracks with professional routing
- **Real-time Effects Chain** - EQ, Compressor, Reverb, Delay, Distortion, Autotune, Limiter, and more
- **Virtual Instruments** - Synths, Pianos, Drums, Bass, Guitars, Orchestral, and Sampler
- **Sample Library** - Built-in samples with waveform preview and drag-and-drop
- **Professional Mixer** - Volume, Pan, Mute, Solo, Arm, VU meters with peak detection
- **Timeline Editor** - Grid-snapped clips, waveform visualization, loop regions, drag-and-drop
- **Transport Controls** - Play, Record, Loop, Metronome, Count-in, BPM control
- **Undo/Redo System** - 50-state history with keyboard shortcuts
- **Project Save/Load** - JSON-based project files
- **Audio Import/Export** - Drag-and-drop audio file import
- **Cyberpunk UI** - Neon green theme with liquid light animations

## Tech Stack

- **Framework**: Next.js 16 (App Router) with Webpack
- **Runtime**: React 19, TypeScript 5
- **Audio**: Web Audio API (AudioContext, GainNode, AnalyserNode, ConvolverNode, etc.)
- **Styling**: Tailwind CSS 4 with custom cyberpunk theme
- **Animations**: CSS animations with liquid light effects
- **Icons**: Lucide React
- **State Management**: React hooks with custom studio hooks
- **Database**: Prisma (for future project persistence)

## Getting Started

### Prerequisites

- Node.js 20+ or Bun 1.4+
- Modern browser with Web Audio API support

### Installation

```bash
# Install dependencies
bun install
# or
npm install

# Start development server
bun dev
# or
npm run dev
```

Open http://localhost:3000

### Build for Production

```bash
# Build standalone
npm run build

# Start production server
npm run start
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main DAW application
│   ├── layout.tsx        # Root layout
│   ├── globals.css       # Cyberpunk theme & animations
│   └── api/              # API routes
├── components/
│   ├── studio/           # Layout panels
│   ├── timeline/         # Timeline editor
│   ├── transport/        # Transport controls
│   ├── mixer/            # Mixer channel strips
│   ├── tracks/           # Track headers & effects
│   ├── samples/          # Sample library browser
│   └── ui/               # shadcn/ui components
├── engine/
│   └── DuckLabAudioEngine.ts  # Web Audio API engine
├── hooks/
│   └── useStudio.ts      # Custom React hooks
├── lib/
│   ├── utils.ts          # Utility functions
│   └── db.ts             # Prisma client
├── types/
│   └── index.ts          # TypeScript types
├── constants/
│   └── index.ts          # Constants & presets
└── constants/
    └── index.ts          # Constants & presets
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `Ctrl+Enter` | Record |
| `Enter` | Stop |
| `L` | Toggle Loop |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` / `Ctrl+Y` | Redo |
| `Delete` / `Backspace` | Delete Selected Clip |
| `M` | Mute Selected Track |
| `S` | Solo Selected Track |
| `R` | Arm Selected Track for Recording |
| `←` / `→` | Move Playhead by Beat |
| `Ctrl+←` / `Ctrl+→` | Move Playhead by Bar |

## Audio Engine Architecture

The `DuckLabAudioEngine` class provides a professional Web Audio API implementation:

- **Master Chain**: Gain → Limiter → Analyser → Destination
- **Track Nodes**: Gain → Pan → Analyser → Master
- **Effects**: Insert-based processing with dynamic node creation
- **Recording**: MediaStreamSource → Track Gain
- **Playback**: BufferSource / OscillatorNode → Track Gain
- **Visualization**: Real-time FFT and time-domain data

## Cyberpunk Theme

The UI uses a custom Tailwind CSS 4 theme with:
- Neon green (`#00ff88`) as primary accent
- Cyber dark backgrounds (`#0a0a0f`)
- Liquid light gradient animations
- Grid pulse and scanline effects
- Neon glow shadows and text effects

## License

DUCK LAB SOFTWARE - ALL RIGHTS RESERVED
Built for: BEYONCÉ, SHAKIRA, ANITTA
