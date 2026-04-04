'use client';

import { Film, Star } from 'lucide-react';
import type { Episode } from '@/lib/api';

interface EpisodeListInlineProps {
  episodes: Episode[];
  isLoading?: boolean;
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString));
}

export function EpisodeListInline({ episodes, isLoading }: EpisodeListInlineProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-nf-surface" />
        ))}
      </div>
    );
  }

  if (episodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-nf-gray-400/15 bg-nf-surface/30 py-8 text-center">
        <Film className="mb-2 h-8 w-8 text-nf-gray-300" />
        <p className="text-sm font-medium text-nf-gray-100">Nenhum episódio cadastrado</p>
        <p className="mt-0.5 text-xs text-nf-gray-300">Adicione episódios para esta temporada.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {episodes.map((episode) => (
        <div
          key={episode['@key']}
          className="flex items-start gap-4 rounded-lg border border-nf-gray-400/15 bg-nf-surface/50 p-4 transition-colors hover:bg-nf-surface"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-nf-gray-500 text-lg font-bold text-nf-gray-100">
            {episode.episodeNumber}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-white">{episode.title}</h4>
            {episode.description && (
              <p className="mt-1 text-xs leading-relaxed text-nf-gray-200 line-clamp-2">
                {episode.description}
              </p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-nf-gray-300">
              {episode.releaseDate && (
                <span>{formatDate(episode.releaseDate)}</span>
              )}
              {episode.rating != null && (
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star className="h-3 w-3 fill-current" />
                  {episode.rating.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
