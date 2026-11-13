# DUCK Music Lab - Architecture

## Core Components

### Audio Engine
- Web Audio API wrapper
- Timeline management
- Track/channel architecture
- Sample accurate timing

### Plugin System
- VST-like plugin format
- Built-in plugins: synth, effects
- Plugin chain management
- Parameter automation

### UI System
- Drawer-based interface (GSAP animated)
- Responsive layout
- Keyboard shortcuts
- Theme system (light/dark)

### AI Layer
- Melody generation (transformer)
- Voice cloning (Eleven Labs API)
- Document organization
- Production assistant

## Data Flow

```
User Input
  ↓
UI (Drawer System)
  ↓
DAW Core (Timeline, Tracks)
  ↓
Audio Engine (Web Audio)
  ↓
Plugin Chain (Effects, Synths)
  ↓
Speaker Output
```

## Tech Stack

- **Frontend:** React 19 + TypeScript
- **Audio:** Tone.js + Web Audio API
- **UI Animation:** GSAP
- **State:** Zustand
- **Build:** Vite

