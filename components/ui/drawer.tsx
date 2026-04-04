'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: 'left' | 'right';
}

export function Drawer({ open, onClose, children, side = 'left' }: DrawerProps) {
  const [mounted, setMounted] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    lastFocusedElement.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      drawerRef.current?.focus();
    }, 20);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      lastFocusedElement.current?.focus?.();
    };
  }, [open, onClose]);

  if (!mounted || !open || typeof window === 'undefined') return null;

  const isLeft = side === 'left';

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        className="fixed inset-0 bg-black/70 backdrop-blur-[2px] animate-[fade-in_200ms_ease-out_forwards]"
        onClick={onClose}
        aria-label="Fechar menu"
      />

      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={cn(
          'fixed top-0 bottom-0 z-[101] flex w-85 max-w-[90vw] flex-col overflow-y-auto overscroll-contain bg-nf-surface shadow-2xl outline-none',
          isLeft
            ? 'left-0 animate-[slide-in-left_250ms_ease-out_forwards]'
            : 'right-0 animate-[slide-in-right_250ms_ease-out_forwards]',
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
