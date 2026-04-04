'use client';

import Image from 'next/image';
import type { TvShow } from '@/lib/api';
import { titleToGradient, cn } from '@/lib/utils';

interface ShowBannerCardProps {
  show: TvShow;
  subtitle?: string;
  onClick: (show: TvShow) => void;
}

export function ShowBannerCard({ show, subtitle, onClick }: ShowBannerCardProps) {
  const imageUrl = show.backdropUrl || show.posterUrl;

  return (
    <button
      type="button"
      onClick={() => onClick(show)}
      className={cn(
        'group relative w-full overflow-hidden rounded-lg bg-nf-surface text-left transition-all duration-200',
        'border border-nf-gray-400/20 hover:border-nf-gray-300/40 hover:shadow-lg hover:shadow-black/20',
        'active:scale-[0.99] cursor-pointer'
      )}
    >
      <div className="relative h-32 w-full overflow-hidden sm:h-40">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={show.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ backgroundImage: titleToGradient(show.title) }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-nf-card/90 via-nf-card/30 to-transparent" />

        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-base font-semibold text-white truncate sm:text-lg">{show.title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-nf-gray-100">{subtitle}</p>
          )}
        </div>
      </div>
    </button>
  );
}
