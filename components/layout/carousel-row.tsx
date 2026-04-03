'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselRowProps {
  title: string;
  children: React.ReactNode;
}

const SCROLL_AMOUNT = 800;
const FADE_WIDTH = 150; // px — width of the fade zone on each edge

export function CarouselRow({ title, children }: CarouselRowProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);

  // Calculate the maximum translateX offset
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

  // Horizontal trackpad / wheel support
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 5) {
        e.preventDefault();
        setOffset((prev) =>
          Math.max(0, Math.min(maxOffset, prev + e.deltaX))
        );
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [maxOffset]);

  // Touch swipe support
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
      const next = Math.max(
        0,
        Math.min(maxOffset, touchRef.current.startOffset + dx)
      );
      setOffset(next);
    },
    [maxOffset]
  );

  const onTouchEnd = useCallback(() => {
    touchRef.current = null;
  }, []);

  const canScrollLeft = offset > 0;
  const canScrollRight = offset < maxOffset - 10;

  const goLeft = () =>
    setOffset((prev) => Math.max(0, prev - SCROLL_AMOUNT));
  const goRight = () =>
    setOffset((prev) => Math.min(maxOffset, prev + SCROLL_AMOUNT));

  // Dynamic mask: fade edges where there's more content
  const maskLeft = canScrollLeft
    ? `transparent, black ${FADE_WIDTH}px`
    : 'black, black';
  const maskRight = canScrollRight
    ? `black calc(100% - ${FADE_WIDTH}px), transparent`
    : 'black, black';
  const maskImage = `linear-gradient(to right, ${maskLeft}, ${maskRight})`;

  return (
    <section className="group/row relative mb-8">
      <h2 className="mb-3 px-4 text-xl font-bold text-nf-gray-100 md:px-12 md:text-2xl">
        {title}
      </h2>

      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            type="button"
            className="absolute left-0 top-8 z-20 flex h-[calc(100%-6rem)] w-12 cursor-pointer items-center justify-center opacity-0 transition-all duration-500 group-hover/row:opacity-100 md:w-14"
            onClick={goLeft}
            aria-label={`Rolar carrossel ${title} para a esquerda`}
          >
            <ChevronLeft className="h-8 w-8 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-transform duration-200 hover:scale-125" />
          </button>
        )}

        {/* Viewport — clip-x hides horizontal overflow; mask-image fades edges */}
        <div
          ref={viewportRef}
          className="px-4 pt-14 pb-16 md:px-12"
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
          {/* Track — w-max ensures flex children expand; slides via translateX */}
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

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            type="button"
            className="absolute right-0 top-8 z-20 flex h-[calc(100%-6rem)] w-12 cursor-pointer items-center justify-center opacity-0 transition-all duration-500 group-hover/row:opacity-100 md:w-14"
            onClick={goRight}
            aria-label={`Rolar carrossel ${title} para a direita`}
          >
            <ChevronRight className="h-8 w-8 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-transform duration-200 hover:scale-125" />
          </button>
        )}
      </div>
    </section>
  );
}
