'use client';

import { Info, Pencil } from 'lucide-react';
import Image from 'next/image';
import type { TvShow } from '@/lib/api';
import { titleToGradient } from '@/lib/utils';
import { AgeBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface HeroBannerProps {
  show: TvShow;
  onEdit: (show: TvShow) => void;
  onMoreInfo: (show: TvShow) => void;
}

export function HeroBanner({ show, onEdit, onMoreInfo }: HeroBannerProps) {
  const gradientStr = titleToGradient(show.title);

  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
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
      <div className="absolute bottom-[15%] left-0 px-4 md:px-12 w-full max-w-2xl z-10">
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.45)' }}
        >
          {show.title}
        </h1>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-green-500 font-bold text-sm" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.6)' }}>98% Match</span>
          <AgeBadge age={show.recommendedAge} />
          <span className="text-nf-gray-200 text-sm font-medium" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.6)' }}>Séries</span>
        </div>

        {show.description && show.description.length > 5 && (
          <p
            className="text-sm md:text-base text-nf-gray-100 mt-3 mb-6 line-clamp-3 max-w-xl leading-relaxed"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.45)' }}
          >
            {show.description}
          </p>
        )}

        <div className="flex items-center gap-3 mt-4">
          <Button
            variant="netflix"
            onClick={() => onEdit(show)}
            className="flex items-center gap-2 px-7 py-3 h-auto text-base rounded shrink-0 shadow-lg font-bold transition-opacity duration-200 hover:opacity-80"
          >
            <Pencil className="w-5 h-5 fill-current" />
            <span>Editar</span>
          </Button>

          <Button
            variant="netflixOutline"
            onClick={() => onMoreInfo(show)}
            className="flex items-center gap-2 bg-[rgba(109,109,110,0.7)] hover:bg-[rgba(109,109,110,0.4)] px-7 py-3 h-auto text-base rounded shrink-0 font-bold transition-opacity duration-200"
          >
            <Info className="w-5 h-5" />
            <span>Mais Info</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
