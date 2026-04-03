'use client';

import { Pencil, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { TvShow } from '@/lib/api';
import { titleToGradient } from '@/lib/utils';
import { AgeBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ShowDetailModalProps {
  show: TvShow | null;
  onClose: () => void;
  onEdit: (show: TvShow) => void;
  onDelete: (show: TvShow) => void;
}

export function ShowDetailModal({ show, onClose, onEdit, onDelete }: ShowDetailModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!show) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [show, onClose]);

  if (!mounted || !show || typeof window === 'undefined') return null;

  const gradientStr = titleToGradient(show.title);
  const updatedAt = new Date(show['@lastUpdated']).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto px-4 py-8">
      {/* Backdrop */}
      <button
        type="button"
        className="fixed inset-0 bg-black/70 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Fechar modal"
      />

      {/* Modal Content */}
      <div
        className="relative z-[101] w-full max-w-3xl overflow-hidden rounded-lg bg-nf-card shadow-2xl animate-[scale-in_200ms_ease-out_forwards]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero Section — backdrop image or gradient */}
        <div className="relative h-[300px] md:h-[400px] w-full">
          {show.backdropUrl ? (
            <Image
              src={show.backdropUrl}
              alt=""
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          ) : (
            <div className="absolute inset-0" style={{ backgroundImage: gradientStr }} />
          )}

          {/* Gradient overlays for text legibility */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(20,20,20,1) 0%, rgba(20,20,20,0.6) 40%, transparent 70%)' }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-nf-card/80 text-white transition-colors hover:bg-nf-card"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Title + actions over backdrop */}
          <div className="absolute bottom-6 left-6 right-6 z-10">
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}
            >
              {show.title}
            </h2>

            <div className="flex items-center gap-3">
              <Button
                variant="netflix"
                onClick={() => {
                  onClose();
                  onEdit(show);
                }}
                className="flex items-center gap-2 px-6 py-2.5 h-auto text-sm rounded font-bold"
              >
                <Pencil className="w-4 h-4" />
                Editar
              </Button>
              <Button
                variant="netflixOutline"
                onClick={() => {
                  onClose();
                  onDelete(show);
                }}
                className="flex items-center gap-2 bg-[rgba(109,109,110,0.7)] hover:bg-[rgba(109,109,110,0.4)] px-6 py-2.5 h-auto text-sm rounded font-bold"
              >
                <Trash2 className="w-4 h-4" />
                Excluir
              </Button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-6">
          {/* Metadata row */}
          <div className="mb-4 flex items-center gap-3">
            <span className="text-sm font-bold text-green-500">98% Match</span>
            <AgeBadge age={show.recommendedAge} />
            <span className="text-sm text-nf-gray-200">Séries</span>
          </div>

          {/* Description — full, no line-clamp */}
          {show.description && show.description.length > 5 && (
            <p className="text-sm leading-relaxed text-nf-gray-100 mb-6">
              {show.description}
            </p>
          )}

          {/* Divider */}
          <div className="h-px bg-nf-gray-400/30 mb-4" />

          {/* Extra metadata */}
          <div className="flex flex-col gap-1.5 text-xs text-nf-gray-200">
            <p>
              <span className="text-nf-gray-300">Atualizado em:</span>{' '}
              <span className="text-nf-gray-100">{updatedAt}</span>
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
