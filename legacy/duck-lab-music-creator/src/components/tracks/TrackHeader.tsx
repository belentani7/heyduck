'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Mic, MicOff, Volume2, VolumeX, Headphones, Monitor, Circle, Square, MousePointer2, Trash2, Copy, GripVertical, MoreHorizontal, Sliders, Zap, Piano, Drum, Guitar, Music, Wind, Droplets, Flame, Box, Package, Radio, Activity, Waves, Music2, Music4, CircleDot, Hexagon, Triangle, Mic2, Package as PackageIcon } from 'lucide-react';
import type { Track, InstrumentType, Effect } from '@/types';
import { INSTRUMENTS } from '@/constants';

interface TrackHeaderProps {
  track: Track;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onMute: () => void;
  onSolo: () => void;
  onArm: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onNameChange: (name: string) => void;
  onVolumeChange: (volume: number) => void;
  onPanChange: (pan: number) => void;
  onInstrumentChange: (instrument: InstrumentType) => void;
  onAddEffect: (effectType: Effect['type']) => void;
  hasAnySolo: boolean;
  vuLevel: number;
  peakLevel: number;
}

const INSTRUMENT_ICONS: Record<InstrumentType, React.ReactNode> = {
  'synth-lead': <Zap size={14} />,
  'synth-pad': <Waves size={14} />,
  'synth-bass': <Activity size={14} />,
  'synth-basic': <Radio size={14} />,
  'piano-acoustic': <Piano size={14} />,
  'piano-electric': <Music2 size={14} />,
  'organ': <Music2 size={14} />,
  'strings': <Guitar size={14} />,
  'brass': <Wind size={14} />,
  'guitar-acoustic': <Guitar size={14} />,
  'guitar-electric': <Guitar size={14} />,
  'bass': <Music4 size={14} />,
  'drums-full': <Drum size={14} />,
  'drums-kick': <CircleDot size={14} />,
  'drums-snare': <Box size={14} />,
  'drums-hihat': <Hexagon size={14} />,
  'percussion': <Triangle size={14} />,
  'vocals': <Mic2 size={14} />,
  'sampler': <PackageIcon size={14} />,
  'custom': <Sliders size={14} />
};

export function TrackHeader({
  track,
  index,
  isSelected,
  onSelect,
  onMute,
  onSolo,
  onArm,
  onDelete,
  onDuplicate,
  onNameChange,
  onVolumeChange,
  onPanChange,
  onInstrumentChange,
  onAddEffect,
  hasAnySolo,
  vuLevel,
  peakLevel
}: TrackHeaderProps) {
  const [showEffects, setShowEffects] = React.useState(false);
  const [showInstrumentMenu, setShowInstrumentMenu] = React.useState(false);
  const [editingName, setEditingName] = React.useState(false);
  const nameInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (editingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [editingName]);

  const handleNameBlur = () => {
    setEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      handleNameBlur();
    }
  };

  const isMutedBySolo = hasAnySolo && !track.soloed;

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2 transition-all duration-200',
        'border-b border-neutral-800',
        isSelected && 'bg-primary/10 border-l-2 border-l-primary',
        track.muted && 'opacity-50',
        isMutedBySolo && 'opacity-30'
      )}
      style={{ backgroundColor: track.color + '10', borderLeftColor: track.color }
      onClick={onSelect}
    >
      <div className="flex items-center gap-2 w-10">
        <span className="text-xs text-neutral-500 font-mono tabular-nums w-8 text-right">{index + 1}</span>
        <div
          className="w-3 h-3 rounded-full border-2 flex-shrink-0 transition-all"
          style={{
            borderColor: track.color,
            backgroundColor: track.muted ? 'transparent' : track.color,
            boxShadow: track.muted ? 'none' : `0 0 8px ${track.color}`
          }}
        />
      </div>

      <div className="flex-1 min-w-0 flex items-center gap-2">
        {editingName ? (
          <input
            ref={nameInputRef}
            type="text"
            value={track.name}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={handleNameKeyDown}
            className="bg-neutral-800 border-none text-neutral-100 text-sm font-medium focus:outline-none w-full min-w-0 px-1"
            style={{ color: track.color }}
          />
        ) : (
          <span
            onDoubleClick={(e) => { e.stopPropagation(); setEditingName(true); }}
            className="text-sm font-medium text-neutral-100 truncate cursor-text"
            style={{ color: track.color }}
          >
            {track.name}
          </span>
        )}

        {track.type === 'instrument' && track.instrument && (
          <button
            onClick={(e) => { e.stopPropagation(); setShowInstrumentMenu(!showInstrumentMenu); }}
            className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
            style={{ borderColor: track.color }}
          >
            {INSTRUMENT_ICONS[track.instrument] || <Music size={12} />}
            <span className="text-neutral-400">{track.instrument.replace('-', ' ')}</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-1">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={track.volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-24 h-1.5 appearance-none bg-neutral-800 rounded-full cursor-pointer accent-primary"
          style={{ color: track.color }}
        />
        <span className="text-xs text-neutral-500 w-10 text-right font-mono tabular-nums">
          {Math.round(track.volume * 100)}%
        </span>
      </div>

      <div className="flex items-center gap-1">
        <input
          type="range"
          min="-1"
          max="1"
          step="0.01"
          value={track.pan}
          onChange={(e) => onPanChange(parseFloat(e.target.value))}
          className="w-16 h-1.5 appearance-none bg-neutral-800 rounded-full cursor-pointer accent-primary"
          style={{ color: track.color }}
        />
        <span className="text-xs text-neutral-500 w-8 text-right font-mono tabular-nums">
          {track.pan > 0 ? 'R' : track.pan < 0 ? 'L' : 'C'}{Math.abs(Math.round(track.pan * 100))}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={(e) => { e.stopPropagation(); onMute(); }}
          className={cn(
            'p-1.5 rounded transition-colors',
            track.muted ? 'bg-red-500/20 text-red-400' : 'text-neutral-500 hover:text-neutral-100 hover:bg-neutral-800'
          )}
          aria-label={track.muted ? 'Unmute' : 'Mute'}
        >
          {track.muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onSolo(); }}
          className={cn(
            'p-1.5 rounded transition-colors',
            track.soloed ? 'bg-yellow-500/20 text-yellow-400' : 'text-neutral-500 hover:text-neutral-100 hover:bg-neutral-800'
          )}
          aria-label={track.soloed ? 'Unsolo' : 'Solo'}
        >
          <Headphones size={14} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onArm(); }}
          className={cn(
            'p-1.5 rounded transition-colors',
            track.armed ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-neutral-500 hover:text-neutral-100 hover:bg-neutral-800'
          )}
          aria-label={track.armed ? 'Disarm' : 'Arm for recording'}
        >
          <Circle className={cn(track.armed && 'fill-current')} size={14} />
        </button>
      </div>

      <div className="flex items-center gap-1 ml-2">
        <button
          onClick={(e) => { e.stopPropagation(); setShowEffects(!showEffects); }}
          className={cn(
            'p-1.5 rounded transition-colors',
            track.effects.length > 0 ? 'text-primary hover:bg-primary/10' : 'text-neutral-500 hover:text-neutral-100 hover:bg-neutral-800'
          )}
          aria-label="Effects"
        >
          <Zap size={14} />
          {track.effects.length > 0 && (
            <span className="text-xs text-primary ml-0.5">{track.effects.length}</span>
          )}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
          className="p-1.5 rounded transition-colors text-neutral-500 hover:text-neutral-100 hover:bg-neutral-800"
          aria-label="Duplicate track"
        >
          <Copy size={14} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1.5 rounded transition-colors text-neutral-500 hover:text-red-400 hover:bg-red-500/10"
          aria-label="Delete track"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex items-center gap-1 ml-2">
        <div className="flex items-center gap-1 bg-neutral-800/50 rounded px-2 py-1">
          <div
            className="h-4 w-16 relative bg-neutral-900 rounded overflow-hidden"
            style={{ borderColor: track.color }}
          >
            <div
              className="h-full bg-primary/50 transition-all duration-50 ease-out"
              style={{ width: `${vuLevel * 100}%`, backgroundColor: track.color }}
            />
            <div
              className="absolute top-0 right-0 w-px h-full bg-yellow-400/80 transition-opacity duration-100"
              style={{
                left: `${Math.min(vuLevel, 1) * 100}%`,
                opacity: peakLevel > 0.9 ? 1 : 0
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface TrackEffectsPanelProps {
  track: Track;
  onToggleEffect: (effectId: string) => void;
  onRemoveEffect: (effectId: string) => void;
  onUpdateEffectParam: (effectId: string, param: string, value: number) => void;
  onAddEffect: (effectType: Effect['type']) => void;
}

export function TrackEffectsPanel({ track, onToggleEffect, onRemoveEffect, onUpdateEffectParam, onAddEffect }: TrackEffectsPanelProps) {
  const [expandedEffectId, setExpandedEffectId] = React.useState<string | null>(null);

  return (
    <div className="mt-2 space-y-2 border-t border-neutral-800 pt-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Effects</span>
        <button
          onClick={(e) => { e.stopPropagation(); onAddEffect('eq'); }}
          className="text-xs text-primary hover:text-primary/70 flex items-center gap-1"
        >
          <span>+ Add</span>
        </button>
      </div>

      {track.effects.length === 0 && (
        <div className="text-center py-4 text-neutral-500 text-sm">
          No effects. Click + Add to insert an effect.
        </div>
      )}

      {track.effects.map((effect, index) => (
        <div
          key={effect.id}
          className={cn(
            'bg-neutral-800/50 rounded-lg p-3 transition-all',
            effect.enabled ? 'border-l-2' : 'opacity-50 border-l-2 border-transparent'
          )}
          style={{ borderLeftColor: effect.enabled ? track.color : undefined }}
        >
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => onToggleEffect(effect.id)}
              className={cn(
                'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                effect.enabled
                  ? 'bg-primary border-primary'
                  : 'border-neutral-600 text-transparent'
              )}
              style={{ borderColor: effect.enabled ? track.color : undefined }}
            >
              {effect.enabled && <span className="text-xs text-white">✓</span>}
            </button>
            <span className="text-sm font-medium text-neutral-100 flex-1 truncate">{effect.name}</span>
            <span className="text-xs text-neutral-500">{effect.type.toUpperCase()}</span>
            <button
              onClick={() => onRemoveEffect(effect.id)}
              className="p-1 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
              aria-label="Remove effect"
            >
              <X size={14} />
            </button>
          </div>

          <button
            onClick={() => setExpandedEffectId(expandedEffectId === effect.id ? null : effect.id)}
            className="w-full text-left text-xs text-neutral-500 hover:text-neutral-300 flex items-center justify-between py-1"
          >
            {expandedEffectId === effect.id ? '▼ Parameters' : '▶ Parameters'}
          </button>

          {expandedEffectId === effect.id && (
            <div className="mt-2 space-y-2 pt-2 border-t border-neutral-700">
              {Object.entries(effect.params).map(([param, value]) => (
                <div key={param} className="flex items-center gap-2">
                  <label className="text-xs text-neutral-400 w-24 capitalize">{param.replace(/([A-Z])/g, ' $1')}</label>
                  <input
                    type="range"
                    min={param.includes('Freq') ? 20 : param.includes('Time') || param.includes('Delay') ? 0 : -60}
                    max={param.includes('Freq') ? 20000 : param.includes('Time') || param.includes('Delay') ? 5000 : 24}
                    step={param.includes('Freq') ? 1 : param.includes('Gain') || param.includes('Level') ? 0.1 : 1}
                    value={value}
                    onChange={(e) => onUpdateEffectParam(effect.id, param, parseFloat(e.target.value))}
                    className="flex-1 h-1.5 appearance-none bg-neutral-700 rounded-full cursor-pointer accent-primary"
                    style={{ color: track.color }}
                  />
                  <span className="text-xs text-neutral-400 w-12 text-right font-mono">
                    {param.includes('Freq') && value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toFixed(param.includes('Gain') || param.includes('Level') ? 1 : 0)}
                    {param.includes('Time') || param.includes('Delay') ? 'ms' : param.includes('Freq') ? 'Hz' : 'dB'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
