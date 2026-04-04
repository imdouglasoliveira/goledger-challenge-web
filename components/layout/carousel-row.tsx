'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselRowProps {
  title: string;
  children: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

const SCROLL_AMOUNT_DESKTOP = 800;
const SCROLL_AMOUNT_MOBILE = 320;
const FADE_WIDTH = 150;

export function CarouselRow({ title, children, actionLabel, onAction }: CarouselRowProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);

  const recalc = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const style = getComputedStyle(viewport);
    const padL = parseFloat(style.paddingLeft);
    const padR = parseFloat(style.paddingRight);
    const contentW = viewport.clientWidth - padL - padR;
    const max = Math.max(0, track.scrollWidth - contentW);

    setMaxOffset(max);
    setOffset((prev) => Math.min(prev, max));
  }, []);

  useEffect(() => {
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [children, recalc]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 5) {
        e.preventDefault();
        setOffset((prev) => Math.max(0, Math.min(maxOffset, prev + e.deltaX)));
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [maxOffset]);

  const touchRef = useRef<{ startX: number; startOffset: number } | null>(null);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      touchRef.current = { startX: e.touches[0].clientX, startOffset: offset };
    },
    [offset]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!touchRef.current) return;
      const dx = touchRef.current.startX - e.touches[0].clientX;
      const next = Math.max(0, Math.min(maxOffset, touchRef.current.startOffset + dx));
      setOffset(next);
    },
    [maxOffset]
  );

  const onTouchEnd = useCallback(() => {
    touchRef.current = null;
  }, []);

  const canScrollLeft = offset > 0;
  const canScrollRight = offset < maxOffset - 10;

  const scrollAmount = typeof window !== 'undefined' && window.innerWidth < 640 ? SCROLL_AMOUNT_MOBILE : SCROLL_AMOUNT_DESKTOP;
  const goLeft = () => setOffset((prev) => Math.max(0, prev - scrollAmount));
  const goRight = () => setOffset((prev) => Math.min(maxOffset, prev + scrollAmount));

  const maskLeft = canScrollLeft ? `transparent, black ${FADE_WIDTH}px` : 'black, black';
  const maskRight = canScrollRight ? `black calc(100% - ${FADE_WIDTH}px), transparent` : 'black, black';
  const maskImage = `linear-gradient(to right, ${maskLeft}, ${maskRight})`;

  return (
    <section className="group/row relative mb-8">
      <div className="mb-4 flex items-center justify-between px-4 md:mb-3 md:px-12">
        <h2 className="text-xl font-bold text-nf-gray-100 md:text-2xl">{title}</h2>
        {actionLabel && onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="touch-target-exempt rounded-md border border-nf-gray-400/35 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-nf-gray-100 transition-colors hover:border-white hover:text-white"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>

      <div className="relative">
        {canScrollLeft && (
          <button
            type="button"
            className="touch-target-exempt absolute left-0 top-8 z-20 flex h-[calc(100%-6rem)] w-10 items-center justify-center bg-gradient-to-r from-black/40 to-transparent opacity-60 transition-all duration-500 group-hover/row:opacity-100 sm:w-12 sm:from-transparent sm:opacity-0 md:w-14"
            onClick={goLeft}
            aria-label={`Rolar carrossel ${title} para a esquerda`}
          >
            <ChevronLeft className="h-6 w-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-transform duration-200 hover:scale-125 sm:h-8 sm:w-8" />
          </button>
        )}

        <div
          ref={viewportRef}
          className="px-4 pb-16 pt-10 md:pt-14 md:px-12"
          style={{
            marginTop: '-3.5rem',
            overflowX: 'clip',
            overflowY: 'visible',
            maskImage,
            WebkitMaskImage: maskImage,
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            ref={trackRef}
            className="group/carousel flex w-max gap-2 [&>*:first-child]:origin-left [&>*:last-child]:origin-right"
            style={{
              transform: `translateX(-${offset}px)`,
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              willChange: 'transform',
            }}
          >
            {children}
          </div>
        </div>

        {canScrollRight && (
          <button
            type="button"
            className="touch-target-exempt absolute right-0 top-8 z-20 flex h-[calc(100%-6rem)] w-10 items-center justify-center bg-gradient-to-l from-black/40 to-transparent opacity-60 transition-all duration-500 group-hover/row:opacity-100 sm:w-12 sm:from-transparent sm:opacity-0 md:w-14"
            onClick={goRight}
            aria-label={`Rolar carrossel ${title} para a direita`}
          >
            <ChevronRight className="h-6 w-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-transform duration-200 hover:scale-125 sm:h-8 sm:w-8" />
          </button>
        )}
      </div>
    </section>
  );
}
