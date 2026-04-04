'use client';

import Image from 'next/image';
import { titleToGradient } from '@/lib/utils';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  backdropUrl?: string | null;
  gradientTitle?: string;
  metadata?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHero({ title, subtitle, description, backdropUrl, gradientTitle, metadata, actions }: PageHeroProps) {
  const gradientStr = gradientTitle ? titleToGradient(gradientTitle) : titleToGradient(title);

  return (
    <div className="relative w-full h-[45vh] sm:h-[55vh] md:h-[65vh] overflow-hidden">
      {backdropUrl ? (
        <Image
          src={backdropUrl}
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
            {title.charAt(0).toUpperCase()}
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

      <div className="absolute bottom-[14%] sm:bottom-[15%] left-0 px-4 md:px-12 w-full max-w-2xl z-10">
        <h1
          className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4 leading-tight"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.45)' }}
        >
          {title}
        </h1>

        {metadata && (
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            {metadata}
          </div>
        )}

        {subtitle && (
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
            <span className="text-nf-gray-200 text-xs sm:text-sm font-medium" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.6)' }}>
              {subtitle}
            </span>
          </div>
        )}

        {description && description.length > 5 && (
          <p
            className="hidden sm:block text-sm md:text-base text-nf-gray-100 mt-3 mb-6 line-clamp-3 max-w-xl leading-relaxed"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.45)' }}
          >
            {description}
          </p>
        )}

        {actions && (
          <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
