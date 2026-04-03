'use client';

import { Pencil, Trash2, List } from 'lucide-react';
import type { Watchlist } from '@/lib/api';
import { cn } from '@/lib/utils';

interface WatchlistCardProps {
  watchlist: Watchlist;
  onEdit: (watchlist: Watchlist) => void;
  onDelete: (watchlist: Watchlist) => void;
}

export function WatchlistCard({ watchlist: wl, onEdit, onDelete }: WatchlistCardProps) {
  const showCount = wl.tvShows?.length ?? 0;
  const resolvedShows = (wl.tvShows ?? []).map((tvShow, index) => ({
    key: tvShow.title ?? `show-${index}`,
    title: tvShow.title ?? 'Show nao resolvido',
  }));

  return (
    <div className={cn(
      'group relative rounded-lg bg-nf-card border border-nf-gray-400/20 p-4 transition-all duration-200',
      'hover:border-nf-gray-300/40 hover:shadow-lg hover:shadow-black/20'
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-nf-red/20 text-nf-red">
            <List className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white truncate">
              {wl.title}
            </h3>
            <p className="text-xs text-nf-gray-300 mt-0.5">
              {showCount} {showCount === 1 ? 'show' : 'shows'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(wl);
            }}
            className="flex h-9 w-9 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-nf-gray-300/60 text-white transition-all duration-150 hover:border-white hover:bg-white/15 hover:scale-110 touch-target-exempt"
            aria-label="Editar watchlist"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(wl);
            }}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-nf-gray-300/60 text-white transition-all duration-150 hover:border-nf-red hover:bg-nf-red/15 hover:text-nf-red hover:scale-110"
            aria-label="Excluir watchlist"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {wl.description && (
        <p className="mt-2 text-xs text-nf-gray-200 line-clamp-2">
          {wl.description}
        </p>
      )}

      {wl.tvShows && wl.tvShows.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {resolvedShows.slice(0, 3).map((tvShow) => (
            <span
              key={tvShow.key}
              className="rounded bg-nf-gray-500 px-2 py-0.5 text-xs text-nf-gray-100"
            >
              {tvShow.title}
            </span>
          ))}
          {wl.tvShows.length > 3 && (
            <span className="rounded bg-nf-gray-500 px-2 py-0.5 text-xs text-nf-gray-100">
              +{wl.tvShows.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
