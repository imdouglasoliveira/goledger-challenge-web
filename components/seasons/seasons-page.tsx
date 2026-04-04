'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, Plus } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import type { Season, TvShow } from '@/lib/api';
import { useSeasons, useCreateSeason, useUpdateSeason, useDeleteSeason, useSeasonsForShow } from '@/lib/hooks/use-seasons';
import { useEpisodesForSeason } from '@/lib/hooks/use-episodes';
import { useTvShows } from '@/lib/hooks/use-tvshows';
import { SeasonForm } from './season-form';
import { LoadingPage } from '@/components/states/loading-card';
import { EmptyState } from '@/components/states/empty-state';
import { ErrorState } from '@/components/states/error-state';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { AgeBadge } from '@/components/ui/badge';
import { HeroBanner } from '@/components/layout/hero-banner';
import { PageHero } from '@/components/layout/page-hero';
import { CarouselRow } from '@/components/layout/carousel-row';
import { ShowBrowseCard } from '@/components/shared/show-browse-card';
import { SeasonListInline } from '@/components/tvshows/season-list-inline';
import { EpisodeListInline } from '@/components/tvshows/episode-list-inline';

type FormMode = { type: 'closed' } | { type: 'create' } | { type: 'edit'; season: Season };

type ViewState =
  | { level: 'shows' }
  | { level: 'seasons'; show: TvShow }
  | { level: 'episodes'; show: TvShow; season: Season };

const CAROUSEL_LIMIT = 20;

export function SeasonsPage() {
  const [formMode, setFormMode] = useState<FormMode>({ type: 'closed' });
  const [confirmDelete, setConfirmDelete] = useState<Season | null>(null);
  const [view, setView] = useState<ViewState>({ level: 'shows' });

  useEffect(() => {
    const openCreate = () => setFormMode({ type: 'create' });
    window.addEventListener('open-create-season', openCreate);
    return () => window.removeEventListener('open-create-season', openCreate);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view.level]);

  const { data, isLoading, error, refetch } = useSeasons(400);
  const { data: showsData } = useTvShows(250);
  const createMutation = useCreateSeason();
  const updateMutation = useUpdateSeason();
  const deleteMutation = useDeleteSeason();

  const seasons = data?.result ?? [];
  const shows = showsData?.result ?? [];

  // Seasons do show selecionado (drill-down)
  const { seasons: seasonsForShow, isLoading: seasonsForShowLoading } = useSeasonsForShow(
    view.level !== 'shows' ? view.show.title : ''
  );

  // Episodes for selected season (drill-down)
  const { episodes, isLoading: episodesLoading } = useEpisodesForSeason(
    view.level === 'episodes' ? view.show.title : '',
    view.level === 'episodes' ? view.season.number : undefined
  );

  // Shows que têm temporadas, com contagem, ordenados por count desc
  const showsWithSeasons = useMemo(() => {
    const seasonCountMap = new Map<string, number>();
    for (const s of seasons) {
      const title = s.tvShow?.title;
      if (title) {
        seasonCountMap.set(title, (seasonCountMap.get(title) ?? 0) + 1);
      }
    }
    return shows
      .filter((show) => seasonCountMap.has(show.title))
      .map((show) => ({
        show,
        seasonCount: seasonCountMap.get(show.title) ?? 0,
      }))
      .sort((a, b) => b.seasonCount - a.seasonCount);
  }, [shows, seasons]);

  // Featured show: o que tem mais temporadas
  const featuredShow = useMemo(() => {
    if (showsWithSeasons.length === 0) return null;
    return showsWithSeasons[0];
  }, [showsWithSeasons]);

  // Séries com 3+ temporadas (para segunda row)
  const manySeasons = useMemo(() => {
    return showsWithSeasons.filter(({ seasonCount }) => seasonCount >= 3);
  }, [showsWithSeasons]);

  function handleCreate(formData: { number: number; tvShow: { '@assetType': 'tvShows'; title: string }; year?: number }) {
    const { year } = formData;
    if (year == null) return;

    createMutation.mutate({ ...formData, year }, {
      onSuccess: () => {
        setFormMode({ type: 'closed' });
        toast.success('Temporada criada', { description: `Temporada ${formData.number} — ${formData.tvShow.title}` });
        confetti({
          particleCount: 90,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#E50914', '#E5E5E5', '#FFD700'],
        });
      },
    });
  }

  function handleUpdate(formData: { number: number; tvShow: { '@assetType': 'tvShows'; title: string }; year?: number }) {
    updateMutation.mutate(formData, {
      onSuccess: () => {
        setFormMode({ type: 'closed' });
        toast.success('Temporada atualizada', { description: `${formData.tvShow.title} · T${formData.number}` });
      },
    });
  }

  function handleDelete(season: Season) {
    deleteMutation.mutate({
      number: season.number,
      tvShow: { '@assetType': 'tvShows', title: season.tvShow?.title ?? '' },
    }, {
      onSuccess: () => {
        setConfirmDelete(null);
        if (view.level === 'episodes' && view.season['@key'] === season['@key']) {
          setView({ level: 'seasons', show: view.show });
        }
        toast.success('Temporada excluída', { description: `${season.tvShow?.title} · T${season.number}` });
      },
    });
  }

  if (isLoading) return <LoadingPage />;

  if (error) {
    return (
      <div className="min-h-screen px-4 pt-40 md:px-12">
        <ErrorState title="Falha ao carregar temporadas" message={error.message} onRetry={() => refetch()} />
      </div>
    );
  }

  if (seasons.length === 0) {
    return (
      <div className="min-h-screen px-4 pt-40 md:px-12">
        <EmptyState
          title="Nenhuma temporada cadastrada"
          description="Adicione temporadas para estruturar os episódios de cada série."
        >
          <Button variant="netflix" onClick={() => setFormMode({ type: 'create' })}>
            <Plus className="mr-1 h-4 w-4" /> Nova Temporada
          </Button>
        </EmptyState>

        <Modal open={formMode.type !== 'closed'} onClose={() => setFormMode({ type: 'closed' })} title="Nova Temporada" size="lg">
          <SeasonForm
            shows={shows}
            onSubmit={handleCreate}
            onCancel={() => setFormMode({ type: 'closed' })}
            isLoading={createMutation.isPending}
            isEdit={false}
          />
        </Modal>
      </div>
    );
  }

  // Drill-down views (seasons / episodes)
  if (view.level !== 'shows') {
    const updatedAt = new Date(view.show['@lastUpdated']).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    return (
      <div className="relative min-h-screen overflow-x-clip pb-24">
        <PageHero
          title={view.show.title}
          subtitle={
            view.level === 'seasons'
              ? `${seasonsForShow.length} temporada${seasonsForShow.length !== 1 ? 's' : ''}`
              : `Temporada ${view.season.number}${view.season.year ? ` (${view.season.year})` : ''} — ${episodes.length} episódio${episodes.length !== 1 ? 's' : ''}`
          }
          description={view.show.description}
          backdropUrl={view.show.backdropUrl}
          gradientTitle={view.show.title}
          metadata={
            <>
              <span className="text-xs font-bold text-green-500 sm:text-sm" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.6)' }}>98% match</span>
              <AgeBadge age={view.show.recommendedAge} />
              <span className="text-xs font-medium text-nf-gray-200 sm:text-sm" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.6)' }}>Série</span>
            </>
          }
          actions={
            <>
              <button
                onClick={() => {
                  if (view.level === 'episodes') {
                    setView({ level: 'seasons', show: view.show });
                  } else {
                    setView({ level: 'shows' });
                  }
                }}
                className="flex h-11 items-center gap-2 rounded-full bg-[rgba(109,109,110,0.7)] px-5 sm:px-7 text-sm sm:text-base font-semibold text-white shadow-lg transition-colors hover:bg-[rgba(109,109,110,0.4)]"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                {view.level === 'episodes' ? 'Temporadas' : 'Voltar'}
              </button>
              {view.level === 'seasons' && (
                <button
                  onClick={() => setFormMode({ type: 'create' })}
                  className="flex h-11 items-center gap-2 rounded-full bg-white px-5 sm:px-7 text-sm sm:text-base font-semibold text-nf-black shadow-lg transition-colors hover:bg-white/80"
                >
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                  Nova Temporada
                </button>
              )}
            </>
          }
        />

        <div className="relative z-10 -mt-6 md:-mt-16 px-4 pb-8 md:px-12">
          {/* Level: Seasons for a show */}
          {view.level === 'seasons' && (
            <>
              <h3 className="mb-4 text-lg font-semibold text-white sm:text-xl">Temporadas</h3>
              <SeasonListInline
                seasons={seasonsForShow}
                isLoading={seasonsForShowLoading}
                onSelectSeason={(season) => setView({ level: 'episodes', show: view.show, season })}
                onEdit={(season) => setFormMode({ type: 'edit', season })}
                onDelete={(season) => setConfirmDelete(season)}
                backdropUrl={view.show.backdropUrl}
                showTitle={view.show.title}
              />
            </>
          )}

          {/* Level: Episodes for a season */}
          {view.level === 'episodes' && (
            <>
              <h3 className="mb-4 text-lg font-semibold text-white sm:text-xl">Episódios</h3>
              <EpisodeListInline episodes={episodes} isLoading={episodesLoading} />
            </>
          )}

          <div className="mt-8 border-t border-nf-gray-400/30 pt-3 text-xs text-nf-gray-200">
            Atualizado em <span className="font-semibold text-nf-gray-100">{updatedAt}</span>
          </div>
        </div>

        {/* Modals */}
        <Modal
          open={formMode.type !== 'closed'}
          onClose={() => setFormMode({ type: 'closed' })}
          title={formMode.type === 'create' ? 'Nova Temporada' : 'Editar Temporada'}
          size="lg"
        >
          <SeasonForm
            defaultValues={formMode.type === 'edit' ? formMode.season : undefined}
            shows={shows}
            onSubmit={formMode.type === 'create' ? handleCreate : handleUpdate}
            onCancel={() => setFormMode({ type: 'closed' })}
            isLoading={createMutation.isPending || updateMutation.isPending}
            isEdit={formMode.type === 'edit'}
          />
        </Modal>

        <Modal open={confirmDelete !== null} onClose={() => setConfirmDelete(null)} title="Confirmar exclusão" size="sm">
          <p className="text-sm text-nf-gray-100">
            Excluir <strong className="text-white">Temporada {confirmDelete?.number}</strong> de{' '}
            <strong className="text-white">{confirmDelete?.tvShow?.title}</strong>? Essa ação não pode ser desfeita.
          </p>
          <div className="mt-8 flex justify-end gap-3 border-t border-nf-gray-400/30 pt-5">
            <Button variant="netflixOutline" onClick={() => setConfirmDelete(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmDelete && handleDelete(confirmDelete)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Excluindo...' : 'Excluir temporada'}
            </Button>
          </div>
        </Modal>

        <button
          className="touch-target-exempt fixed bottom-6 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-nf-red text-white shadow-lg shadow-nf-red/30 transition-all hover:bg-nf-red-hover active:scale-95 md:hidden"
          style={{ marginBottom: 'var(--safe-bottom)' }}
          onClick={() => setFormMode({ type: 'create' })}
          aria-label="Adicionar nova temporada"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>
    );
  }

  // Shows Level — Hero + Carousel (Netflix-style)
  return (
    <div className="relative min-h-screen overflow-x-clip pb-24">
      {featuredShow && (
        <HeroBanner
          show={featuredShow.show}
          onEdit={() => setView({ level: 'seasons', show: featuredShow.show })}
          onMoreInfo={() => setView({ level: 'seasons', show: featuredShow.show })}
        />
      )}

      <div className="relative z-10 -mt-6 md:-mt-16">
        <CarouselRow title="Todas as Séries">
          {showsWithSeasons.slice(0, CAROUSEL_LIMIT).map(({ show, seasonCount }) => (
            <ShowBrowseCard
              key={show.title}
              show={show}
              subtitle={`${seasonCount} temporada${seasonCount > 1 ? 's' : ''}`}
              onClick={(s) => setView({ level: 'seasons', show: s })}
            />
          ))}
        </CarouselRow>

        {manySeasons.length > 0 && (
          <CarouselRow title="Mais Temporadas">
            {manySeasons.slice(0, CAROUSEL_LIMIT).map(({ show, seasonCount }) => (
              <ShowBrowseCard
                key={show.title}
                show={show}
                subtitle={`${seasonCount} temporada${seasonCount > 1 ? 's' : ''}`}
                onClick={(s) => setView({ level: 'seasons', show: s })}
              />
            ))}
          </CarouselRow>
        )}
      </div>

      {/* Modals */}
      <Modal
        open={formMode.type !== 'closed'}
        onClose={() => setFormMode({ type: 'closed' })}
        title={formMode.type === 'create' ? 'Nova Temporada' : 'Editar Temporada'}
        size="lg"
      >
        <SeasonForm
          defaultValues={formMode.type === 'edit' ? formMode.season : undefined}
          shows={shows}
          onSubmit={formMode.type === 'create' ? handleCreate : handleUpdate}
          onCancel={() => setFormMode({ type: 'closed' })}
          isLoading={createMutation.isPending || updateMutation.isPending}
          isEdit={formMode.type === 'edit'}
        />
      </Modal>

      <button
        className="touch-target-exempt fixed bottom-6 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-nf-red text-white shadow-lg shadow-nf-red/30 transition-all hover:bg-nf-red-hover active:scale-95 md:hidden"
        style={{ marginBottom: 'var(--safe-bottom)' }}
        onClick={() => setFormMode({ type: 'create' })}
        aria-label="Adicionar nova temporada"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
