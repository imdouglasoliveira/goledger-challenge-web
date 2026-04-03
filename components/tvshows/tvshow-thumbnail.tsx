'use client';

import { Pencil, Trash2 } from 'lucide-react';
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
}

export function TvShowThumbnail({ show, onEdit, onDelete, onMoreInfo }: TvShowThumbnailProps) {
  const gradientStr = titleToGradient(show.title);
  // Prefer backdrop (landscape) for 16:9 cards, fall back to poster
  const thumbnailUrl = show.backdropUrl || show.posterUrl;
  const isPoster = !show.backdropUrl && !!show.posterUrl;

  return (
    <div onClick={() => onMoreInfo(show)} className="group/card relative w-[250px] shrink-0 cursor-pointer rounded-lg shadow-lg transition-all duration-300 ease-out hover:z-[30] hover:scale-[1.3] group-hover/carousel:opacity-40 hover:!opacity-100 group-hover/card:shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
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
            <div
              className="absolute inset-0"
              style={{ backgroundImage: gradientStr }}
            />
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

        {/* Hover Panel — max-h animates, parent overflow-hidden handles corners */}
        <div className="max-h-0 overflow-hidden rounded-b-lg bg-nf-card transition-[max-height] duration-300 ease-out group-hover/card:max-h-[200px]">
          <div className="p-3">
              {/* Title in panel */}
              <h3 className="mb-2 truncate text-sm font-semibold text-white">
                {show.title}
              </h3>

              {/* Action buttons + metadata row */}
              <div className="mb-2 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(show);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-nf-gray-300/60 text-white transition-all duration-150 hover:border-white hover:bg-white/15 hover:scale-110"
                    aria-label="Editar show"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(show);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-nf-gray-300/60 text-white transition-all duration-150 hover:border-nf-red hover:bg-nf-red/15 hover:text-nf-red hover:scale-110"
                    aria-label="Excluir show"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <AgeBadge age={show.recommendedAge} />
              </div>

              {/* Match indicator */}
              <div className="mb-1.5 flex items-center gap-2">
                <span className="text-xs font-bold text-green-500">98% Match</span>
              </div>

              {show.description && show.description.length > 5 && (
                <p className="line-clamp-2 text-[11px] leading-relaxed text-nf-gray-200">
                  {show.description}
                </p>
              )}
            </div>
        </div>
    </div>
  );
}
