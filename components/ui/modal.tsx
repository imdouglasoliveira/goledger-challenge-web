'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  const [mounted, setMounted] = useState(false);

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

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!mounted || !open || typeof window === 'undefined') return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:px-4">
      <button
        type="button"
        className="fixed inset-0 bg-black/70 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Fechar modal"
      />

      <div
        className={cn(
          'relative z-[101] w-full bg-nf-card shadow-2xl text-nf-gray-100 overflow-hidden',
          'max-h-[95dvh] sm:max-h-[85vh] flex flex-col',
          'rounded-t-2xl sm:rounded-lg',
          'animate-[slide-up_200ms_ease-out_forwards] sm:animate-[scale-in_200ms_ease-out_forwards]',
          sizeClasses[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle — mobile only */}
        <div className="flex justify-center pt-2 pb-0 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-nf-gray-400" />
        </div>

        {title ? (
          <div className="flex items-center justify-between p-4 border-b border-nf-gray-400/30 shrink-0">
            <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full text-nf-gray-200 hover:text-white hover:bg-white/10 transition-colors touch-target-exempt"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-nf-card/80 text-nf-gray-200 hover:text-white hover:bg-nf-card transition-colors touch-target-exempt"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1 safe-bottom">{children}</div>
      </div>
    </div>,
    document.body
  );
}
