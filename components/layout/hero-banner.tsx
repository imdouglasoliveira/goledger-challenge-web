'use client';

import { Check, Info, Pencil, Plus } from 'lucide-react';
import Image from 'next/image';
import type { TvShow } from '@/lib/api';
import { cn, titleToGradient } from '@/lib/utils';
import { AgeBadge } from '@/components/ui/badge';

interface HeroBannerProps {
  show: TvShow;
  onEdit: (show: TvShow) => void;
  onMoreInfo: (show: TvShow) => void;
  isInWatchlist?: boolean;
  onToggleWatchlist?: () => void;
}

export function HeroBanner({ show, onEdit, onMoreInfo, isInWatchlist, onToggleWatchlist }: HeroBannerProps) {
  const gradientStr = titleToGradient(show.title);

  return (
    <div className="relative w-full h-[48vh] sm:h-[65vh] md:h-[75vh] overflow-hidden">
      {show.backdropUrl ? (
        <Image
          src={show.backdropUrl}
          alt=""
          fill
          className="object-cover object-top"
          priority
          sizes="100vw"
        />
      ) : (
        <>
          <div
            className="absolute inset-0"
            style={{ backgroundImage: gradientStr }}
          />
          <div className="absolute top-1/2 right-[10%] -translate-y-1/2 opacity-5 select-none text-[250px] md:text-[400px] font-black leading-none overflow-hidden">
            {show.title.charAt(0).toUpperCase()}
          </div>
        </>
      )}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(229,9,20,0.15)_0%,_transparent_60%)]" />

      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 40%, transparent 60%)' }}
      />

      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{ background: 'linear-gradient(to top, #141414 10%, transparent 90%)' }}
      />

      {/* Content */}
      <div className="absolute bottom-[14%] sm:bottom-[15%] left-0 px-4 md:px-12 w-full max-w-2xl z-10">
        <h1
          className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4 leading-tight"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.45)' }}
        >
          {show.title}
        </h1>

        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
          <span className="text-green-500 font-bold text-xs sm:text-sm" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.6)' }}>98% Match</span>
          <AgeBadge age={show.recommendedAge} />
          <span className="text-nf-gray-200 text-xs sm:text-sm font-medium" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.6)' }}>Séries</span>
        </div>

        {show.description && show.description.length > 5 && (
          <p
            className="hidden sm:block text-sm md:text-base text-nf-gray-100 mt-3 mb-6 line-clamp-3 max-w-xl leading-relaxed"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.45)' }}
          >
            {show.description}
          </p>
        )}

        <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
          <button
            onClick={() => onEdit(show)}
            className="flex h-11 items-center gap-2 rounded-full bg-white px-5 sm:px-7 text-sm sm:text-base font-semibold text-nf-black shadow-lg transition-colors hover:bg-white/80"
          >
            <Pencil className="h-4 w-4 sm:h-5 sm:w-5" />
            Editar
          </button>

          <button
            onClick={() => onMoreInfo(show)}
            className="flex h-11 items-center gap-2 rounded-full bg-[rgba(109,109,110,0.7)] px-5 sm:px-7 text-sm sm:text-base font-semibold text-white shadow-lg transition-colors hover:bg-[rgba(109,109,110,0.4)]"
          >
            <Info className="h-4 w-4 sm:h-5 sm:w-5" />
            Mais Info
          </button>

          {onToggleWatchlist && (
            <button
              onClick={onToggleWatchlist}
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-full border-2 shadow-lg transition-all duration-150 hover:scale-110',
                isInWatchlist
                  ? 'border-green-500 bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  : 'border-nf-gray-100/70 bg-black/40 text-white hover:border-white hover:bg-black/50'
              )}
              aria-label={isInWatchlist ? 'Remover da lista' : 'Adicionar à lista'}
            >
              {isInWatchlist ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
