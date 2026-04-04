'use client';

import { Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import type { Season } from '@/lib/api';
import { titleToGradient } from '@/lib/utils';

interface SeasonListInlineProps {
  seasons: Season[];
  isLoading?: boolean;
  onSelectSeason: (season: Season) => void;
  onEdit?: (season: Season) => void;
  onDelete?: (season: Season) => void;
  backdropUrl?: string | null;
  showTitle?: string;
}

export function SeasonListInline({ seasons, isLoading, onSelectSeason, onEdit, onDelete, backdropUrl, showTitle }: SeasonListInlineProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-lg bg-nf-surface sm:h-32" />
        ))}
      </div>
    );
  }

  if (seasons.length === 0) {
    return (
      <p className="text-sm text-nf-gray-200">Nenhuma temporada cadastrada para esta série.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {seasons.map((season) => (
        <div key={season['@key']} className="group/season relative">
          <button
            type="button"
            onClick={() => onSelectSeason(season)}
            className="relative h-28 w-full overflow-hidden rounded-lg cursor-pointer active:scale-[0.97] transition-transform sm:h-32"
          >
            {backdropUrl ? (
              <Image
                src={backdropUrl}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{ backgroundImage: titleToGradient(showTitle ?? '') }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-3 left-3">
              <span className="block text-sm font-semibold text-white">
                Temporada {season.number}
              </span>
              {season.year && (
                <span className="text-xs text-nf-gray-100">{season.year}</span>
              )}
            </div>
          </button>

          {(onEdit || onDelete) && (
            <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover/season:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onEdit(season); }}
                  className="flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-white/40 bg-black/50 text-white backdrop-blur-sm transition-all duration-150 hover:border-white hover:bg-white/20 hover:scale-110 touch-target-exempt"
                  aria-label={`Editar temporada ${season.number}`}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onDelete(season); }}
                  className="flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-white/40 bg-black/50 text-white backdrop-blur-sm transition-all duration-150 hover:border-nf-red hover:bg-nf-red/20 hover:text-nf-red hover:scale-110 touch-target-exempt"
                  aria-label={`Excluir temporada ${season.number}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
