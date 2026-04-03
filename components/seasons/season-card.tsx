'use client';

import { Pencil, Trash2, Tv } from 'lucide-react';
import type { Season } from '@/lib/api';
import { cn } from '@/lib/utils';

interface SeasonCardProps {
  season: Season;
  onEdit: (season: Season) => void;
  onDelete: (season: Season) => void;
}

export function SeasonCard({ season, onEdit, onDelete }: SeasonCardProps) {
  const tvShowTitle = season.tvShow?.title ?? 'Show nao resolvido';

  return (
    <div className={cn(
      'group relative rounded-lg bg-nf-card border border-nf-gray-400/20 p-4 transition-all duration-200',
      'hover:border-nf-gray-300/40 hover:shadow-lg hover:shadow-black/20'
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-nf-red/20 text-nf-red">
            <Tv className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Temporada {season.number}
            </h3>
            <p className="text-xs text-nf-gray-300">
              {tvShowTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(season);
            }}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-nf-gray-300/60 text-white transition-all duration-150 hover:border-white hover:bg-white/15 hover:scale-110"
            aria-label="Editar temporada"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(season);
            }}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-nf-gray-300/60 text-white transition-all duration-150 hover:border-nf-red hover:bg-nf-red/15 hover:text-nf-red hover:scale-110"
            aria-label="Excluir temporada"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {season.year && (
        <div className="mt-3 flex items-center gap-2">
          <span className="rounded bg-nf-gray-500 px-2 py-0.5 text-xs font-medium text-nf-gray-100">
            {season.year}
          </span>
        </div>
      )}
    </div>
  );
}
