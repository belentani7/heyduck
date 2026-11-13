import type { Track, Effect, EffectType, TrackNodes, ProjectSettings } from '@/types';

export class DuckLabAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private tracks: Map<string, TrackNodes> = new Map();
  private mediaStream: MediaStream | null = null;
  private masterLimiter: DynamicsCompressorNode | null = null;

  constructor() {}

  async initialize(sampleRate: number = 44100): Promise<void> {
    this.ctx = new AudioContext({ sampleRate });

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.8;

    this.masterLimiter = this.ctx.createDynamicsCompressor();
    this.masterLimiter.threshold.value = -1;
    this.masterLimiter.ratio.value = 20;
    this.masterLimiter.attack.value = 0.001;
    this.masterLimiter.release.value = 0.1;
    this.masterLimiter.knee.value = 0;

    this.analyserNode = this.ctx.createAnalyser();
    this.analyserNode.fftSize = 2048;
    this.analyserNode.smoothingTimeConstant = 0.8;

    this.masterGain.connect(this.masterLimiter);
    this.masterLimiter.connect(this.analyserNode);
    this.analyserNode.connect(this.ctx.destination);
  }

  get context(): AudioContext | null {
    return this.ctx;
  }

  get analyser(): AnalyserNode | null {
    return this.analyserNode;
  }

  setMasterVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx!.currentTime);
    }
  }

  setMasterLimiterEnabled(enabled: boolean): void {
    if (this.masterLimiter) {
      this.masterLimiter.ratio.setValueAtTime(enabled ? 20 : 1, this.ctx!.currentTime);
    }
  }

  setMasterLimiterThreshold(threshold: number): void {
    if (this.masterLimiter) {
      this.masterLimiter.threshold.setValueAtTime(threshold, this.ctx!.currentTime);
    }
  }

  createTrack(trackId: string): TrackNodes {
    if (!this.ctx || !this.masterGain) throw new Error('Audio engine not initialized');

    const gainNode = this.ctx.createGain();
    const panNode = this.ctx.createStereoPanner();
    const analyser = this.ctx.createAnalyser();
    analyser.fftSize = 256;

    gainNode.connect(panNode);
    panNode.connect(analyser);
    analyser.connect(this.masterGain);

    const nodes: TrackNodes = { gain: gainNode, pan: panNode, analyser, effects: [] };
    this.tracks.set(trackId, nodes);
    return nodes;
  }

  removeTrack(trackId: string): void {
    const nodes = this.tracks.get(trackId);
    if (nodes) {
      nodes.gain.disconnect();
      nodes.pan.disconnect();
      nodes.analyser.disconnect();
      nodes.effects.forEach(e => { try { e.disconnect(); } catch { } });
      this.tracks.delete(trackId);
    }
  }

  setTrackVolume(trackId: string, volume: number): void {
    const nodes = this.tracks.get(trackId);
    if (nodes && this.ctx) {
      nodes.gain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
    }
  }

  setTrackPan(trackId: string, pan: number): void {
    const nodes = this.tracks.get(trackId);
    if (nodes && this.ctx) {
      nodes.pan.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), this.ctx.currentTime);
    }
  }

  setTrackMute(trackId: string, muted: boolean): void {
    const nodes = this.tracks.get(trackId);
    if (nodes && this.ctx) {
      nodes.gain.gain.setValueAtTime(muted ? 0 : 1, this.ctx.currentTime);
    }
  }

  async startRecording(trackId: string): Promise<void> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: this.ctx?.sampleRate
        }
      });

      if (!this.ctx || !this.mediaStream) throw new Error('Cannot record');

      const source = this.ctx.createMediaStreamSource(this.mediaStream);
      const nodes = this.tracks.get(trackId);
      if (nodes) {
        source.connect(nodes.gain);
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  stopRecording(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
  }

  async loadAudioFile(file: File): Promise<AudioBuffer> {
    if (!this.ctx) throw new Error('Audio engine not initialized');

    const arrayBuffer = await file.arrayBuffer();
    return await this.ctx.decodeAudioData(arrayBuffer);
  }

  playBuffer(buffer: AudioBuffer, trackId: string, startTime: number = 0, offset: number = 0, duration?: number): void {
    if (!this.ctx) return;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = false;

    const nodes = this.tracks.get(trackId);
    if (nodes) {
      source.connect(nodes.gain);
    } else {
      source.connect(this.masterGain!);
    }

    source.start(this.ctx.currentTime + startTime, offset, duration);
  }

  createOscillator(type: OscillatorType, frequency: number, trackId: string): OscillatorNode {
    if (!this.ctx) throw new Error('Audio engine not initialized');

    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = frequency;

    const nodes = this.tracks.get(trackId);
    if (nodes) {
      osc.connect(nodes.gain);
    } else {
      osc.connect(this.masterGain!);
    }

    return osc;
  }

  createEffect(type: EffectType, params: Record<string, number>): AudioNode {
    if (!this.ctx) throw new Error('Audio engine not initialized');

    switch (type) {
      case 'eq':
        return this.createEQ(params);
      case 'compressor':
        return this.createCompressor(params);
      case 'reverb':
        return this.createReverb(params);
      case 'delay':
        return this.createDelay(params);
      case 'distortion':
        return this.createDistortion(params);
      case 'filter':
        return this.createFilter(params);
      case 'chorus':
        return this.createChorus(params);
      case 'flanger':
        return this.createFlanger(params);
      case 'phaser':
        return this.createPhaser(params);
      case 'autotune':
        return this.createAutoTune(params);
      case 'limiter':
        return this.createLimiter(params);
      case 'gate':
        return this.createGate(params);
      case 'bitcrusher':
        return this.createBitcrusher(params);
      case 'tremolo':
        return this.createTremolo(params);
      case 'vibrato':
        return this.createVibrato(params);
      default:
        const gain = this.ctx.createGain();
        gain.gain.value = 1;
        return gain;
    }
  }

  private createEQ(params: Record<string, number>): BiquadFilterNode {
    if (!this.ctx) throw new Error('No audio context');
    const eq = this.ctx.createBiquadFilter();
    eq.type = 'peaking';
    eq.frequency.value = params.midFreq || 1000;
    eq.gain.value = params.midGain || 0;
    eq.Q.value = params.q || 1;
    return eq;
  }

  private createCompressor(params: Record<string, number>): DynamicsCompressorNode {
    if (!this.ctx) throw new Error('No audio context');
    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = params.threshold || -24;
    comp.ratio.value = params.ratio || 4;
    comp.attack.value = (params.attack || 10) / 1000;
    comp.release.value = (params.release || 100) / 1000;
    comp.knee.value = params.knee || 6;
    return comp;
  }

  private async createReverb(params: Record<string, number>): Promise<ConvolverNode> {
    if (!this.ctx) throw new Error('No audio context');
    const convolver = this.ctx.createConvolver();

    const decayTime = params.decayTime || 2;
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * decayTime;
    const impulse = this.ctx.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const n = length - i;
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(n / length, 2);
      }
    }

    convolver.buffer = impulse;
    return convolver;
  }

  private createDelay(params: Record<string, number>): DelayNode {
    if (!this.ctx) throw new Error('No audio context');
    const delay = this.ctx.createDelay(2);
    delay.delayTime.value = (params.time || 200) / 1000;

    if (params.feedback) {
      const feedbackGain = this.ctx.createGain();
      feedbackGain.gain.value = params.feedback / 100;
      delay.connect(feedbackGain);
      feedbackGain.connect(delay);
    }

    return delay;
  }

  private createDistortion(params: Record<string, number>): WaveShaperNode {
    if (!this.ctx) throw new Error('No audio context');
    const shaper = this.ctx.createWaveShaper();
    const amount = params.amount || 50;
    const samples = 44100;
    const curve = new Float32Array(samples);

    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
    }

    shaper.curve = curve;
    shaper.oversample = '4x';
    return shaper;
  }

  private createFilter(params: Record<string, number>): BiquadFilterNode {
    if (!this.ctx) throw new Error('No audio context');
    const filter = this.ctx.createBiquadFilter();
    filter.type = (params.filterType as BiquadFilterType) || 'lowpass';
    filter.frequency.value = params.frequency || 1000;
    filter.Q.value = params.q || 1;
    return filter;
  }

  private createChorus(params: Record<string, number>): AudioNode {
    if (!this.ctx) throw new Error('No audio context');
    const chorus = this.ctx.createDelay(1);
    chorus.delayTime.value = (params.delay || 15) / 1000;

    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = params.rate || 1.5;

    const depthGain = this.ctx.createGain();
    depthGain.gain.value = (params.depth || 50) / 1000;

    lfo.connect(depthGain);
    depthGain.connect(chorus.delayTime);

    const feedbackGain = this.ctx.createGain();
    feedbackGain.gain.value = (params.feedback || 20) / 100;
    chorus.connect(feedbackGain);
    feedbackGain.connect(chorus);

    lfo.start();
    return chorus;
  }

  private createFlanger(params: Record<string, number>): AudioNode {
    if (!this.ctx) throw new Error('No audio context');
    const flanger = this.ctx.createDelay(1);
    flanger.delayTime.value = 0.001;

    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = params.rate || 0.5;

    const depthGain = this.ctx.createGain();
    depthGain.gain.value = (params.depth || 100) / 1000;

    lfo.connect(depthGain);
    depthGain.connect(flanger.delayTime);

    const feedbackGain = this.ctx.createGain();
    feedbackGain.gain.value = params.feedback || 0.7;
    flanger.connect(feedbackGain);
    feedbackGain.connect(flanger);

    lfo.start();
    return flanger;
  }

  private createPhaser(params: Record<string, number>): AudioNode {
    if (!this.ctx) throw new Error('No audio context');
    const filters: BiquadFilterNode[] = [];
    for (let i = 0; i < 4; i++) {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'allpass';
      filter.frequency.value = 1000;
      filter.Q.value = 1;
      filters.push(filter);
    }

    for (let i = 0; i < filters.length - 1; i++) {
      filters[i].connect(filters[i + 1]);
    }

    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = params.rate || 0.5;

    const depthGain = this.ctx.createGain();
    depthGain.gain.value = (params.depth || 500) / 1000;

    lfo.connect(depthGain);
    filters.forEach(f => depthGain.connect(f.frequency));

    lfo.start();
    return filters[0];
  }

  private createAutoTune(params: Record<string, number>): AudioNode {
    if (!this.ctx) throw new Error('No audio context');
    const processor = this.ctx.createScriptProcessor(4096, 1, 1);
    let buffer = new Float32Array(0);

    processor.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0);
      const output = e.outputBuffer.getChannelData(0);
      output.set(input);
    };

    return processor;
  }

  private createLimiter(params: Record<string, number>): DynamicsCompressorNode {
    if (!this.ctx) throw new Error('No audio context');
    const limiter = this.ctx.createDynamicsCompressor();
    limiter.threshold.value = params.threshold || -1;
    limiter.ratio.value = 20;
    limiter.attack.value = 0.001;
    limiter.release.value = (params.release || 100) / 1000;
    limiter.knee.value = 0;
    return limiter;
  }

  private createGate(params: Record<string, number>): AudioNode {
    if (!this.ctx) throw new Error('No audio context');
    const gate = this.ctx.createDynamicsCompressor();
    gate.threshold.value = params.threshold || -40;
    gate.ratio.value = 10;
    gate.attack.value = (params.attack || 1) / 1000;
    gate.release.value = (params.release || 100) / 1000;
    return gate;
  }

  private createBitcrusher(params: Record<string, number>): AudioNode {
    if (!this.ctx) throw new Error('No audio context');
    const processor = this.ctx.createScriptProcessor(4096, 1, 1);
    const bits = params.bits || 8;
    const sampleRate = params.sampleRate || 0.1;

    processor.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0);
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < input.length; i++) {
        const step = Math.pow(2, bits - 1);
        output[i] = Math.round(input[i] * step) / step;
      }
    };

    return processor;
  }

  private createTremolo(params: Record<string, number>): AudioNode {
    if (!this.ctx) throw new Error('No audio context');
    const gain = this.ctx.createGain();
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = params.rate || 5;

    const depthGain = this.ctx.createGain();
    depthGain.gain.value = (params.depth || 50) / 100;

    lfo.connect(depthGain);
    depthGain.connect(gain.gain);

    lfo.start();
    return gain;
  }

  private createVibrato(params: Record<string, number>): AudioNode {
    if (!this.ctx) throw new Error('No audio context');
    const delay = this.ctx.createDelay(1);
    delay.delayTime.value = 0.005;

    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = params.rate || 5;

    const depthGain = this.ctx.createGain();
    depthGain.gain.value = (params.depth || 50) / 1000;

    lfo.connect(depthGain);
    depthGain.connect(delay.delayTime);

    const feedbackGain = this.ctx.createGain();
    feedbackGain.gain.value = 0.5;
    delay.connect(feedbackGain);
    feedbackGain.connect(delay);

    lfo.start();
    return delay;
  }

  addEffectToTrack(trackId: string, effect: Effect): void {
    const nodes = this.tracks.get(trackId);
    if (!nodes || !this.ctx) return;

    const effectNode = this.createEffect(effect.type, effect.params);
    const lastNode = nodes.effects.length > 0 ? nodes.effects[nodes.effects.length - 1] : nodes.pan;

    lastNode.disconnect();
    lastNode.connect(effectNode);
    effectNode.connect(nodes.analyser);

    nodes.effects.push(effectNode);
  }

  removeEffectFromTrack(trackId: string, effectIndex: number): void {
    const nodes = this.tracks.get(trackId);
    if (!nodes || effectIndex >= nodes.effects.length) return;

    const effectToRemove = nodes.effects[effectIndex];
    const prevNode = effectIndex > 0 ? nodes.effects[effectIndex - 1] : nodes.pan;
    const nextNode = effectIndex < nodes.effects.length - 1 ? nodes.effects[effectIndex + 1] : nodes.analyser;

    prevNode.disconnect();
    prevNode.connect(nextNode);

    try { effectToRemove.disconnect(); } catch { }

    nodes.effects.splice(effectIndex, 1);
  }

  getFrequencyData(): Uint8Array {
    if (!this.analyserNode) return new Uint8Array(0);
    const data = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(data);
    return data;
  }

  getTimeDomainData(): Uint8Array {
    if (!this.analyserNode) return new Uint8Array(0);
    const data = new Uint8Array(this.analyserNode.fftSize);
    this.analyserNode.getByteTimeDomainData(data);
    return data;
  }

  getTrackLevel(trackId: string): number {
    const nodes = this.tracks.get(trackId);
    if (!nodes?.analyser) return 0;

    const data = new Uint8Array(nodes.analyser.frequencyBinCount);
    nodes.analyser.getByteFrequencyData(data);

    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
    }
    return sum / data.length / 255;
  }

  getTrackPeakLevel(trackId: string): number {
    const nodes = this.tracks.get(trackId);
    if (!nodes?.analyser) return 0;

    const data = new Uint8Array(nodes.analyser.fftSize);
    nodes.analyser.getByteTimeDomainData(data);

    let max = 0;
    for (let i = 0; i < data.length; i++) {
      const val = Math.abs(data[i] - 128) / 128;
      if (val > max) max = val;
    }
    return max;
  }

  getMasterLevel(): number {
    if (!this.analyserNode) return 0;
    const data = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(data);

    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
    }
    return sum / data.length / 255;
  }

  getMasterPeakLevel(): number {
    if (!this.analyserNode) return 0;
    const data = new Uint8Array(this.analyserNode.fftSize);
    this.analyserNode.getByteTimeDomainData(data);

    let max = 0;
    for (let i = 0; i < data.length; i++) {
      const val = Math.abs(data[i] - 128) / 128;
      if (val > max) max = val;
    }
    return max;
  }

  destroy(): void {
    this.stopRecording();
    this.tracks.forEach((_, id) => this.removeTrack(id));
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

let audioEngineInstance: DuckLabAudioEngine | null = null;

export function getAudioEngine(): DuckLabAudioEngine {
  if (!audioEngineInstance) {
    audioEngineInstance = new DuckLabAudioEngine();
  }
  return audioEngineInstance;
}

export function resetAudioEngine(): void {
  if (audioEngineInstance) {
    audioEngineInstance.destroy();
    audioEngineInstance = null;
  }
}
