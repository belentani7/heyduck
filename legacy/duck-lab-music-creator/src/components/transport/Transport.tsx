'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Play, Pause, Square, SkipBack, SkipForward, RotateCcw, Repeat, Repeat1, Circle, CircleDot, Metronome, Timer, Clock, Settings, Zap, Download, Upload, FolderOpen, Save, Trash2, Plus, Minus, ChevronDown, ChevronUp, HelpCircle, Info, AlertCircle, CheckCircle, XCircle, Volume2, VolumeX, Mic, MicOff, RecordCircle } from 'lucide-react';
import type { TransportState, ProjectSettings } from '@/types';

interface TransportProps {
  transport: TransportState;
  projectSettings: ProjectSettings;
  isInitialized: boolean;
  onPlay: () => void;
  onStop: () => void;
  onRecord: () => void;
  onLoopToggle: () => void;
  onMetronomeToggle: () => void;
  onCountInToggle: () => void;
  onSettingsOpen: () => void;
  onNewProject: () => void;
  onSaveProject: () => void;
  onLoadProject: () => void;
  onExportAudio: () => void;
  onImportAudio: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  metronomeEnabled: boolean;
  countInEnabled: boolean;
  masterVolume: number;
  onMasterVolumeChange: (volume: number) => void;
  showHelp: boolean;
  onHelpToggle: () => void;
}

export function Transport({
  transport,
  projectSettings,
  isInitialized,
  onPlay,
  onStop,
  onRecord,
  onLoopToggle,
  onMetronomeToggle,
  onCountInToggle,
  onSettingsOpen,
  onNewProject,
  onSaveProject,
  onLoadProject,
  onExportAudio,
  onImportAudio,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  metronomeEnabled,
  countInEnabled,
  masterVolume,
  onMasterVolumeChange,
  showHelp,
  onHelpToggle
}: TransportProps) {
  const [showFileMenu, setShowFileMenu] = React.useState(false);
  const [showEditMenu, setShowEditMenu] = React.useState(false);
  const [showViewMenu, setShowViewMenu] = React.useState(false);
  const [showProjectMenu, setShowProjectMenu] = React.useState(false);

  const formatTime = (beats: number, bpm: number) => {
    const seconds = (beats / (bpm / 60)) % 3600;
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const formatBeats = (beats: number, timeSig: [number, number]) => {
    const beatsPerBar = timeSig[0];
    const bar = Math.floor(beats / beatsPerBar) + 1;
    const beat = Math.floor(beats % beatsPerBar) + 1;
    return `${bar}:${beat.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-950/95 border-t border-neutral-800 backdrop-blur-xl">
      <div className="max-w-full mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-neutral-900/50 rounded-lg p-1 border border-neutral-800">
              <button
                onClick={onNewProject}
                className="p-2 rounded hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-neutral-100"
                aria-label="New Project"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={onSaveProject}
                className="p-2 rounded hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-neutral-100"
                aria-label="Save Project"
              >
                <Save size={16} />
              </button>
              <button
                onClick={onLoadProject}
                className="p-2 rounded hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-neutral-100"
                aria-label="Load Project"
              >
                <FolderOpen size={16} />
              </button>
              <button
                onClick={onExportAudio}
                className="p-2 rounded hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-neutral-100"
                aria-label="Export Audio"
              >
                <Download size={16} />
              </button>
              <button
                onClick={onImportAudio}
                className="p-2 rounded hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-neutral-100"
                aria-label="Import Audio"
              >
                <Upload size={16} />
              </button>
            </div>

            <div className="flex items-center gap-1 bg-neutral-900/50 rounded-lg p-1 border border-neutral-800 ml-2">
              <button
                onClick={onUndo}
                disabled={!canUndo}
                className="p-2 rounded hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Undo"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={onRedo}
                disabled={!canRedo}
                className="p-2 rounded hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Redo"
              >
                <RotateCcw size={16} className="transform scale-x-[-1]" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 bg-neutral-900/50 rounded-lg px-4 py-2 border border-neutral-800">
              <div className="flex items-center gap-1">
                <button
                  onClick={onStop}
                  className={cn(
                    'p-2 rounded-lg transition-all',
                    transport.isPlaying || transport.isRecording
                      ? 'bg-neutral-800 text-neutral-100'
                      : 'bg-neutral-800/50 text-neutral-500 hover:text-neutral-100 hover:bg-neutral-800'
                  )}
                  aria-label="Stop"
                  disabled={!transport.isPlaying && !transport.isRecording}
                >
                  <Square size={18} />
                </button>

                <button
                  onClick={onPlay}
                  disabled={!isInitialized}
                  className={cn(
                    'p-3 rounded-xl transition-all shadow-lg',
                    transport.isPlaying
                      ? 'bg-red-500/20 text-red-400 ring-2 ring-red-500/30 animate-pulse'
                      : 'bg-primary text-neutral-950 hover:bg-primary/80'
                  )}
                  aria-label={transport.isPlaying ? 'Pause' : 'Play'}
                  disabled={!isInitialized}
                >
                  {transport.isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>

                <button
                  onClick={onRecord}
                  className={cn(
                    'p-3 rounded-xl transition-all shadow-lg',
                    transport.isRecording
                      ? 'bg-red-500 text-white ring-2 ring-red-500/50 animate-pulse'
                      : 'bg-neutral-800/50 text-neutral-400 hover:bg-red-500/20 hover:text-red-400 hover:ring-2 hover:ring-red-500/30'
                  )}
                  aria-label={transport.isRecording ? 'Stop Recording' : 'Record'}
                  disabled={!isInitialized}
                >
                  <RecordCircle size={24} />
                </button>

                <button
                  onClick={onLoopToggle}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    transport.isLooping
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-neutral-800/50 text-neutral-500 hover:text-neutral-100 hover:bg-neutral-800'
                  )}
                  aria-label={transport.isLooping ? 'Disable Loop' : 'Enable Loop'}
                >
                  <Repeat size={18} />
                </button>
              </div>

              <div className="flex items-center gap-4 ml-4">
                <div className="text-center">
                  <div className="text-xs text-neutral-500 uppercase tracking-wider">Time</div>
                  <div className="font-mono text-lg text-neutral-100 tabular-nums">
                    {formatTime(transport.position, transport.bpm)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-neutral-500 uppercase tracking-wider">Beats</div>
                  <div className="font-mono text-lg text-neutral-100 tabular-nums">
                    {formatBeats(transport.position, projectSettings.timeSignature)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-neutral-500 uppercase tracking-wider">BPM</div>
                  <div className="font-mono text-lg text-neutral-100 tabular-nums w-16">
                    <input
                      type="number"
                      value={transport.bpm}
                      onChange={(e) => {
                        const val = Math.max(20, Math.min(300, parseInt(e.target.value) || transport.bpm));
                        // This would need a callback to update transport BPM
                      }}
                      onBlur={(e) => {
                        const val = Math.max(20, Math.min(300, parseInt(e.target.value) || transport.bpm));
                        // Update BPM
                      }}
                      className="bg-transparent border-none text-center text-neutral-100 font-mono focus:outline-none w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-neutral-900/50 rounded-lg p-1 border border-neutral-800">
              <button
                onClick={onMetronomeToggle}
                className={cn(
                  'p-2 rounded transition-colors',
                  metronomeEnabled
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'text-neutral-500 hover:text-neutral-100 hover:bg-neutral-800'
                )}
                aria-label={metronomeEnabled ? 'Disable Metronome' : 'Enable Metronome'}
              >
                <Metronome size={16} />
              </button>
              <button
                onClick={onCountInToggle}
                className={cn(
                  'p-2 rounded transition-colors',
                  countInEnabled
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-neutral-500 hover:text-neutral-100 hover:bg-neutral-800'
                )}
                aria-label={countInEnabled ? 'Disable Count-in' : 'Enable Count-in'}
              >
                <Timer size={16} />
              </button>
            </div>

            <div className="flex items-center gap-2 ml-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={masterVolume}
                  onChange={(e) => onMasterVolumeChange(parseFloat(e.target.value))}
                  className="w-24 h-1.5 appearance-none bg-neutral-800 rounded-full cursor-pointer accent-primary"
                />
                <Volume2 size={16} className="text-neutral-400" />
              </label>

              <button
                onClick={onSettingsOpen}
                className="p-2 rounded-lg hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-neutral-100"
                aria-label="Settings"
              >
                <Settings size={18} />
              </button>

              <button
                onClick={onHelpToggle}
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
    </div>
  );
}
