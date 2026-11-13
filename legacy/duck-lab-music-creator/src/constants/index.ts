export const DEFAULT_PROJECT_SETTINGS: ProjectSettings = {
  name: 'Untitled Duck Lab Project',
  bpm: 120,
  timeSignature: [4, 4],
  key: 'C major',
  sampleRate: 44100,
  bitDepth: 24,
  masterVolume: 0.8,
  masterEffects: []
};

export const TRACK_COLORS = [
  '#00ff88', '#00ffff', '#ff00ff', '#8b5cf6',
  '#ff6b6b', '#ffc800', '#ff8800', '#00ccff',
  '#88ff00', '#ff00aa', '#aa00ff', '#00aaff'
] as const;

export const EFFECT_PRESETS: PluginPreset[] = [
  {
    name: 'Vocal Presence EQ',
    type: 'eq',
    params: { lowGain: -2, midFreq: 2500, midGain: 3, highFreq: 12000, highGain: 1, q: 1.2 },
    author: 'Duck Lab',
    description: 'Enhances vocal clarity and presence'
  },
  {
    name: 'Studio Compressor',
    type: 'compressor',
    params: { threshold: -24, ratio: 4, attack: 10, release: 100, knee: 6, makeupGain: 3 },
    author: 'Duck Lab',
    description: 'Transparent dynamic control for vocals'
  },
  {
    name: 'Hall Reverb',
    type: 'reverb',
    params: { decayTime: 2.5, preDelay: 25, wetLevel: 30, dryLevel: 70, roomSize: 80 },
    author: 'Duck Lab',
    description: 'Spacious hall reverb for depth'
  },
  {
    name: 'Slapback Delay',
    type: 'delay',
    params: { time: 150, feedback: 35, wetLevel: 25, dryLevel: 75, pingPong: true },
    author: 'Duck Lab',
    description: 'Classic rockabilly slapback echo'
  },
  {
    name: 'Auto-Tune Pro',
    type: 'autotune',
    params: { retuneSpeed: 20, correctionAmount: 100, scale: 'chromatic', key: 'C', mode: 'major' },
    author: 'Duck Lab',
    description: 'Professional pitch correction'
  },
  {
    name: 'Brickwall Limiter',
    type: 'limiter',
    params: { threshold: -1, release: 100, lookahead: 5, ceiling: -0.3 },
    author: 'Duck Lab',
    description: 'Mastering limiter for loudness'
  },
  {
    name: 'Warm Chorus',
    type: 'chorus',
    params: { rate: 1.5, depth: 50, delay: 15, feedback: 20, mix: 40 },
    author: 'Duck Lab',
    description: 'Rich analog-style chorus'
  },
  {
    name: 'Stereo Flanger',
    type: 'flanger',
    params: { rate: 0.5, depth: 100, feedback: 70, mix: 50 },
    author: 'Duck Lab',
    description: 'Jet-engine flanging effect'
  }
];

export const INSTRUMENTS: { type: InstrumentType; name: string; icon: string; category: string }[] = [
  { type: 'synth-lead', name: 'Synth Lead', icon: 'zap', category: 'Synthesizers' },
  { type: 'synth-pad', name: 'Synth Pad', icon: 'waves', category: 'Synthesizers' },
  { type: 'synth-bass', name: 'Synth Bass', icon: 'activity', category: 'Synthesizers' },
  { type: 'synth-basic', name: 'Basic Synth', icon: 'radio', category: 'Synthesizers' },
  { type: 'piano-acoustic', name: 'Acoustic Piano', icon: 'piano', category: 'Keyboards' },
  { type: 'piano-electric', name: 'Electric Piano', icon: 'keyboard', category: 'Keyboards' },
  { type: 'organ', name: 'Organ', icon: 'music-2', category: 'Keyboards' },
  { type: 'strings', name: 'Strings', icon: 'guitar', category: 'Orchestral' },
  { type: 'brass', name: 'Brass Section', icon: 'trumpet', category: 'Orchestral' },
  { type: 'guitar-acoustic', name: 'Acoustic Guitar', icon: 'guitar', category: 'Guitars' },
  { type: 'guitar-electric', name: 'Electric Guitar', icon: 'guitar', category: 'Guitars' },
  { type: 'bass', name: 'Bass Guitar', icon: 'music-4', category: 'Bass' },
  { type: 'drums-full', name: 'Full Drum Kit', icon: 'drum', category: 'Drums' },
  { type: 'drums-kick', name: 'Kick Drum', icon: 'circle-dot', category: 'Drums' },
  { type: 'drums-snare', name: 'Snare Drum', icon: 'box', category: 'Drums' },
  { type: 'drums-hihat', name: 'Hi-Hat', icon: 'hexagon', category: 'Drums' },
  { type: 'percussion', name: 'Percussion', icon: 'triangle', category: 'Percussion' },
  { type: 'vocals', name: 'Vocal Track', icon: 'mic-2', category: 'Vocals' },
  { type: 'sampler', name: 'Sampler', icon: 'package', category: 'Sampling' }
];

export const SAMPLE_LIBRARY: Sample[] = [
  { id: 's1', name: '808 Kick Heavy', category: 'drums', duration: 0.5, bpm: 140, waveform: generateRandomWaveform(50), tags: ['kick', '808', 'bass'] },
  { id: 's2', name: 'Snare Punchy', category: 'drums', duration: 0.3, bpm: 120, waveform: generateRandomWaveform(35), tags: ['snare', 'punchy'] },
  { id: 's3', name: 'Hi-Hat Closed', category: 'drums', duration: 0.1, bpm: 128, waveform: generateRandomWaveform(15), tags: ['hihat', 'closed'] },
  { id: 's4', name: 'Hi-Hat Open', category: 'drums', duration: 0.4, bpm: 128, waveform: generateRandomWaveform(45), tags: ['hihat', 'open'] },
  { id: 's5', name: 'Clap Classic', category: 'percussion', duration: 0.25, bpm: 110, waveform: generateRandomWaveform(30), tags: ['clap', 'classic'] },
  { id: 's6', name: 'Rim Shot', category: 'percussion', duration: 0.15, bpm: 100, waveform: generateRandomWaveform(18), tags: ['rimshot', 'accent'] },
  { id: 's7', name: 'Crash Cymbal', category: 'percussion', duration: 1.5, bpm: 120, waveform: generateRandomWaveform(80), tags: ['cymbal', 'crash'] },
  { id: 's8', name: 'Ride Cymbal', category: 'percussion', duration: 2.0, bpm: 120, waveform: generateRandomWaveform(100), tags: ['cymbal', 'ride'] },
  { id: 's9', name: 'Bass Sub Drop', category: 'bass', duration: 2.0, bpm: 140, key: 'C1', waveform: generateRandomWaveform(120), tags: ['bass', 'sub', 'drop'] },
  { id: 's10', name: 'Synth Stab Major', category: 'melody', duration: 0.5, bpm: 128, key: 'C4', waveform: generateRandomWaveform(55), tags: ['synth', 'stab', 'major'] },
  { id: 's11', name: 'Vocal Chop Ahh', category: 'vocals', duration: 1.0, bpm: 120, waveform: generateRandomWaveform(70), tags: ['vocal', 'chop', 'ahh'] },
  { id: 's12', name: 'FX Whoosh', category: 'fx', duration: 1.5, bpm: 0, waveform: generateRandomWaveform(90), tags: ['fx', 'whoosh', 'transition'] },
  { id: 's13', name: 'FX Reverse Cymbal', category: 'fx', duration: 1.0, bpm: 0, waveform: generateRandomWaveform(60), tags: ['fx', 'reverse', 'cymbal'] },
  { id: 's14', name: 'Loop House Beat', category: 'loops', duration: 4.0, bpm: 124, waveform: generateRandomWaveform(200), tags: ['loop', 'house', 'beat'] },
  { id: 's15', name: 'Loop Trap Hi-Hats', category: 'loops', duration: 2.0, bpm: 140, waveform: generateRandomWaveform(100), tags: ['loop', 'trap', 'hihat'] },
  { id: 's16', name: 'Ambient Pad', category: 'ambient', duration: 8.0, bpm: 90, key: 'Am', waveform: generateRandomWaveform(300), tags: ['ambient', 'pad', 'atmospheric'] }
];

export const SAMPLE_CATEGORIES: { value: SampleCategory; label: string; icon: string }[] = [
  { value: 'drums', label: 'Drums', icon: 'drum' },
  { value: 'percussion', label: 'Percussion', icon: 'triangle' },
  { value: 'bass', label: 'Bass', icon: 'music-4' },
  { value: 'melody', label: 'Melody', icon: 'music' },
  { value: 'vocals', label: 'Vocals', icon: 'mic-2' },
  { value: 'fx', label: 'FX', icon: 'zap' },
  { value: 'loops', label: 'Loops', icon: 'repeat' },
  { value: 'oneshots', label: 'One Shots', icon: 'circle-dot' },
  { value: 'ambient', label: 'Ambient', icon: 'cloud' },
  { value: 'nature', label: 'Nature', icon: 'leaf' }
];

export const GRID_DIVISIONS = [1, 2, 4, 8, 16, 32] as const;

export const ZOOM_MIN = 10;
export const ZOOM_MAX = 200;
export const VERTICAL_ZOOM_MIN = 20;
export const VERTICAL_ZOOM_MAX = 150;

export const MAX_UNDO_STATES = 50;

function generateRandomWaveform(length: number): number[] {
  const waveform: number[] = [];
  let value = Math.random();
  for (let i = 0; i < length; i++) {
    value += (Math.random() - 0.5) * 0.3;
    value = Math.max(0.05, Math.min(1, value));
    waveform.push(value);
  }
  return waveform;
}
