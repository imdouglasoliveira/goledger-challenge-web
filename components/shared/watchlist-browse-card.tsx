'use client';

import { Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import type { TvShow, Watchlist } from '@/lib/api';
import { titleToGradient } from '@/lib/utils';
import { useMemo } from 'react';

interface WatchlistBrowseCardProps {
  watchlist: Watchlist;
  shows: TvShow[];
  onEdit: (watchlist: Watchlist) => void;
  onDelete: (watchlist: Watchlist) => void;
  onClick: (watchlist: Watchlist) => void;
}

export function WatchlistBrowseCard({ watchlist: wl, shows, onEdit, onDelete, onClick }: WatchlistBrowseCardProps) {
  const showCount = wl.tvShows?.length ?? 0;

  const resolvedShows = useMemo(() => {
    const showMap = new Map(shows.map((s) => [s.title, s]));
    return (wl.tvShows ?? [])
      .map((ref) => showMap.get(ref.title))
      .filter((s): s is TvShow => s != null);
  }, [wl.tvShows, shows]);

  const coverShow = resolvedShows[0];
  const coverUrl = coverShow?.backdropUrl || coverShow?.posterUrl;

  return (
    <>
      {/* Desktop: hover-expand card */}
      <div
        onClick={() => onClick(wl)}
        className="group/card relative hidden w-[280px] shrink-0 cursor-pointer rounded-lg shadow-lg transition-all duration-300 ease-out pointer-fine:block hover:z-[30] hover:scale-[1.25] group-hover/carousel:opacity-40 hover:!opacity-100 group-hover/card:shadow-[0_8px_30px_rgba(0,0,0,0.8)]"
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg rounded-b-lg group-hover/card:rounded-b-none bg-nf-surface transition-[border-radius] duration-300">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={wl.title}
              fill
              className="object-cover"
              sizes="280px"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundImage: titleToGradient(wl.title) }}
            >
              <span className="select-none text-6xl font-bold text-white/10">
                {wl.title.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-nf-card to-transparent transition-opacity duration-300 group-hover/card:from-nf-card" />

          <div className="absolute bottom-2 left-3 right-3">
            <h3 className="truncate text-sm font-semibold text-white drop-shadow-md transition-opacity duration-300 group-hover/card:opacity-0">
              {wl.title}
            </h3>
            <span className="text-[11px] text-nf-gray-100 drop-shadow-md transition-opacity duration-300 group-hover/card:opacity-0">
              {showCount} {showCount === 1 ? 'show' : 'shows'}
            </span>
          </div>
        </div>

        {/* Hover Panel */}
        <div className="max-h-0 overflow-hidden rounded-b-lg bg-nf-card transition-[max-height] duration-300 ease-out group-hover/card:max-h-[220px]">
          <div className="p-3">
            <h3 className="mb-1 truncate text-sm font-semibold text-white">{wl.title}</h3>
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded bg-nf-red/20 px-2 py-0.5 text-xs font-medium text-nf-red">
                {showCount} {showCount === 1 ? 'show' : 'shows'}
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(wl); }}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-nf-gray-300/60 text-white transition-all duration-150 hover:border-white hover:bg-white/15 hover:scale-110"
                  aria-label="Editar watchlist"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(wl); }}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-nf-gray-300/60 text-white transition-all duration-150 hover:border-nf-red hover:bg-nf-red/15 hover:text-nf-red hover:scale-110"
                  aria-label="Excluir watchlist"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            {wl.description && (
              <p className="mb-2 line-clamp-2 text-[11px] leading-relaxed text-nf-gray-200">{wl.description}</p>
            )}
            {resolvedShows.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {resolvedShows.slice(0, 3).map((show) => (
                  <span key={show.title} className="rounded bg-nf-gray-500 px-2 py-0.5 text-[10px] text-nf-gray-100">
                    {show.title}
                  </span>
                ))}
                {resolvedShows.length > 3 && (
                  <span className="rounded bg-nf-gray-500 px-2 py-0.5 text-[10px] text-nf-gray-100">
                    +{resolvedShows.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: compact touch-friendly card */}
      <div className="relative w-[200px] shrink-0 pointer-fine:hidden">
        <div
          onClick={() => onClick(wl)}
          className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-nf-surface cursor-pointer active:scale-[0.97] transition-transform duration-150"
        >
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={wl.title}
              fill
              className="object-cover"
              sizes="200px"
            />
          ) : (
            <>
              <div className="absolute inset-0" style={{ backgroundImage: titleToGradient(wl.title) }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="select-none text-5xl font-bold text-white/10">
                  {wl.title.charAt(0).toUpperCase()}
                </span>
              </div>
            </>
          )}

          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-2.5">
            <span className="rounded bg-nf-red/20 px-1.5 py-0.5 text-[10px] font-medium text-nf-red mb-1 inline-block">
              {showCount} {showCount === 1 ? 'show' : 'shows'}
            </span>
            <h3 className="text-xs font-semibold text-white line-clamp-2 leading-snug">
              {wl.title}
            </h3>
          </div>
        </div>

        {/* Mobile action buttons */}
        <div className="flex items-center justify-center gap-3 mt-2">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(wl); }}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-nf-gray-400 text-nf-gray-200 active:bg-white/15 active:border-white touch-target-exempt"
            aria-label="Editar watchlist"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(wl); }}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-nf-gray-400 text-nf-gray-200 active:bg-nf-red/15 active:border-nf-red active:text-nf-red touch-target-exempt"
            aria-label="Excluir watchlist"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </>
  );
}
