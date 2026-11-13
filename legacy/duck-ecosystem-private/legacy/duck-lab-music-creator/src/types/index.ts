export interface Track {
  id: string;
  name: string;
  type: 'audio' | 'midi' | 'instrument';
  color: string;
  volume: number;
  pan: number;
  muted: boolean;
  soloed: boolean;
  armed: boolean;
  clips: Clip[];
  effects: Effect[];
  instrument?: InstrumentType;
  inputDevice?: string;
}

export interface Clip {
  id: string;
  name: string;
  start: number;
  duration: number;
  waveform?: number[];
  color: string;
  muted: boolean;
  selected: boolean;
  audioBuffer?: AudioBuffer;
  midiNotes?: MidiNote[];
}

export interface MidiNote {
  pitch: number;
  velocity: number;
  start: number;
  duration: number;
}

export interface Effect {
  id: string;
  type: EffectType;
  name: string;
  enabled: boolean;
  params: Record<string, number>;
  order: number;
}

export type EffectType =
  | 'eq'
  | 'compressor'
  | 'reverb'
  | 'delay'
  | 'chorus'
  | 'flanger'
  | 'phaser'
  | 'distortion'
  | 'autotune'
  | 'limiter'
  | 'gate'
  | 'filter'
  | 'bitcrusher'
  | 'tremolo'
  | 'vibrato';

export type InstrumentType =
  | 'synth-basic'
  | 'synth-pad'
  | 'synth-lead'
  | 'synth-bass'
  | 'piano-acoustic'
  | 'piano-electric'
  | 'organ'
  | 'strings'
  | 'brass'
  | 'guitar-acoustic'
  | 'guitar-electric'
  | 'bass'
  | 'drums-kick'
  | 'drums-snare'
  | 'drums-hihat'
  | 'drums-full'
  | 'percussion'
  | 'vocals'
  | 'sampler'
  | 'custom';

export interface Sample {
  id: string;
  name: string;
  category: SampleCategory;
  duration: number;
  bpm: number;
  key?: string;
  waveform: number[];
  url?: string;
  tags: string[];
}

export type SampleCategory =
  | 'drums'
  | 'percussion'
  | 'bass'
  | 'melody'
  | 'vocals'
  | 'fx'
  | 'loops'
  | 'oneshots'
  | 'ambient'
  | 'nature';

export interface ProjectSettings {
  name: string;
  bpm: number;
  timeSignature: [number, number];
  key: string;
  sampleRate: number;
  bitDepth: number;
  masterVolume: number;
  masterEffects: Effect[];
}

export interface TransportState {
  isPlaying: boolean;
  isRecording: boolean;
  isLooping: boolean;
  position: number;
  bpm: number;
  tempoAutomation: { beat: number; bpm: number }[];
}

export interface MixerState {
  channels: ChannelState[];
  master: MasterChannelState;
}

export interface ChannelState {
  trackId: string;
  volume: number;
  pan: number;
  mute: boolean;
  solo: boolean;
  arm: boolean;
  vuLevel: number;
  vuPeak: number;
}

export interface MasterChannelState {
  volume: number;
  vuLevel: number;
  vuPeak: number;
  limiterEnabled: boolean;
  limiterThreshold: number;
}

export interface PluginPreset {
  name: string;
  type: EffectType;
  params: Record<string, number>;
  author: string;
  description: string;
}

export interface MIDIMessage {
  status: number;
  data1: number;
  data2: number;
  timestamp: number;
}

export interface TrackNodes {
  gain: GainNode;
  pan: StereoPannerNode;
  analyser: AnalyserNode;
  effects: AudioNode[];
}
