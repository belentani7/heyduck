'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Mixer, Piano, Music, Settings, HelpCircle, X, ChevronLeft, ChevronRight, PanelLeftClose, PanelRightClose, Maximize2, Minimize2, Search, Filter, Volume2, Mic, Mic2, Drum, Piano as PianoIcon, Guitar, Waves, Zap, Plus, Trash2, Copy, GripVertical, MoreHorizontal, Download, Upload, FolderOpen, Save, RotateCcw, AlertCircle, Info, CheckCircle, XCircle, RecordCircle, Metronome, Timer, Clock, Calendar, FileAudio, Image, Film, Home, Building, Store, BookOpen, GraduationCap, Palette, Brush, PenTool, Type, Highlighter, Eraser, Move, ZoomIn, ZoomOut, RefreshCw, Power, PowerOff, Terminal, Code, Braces, Binary, Hash, AtSign, Percent, Divide, PlusCircle, MinusCircle, XCircle as XCircleIcon, CheckCircle as CheckCircleIcon, AlertTriangle, ThumbsUp, ThumbsDown, Smile, Frown, Meh, Laugh, Angry, HeartBroken, Rocket, Plane, Ship, Car, Bike, Footprints, Mountain, TreePine, Flower2, Snowflake, Sun, CloudRain, Coffee, Pizza, Cake, Beer, Wine, Cookie, Apple, Cherry, Grape, Cat, Dog, Fish, Bird, Rabbit, Butterfly, Crown, Gem, Medal, Gift, PartyPopper, Confetti } from 'lucide-react';

import { Panel, PanelHeader, PanelSection } from '@/components/studio/Panel';
import { TrackHeader, TrackEffectsPanel } from '@/components/tracks/TrackHeader';
import { Timeline } from '@/components/timeline/Timeline';
import { Transport } from '@/components/transport/Transport';
import { Mixer } from '@/components/mixer/Mixer';
import { SamplesPanel } from '@/components/samples/SamplesPanel';
import { DuckLabAudioEngine, getAudioEngine, resetAudioEngine } from '@/engine/DuckLabAudioEngine';
import { useAudioEngine, useProjectState, useTransport, useAudioVisualization, useUndoRedo, useKeyboardShortcuts, useFileImport } from '@/hooks/useStudio';
import type { Track, Clip, Effect, TransportState, ProjectSettings, InstrumentType, EffectType, Sample } from '@/types';
import { DEFAULT_PROJECT_SETTINGS, TRACK_COLORS, EFFECT_PRESETS, INSTRUMENTS, SAMPLE_LIBRARY, SAMPLE_CATEGORIES, GRID_DIVISIONS, ZOOM_MIN, ZOOM_MAX, VERTICAL_ZOOM_MIN, VERTICAL_ZOOM_MAX } from '@/constants';

export default function DuckLabMusicCreator() {
  const { engine, isInitialized, initialize, destroy } = useAudioEngine();
  const {
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
  } = useProjectState();

  const { transport, setTransport, start, stop, togglePlay, toggleRecord, toggleLoop, setPosition, setBPM } = useTransport();
  const { frequencyData, timeDomainData, masterVuLevel, trackLevels } = useAudioVisualization(tracks);
  const { state: undoState, setState: pushUndoState, undo, redo, canUndo, canRedo } = useUndoRedo({ tracks, transport, projectSettings });

  const [activeView, setActiveView] = useState<'timeline' | 'mixer' | 'piano-roll' | 'instruments'>('timeline');
  const [showPluginPanel, setShowPluginPanel] = useState(false);
  const [showSampleLibrary, setShowSampleLibrary] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [masterVuLevel, setMasterVuLevel] = useState(0);
  const [masterPeakLevel, setMasterPeakLevel] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(50);
  const [verticalZoom, setVerticalZoom] = useState(50);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridDivision, setGridDivision] = useState<1 | 2 | 4 | 8 | 16 | 32>(4);
  const [metronomeEnabled, setMetronomeEnabled] = useState(true);
  const [countInEnabled, setCountInEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [loopStart, setLoopStart] = useState(0);
  const [loopEnd, setLoopEnd] = useState(16);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Sample['category'] | 'all'>('all');
  const [isPreviewingSample, setIsPreviewingSample] = useState<string | null>(null);
  const [draggedSample, setDraggedSample] = useState<Sample | null>(null);
  const [dragPreview, setDragPreview] = useState<{ sample: Sample; x: number; y: number } | null>(null);
  const [masterVolume, setMasterVolume] = useState(0.8);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const trackLevelsRef = useRef<Record<string, number>>({});
  const trackPeakLevelsRef = useRef<Record<string, number>>({});

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const handlePlay = useCallback(() => {
    if (!isInitialized) {
      showNotification('⚠️ Please wait for audio engine to initialize', 'info');
      return;
    }
    const eng = getAudioEngine();
    if (eng.context?.state === 'suspended') {
      eng.context.resume();
    }
    start();
  }, [isInitialized, start]);

  const handleStop = useCallback(() => {
    stop();
  }, [stop]);

  const handleRecord = useCallback(async () => {
    if (!isInitialized) {
      showNotification('⚠️ Audio engine not ready', 'error');
      return;
    }
    if (transport.isRecording) {
      setTransport(prev => ({ ...prev, isRecording: false }));
      engine.stopRecording();
      showNotification('🎙️ Recording stopped', 'success');
    } else {
      try {
        const armedTrack = tracks.find(t => t.armed);
        if (armedTrack) {
          await engine.startRecording(armedTrack.id);
          setTransport(prev => ({ ...prev, isRecording: true, isPlaying: true }));
          showNotification('🔴 Recording started on ' + armedTrack.name, 'success');
        } else {
          showNotification('⚠️ Arm a track first to record', 'info');
        }
      } catch (error) {
        showNotification('❌ Could not access microphone', 'error');
      }
    }
  }, [isInitialized, transport.isRecording, tracks, engine, setTransport]);

  const handleLoopToggle = useCallback(() => {
    setTransport(prev => ({ ...prev, isLooping: !prev.isLooping }));
  }, [setTransport]);

  const handleMetronomeToggle = useCallback(() => {
    setMetronomeEnabled(prev => !prev);
  }, []);

  const handleCountInToggle = useCallback(() => {
    setCountInEnabled(prev => !prev);
  }, []);

  const handleSettingsOpen = useCallback(() => {
    setShowSettings(prev => !prev);
  }, []);

  const handleHelpToggle = useCallback(() => {
    setShowHelp(prev => !prev);
  }, []);

  const handleNewProject = useCallback(() => {
    if (window.confirm('Create new project? Unsaved changes will be lost.')) {
      setTracks([]);
      setTransport(prev => ({ ...prev, position: 0, isPlaying: false, isRecording: false }));
      showNotification('📄 New project created', 'success');
    }
  }, [setTracks, setTransport]);

  const handleSaveProject = useCallback(() => {
    const projectData = {
      projectSettings,
      tracks: tracks.map(t => ({
        ...t,
        clips: t.clips.map(c => ({ ...c, audioBuffer: undefined, waveform: c.waveform?.slice(0, 200) }))
      })),
      transport: { ...transport, isPlaying: false, isRecording: false }
    };
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectSettings.name.replace(/\s+/g, '_')}.ducklab`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('💾 Project saved', 'success');
  }, [projectSettings, tracks, transport]);

  const handleLoadProject = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileLoad = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.projectSettings) setProjectSettings(data.projectSettings);
        if (data.tracks) {
          data.tracks.forEach((t: Track) => {
            engine.createTrack(t.id);
            engine.setTrackVolume(t.id, t.volume);
            engine.setTrackPan(t.id, t.pan);
          });
          setTracks(data.tracks);
        }
        if (data.transport) setTransport({ ...data.transport, isPlaying: false, isRecording: false });
        showNotification('📂 Project loaded', 'success');
      } catch (error) {
        showNotification('❌ Invalid project file', 'error');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [engine, setProjectSettings, setTracks, setTransport]);

  const handleExportAudio = useCallback(async () => {
    showNotification('🎵 Export feature coming soon', 'info');
  }, []);

  const handleImportAudio = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.multiple = true;
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files || files.length === 0) return;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('audio/') || file.name.endsWith('.wav') || file.name.endsWith('.mp3')) {
          try {
            const buffer = await engine.loadAudioFile(file);
            const targetTrack = tracks.find(t => t.type === 'audio' && (t.id === selectedTrackId || !selectedTrackId));
            if (targetTrack) {
              const duration = buffer.duration * (projectSettings.bpm / 60);
              const clip: Clip = {
                id: crypto.randomUUID(),
                name: file.name.replace(/\.[^/.]+$/, ''),
                start: 0,
                duration: duration,
                waveform: Array.from({ length: Math.round(duration * 25) }, () => Math.random()),
                color: targetTrack.color,
                muted: false,
                selected: false,
                audioBuffer: buffer
              };
              setTracks(prev => prev.map(t =>
                t.id === targetTrack.id ? { ...t, clips: [...t.clips, clip] } : t
              ));
            }
            showNotification(`📁 Imported: ${file.name}`, 'success');
          } catch (error) {
            showNotification(`❌ Failed to import: ${file.name}`, 'error');
          }
        }
      }
    };
    input.click();
  }, [engine, tracks, selectedTrackId, projectSettings.bpm, setTracks]);

  const handleUndo = useCallback(() => {
    undo();
  }, [undo]);

  const handleRedo = useCallback(() => {
    redo();
  }, [redo]);

  const handleMasterVolumeChange = useCallback((volume: number) => {
    setMasterVolume(volume);
    engine.setMasterVolume(volume);
  }, [engine]);

  const handleSamplePreview = useCallback((sample: Sample) => {
    if (isPreviewingSample === sample.id) {
      setIsPreviewingSample(null);
      engine.stopRecording();
    } else {
      setIsPreviewingSample(sample.id);
      // Preview logic would go here
    }
  }, [engine, isPreviewingSample]);

  const handleSampleDragStart = useCallback((sample: Sample, clientX: number, clientY: number) => {
    setDraggedSample(sample);
    setDragPreview({ sample, x: clientX, y: clientY });
  }, []);

  const handleSampleDrop = useCallback((sample: Sample, trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (!track) return;

    const clip: Clip = {
      id: crypto.randomUUID(),
      name: sample.name,
      start: transport.position,
      duration: sample.duration * (projectSettings.bpm / 60),
      waveform: sample.waveform,
      color: track.color,
      muted: false,
      selected: false
    };

    setTracks(prev => prev.map(t =>
      t.id === trackId ? { ...t, clips: [...t.clips, clip] } : t
    ));

    showNotification(`🎵 Added ${sample.name}`, 'success');
    setDraggedSample(null);
    setDragPreview(null);
  }, [tracks, transport.position, projectSettings.bpm, setTracks]);

  const handleTrackSelect = useCallback((trackId: string) => {
    setSelectedTrackId(trackId);
    setSelectedClipId(null);
  }, []);

  const handleClipSelect = useCallback((clipId: string | null) => {
    selectClip(clipId);
  }, [selectClip]);

  const handleClipDragStart = useCallback((clipId: string, trackId: string, clientX: number, clipStart: number) => {
    // Clip drag logic
  }, []);

  const handleClipDrag = useCallback((clientX: number) => {
    // Clip drag move logic
  }, []);

  const handleClipDragEnd = useCallback(() => {
    // Clip drag end logic
  }, []);

  const handleClipResize = useCallback((clipId: string, trackId: string, newDuration: number) => {
    setTracks(prev => prev.map(t =>
      t.id === trackId ? {
        ...t,
        clips: t.clips.map(c => c.id === clipId ? { ...c, duration: newDuration } : c)
      } : t
    ));
  }, [setTracks]);

  const handleAddClip = useCallback((trackId: string, beat: number) => {
    const track = tracks.find(t => t.id === trackId);
    addClip(trackId, beat);
  }, [tracks, addClip]);

  const handleDeleteClip = useCallback((trackId: string, clipId: string) => {
    deleteClip(trackId, clipId);
  }, [deleteClip]);

  const handleDuplicateClip = useCallback((trackId: string, clipId: string) => {
    const track = tracks.find(t => t.id === trackId);
    const clip = track?.clips.find(c => c.id === clipId);
    if (!clip) return;

    const duplicated: Clip = {
      ...clip,
      id: crypto.randomUUID(),
      start: clip.start + clip.duration
    };

    setTracks(prev => prev.map(t =>
      t.id === trackId ? { ...t, clips: [...t.clips, duplicated] } : t
    ));
  }, [tracks, setTracks]);

  const handleSplitClip = useCallback((trackId: string, clipId: string, beat: number) => {
    // Split clip logic
  }, []);

  const handleMuteClip = useCallback((trackId: string, clipId: string) => {
    setTracks(prev => prev.map(t =>
      t.id === trackId ? {
        ...t,
        clips: t.clips.map(c => c.id === clipId ? { ...c, muted: !c.muted } : c)
      } : t
    ));
  }, [setTracks]);

  const handleLoopChange = useCallback((start: number, end: number) => {
    setLoopStart(start);
    setLoopEnd(end);
  }, []);

  const handleSetPosition = useCallback((beat: number) => {
    setTransport(prev => ({ ...prev, position: beat }));
  }, [setTransport]);

  const handleTrackInstrumentChange = useCallback((trackId: string, instrument: InstrumentType) => {
    updateTrack(trackId, { instrument });
  }, [updateTrack]);

  useEffect(() => {
    const init = async () => {
      const success = await initialize(projectSettings.sampleRate);
      if (success) {
        showNotification('🎵 Duck Lab Audio Engine Initialized!', 'success');
      }
    };
    init();

    return () => {
      destroy();
    };
  }, [initialize, destroy, projectSettings.sampleRate]);

  useEffect(() => {
    if (tracks.length === 0) {
      const defaultTracks: Track[] = [
        { id: crypto.randomUUID(), name: 'Vocals - Beyoncé', type: 'audio', color: '#00ff88', volume: 0.8, pan: 0, muted: false, soloed: false, armed: true, clips: [], effects: [], inputDevice: 'default' },
        { id: crypto.randomUUID(), name: 'Vocals - Shakira', type: 'audio', color: '#00ffff', volume: 0.75, pan: -0.2, muted: false, soloed: false, armed: true, clips: [], effects: [], inputDevice: 'default' },
        { id: crypto.randomUUID(), name: 'Vocals - Anitta', type: 'audio', color: '#ff00ff', volume: 0.78, pan: 0.2, muted: false, soloed: false, armed: true, clips: [], effects: [], inputDevice: 'default' },
        { id: crypto.randomUUID(), name: 'Drums', type: 'instrument', color: '#ff6b6b', volume: 0.85, pan: 0, muted: false, soloed: false, armed: false, clips: [], effects: [], instrument: 'drums-full' },
        { id: crypto.randomUUID(), name: 'Bass Synth', type: 'instrument', color: '#ffc800', volume: 0.7, pan: 0, muted: false, soloed: false, armed: false, clips: [], effects: [], instrument: 'synth-bass' },
        { id: crypto.randomUUID(), name: 'Melody Synth', type: 'instrument', color: '#8b5cf6', volume: 0.72, pan: 0, muted: false, soloed: false, armed: false, clips: [], effects: [], instrument: 'synth-lead' },
        { id: crypto.randomUUID(), name: 'Pad/Strings', type: 'instrument', color: '#00ccff', volume: 0.5, pan: 0, muted: false, soloed: false, armed: false, clips: [], effects: [], instrument: 'synth-pad' },
        { id: crypto.randomUUID(), name: 'FX/Ambient', type: 'audio', color: '#88ff00', volume: 0.4, pan: 0, muted: false, soloed: false, armed: false, clips: [], effects: [] }
      ];

      setTracks(defaultTracks);
      defaultTracks.forEach(track => {
        engine.createTrack(track.id);
        engine.setTrackVolume(track.id, track.volume);
        engine.setTrackPan(track.id, track.pan);
      });
    }
  }, []);

  useEffect(() => {
    pushUndoState({ tracks, transport, projectSettings });
  }, [tracks, transport, projectSettings, pushUndoState]);

  const hasAnySolo = tracks.some(t => t.soloed);
  const pixelsPerBeat = 20 + (zoomLevel / 100) * 80;
  const timelineWidth = Math.max(2000, pixelsPerBeat * 64);

  useKeyboardShortcuts({
    onPlay: handlePlay,
    onRecord: handleRecord,
    onUndo: handleUndo,
    onRedo: handleRedo,
    onDelete: () => {
      if (selectedClipId) {
        const track = tracks.find(t => t.clips.some(c => c.id === selectedClipId));
        if (track) handleDeleteClip(track.id, selectedClipId);
      }
    },
    onMute: () => selectedTrackId && updateTrack(selectedTrackId, { muted: !tracks.find(t => t.id === selectedTrackId)?.muted }),
    onSolo: () => selectedTrackId && updateTrack(selectedTrackId, { soloed: !tracks.find(t => t.id === selectedTrackId)?.soloed }),
    onArm: () => selectedTrackId && updateTrack(selectedTrackId, { armed: !tracks.find(t => t.id === selectedTrackId)?.armed }),
    onNavigateLeft: () => setTransport(prev => ({ ...prev, position: Math.max(0, prev.position - projectSettings.timeSignature[0]) })),
    onNavigateRight: () => setTransport(prev => ({ ...prev, position: prev.position + projectSettings.timeSignature[0] }))
  });

  return (
    <div className="h-screen w-full bg-neutral-950 text-neutral-100 overflow-hidden font-sans">
      <input ref={fileInputRef} type="file" accept=".ducklab,.json" onChange={handleFileLoad} className="hidden" />

      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border"
          style={{
            backgroundColor: notification.type === 'success' ? 'rgba(0, 255, 136, 0.1)' : notification.type === 'error' ? 'rgba(255, 68, 68, 0.1)' : 'rgba(0, 255, 255, 0.1)',
            borderColor: notification.type === 'success' ? '#00ff88' : notification.type === 'error' ? '#ff4444' : '#00ffff'
          }}
        >
          <span className="text-sm font-medium" style={{ color: notification.type === 'success' ? '#00ff88' : notification.type === 'error' ? '#ff4444' : '#00ffff' }}>
            {notification.message}
          </span>
        </div>
      )}

      <div className="fixed top-0 left-0 right-0 z-40 bg-neutral-950/80 border-b border-neutral-800 backdrop-blur-xl">
        <div className="max-w-full mx-auto px-3 py-1.5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <span className="font-bold text-lg text-primary tracking-tight">DUCK LAB</span>
            <span className="text-xs text-neutral-500 px-2 py-0.5 bg-neutral-800 rounded">MUSIC CREATOR</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleNewProject}
              className="p-2 rounded hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-neutral-100"
              aria-label="New Project"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={handleSaveProject}
              className="p-2 rounded hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-neutral-100"
              aria-label="Save Project"
            >
              <Save size={16} />
            </button>
            <button
              onClick={handleLoadProject}
              className="p-2 rounded hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-neutral-100"
              aria-label="Load Project"
            >
              <FolderOpen size={16} />
            </button>
            <button
              onClick={handleExportAudio}
              className="p-2 rounded hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-neutral-100"
              aria-label="Export Audio"
            >
              <Download size={16} />
            </button>
          </div>

          <div className="flex items-center gap-1 ml-4">
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              className="p-2 rounded hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Undo"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              className="p-2 rounded hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Redo"
            >
              <RotateCcw size={16} className="transform scale-x-[-1]" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-xs text-neutral-500 uppercase tracking-wider">Time</div>
                <div className="font-mono text-lg text-neutral-100 tabular-nums">
                  {(transport.position / (transport.bpm / 60) % 3600).toFixed(2).padStart(6, '0')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-neutral-500 uppercase tracking-wider">Beats</div>
                <div className="font-mono text-lg text-neutral-100 tabular-nums">
                  {Math.floor(transport.position / projectSettings.timeSignature[0]) + 1}:{Math.floor(transport.position % projectSettings.timeSignature[0]) + 1}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-neutral-900/50 rounded-lg px-3 py-1 border border-neutral-800">
              <label className="flex items-center gap-1 cursor-pointer text-xs text-neutral-400">
                <input type="checkbox" checked={metronomeEnabled} onChange={handleMetronomeToggle} className="w-4 h-4 accent-primary" />
                <Metronome size={12} />
              </label>
              <label className="flex items-center gap-1 cursor-pointer text-xs text-neutral-400 ml-2">
                <input type="checkbox" checked={countInEnabled} onChange={handleCountInToggle} className="w-4 h-4 accent-primary" />
                <Timer size={12} />
              </label>
              <label className="flex items-center gap-1 cursor-pointer text-xs text-neutral-400 ml-2">
                <input type="checkbox" checked={snapToGrid} onChange={(e) => setSnapToGrid(e.target.checked)} className="w-4 h-4 accent-primary" />
                <Settings size={12} />
              </label>
            </div>

            <select
              value={gridDivision}
              onChange={(e) => setGridDivision(parseInt(e.target.value) as 1 | 2 | 4 | 8 | 16 | 32)}
              className="bg-neutral-800/50 border border-neutral-700 rounded-lg px-3 py-1.5 text-sm text-neutral-100 focus:outline-none focus:border-primary/50"
              aria-label="Grid Division"
            >
              {GRID_DIVISIONS.map(d => (
                <option key={d} value={d}>1/{d}</option>
              ))}
            </select>

            <div className="flex items-center gap-2 ml-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="range"
                  min={ZOOM_MIN}
                  max={ZOOM_MAX}
                  value={zoomLevel}
                  onChange={(e) => setZoomLevel(parseInt(e.target.value))}
                  className="w-32 h-1.5 appearance-none bg-neutral-800 rounded-full cursor-pointer accent-primary"
                />
                <ZoomIn size={14} className="text-neutral-400" />
              </label>

              <div className="w-px h-8 bg-neutral-700 mx-2" />

              <label className="flex items-center gap-2 cursor-pointer">
                <Volume2 size={14} className="text-neutral-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={masterVolume}
                  onChange={(e) => handleMasterVolumeChange(parseFloat(e.target.value))}
                  className="w-24 h-1.5 appearance-none bg-neutral-800 rounded-full cursor-pointer accent-primary"
                />
              </label>

              <button
                onClick={handleSettingsOpen}
                className="p-2 rounded-lg hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-neutral-100 ml-2"
                aria-label="Settings"
              >
                <Settings size={18} />
              </button>

              <button
                onClick={handleHelpToggle}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  showHelp
                    ? 'bg-primary/20 text-primary'
                    : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800'
                )}
                aria-label={showHelp ? 'Hide Help' : 'Show Help'}
              >
                <HelpCircle size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 top-12 bottom-56 z-30 flex">
        <Panel
          position="left"
          collapsible
          defaultOpen={true}
          title="Tracks"
          icon={<LayoutDashboard size={18} />}
          width={320}
          minWidth={280}
          maxWidth={500}
        >
          <div className="h-full overflow-y-auto">
            {tracks.map((track, index) => (
              <TrackHeader
                key={track.id}
                track={track}
                index={index}
                isSelected={selectedTrackId === track.id}
                onSelect={() => handleTrackSelect(track.id)}
                onMute={() => updateTrack(track.id, { muted: !track.muted })}
                onSolo={() => updateTrack(track.id, { soloed: !track.soloed })}
                onArm={() => updateTrack(track.id, { armed: !track.armed })}
                onDelete={() => deleteTrack(track.id)}
                onDuplicate={() => duplicateTrack(track.id)}
                onNameChange={(name) => updateTrack(track.id, { name })}
                onVolumeChange={(volume) => updateTrack(track.id, { volume })}
                onPanChange={(pan) => updateTrack(track.id, { pan })}
                onInstrumentChange={(instrument) => updateTrack(track.id, { instrument })}
                onAddEffect={(effectType) => addEffect(track.id, effectType)}
                hasAnySolo={hasAnySolo}
                vuLevel={trackLevels[track.id] || 0}
                peakLevel={trackPeakLevelsRef.current[track.id] || 0}
              />
            ))}
          </div>
        </Panel>

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-hidden relative">
            <Timeline
              tracks={tracks}
              selectedTrackId={selectedTrackId}
              selectedClipId={selectedClipId}
              transportPosition={transport.position}
              isPlaying={transport.isPlaying}
              isRecording={transport.isRecording}
              loopStart={loopStart}
              loopEnd={loopEnd}
              zoomLevel={zoomLevel}
              pixelsPerBeat={pixelsPerBeat}
              snapToGrid={snapToGrid}
              gridDivision={gridDivision}
              onTrackSelect={handleTrackSelect}
              onClipSelect={handleClipSelect}
              onClipDragStart={handleClipDragStart}
              onClipDrag={handleClipDrag}
              onClipDragEnd={handleClipDragEnd}
              onClipResize={handleClipResize}
              onAddClip={handleAddClip}
              onDeleteClip={handleDeleteClip}
              onDuplicateClip={handleDuplicateClip}
              onSplitClip={handleSplitClip}
              onMuteClip={handleMuteClip}
              onLoopChange={handleLoopChange}
              onSetPosition={handleSetPosition}
            />
          </div>
        </div>

        <Panel
          position="right"
          collapsible
          defaultOpen={true}
          title="Samples"
          icon={<PackageIcon size={18} />}
          width={340}
          minWidth={300}
          maxWidth={500}
        >
          <SamplesPanel
            samples={SAMPLE_LIBRARY}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onCategoryChange={setSelectedCategory}
            onSearchChange={setSearchQuery}
            onSamplePreview={handleSamplePreview}
            onSampleDragStart={handleSampleDragStart}
            onSampleDrop={handleSampleDrop}
            isPreviewing={isPreviewingSample}
          />
        </Panel>
      </div>

      <Transport
        transport={transport}
        projectSettings={projectSettings}
        isInitialized={isInitialized}
        onPlay={handlePlay}
        onStop={handleStop}
        onRecord={handleRecord}
        onLoopToggle={handleLoopToggle}
        onMetronomeToggle={handleMetronomeToggle}
        onCountInToggle={handleCountInToggle}
        onSettingsOpen={handleSettingsOpen}
        onNewProject={handleNewProject}
        onSaveProject={handleSaveProject}
        onLoadProject={handleLoadProject}
        onExportAudio={handleExportAudio}
        onImportAudio={handleImportAudio}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        metronomeEnabled={metronomeEnabled}
        countInEnabled={countInEnabled}
        masterVolume={masterVolume}
        onMasterVolumeChange={handleMasterVolumeChange}
        showHelp={showHelp}
        onHelpToggle={handleHelpToggle}
      />

      {showHelp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <h2 className="text-xl font-bold text-neutral-100">Keyboard Shortcuts</h2>
              <button onClick={handleHelpToggle} className="p-2 rounded hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-neutral-100">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wider">Transport</h3>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <dt className="text-neutral-400">Space</dt><dd className="text-neutral-100">Play / Pause</dd>
                  <dt className="text-neutral-400">Ctrl+Enter</dt><dd className="text-neutral-100">Record</dd>
                  <dt className="text-neutral-400">Enter</dt><dd className="text-neutral-100">Stop</dd>
                  <dt className="text-neutral-400">L</dt><dd className="text-neutral-100">Toggle Loop</dd>
                </dl>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wider">Editing</h3>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <dt className="text-neutral-400">Ctrl+Z</dt><dd className="text-neutral-100">Undo</dd>
                  <dt className="text-neutral-400">Ctrl+Shift+Z / Ctrl+Y</dt><dd className="text-neutral-100">Redo</dd>
                  <dt className="text-neutral-400">Delete / Backspace</dt><dd className="text-neutral-100">Delete Selected Clip</dd>
                  <dt className="text-neutral-400">Ctrl+D</dt><dd className="text-neutral-100">Duplicate Track</dd>
                </dl>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wider">Track Controls (when track selected)</h3>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <dt className="text-neutral-400">M</dt><dd className="text-neutral-100">Mute</dd>
                  <dt className="text-neutral-400">S</dt><dd className="text-neutral-100">Solo</dd>
                  <dt className="text-neutral-400">R</dt><dd className="text-neutral-100">Arm for Recording</dd>
                </dl>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wider">Navigation</h3>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <dt className="text-neutral-400">← / →</dt><dd className="text-neutral-100">Move Playhead by Beat</dd>
                  <dt className="text-neutral-400">Ctrl+← / Ctrl+→</dt><dd className="text-neutral-100">Move Playhead by Bar</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <h2 className="text-xl font-bold text-neutral-100">Settings</h2>
              <button onClick={() => setShowSettings(false)} className="p-2 rounded hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-neutral-100">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">Audio</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Sample Rate</label>
                    <select
                      value={projectSettings.sampleRate}
                      onChange={(e) => setProjectSettings(prev => ({ ...prev, sampleRate: parseInt(e.target.value) }))}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-neutral-100 focus:outline-none focus:border-primary/50"
                    >
                      <option value={44100}>44.1 kHz</option>
                      <option value={48000}>48 kHz</option>
                      <option value={88200}>88.2 kHz</option>
                      <option value={96000}>96 kHz</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Bit Depth</label>
                    <select
                      value={projectSettings.bitDepth}
                      onChange={(e) => setProjectSettings(prev => ({ ...prev, bitDepth: parseInt(e.target.value) }))}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-neutral-100 focus:outline-none focus:border-primary/50"
                    >
                      <option value={16}>16-bit</option>
                      <option value={24}>24-bit</option>
                      <option value={32}>32-bit float</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">Project</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Project Name</label>
                    <input
                      type="text"
                      value={projectSettings.name}
                      onChange={(e) => setProjectSettings(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-neutral-100 focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">BPM</label>
                    <input
                      type="number"
                      min="20"
                      max="300"
                      value={projectSettings.bpm}
                      onChange={(e) => setProjectSettings(prev => ({ ...prev, bpm: parseInt(e.target.value) || prev.bpm }))}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-neutral-100 focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Time Signature</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="1"
                        max="16"
                        value={projectSettings.timeSignature[0]}
                        onChange={(e) => setProjectSettings(prev => ({ ...prev, timeSignature: [parseInt(e.target.value) || 4, prev.timeSignature[1]] }))}
                        className="w-1/2 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-neutral-100 focus:outline-none focus:border-primary/50 text-center"
                      />
                      <span className="flex items-center text-neutral-400">/</span>
                      <input
                        type="number"
                        min="1"
                        max="16"
                        value={projectSettings.timeSignature[1]}
                        onChange={(e) => setProjectSettings(prev => ({ ...prev, timeSignature: [prev.timeSignature[0], parseInt(e.target.value) || 4] }))}
                        className="w-1/2 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-neutral-100 focus:outline-none focus:border-primary/50 text-center"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Key</label>
                    <input
                      type="text"
                      value={projectSettings.key}
                      onChange={(e) => setProjectSettings(prev => ({ ...prev, key: e.target.value }))}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-neutral-100 focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">Appearance</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} className="w-4 h-4 accent-primary" />
                    <span className="text-neutral-100">Dark Mode</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={autoSaveEnabled} onChange={(e) => setAutoSaveEnabled(e.target.checked)} className="w-4 h-4 accent-primary" />
                    <span className="text-neutral-100">Auto-save</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {dragPreview && (
        <div
          className="fixed pointer-events-none z-50 bg-neutral-800 border border-primary/50 rounded-lg px-3 py-2 text-sm font-medium text-primary shadow-lg"
          style={{ left: dragPreview.x + 10, top: dragPreview.y + 10 }}
        >
          {dragPreview.sample.name}
        </div>
      )}
    </div>
  );
}
