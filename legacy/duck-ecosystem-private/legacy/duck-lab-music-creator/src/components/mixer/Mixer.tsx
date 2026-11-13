'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Volume2, VolumeX, Headphones, Monitor, Circle, Sliders, Zap, Trash2, Copy, GripVertical, MoreHorizontal, ChevronUp, ChevronDown, Minus, Plus, Settings, Mic, MicOff, PanoramaHorizontal } from 'lucide-react';
import type { Track, Effect } from '@/types';
import { TrackHeader, TrackEffectsPanel } from '@/components/tracks/TrackHeader';

interface MixerProps {
  tracks: Track[];
  selectedTrackId: string | null;
  hasAnySolo: boolean;
  masterVolume: number;
  masterVuLevel: number;
  masterPeakLevel: number;
  trackLevels: Record<string, number>;
  trackPeakLevels: Record<string, number>;
  onTrackSelect: (trackId: string) => void;
  onMuteTrack: (trackId: string) => void;
  onSoloTrack: (trackId: string) => void
  onArmTrack: (trackId: string) => void
  onDeleteTrack: (trackId: string) => void
  onDuplicateTrack: (trackId: string) => void
  onTrackNameChange: (trackId: string, name: string) => void
  onTrackVolumeChange: (trackId: string, volume: number) => void
  onTrackPanChange: (trackId: string, pan: number) => void
  onTrackInstrumentChange: (trackId: string, instrument: Track['instrument']) => void
  onAddEffect: (trackId: string, effectType: Effect['type']) => void
  onToggleEffect: (trackId: string, effectId: string) => void
  onRemoveEffect: (trackId: string, effectId: string) => void
  onUpdateEffectParam: (trackId: string, effectId: string, param: string, value: number) => void
  onMasterVolumeChange: (volume: number) => void
}

export function Mixer({
  tracks,
  selectedTrackId,
  hasAnySolo,
  masterVolume,
  masterVuLevel,
  masterPeakLevel,
  trackLevels,
  trackPeakLevels,
  onTrackSelect,
  onMuteTrack,
  onSoloTrack,
  onArmTrack,
  onDeleteTrack,
  onDuplicateTrack,
  onTrackNameChange,
  onTrackVolumeChange,
  onTrackPanChange,
  onTrackInstrumentChange,
  onAddEffect,
  onToggleEffect,
  onRemoveEffect,
  onUpdateEffectParam,
  onMasterVolumeChange
}: MixerProps) {
  const [showMasterDetails, setShowMasterDetails] = React.useState(false);

  return (
    <div className="h-full overflow-y-auto space-y-4 pb-8">
      <div className="grid grid-cols-1 gap-4">
        {tracks.map((track, index) => (
          <div key={track.id} className="relative">
            <TrackHeader
              track={track}
              index={index}
              isSelected={selectedTrackId === track.id}
              onSelect={() => onTrackSelect(track.id)}
              onMute={() => onMuteTrack(track.id)}
              onSolo={() => onSoloTrack(track.id)}
              onArm={() => onArmTrack(track.id)}
              onDelete={() => onDeleteTrack(track.id)}
              onDuplicate={() => onDuplicateTrack(track.id)}
              onNameChange={(name) => onTrackNameChange(track.id, name)}
              onVolumeChange={(volume) => onTrackVolumeChange(track.id, volume)}
              onPanChange={(pan) => onTrackPanChange(track.id, pan)}
              onInstrumentChange={(instrument) => onTrackInstrumentChange(track.id, instrument)}
              onAddEffect={(effectType) => onAddEffect(track.id, effectType)}
              hasAnySolo={hasAnySolo}
              vuLevel={trackLevels[track.id] || 0}
              peakLevel={trackPeakLevels[track.id] || 0}
            />

            {selectedTrackId === track.id && track.effects.length > 0 && (
              <TrackEffectsPanel
                track={track}
                onToggleEffect={(effectId) => onToggleEffect(track.id, effectId)}
                onRemoveEffect={(effectId) => onRemoveEffect(track.id, effectId)}
                onUpdateEffectParam={(effectId, param, value) => onUpdateEffectParam(track.id, effectId, param, value)}
                onAddEffect={(effectType) => onAddEffect(track.id, effectType)}
              />
            )}
          </div>
        )}

        <div className="border-t border-neutral-800 pt-4 mt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 w-40">
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={masterVolume}
                    onChange={(e) => onMasterVolumeChange(parseFloat(e.target.value))}
                    className="w-20 h-1.5 appearance-none bg-neutral-800 rounded-full cursor-pointer accent-primary"
                  />
                  <Volume2 size={16} className="text-neutral-400" />
                </label>
              </div>
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-4 w-64 justify-end">
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="text-xs text-neutral-500 uppercase tracking-wider">Master</div>
                  <div className="font-mono text-sm text-neutral-100 tabular-nums">
                    {Math.round(masterVolume * 100)}%
                  </div>
                </div>

                <div className="relative h-32 w-8">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-full bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary via-primary/50 to-transparent transition-all duration-50 ease-out"
                      style={{ height: `${masterVuLevel * 100}%` }}
                    />
                    {masterPeakLevel > 0.9 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-400 animate-pulse" />
                    )}
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-px bg-red-400/50" style={{ bottom: `${masterPeakLevel * 100}%` }} />
                </div>

                <div className="text-center">
                  <div className="text-xs text-neutral-500 uppercase tracking-wider">Peak</div>
                  <div className="font-mono text-sm text-neutral-100 tabular-nums">
                    {masterPeakLevel > 0.99 ? 'CLIP' : `${Math.round(masterPeakLevel * 100)}%`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
