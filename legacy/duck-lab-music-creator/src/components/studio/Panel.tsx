'use client';

import React from 'react';
import { X, ChevronLeft, ChevronRight, LayoutDashboard, Mixer, Piano, Music, Settings, HelpCircle, Maximize2, Minimize2, PanelLeftClose, PanelRightClose } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  title?: string;
  icon?: React.ReactNode;
  position?: 'left' | 'right';
  width?: number;
  minWidth?: number;
  maxWidth?: number;
}

export function Panel({ children, className, collapsible = true, defaultOpen = true, title, icon, position = 'left', width = 280, minWidth = 200, maxWidth = 600 }: PanelProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const [isResizing, setIsResizing] = React.useState(false);
  const [currentWidth, setCurrentWidth] = React.useState(width);
  const panelRef = React.useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!collapsible) return;
    setIsResizing(true);
    document.body.style.cursor = position === 'left' ? 'ew-resize' : 'ew-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = position === 'left'
        ? e.clientX
        : window.innerWidth - e.clientX;
      setCurrentWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed z-40 transition-all duration-300',
          position === 'left'
            ? 'left-2 top-1/2 -translate-y-1/2'
            : 'right-2 top-1/2 -translate-y-1/2',
          'p-2 bg-neutral-900/80 border border-neutral-700 rounded-lg hover:border-primary/50'
        )}
        style={{ backdropFilter: 'blur(8px)' }}
        aria-label={`Show ${title || 'panel'}`}
      >
        {position === 'left' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    );
  }

  return (
    <>
      <div
        ref={panelRef}
        className={cn(
          'fixed z-30 flex flex-col transition-all duration-300 overflow-hidden',
          'bg-neutral-950/95 border border-neutral-800 backdrop-blur-xl',
          position === 'left'
            ? 'left-0 top-0 h-full'
            : 'right-0 top-0 h-full',
          isResizing ? 'select-none' : ''
        )}
        style={{
          width: currentWidth,
          minWidth,
          maxWidth,
          boxShadow: position === 'left'
            ? '4px 0 24px rgba(0, 0, 0, 0.5)'
            : '-4px 0 24px rgba(0, 0, 0, 0.5)'
        }}
      >
        {(title || icon || collapsible) && (
          <div
            className={cn(
              'flex items-center justify-between p-3 border-b border-neutral-800',
              'bg-neutral-900/50 backdrop-blur-sm'
            )}
          >
            <div className="flex items-center gap-2">
              {icon && <span className="text-primary">{icon}</span>}
              {title && <span className="font-medium text-sm text-neutral-100">{title}</span>}
            </div>
            <div className="flex items-center gap-1">
              {collapsible && (
                <button
                  onMouseDown={handleMouseDown}
                  className={cn(
                    'p-1 rounded hover:bg-neutral-800 transition-colors',
                    isResizing && 'bg-neutral-800'
                  )}
                  aria-label="Resize panel"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <div className="w-px h-6 bg-neutral-600" />
                  </div>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-neutral-100"
                aria-label={`Hide ${title || 'panel'}`}
              >
                {position === 'left' ? <PanelLeftClose size={16} /> : <PanelRightClose size={16} />}
              </button>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-auto p-3">
          {children}
        </div>
      </div>
      {collapsible && isOpen && (
        <div
          className={cn(
            'fixed z-20 inset-0 transition-opacity duration-300',
            'bg-black/50 backdrop-blur-sm'
          )}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

export function PanelHeader({ title, icon, children, className }: {
  title: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <div className="flex items-center gap-2">
        {icon && <span className="text-primary">{icon}</span>}
        <h3 className="font-semibold text-neutral-100 text-sm">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function PanelSection({ title, children, className, collapsible = false, defaultOpen = true }: {
  title: string;
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className={cn('mb-4', className)}>
      {(collapsible || title) && (
        <button
          onClick={() => collapsible && setIsOpen(!isOpen)}
          className={cn(
            'flex items-center justify-between w-full px-2 py-1.5 text-left',
            'text-sm font-medium text-neutral-300 hover:text-neutral-100',
            'rounded transition-colors'
          )}
        >
          <span className="flex items-center gap-2">
            {collapsible && (
              <ChevronRight
                size={14}
                className={cn('transition-transform', isOpen && 'rotate-90', 'text-neutral-500')}
              />
            )}
            <span>{title}</span>
          </span>
        </button>
      )}
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          collapsible && !isOpen && 'max-h-0 opacity-0'
        )}
        style={collapsible && !isOpen ? { paddingTop: 0, paddingBottom: 0 } : undefined}
      >
        {isOpen || !collapsible ? (
          <div className="space-y-2">{children}</div>
        ) : null}
      </div>
    </div>
  );
}
