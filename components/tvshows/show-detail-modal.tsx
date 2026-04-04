'use client';

import { useState } from 'react';
import { Check, ChevronLeft, Pencil, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import type { Season, TvShow } from '@/lib/api';
import { cn, titleToGradient } from '@/lib/utils';
import { AgeBadge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { useSeasonsForShow } from '@/lib/hooks/use-seasons';
import { useEpisodesForSeason } from '@/lib/hooks/use-episodes';
import { SeasonListInline } from './season-list-inline';
import { EpisodeListInline } from './episode-list-inline';

interface ShowDetailModalProps {
  show: TvShow | null;
  onClose: () => void;
  onEdit: (show: TvShow) => void;
  onDelete: (show: TvShow) => void;
  isInWatchlist?: boolean;
  onToggleWatchlist?: () => void;
}

export function ShowDetailModal({
  show,
  onClose,
  onEdit,
  onDelete,
  isInWatchlist,
  onToggleWatchlist,
}: ShowDetailModalProps) {
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);

  const { seasons, isLoading: seasonsLoading } = useSeasonsForShow(show?.title ?? '');
  const { episodes, isLoading: episodesLoading } = useEpisodesForSeason(
    show?.title ?? '',
    selectedSeason?.number
  );

  if (!show) return null;

  const gradientStr = titleToGradient(show.title);
  const updatedAt = new Date(show['@lastUpdated']).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  function handleClose() {
    setSelectedSeason(null);
    onClose();
  }

  return (
    <Modal open={Boolean(show)} onClose={handleClose} size="full" contentClassName="p-0">
      <div className="flex min-h-[68vh] flex-col">
        <div className="relative h-[240px] w-full sm:h-[320px] md:h-[420px]">
          {show.backdropUrl ? (
            <Image
              src={show.backdropUrl}
              alt=""
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 1100px"
              priority
            />
          ) : (
            <div className="absolute inset-0" style={{ backgroundImage: gradientStr }} />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-nf-card via-nf-card/60 to-transparent" />

          <div className="absolute bottom-5 left-4 right-4 z-10 sm:bottom-7 sm:left-6 sm:right-6 md:left-8 md:right-8">
            <h2 className="mb-3 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
              {show.title}
            </h2>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => {
                  handleClose();
                  onEdit(show);
                }}
                className="flex h-10 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-nf-black transition-colors hover:bg-white/80"
              >
                <Pencil className="h-4 w-4" />
                Editar
              </button>

              {onToggleWatchlist && (
                <button
                  onClick={onToggleWatchlist}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-150 hover:scale-110',
                    isInWatchlist
                      ? 'border-green-500 bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      : 'border-nf-gray-100/70 bg-black/40 text-white hover:border-white hover:bg-black/50'
                  )}
                  aria-label={isInWatchlist ? 'Remover da lista' : 'Adicionar à lista'}
                >
                  {isInWatchlist ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </button>
              )}

              <button
                onClick={() => {
                  handleClose();
                  onDelete(show);
                }}
                className="flex h-10 items-center gap-2 rounded-full border border-white/30 bg-black/40 px-4 text-sm font-semibold text-nf-gray-100 shadow-lg backdrop-blur-sm transition-colors hover:border-nf-red hover:text-nf-red hover:bg-nf-red/10"
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 px-4 pb-5 pt-5 sm:px-6 md:px-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-nf-gray-100">
            <span className="font-bold text-green-400">98% match</span>
            <AgeBadge age={show.recommendedAge} />
            <span>Série</span>
          </div>

          <p className="max-w-4xl text-sm leading-relaxed text-nf-gray-100 sm:text-base">
            {show.description?.trim() ? show.description : 'Descrição não informada para este título.'}
          </p>

          {/* Drill-down: Temporadas / Episódios */}
          <div className="mt-2 border-t border-nf-gray-400/30 pt-4">
            {selectedSeason ? (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedSeason(null)}
                  className="mb-4 flex items-center gap-1 text-sm font-medium text-nf-gray-100 transition-colors hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Temporada {selectedSeason.number}
                  {selectedSeason.year ? ` (${selectedSeason.year})` : ''}
                </button>
                <EpisodeListInline episodes={episodes} isLoading={episodesLoading} />
              </>
            ) : (
              <>
                <h3 className="mb-3 text-base font-semibold text-white">Temporadas</h3>
                <SeasonListInline
                  seasons={seasons}
                  isLoading={seasonsLoading}
                  onSelectSeason={setSelectedSeason}
                  backdropUrl={show.backdropUrl}
                  showTitle={show.title}
                />
              </>
            )}
          </div>

          <div className="mt-auto border-t border-nf-gray-400/30 pt-3 text-xs text-nf-gray-200">
            Atualizado em <span className="font-semibold text-nf-gray-100">{updatedAt}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
