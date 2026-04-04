'use client';

import { useMemo } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import type { TvShow, Watchlist } from '@/lib/api';
import { cn, titleToGradient } from '@/lib/utils';

interface WatchlistCardProps {
  watchlist: Watchlist;
  shows: TvShow[];
  onEdit: (watchlist: Watchlist) => void;
  onDelete: (watchlist: Watchlist) => void;
  onClick?: (watchlist: Watchlist) => void;
}

export function WatchlistCard({ watchlist: wl, shows, onEdit, onDelete, onClick }: WatchlistCardProps) {
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
    <div
      onClick={() => onClick?.(wl)}
      className={cn(
        'group relative rounded-lg bg-nf-card border border-nf-gray-400/20 overflow-hidden transition-all duration-200',
        'hover:border-nf-gray-300/40 hover:shadow-lg hover:shadow-black/20',
        onClick && 'cursor-pointer'
      )}
    >
      {/* Cover image — backdrop do primeiro show */}
      <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-nf-surface">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={wl.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundImage: titleToGradient(wl.title) }}
          >
            <span className="text-4xl font-bold text-white/20">
              {wl.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-nf-card to-transparent" />
        {/* Show count badge */}
        <div className="absolute bottom-2 left-3 rounded bg-black/60 px-2 py-0.5 text-xs font-medium text-nf-gray-100">
          {showCount} {showCount === 1 ? 'show' : 'shows'}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-white truncate">{wl.title}</h3>
            {wl.description && (
              <p className="mt-1 text-xs text-nf-gray-200 line-clamp-2">{wl.description}</p>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(wl); }}
              className="flex h-9 w-9 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-nf-gray-300/60 text-white transition-all duration-150 hover:border-white hover:bg-white/15 hover:scale-110 touch-target-exempt"
              aria-label="Editar watchlist"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(wl); }}
              className="flex h-9 w-9 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-nf-gray-300/60 text-white transition-all duration-150 hover:border-nf-red hover:bg-nf-red/15 hover:text-nf-red hover:scale-110 touch-target-exempt"
              aria-label="Excluir watchlist"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Resolved show names */}
        {resolvedShows.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {resolvedShows.slice(0, 3).map((show) => (
              <span key={show.title} className="rounded bg-nf-gray-500 px-2 py-0.5 text-xs text-nf-gray-100">
                {show.title}
              </span>
            ))}
            {resolvedShows.length > 3 && (
              <span className="rounded bg-nf-gray-500 px-2 py-0.5 text-xs text-nf-gray-100">
                +{resolvedShows.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
