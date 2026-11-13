import { useState, useCallback, useRef, useEffect } from 'react';
import type { Track, Clip, Effect, TransportState, ProjectSettings, InstrumentType, EffectType, Sample } from '@/types';
import { getAudioEngine } from '@/engine/DuckLabAudioEngine';
import { DEFAULT_PROJECT_SETTINGS, TRACK_COLORS, EFFECT_PRESETS, INSTRUMENTS, SAMPLE_LIBRARY } from '@/constants';

export function useAudioEngine() {
  const [isInitialized, setIsInitialized] = useState(false);
  const engine = getAudioEngine();

  const initialize = useCallback(async (sampleRate: number = 44100) => {
    try {
      await engine.initialize(sampleRate);
      setIsInitialized(true);
      return true;
    } catch (error) {
      console.error('Failed to initialize audio engine:', error);
      return false;
    }
  }, [engine]);

  const destroy = useCallback(() => {
    engine.destroy();
    setIsInitialized(false);
  }, [engine]);

  return { engine, isInitialized, initialize, destroy };
}

export function useProjectState() {
  const [projectSettings, setProjectSettings] = useState<ProjectSettings>(DEFAULT_PROJECT_SETTINGS);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);

  const addTrack = useCallback((type: Track['type'] = 'audio') => {
    const newTrack: Track = {
      id: crypto.randomUUID(),
      name: `Track ${tracks.length + 1}`,
      type,
      color: TRACK_COLORS[tracks.length % TRACK_COLORS.length],
      volume: 0.8,
      pan: 0,
      muted: false,
      soloed: false,
      armed: false,
      clips: [],
      effects: [],
      ...(type === 'instrument' && { instrument: 'synth-basic' as InstrumentType })
    };

    setTracks(prev => [...prev, newTrack]);
    getAudioEngine().createTrack(newTrack.id);
    return newTrack.id;
  }, [tracks.length]);

  const deleteTrack = useCallback((trackId: string) => {
    setTracks(prev => prev.filter(t => t.id !== trackId));
    getAudioEngine().removeTrack(trackId);
    if (selectedTrackId === trackId) setSelectedTrackId(null);
  }, [selectedTrackId]);

  const duplicateTrack = useCallback((trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (!track) return;

    const duplicated: Track = {
      ...track,
      id: crypto.randomUUID(),
      name: `${track.name} (copy)`,
      clips: track.clips.map(c => ({ ...c, id: crypto.randomUUID() })),
      effects: track.effects.map(e => ({ ...e, id: crypto.randomUUID() }))
    };

    setTracks(prev => {
      const index = prev.findIndex(t => t.id === trackId);
      const newTracks = [...prev];
      newTracks.splice(index + 1, 0, duplicated);
      return newTracks;
    });

    getAudioEngine().createTrack(duplicated.id);
    return duplicated.id;
  }, [tracks]);

  const updateTrack = useCallback((trackId: string, updates: Partial<Track>) => {
    setTracks(prev => prev.map(t => t.id === trackId ? { ...t, ...updates } : t));

    if (updates.volume !== undefined) getAudioEngine().setTrackVolume(trackId, updates.volume);
    if (updates.pan !== undefined) getAudioEngine().setTrackPan(trackId, updates.pan);
    if (updates.muted !== undefined) getAudioEngine().setTrackMute(trackId, updates.muted);
  }, []);

  const addClip = useCallback((trackId: string, startBeat: number = 0, clip?: Partial<Clip>) => {
    const track = tracks.find(t => t.id === trackId);
    const newClip: Clip = {
      id: crypto.randomUUID(),
      name: clip?.name || 'New Clip',
      start: clip?.start ?? startBeat,
      duration: clip?.duration ?? 4,
      waveform: clip?.waveform,
      color: clip?.color || track?.color || '#00ff88',
      muted: false,
      selected: false,
      ...clip
    };

    setTracks(prev => prev.map(t =>
      t.id === trackId ? { ...t, clips: [...t.clips, newClip] } : t
    ));

    return newClip.id;
  }, [tracks]);

  const deleteClip = useCallback((trackId: string, clipId: string) => {
    setTracks(prev => prev.map(t =>
      t.id === trackId ? { ...t, clips: t.clips.filter(c => c.id !== clipId) } : t
    ));
    if (selectedClipId === clipId) setSelectedClipId(null);
  }, [selectedClipId]);

  const selectClip = useCallback((clipId: string | null) => {
    setSelectedClipId(clipId);
    setTracks(prev => prev.map(t => ({
      ...t,
      clips: t.clips.map(c => ({ ...c, selected: c.id === clipId }))
    })));
  }, []);

  const addEffect = useCallback((trackId: string, effectType: EffectType) => {
    const preset = EFFECT_PRESETS.find(p => p.type === effectType);

    const effect: Effect = {
      id: crypto.randomUUID(),
      type: effectType,
      name: preset?.name || effectType.charAt(0).toUpperCase() + effectType.slice(1),
      enabled: true,
      params: preset?.params || {},
      order: 0
    };

    setTracks(prev => prev.map(t => {
      if (t.id !== trackId) return t;
      return {
        ...t,
        effects: [...t.effects, { ...effect, order: t.effects.length }]
      };
    }));

    return effect.id;
  }, []);

  const removeEffect = useCallback((trackId: string, effectId: string) => {
    setTracks(prev => prev.map(t => {
      if (t.id !== trackId) return t;
      return {
        ...t,
        effects: t.effects.filter(e => e.id !== effectId)
      };
    }));
  }, []);

  const toggleEffect = useCallback((trackId: string, effectId: string) => {
    setTracks(prev => prev.map(t => {
      if (t.id !== trackId) return t;
      return {
        ...t,
        effects: t.effects.map(e =>
          e.id === effectId ? { ...e, enabled: !e.enabled } : e
        )
      };
    }));
  }, []);

  const updateEffectParam = useCallback((trackId: string, effectId: string, param: string, value: number) => {
    setTracks(prev => prev.map(t => {
      if (t.id !== trackId) return t;
      return {
        ...t,
        effects: t.effects.map(e =>
          e.id === effectId ? { ...e, params: { ...e.params, [param]: value } } : e
        )
      };
    }));
  }, []);

  return {
    projectSettings,
    setProjectSettings,
    tracks,
    setTracks,
    selectedTrackId,
    setSelectedTrackId,
    selectedClipId,
    addTrack,
    deleteTrack,
    duplicateTrack,
    updateTrack,
    addClip,
    deleteClip,
    selectClip,
    addEffect,
    removeEffect,
    toggleEffect,
    updateEffectParam
  };
}

export function useTransport() {
  const [transport, setTransport] = useState<TransportState>({
    isPlaying: false,
    isRecording: false,
    isLooping: true,
    position: 0,
    bpm: 120,
    tempoAutomation: []
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const engine = getAudioEngine();

  const start = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setTransport(prev => ({
        ...prev,
        position: prev.position + (1 / (120 / 60)) * (prev.bpm / 120)
      }));
      updateAudioVisualization(engine);
    }, 50);
    setTransport(prev => ({ ...prev, isPlaying: true }));
  }, [engine]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTransport(prev => ({ ...prev, isPlaying: false, isRecording: false, position: 0 }));
    engine.stopRecording();
  }, [engine]);

  const togglePlay = useCallback(() => {
    if (transport.isPlaying) stop();
    else start();
  }, [transport.isPlaying, start, stop]);

  const toggleRecord = useCallback(async (tracks: Track[]) => {
    if (transport.isRecording) {
      setTransport(prev => ({ ...prev, isRecording: false }));
      engine.stopRecording();
    } else {
      const armedTrack = tracks.find(t => t.armed);
      if (armedTrack) {
        await engine.startRecording(armedTrack.id);
        setTransport(prev => ({ ...prev, isRecording: true, isPlaying: true }));
      }
    }
  }, [transport.isRecording, engine]);

  const toggleLoop = useCallback(() => {
    setTransport(prev => ({ ...prev, isLooping: !prev.isLooping }));
  }, []);

  const setPosition = useCallback((position: number) => {
    setTransport(prev => ({ ...prev, position }));
  }, []);

  const setBPM = useCallback((bpm: number) => {
    setTransport(prev => ({ ...prev, bpm }));
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { transport, setTransport, start, stop, togglePlay, toggleRecord, toggleLoop, setPosition, setBPM };
}

function updateAudioVisualization(engine: ReturnType<typeof getAudioEngine>) {
  // This will be called by the component that needs visualization data
}

export function useAudioVisualization(tracks: Track[]) {
  const [frequencyData, setFrequencyData] = useState<number[]>(new Array(64).fill(0));
  const [timeDomainData, setTimeDomainData] = useState<number[]>(new Array(128).fill(0.5));
  const [masterVuLevel, setMasterVuLevel] = useState(0);
  const [trackLevels, setTrackLevels] = useState<Record<string, number>>({});
  const engine = getAudioEngine();

  useEffect(() => {
    const interval = setInterval(() => {
      const freqData = engine.getFrequencyData();
      if (freqData.length > 0) {
        const downsampled: number[] = [];
        const binSize = Math.floor(freqData.length / 64);
        for (let i = 0; i < 64; i++) {
          let sum = 0;
          for (let j = 0; j < binSize; j++) {
            sum += freqData[i * binSize + j];
          }
          downsampled.push(sum / binSize / 255);
        }
        setFrequencyData(downsampled);
      }

      const timeData = engine.getTimeDomainData();
      if (timeData.length > 0) {
        setTimeDomainData(Array.from(timeData).map(v => v / 128 - 1));
      }

      const newTrackLevels: Record<string, number> = {};
      let maxLevel = 0;
      tracks.forEach(track => {
        const level = engine.getTrackLevel(track.id);
        newTrackLevels[track.id] = level;
        if (level > maxLevel) maxLevel = level;
      });
      setTrackLevels(newTrackLevels);
      setMasterVuLevel(maxLevel);
    }, 50);

    return () => clearInterval(interval);
  }, [tracks, engine]);

  return { frequencyData, timeDomainData, masterVuLevel, trackLevels };
}

export function useUndoRedo<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);
  const undoStack = useRef<T[]>([]);
  const redoStack = useRef<T[]>([]);

  const push = useCallback((newState: T) => {
    undoStack.current.push(state);
    if (undoStack.current.length > 50) undoStack.current.shift();
    redoStack.current = [];
    setState(newState);
  }, [state]);

  const undo = useCallback(() => {
    if (undoStack.current.length === 0) return;
    const prevState = undoStack.current.pop()!;
    redoStack.current.push(state);
    setState(prevState);
  }, [state]);

  const redo = useCallback(() => {
    if (redoStack.current.length === 0) return;
    const nextState = redoStack.current.pop()!;
    undoStack.current.push(state);
    setState(nextState);
  }, [state]);

  const canUndo = undoStack.current.length > 0;
  const canRedo = redoStack.current.length > 0;

  return { state, setState: push, undo, redo, canUndo, canRedo };
}

export function useKeyboardShortcuts(callbacks: {
  onPlay?: () => void;
  onRecord?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onDelete?: () => void;
  onMute?: () => void;
  onSolo?: () => void;
  onArm?: () => void;
  onNavigateLeft?: () => void;
  onNavigateRight?: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          callbacks.onPlay?.();
          break;
        case 'Enter':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            callbacks.onRecord?.();
          }
          break;
        case 'Delete':
        case 'Backspace':
          callbacks.onDelete?.();
          break;
        case 'KeyZ':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            if (event.shiftKey) callbacks.onRedo?.();
            else callbacks.onUndo?.();
          }
          break;
        case 'KeyY':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            callbacks.onRedo?.();
          }
          break;
        case 'KeyM':
          callbacks.onMute?.();
          break;
        case 'KeyS':
          callbacks.onSolo?.();
          break;
        case 'KeyR':
          callbacks.onArm?.();
          break;
        case 'ArrowLeft':
          if (event.ctrlKey || event.metaKey) {
            callbacks.onNavigateLeft?.();
          }
          break;
        case 'ArrowRight':
          if (event.ctrlKey || event.metaKey) {
            callbacks.onNavigateRight?.();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callbacks]);
}

export function useFileImport(engine: ReturnType<typeof getAudioEngine>) {
  const [isImporting, setIsImporting] = useState(false);

  const importFiles = useCallback(async (files: FileList, projectBPM: number): Promise<void> => {
    setIsImporting(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('audio/') || file.name.endsWith('.wav') || file.name.endsWith('.mp3')) {
          try {
            const buffer = await engine.loadAudioFile(file);
            // The component will handle adding the clip
            console.log(`Loaded ${file.name}: ${buffer.duration}s`);
          } catch (error) {
            console.error(`Failed to load ${file.name}:`, error);
          }
        }
      }
    } finally {
      setIsImporting(false);
    }
  }, [engine]);

  return { importFiles, isImporting };
}
