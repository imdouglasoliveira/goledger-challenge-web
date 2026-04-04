'use client';

import { Pencil, PlayCircle, Star, Trash2 } from 'lucide-react';
import type { Episode } from '@/lib/api';
import { cn } from '@/lib/utils';

interface EpisodeCardProps {
  episode: Episode;
  onEdit: (episode: Episode) => void;
  onDelete: (episode: Episode) => void;
}

export function EpisodeCard({ episode, onEdit, onDelete }: EpisodeCardProps) {
  const formattedDate = new Date(episode.releaseDate).toLocaleDateString('pt-BR');
  const seasonNumber = episode.season?.number ?? '?';
  const tvShowTitle = episode.season?.tvShow?.title ?? 'Show não resolvido';

  return (
    <div className={cn(
      'group relative rounded-lg bg-nf-card border border-nf-gray-400/20 p-4 transition-all duration-200',
      'hover:border-nf-gray-300/40 hover:shadow-lg hover:shadow-black/20'
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-nf-red/20 text-nf-red">
            <PlayCircle className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white truncate">
              E{episode.episodeNumber}: {episode.title}
            </h3>
            <p className="text-xs text-nf-gray-300 mt-0.5">
              {tvShowTitle} - S{seasonNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(episode);
            }}
            className="flex h-9 w-9 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-nf-gray-300/60 text-white transition-all duration-150 hover:border-white hover:bg-white/15 hover:scale-110 touch-target-exempt"
            aria-label="Editar episodio"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(episode);
            }}
            className="flex h-9 w-9 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-nf-gray-300/60 text-white transition-all duration-150 hover:border-nf-red hover:bg-nf-red/15 hover:text-nf-red hover:scale-110 touch-target-exempt"
            aria-label="Excluir episodio"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {episode.description && (
        <p className="mt-2 text-xs text-nf-gray-200 line-clamp-2">
          {episode.description}
        </p>
      )}

      <div className="mt-3 flex items-center gap-3">
        <span className="text-xs text-nf-gray-300">{formattedDate}</span>
        {episode.rating != null && (
          <span className="inline-flex items-center gap-1 rounded bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-400">
            <Star className="h-3 w-3 fill-current" />
            {episode.rating.toFixed(1)}/10
          </span>
        )}
      </div>
    </div>
  );
}
