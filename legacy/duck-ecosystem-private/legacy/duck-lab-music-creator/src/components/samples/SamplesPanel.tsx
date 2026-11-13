'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Search, Filter, X, Play, Volume2, Plus, Loader2, Music, Drum, Guitar, Piano, Waves, Zap, Mic, Box, Package, CircleDot, Hexagon, Triangle, Wind, Droplets, Flame, Box as BoxIcon, Package as PackageIcon, Repeat, Music2, Music4, CircleDot as CircleDotIcon, Triangle as TriangleIcon } from 'lucide-react';
import type { Sample, SampleCategory } from '@/types';
import { SAMPLE_LIBRARY, SAMPLE_CATEGORIES } from '@/constants';

interface SamplesPanelProps {
  samples: Sample[];
  selectedCategory: SampleCategory | 'all';
  searchQuery: string;
  onCategoryChange: (category: SampleCategory | 'all') => void;
  onSearchChange: (query: string) => void;
  onSamplePreview: (sample: Sample) => void;
  onSampleDragStart: (sample: Sample, clientX: number, clientY: number) => void;
  onSampleDrop: (sample: Sample, trackId: string) => void;
  isPreviewing: string | null;
}

const CATEGORY_ICONS: Record<SampleCategory, React.ReactNode> = {
  drums: <Drum size={16} />,
  percussion: <Triangle size={16} />,
  bass: <Music4 size={16} />,
  melody: <Music size={16} />,
  vocals: <Mic size={16} />,
  fx: <Zap size={16} />,
  loops: <Repeat size={16} />,
  oneshots: <CircleDotIcon size={16} />,
  ambient: <Waves size={16} />,
  nature: <Flame size={16} />
};

export function SamplesPanel({
  samples,
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
  onSamplePreview,
  onSampleDragStart,
  onSampleDrop,
  isPreviewing
}: SamplesPanelProps) {
  const filteredSamples = React.useMemo(() => {
    let filtered = samples;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    return filtered;
  }, [samples, selectedCategory, searchQuery]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search samples..."
            className="w-full bg-neutral-800/50 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
          />
        </div>
        <button
          onClick={() => onCategoryChange('all')}
          className="p-2 rounded-lg hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-neutral-100"
          aria-label="Clear filter"
        >
          <Filter className="size-5" />
        </button>
      </div>

      <div className="flex gap-1 mb-4 overflow-x-auto pb-2">
        {SAMPLE_CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(selectedCategory === cat.value ? 'all' : cat.value)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
              selectedCategory === cat.value
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-neutral-800/50 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100 border border-neutral-700'
            )}
          >
            {CATEGORY_ICONS[cat.value]}
            <span>{cat.label}</span>
            {selectedCategory === cat.value && <X size={12} />}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredSamples.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
            <Music className="size-12 mb-3 opacity-30" />
            <p className="text-sm">No samples found</p>
            <p className="text-xs text-neutral-600">Try adjusting your search or filter</p>
          </div>
        ) : (
          filteredSamples.map(sample => (
            <div
              key={sample.id}
              className={cn(
                'group relative bg-neutral-800/50 border border-neutral-700 rounded-lg p-3 transition-all hover:border-primary/50 hover:bg-neutral-800',
                isPreviewing === sample.id && 'border-primary/50 bg-primary/5 ring-1 ring-primary/20'
              )}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/sample', JSON.stringify(sample));
                e.dataTransfer.effectAllowed = 'copy';
                onSampleDragStart(sample, e.clientX, e.clientY);
              }}
              onClick={() => onSamplePreview(sample)}
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg flex-shrink-0" style={{ backgroundColor: sample.category === 'drums' ? '#ff6b6b20' : sample.category === 'bass' ? '#ffc80020' : sample.category === 'melody' ? '#8b5cf620' : sample.category === 'vocals' ? '#ff00ff20' : sample.category === 'fx' ? '#00ffff20' : '#00ff8820' }}>
                  {CATEGORY_ICONS[sample.category]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-medium text-neutral-100 truncate">{sample.name}</h4>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-neutral-500 font-mono">
                        {sample.duration.toFixed(1)}s
                      </span>
                      {sample.bpm > 0 && (
                        <span className="text-xs text-neutral-500 bg-neutral-800 px-1.5 py-0.5 rounded">
                          {sample.bpm} BPM
                        </span>
                      )}
                      {sample.key && (
                        <span className="text-xs text-neutral-500 bg-neutral-800 px-1.5 py-0.5 rounded">
                          {sample.key}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {sample.tags.slice(0, 4).map(tag => (
                      <span key={tag} className="text-xs text-neutral-500 bg-neutral-900/50 px-1.5 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                    {sample.tags.length > 4 && (
                      <span className="text-xs text-neutral-600">+{sample.tags.length - 4}</span>
                    )}
                  </div>

                  <div className="relative h-4 bg-neutral-900 rounded overflow-hidden">
                    <svg width="100%" height="100%" viewBox={`0 0 ${sample.waveform.length} 50`} preserveAspectRatio="none">
                      <path
                        d={sample.waveform.map((v, i) => `${i === 0 ? 'M' : 'L'} ${i} ${25 - v * 20}`).join(' ')}
                        stroke="currentColor"
                        strokeWidth="0.5"
                        fill="none"
                        opacity="0.7"
                        className="text-primary"
                      />
                    </svg>
                    {isPreviewing === sample.id && (
                      <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); onSamplePreview(sample); }}
                    className="p-1.5 rounded hover:bg-neutral-700 transition-colors text-neutral-400 hover:text-neutral-100"
                    aria-label={isPreviewing === sample.id ? 'Stop preview' : 'Preview'}
                  >
                    {isPreviewing === sample.id ? <span className="text-red-400">⏹</span> : <Play size={16} />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="p-1.5 rounded hover:bg-neutral-700 transition-colors text-neutral-400 hover:text-neutral-100"
                    aria-label="Add to track"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        )}
      </div>
    </div>
  );
}
