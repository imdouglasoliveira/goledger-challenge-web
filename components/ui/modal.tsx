'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  contentClassName?: string;
}

export function Modal({ open, onClose, title, children, size = 'md', contentClassName }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    lastFocusedElement.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      dialogRef.current?.focus();
    }, 20);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      lastFocusedElement.current?.focus?.();
    };
  }, [open, onClose]);

  const shellSizeClasses = {
    sm: 'sm:max-w-lg sm:min-h-[260px]',
    md: 'sm:max-w-2xl sm:min-h-[280px]',
    lg: 'sm:max-w-4xl sm:min-h-[68vh]',
    xl: 'sm:max-w-5xl sm:min-h-[74vh]',
    full: 'sm:max-w-6xl sm:min-h-[80vh]',
  };

  if (!mounted || !open || typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        className="fixed inset-0 bg-black/80 backdrop-blur-[3px]"
        onClick={onClose}
        aria-label="Fechar modal"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={cn(
          'relative z-[101] flex w-full flex-col overflow-hidden bg-nf-card text-nf-gray-100 shadow-2xl outline-none',
          'max-h-[96dvh] sm:max-h-[90dvh]',
          'rounded-t-2xl sm:rounded-xl',
          'animate-[slide-up_200ms_ease-out_forwards] sm:animate-[scale-in_200ms_ease-out_forwards]',
          shellSizeClasses[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pb-0 pt-2 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-nf-gray-400" />
        </div>

        {title ? (
          <div className="shrink-0 border-b border-nf-gray-400/35 px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-center justify-between gap-4">
              <h2 id={titleId} className="text-lg font-semibold text-white sm:text-xl">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="touch-target-exempt flex h-9 w-9 items-center justify-center rounded-full text-nf-gray-100 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Fechar modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={onClose}
            className="touch-target-exempt absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-nf-gray-100 transition-colors hover:bg-black/60 hover:text-white"
            aria-label="Fechar modal"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <div className={cn(
          'min-h-0 flex-1 overflow-y-auto overscroll-contain',
          contentClassName
            ? contentClassName
            : (size === 'sm' ? 'px-5 py-5 sm:px-7 sm:py-6' : 'px-4 py-4 sm:px-6 sm:py-5')
        )}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
