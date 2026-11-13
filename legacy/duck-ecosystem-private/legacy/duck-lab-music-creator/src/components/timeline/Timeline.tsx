'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Trash2, GripVertical, Copy, Scissors, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import type { Clip, Track } from '@/types';

interface TimelineProps {
  tracks: Track[];
  selectedTrackId: string | null;
  selectedClipId: string | null;
  transportPosition: number;
  isPlaying: boolean;
  isRecording: boolean;
  loopStart: number;
  loopEnd: number;
  zoomLevel: number;
  pixelsPerBeat: number;
  snapToGrid: boolean;
  gridDivision: number;
  onTrackSelect: (trackId: string) => void;
  onClipSelect: (clipId: string | null) => void;
  onClipDragStart: (clipId: string, trackId: string, clientX: number, clipStart: number) => void;
  onClipDrag: (clientX: number) => void;
  onClipDragEnd: () => void;
  onClipResize: (clipId: string, trackId: string, newDuration: number) => void;
  onAddClip: (trackId: string, beat: number) => void;
  onDeleteClip: (trackId: string, clipId: string) => void;
  onDuplicateClip: (trackId: string, clipId: string) => void;
  onSplitClip: (trackId: string, clipId: string, beat: number) => void;
  onMuteClip: (trackId: string, clipId: string) => void;
  onLoopChange: (start: number, end: number) => void;
  onSetPosition: (beat: number) => void;
}

export function Timeline({
  tracks,
  selectedTrackId,
  selectedClipId,
  transportPosition,
  isPlaying,
  isRecording,
  loopStart,
  loopEnd,
  zoomLevel,
  pixelsPerBeat,
  snapToGrid,
  gridDivision,
  onTrackSelect,
  onClipSelect,
  onClipDragStart,
  onClipDrag,
  onClipDragEnd,
  onClipResize,
  onAddClip,
  onDeleteClip,
  onDuplicateClip,
  onSplitClip,
  onMuteClip,
  onLoopChange,
  onSetPosition
}: TimelineProps) {
  const timelineRef = React.useRef<HTMLDivElement>(null);
  const rulerRef = React.useRef<HTMLDivElement>(null);
  const [draggingLoopStart, setDraggingLoopStart] = React.useState(false);
  const [draggingLoopEnd, setDraggingLoopEnd] = React.useState(false);
  const [playheadPosition, setPlayheadPosition] = React.useState(0);

  React.useEffect(() => {
    setPlayheadPosition(transportPosition * pixelsPerBeat);
  }, [transportPosition, pixelsPerBeat]);

  const handleRulerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = rulerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const beat = (e.clientX - rect.left) / pixelsPerBeat;
    const snappedBeat = snapToGrid ? Math.round(beat / (1 / gridDivision)) * (1 / gridDivision) : beat;
    onSetPosition(Math.max(0, snappedBeat));
  };

  const handleLoopStartDrag = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDraggingLoopStart(true);
  };

  const handleLoopEndDrag = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDraggingLoopEnd(true);
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = rulerRef.current?.getBoundingClientRect();
      if (!rect) return;

      if (draggingLoopStart) {
        const beat = (e.clientX - rect.left) / pixelsPerBeat;
        const snappedBeat = snapToGrid ? Math.round(beat / (1 / gridDivision)) * (1 / gridDivision) : beat;
        onLoopChange(Math.max(0, snappedBeat), loopEnd);
      } else if (draggingLoopEnd) {
        const beat = (e.clientX - rect.left) / pixelsPerBeat;
        const snappedBeat = snapToGrid ? Math.round(beat / (1 / gridDivision)) * (1 / gridDivision) : beat;
        onLoopChange(loopStart, Math.max(loopStart + 1, snappedBeat));
      }
    };

    const handleMouseUp = () => {
      setDraggingLoopStart(false);
      setDraggingLoopEnd(false);
    };

    if (draggingLoopStart || draggingLoopEnd) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingLoopStart, draggingLoopEnd, loopStart, loopEnd, pixelsPerBeat, snapToGrid, gridDivision, onLoopChange]);

  const totalBeats = 64;
  const timelineWidth = Math.max(totalBeats * pixelsPerBeat, 2000);
  const beatsPerBar = 4;
  const bars = Math.ceil(totalBeats / beatsPerBar);

  return (
    <div className="flex-1 overflow-auto relative bg-neutral-950" ref={timelineRef}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          ref={rulerRef}
          className="h-8 bg-neutral-900/80 border-b border-neutral-800 sticky top-0 z-10 flex items-end px-3"
          onClick={handleRulerClick}
          style={{ backdropFilter: 'blur(8px)' }}
        >
          <div className="flex w-full h-full" style={{ width: timelineWidth }}>
            {Array.from({ length: bars }, (_, barIndex) => (
              <div key={barIndex} className="relative h-full w-full flex items-end" style={{ width: beatsPerBar * pixelsPerBeat }}>
                <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-700" />
                {Array.from({ length: beatsPerBar }, (_, beatIndex) => {
                  const beat = barIndex * beatsPerBar + beatIndex;
                  if (beat >= totalBeats) return null;
                  const isDownbeat = beatIndex === 0;
                  return (
                    <div
                      key={beat}
                      className="absolute bottom-0 w-px transition-colors"
                      style={{
                        height: isDownbeat ? '100%' : '40%',
                        left: beatIndex * pixelsPerBeat,
                        backgroundColor: isDownbeat ? '#333' : '#222'
                      }}
                    />
                  );
                })}
                <div className="absolute left-1 bottom-1 text-xs text-neutral-500 font-mono">
                  {barIndex + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-0 top-8 pointer-events-none">
          {tracks.map((track, trackIndex) => (
            <div
              key={track.id}
              className="absolute left-0 right-0 h-16 border-b border-neutral-800/50 flex items-center px-3"
              style={{
                top: 8 + trackIndex * 64,
                backgroundColor: trackIndex % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent'
              }}
            >
              {track.clips.map(clip => (
                <div
                  key={clip.id}
                  className="absolute h-12 rounded transition-all cursor-pointer"
                  style={{
                    left: clip.start * pixelsPerBeat,
                    width: Math.max(clip.duration * pixelsPerBeat, 8),
                    backgroundColor: clip.color + (clip.muted ? '60' : 'CC'),
                    borderColor: clip.color,
                    borderWidth: selectedClipId === clip.id ? 2 : 1,
                    borderStyle: 'solid',
                    opacity: clip.muted ? 0.5 : 1,
                    boxShadow: selectedClipId === clip.id ? `0 0 0 2px ${clip.color}, 0 4px 12px ${clip.color}40` : '0 2px 8px rgba(0,0,0,0.3)'
                  }}
                  onClick={(e) => { e.stopPropagation(); onClipSelect(clip.id); }}
                  onMouseDown={(e) => {
                    if (e.button === 0) {
                      e.stopPropagation();
                      onClipDragStart(clip.id, track.id, e.clientX, clip.start);
                    }
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-2 bg-black/20 flex items-center justify-between px-1">
                    <span className="text-xs text-neutral-300 truncate px-1 font-medium">{clip.name}</span>
                    <div className="flex items-center gap-1">
                      {!clip.muted && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onMuteClip(track.id, clip.id); }}
                          className="p-0.5 text-neutral-400 hover:text-neutral-100"
                          aria-label="Mute clip"
                        >
                          <Volume2 size={10} />
                        </button>
                      )}
                      {clip.muted && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onMuteClip(track.id, clip.id); }}
                          className="p-0.5 text-neutral-400 hover:text-neutral-100"
                          aria-label="Unmute clip"
                        >
                          <VolumeX size={10} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30" />
                  {clip.waveform && (
                    <div className="absolute top-2 bottom-2 left-2 right-2 overflow-hidden">
                      <svg width="100%" height="100%" viewBox={`0 0 ${clip.waveform.length} 100`} preserveAspectRatio="none">
                        <path
                          d={clip.waveform.map((v, i) => `${i === 0 ? 'M' : 'L'} ${i} ${50 - v * 40}`).join(' ')}
                          stroke={clip.color}
                          strokeWidth="0.5"
                          fill="none"
                          opacity="0.8"
                        />
                      </svg>
                    </div>
                  )}
                  <div
                    className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize bg-white/5 hover:bg-white/10 transition-colors"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {isPlaying && (
          <div
            className="absolute top-8 bottom-0 w-px bg-red-400 animate-pulse pointer-events-none z-20"
            style={{
              left: playheadPosition,
              boxShadow: '0 0 8px 2px rgba(255, 0, 0, 0.5)'
            }}
          >
            <div className="absolute -left-2 top-0 w-4 h-4 bg-red-400 rounded-full -translate-x-1/2 animate-pulse" />
          </div>
        )}

        {loopStart !== loopEnd && (
          <>
            <div
              className="absolute top-8 bottom-0 w-px bg-yellow-400 pointer-events-none z-10"
              style={{ left: loopStart * pixelsPerBeat }}
            >
              <div
                className="absolute -left-3 top-0 w-6 h-6 bg-yellow-400 rounded-full -translate-x-1/2 cursor-col-resize"
                onMouseDown={handleLoopStartDrag}
              />
            </div>
            <div
              className="absolute top-8 bottom-0 w-px bg-yellow-400 pointer-events-none z-10"
              style={{ left: loopEnd * pixelsPerBeat }}
            >
              <div
                className="absolute -left-3 top-0 w-6 h-6 bg-yellow-400 rounded-full -translate-x-1/2 cursor-col-resize"
                onMouseDown={handleLoopEndDrag}
              />
            </div>
            <div
              className="absolute top-8 bottom-0 bg-yellow-400/10 pointer-events-none z-5"
              style={{
                left: loopStart * pixelsPerBeat,
                width: (loopEnd - loopStart) * pixelsPerBeat
              }}
            />
          </>
        )}

        <div
          className="absolute inset-0 top-8 bg-neutral-900/50 pointer-events-none"
          style={{ backgroundImage: `linear-gradient(90deg, transparent 50%, rgba(255,255,255,0.01) 50%)`, backgroundSize: `${pixelsPerBeat * 4}px 100%` }}
        />
      </div>

      <div className="relative z-0" style={{ width: timelineWidth, minHeight: tracks.length * 64 + 8 }}>
        {tracks.map((track, trackIndex) => (
          <div
            key={track.id}
            className="relative h-16 border-b border-neutral-800/50"
            style={{
              backgroundColor: trackIndex % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent'
            }}
            onClick={() => onTrackSelect(track.id)}
            onDoubleClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const beat = (e.clientX - rect.left) / pixelsPerBeat;
              const snappedBeat = snapToGrid ? Math.round(beat / (1 / gridDivision)) * (1 / gridDivision) : beat;
              onAddClip(track.id, snappedBeat);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
            }}
          >
            {track.clips.map(clip => (
              <div
                key={clip.id}
                className="absolute h-12 rounded transition-all cursor-pointer select-none"
                style={{
                  left: clip.start * pixelsPerBeat,
                  width: Math.max(clip.duration * pixelsPerBeat, 8),
                  backgroundColor: clip.color + (clip.muted ? '60' : 'CC'),
                  borderColor: clip.color,
                  borderWidth: selectedClipId === clip.id ? 2 : 1,
                  borderStyle: 'solid',
                  opacity: clip.muted ? 0.5 : 1,
                  boxShadow: selectedClipId === clip.id ? `0 0 0 2px ${clip.color}, 0 4px 12px ${clip.color}40` : '0 2px 8px rgba(0,0,0,0.3)',
                  zIndex: selectedClipId === clip.id ? 10 : 1
                }}
                onClick={(e) => { e.stopPropagation(); onClipSelect(clip.id); }}
                onMouseDown={(e) => {
                  if (e.button === 0) {
                    e.stopPropagation();
                    onClipDragStart(clip.id, track.id, e.clientX, clip.start);
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-2 bg-black/20 flex items-center justify-between px-1">
                  <span className="text-xs text-neutral-300 truncate px-1 font-medium">{clip.name}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!clip.muted && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onMuteClip(track.id, clip.id); }}
                        className="p-0.5 text-neutral-400 hover:text-neutral-100"
                        aria-label="Mute clip"
                      >
                        <Volume2 size={10} />
                      </button>
                    )}
                    {clip.muted && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onMuteClip(track.id, clip.id); }}
                        className="p-0.5 text-neutral-400 hover:text-neutral-100"
                        aria-label="Unmute clip"
                      >
                        <VolumeX size={10} />
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); onDuplicateClip(track.id, clip.id); }}
                      className="p-0.5 text-neutral-400 hover:text-neutral-100"
                      aria-label="Duplicate clip"
                    >
                      <Copy size={10} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteClip(track.id, clip.id); }}
                      className="p-0.5 text-neutral-400 hover:text-red-400"
                      aria-label="Delete clip"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30" />
                {clip.waveform && (
                  <div className="absolute top-2 bottom-2 left-2 right-2 overflow-hidden">
                    <svg width="100%" height="100%" viewBox={`0 0 ${clip.waveform.length} 100`} preserveAspectRatio="none">
                      <path
                        d={clip.waveform.map((v, i) => `${i === 0 ? 'M' : 'L'} ${i} ${50 - v * 40}`).join(' ')}
                        stroke={clip.color}
                        strokeWidth="0.5"
                        fill="none"
                        opacity="0.8"
                      />
                    </svg>
                  </div>
                )}
                <div
                  className="absolute left-0 top-0 bottom-0 w-2 cursor-w-resize bg-transparent hover:bg-white/5"
                  onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
                />
                <div
                  className="absolute right-0 top-0 bottom-0 w-2 cursor-e-resize bg-transparent hover:bg-white/5"
                  onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
