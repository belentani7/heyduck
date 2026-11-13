# Plugin Development Guide

## Creating a Plugin

Plugins follow a simple interface:

```typescript
interface DuckPlugin {
  name: string
  category: 'synth' | 'effect' | 'utility'
  parameters: Parameter[]
  process(input: AudioBuffer): AudioBuffer
}
```

## Built-in Plugins

- **Synth8:** Polyphonic synth, 8 voices
- **ReverbMax:** Algorithmic reverb
- **CompressorPro:** Multiband compressor
- **EQX:** Parametric EQ
- **DelayMaster:** Tempo-synced delay

## Adding a Custom Plugin

1. Create file in `src/modules/plugins/`
2. Implement plugin interface
3. Register in plugin store
4. Test with sample audio

