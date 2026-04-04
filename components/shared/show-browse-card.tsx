'use client';

import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import type { TvShow } from '@/lib/api';
import { titleToGradient, cn } from '@/lib/utils';
import { AgeBadge } from '@/components/ui/badge';

interface ShowBrowseCardProps {
  show: TvShow;
  subtitle?: string;
  onClick: (show: TvShow) => void;
}

export function ShowBrowseCard({ show, subtitle, onClick }: ShowBrowseCardProps) {
  const gradientStr = titleToGradient(show.title);
  const thumbnailUrl = show.backdropUrl || show.posterUrl;
  const isPoster = !show.backdropUrl && !!show.posterUrl;

  return (
    <>
      {/* Desktop: hover-expand card */}
      <div
        onClick={() => onClick(show)}
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
            <h3 className="mb-1.5 truncate text-sm font-semibold text-white">{show.title}</h3>
            <div className="mb-2 flex items-center justify-between">
              {subtitle && (
                <span className="text-xs font-medium text-nf-gray-100">{subtitle}</span>
              )}
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

      {/* Mobile: compact touch-friendly card */}
      <div className="relative w-[160px] shrink-0 pointer-fine:hidden">
        <div
          onClick={() => onClick(show)}
          className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-nf-surface cursor-pointer active:scale-[0.97] transition-transform duration-150"
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

          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <AgeBadge age={show.recommendedAge} />
              {subtitle && (
                <span className="text-[10px] font-medium text-nf-gray-100">{subtitle}</span>
              )}
            </div>
            <h3 className="text-xs font-semibold text-white line-clamp-2 leading-snug">
              {show.title}
            </h3>
          </div>

          <div className="absolute top-2 right-2">
            <ChevronRight className="h-4 w-4 text-white/50" />
          </div>
        </div>
      </div>
    </>
  );
}
