'use client';

import { Check, ChevronRight, Pencil, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import type { TvShow } from '@/lib/api';
import { titleToGradient } from '@/lib/utils';
import { AgeBadge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TvShowThumbnailProps {
  show: TvShow;
  onEdit: (show: TvShow) => void;
  onDelete: (show: TvShow) => void;
  onMoreInfo: (show: TvShow) => void;
  isInWatchlist?: boolean;
  onToggleWatchlist?: () => void;
}

export function TvShowThumbnail({ show, onEdit, onDelete, onMoreInfo, isInWatchlist, onToggleWatchlist }: TvShowThumbnailProps) {
  const gradientStr = titleToGradient(show.title);
  const thumbnailUrl = show.backdropUrl || show.posterUrl;
  const isPoster = !show.backdropUrl && !!show.posterUrl;

  return (
    <>
      {/* Desktop: hover-expand card (pointer: fine) */}
      <div
        onClick={() => onMoreInfo(show)}
        className="group/card relative hidden w-[250px] shrink-0 cursor-pointer rounded-lg shadow-lg transition-all duration-300 ease-out pointer-fine:block hover:z-[30] hover:scale-[1.3] group-hover/carousel:opacity-40 hover:!opacity-100 group-hover/card:shadow-[0_8px_30px_rgba(0,0,0,0.8)]"
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg rounded-b-lg group-hover/card:rounded-b-none bg-nf-surface transition-[border-radius] duration-300">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={show.title}
              fill
              className={cn('object-cover', isPoster && 'object-top')}
              sizes="250px"
            />
          ) : (
            <div className="absolute inset-0" style={{ backgroundImage: gradientStr }} />
          )}

          {!thumbnailUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="select-none text-6xl font-bold text-white/10">
                {show.title.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-nf-card to-transparent transition-opacity duration-300 group-hover/card:from-nf-card" />
          <h3 className="absolute bottom-2 left-3 right-3 truncate text-sm font-semibold text-white drop-shadow-md transition-opacity duration-300 group-hover/card:opacity-0">
            {show.title}
          </h3>
        </div>

        {/* Hover Panel */}
        <div className="max-h-0 overflow-hidden rounded-b-lg bg-nf-card transition-[max-height] duration-300 ease-out group-hover/card:max-h-[200px]">
          <div className="p-3">
            <h3 className="mb-2 truncate text-sm font-semibold text-white">{show.title}</h3>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex gap-1.5">
                {onToggleWatchlist && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleWatchlist(); }}
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-150 hover:scale-110',
                      isInWatchlist
                        ? 'border-green-500 bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        : 'border-nf-gray-300/60 text-white hover:border-white hover:bg-white/15'
                    )}
                    aria-label={isInWatchlist ? 'Remover da lista' : 'Adicionar à lista'}
                  >
                    {isInWatchlist ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(show); }}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-nf-gray-300/60 text-white transition-all duration-150 hover:border-white hover:bg-white/15 hover:scale-110"
                  aria-label="Editar show"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(show); }}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-nf-gray-300/60 text-white transition-all duration-150 hover:border-nf-red hover:bg-nf-red/15 hover:text-nf-red hover:scale-110"
                  aria-label="Excluir show"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <AgeBadge age={show.recommendedAge} />
            </div>
            <div className="mb-1.5 flex items-center gap-2">
              <span className="text-xs font-bold text-green-500">98% Match</span>
            </div>
            {show.description && show.description.length > 5 && (
              <p className="line-clamp-2 text-[11px] leading-relaxed text-nf-gray-200">{show.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: compact touch-friendly card (pointer: coarse / default) */}
      <div
        onClick={() => onMoreInfo(show)}
        className="relative w-[160px] shrink-0 pointer-fine:hidden aspect-[2/3] overflow-hidden rounded-lg bg-nf-surface cursor-pointer active:scale-[0.97] transition-transform duration-150"
      >
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={show.title}
            fill
            className={cn('object-cover', isPoster ? 'object-top' : 'object-center')}
            sizes="160px"
          />
        ) : (
          <>
            <div className="absolute inset-0" style={{ backgroundImage: gradientStr }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="select-none text-5xl font-bold text-white/10">
                {show.title.charAt(0).toUpperCase()}
              </span>
            </div>
          </>
        )}

        {/* Bottom gradient + info overlay */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-2.5">
          {/* Action buttons — inside card */}
          <div className="flex items-center gap-2 mb-2">
            {onToggleWatchlist && (
              <button
                onClick={(e) => { e.stopPropagation(); onToggleWatchlist(); }}
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full border touch-target-exempt',
                  isInWatchlist
                    ? 'border-green-500 bg-green-500/20 text-green-400'
                    : 'border-nf-gray-300/60 text-white active:bg-white/15 active:border-white'
                )}
                aria-label={isInWatchlist ? 'Remover da lista' : 'Adicionar à lista'}
              >
                {isInWatchlist ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(show); }}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-nf-gray-300/60 text-white active:bg-white/15 active:border-white touch-target-exempt"
              aria-label="Editar show"
            >
              <Pencil className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(show); }}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-nf-gray-300/60 text-white active:bg-nf-red/15 active:border-nf-red active:text-nf-red touch-target-exempt"
              aria-label="Excluir show"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 mb-1">
            <AgeBadge age={show.recommendedAge} />
            <span className="text-[10px] font-bold text-green-500">98%</span>
          </div>
          <h3 className="text-xs font-semibold text-white line-clamp-2 leading-snug">
            {show.title}
          </h3>
        </div>

        {/* Tap hint */}
        <div className="absolute top-2 right-2">
          <ChevronRight className="h-4 w-4 text-white/50" />
        </div>
      </div>
    </>
  );
}
