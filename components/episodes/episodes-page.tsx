'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import type { Episode, Season, TvShow } from '@/lib/api';
import { useCreateEpisode, useDeleteEpisode, useEpisodes, useUpdateEpisode } from '@/lib/hooks/use-episodes';
import { useSeasons, useSeasonsForShow } from '@/lib/hooks/use-seasons';
import { useTvShows } from '@/lib/hooks/use-tvshows';
import { EmptyState } from '@/components/states/empty-state';
import { ErrorState } from '@/components/states/error-state';
import { LoadingPage } from '@/components/states/loading-card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { AgeBadge } from '@/components/ui/badge';
import { EpisodeForm } from './episode-form';
import { HeroBanner } from '@/components/layout/hero-banner';
import { PageHero } from '@/components/layout/page-hero';
import { CarouselRow } from '@/components/layout/carousel-row';
import { ShowBrowseCard } from '@/components/shared/show-browse-card';
import { EpisodeListInline } from '@/components/tvshows/episode-list-inline';
import { SeasonListInline } from '@/components/tvshows/season-list-inline';

type FormMode = { type: 'closed' } | { type: 'create' } | { type: 'edit'; episode: Episode };

type ViewState =
  | { level: 'shows' }
  | { level: 'seasons'; show: TvShow }
  | { level: 'episodes'; show: TvShow; season: Season };

const CAROUSEL_LIMIT = 20;

export function EpisodesPage() {
  const [formMode, setFormMode] = useState<FormMode>({ type: 'closed' });
  const [confirmDelete, setConfirmDelete] = useState<Episode | null>(null);
  const [view, setView] = useState<ViewState>({ level: 'shows' });

  useEffect(() => {
    const openCreate = () => setFormMode({ type: 'create' });
    window.addEventListener('open-create-episode', openCreate);
    return () => window.removeEventListener('open-create-episode', openCreate);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view.level]);

  const { data, isLoading, error, refetch } = useEpisodes(700);
  const { data: seasonsData } = useSeasons(400);
  const { data: showsData } = useTvShows(250);
  const createMutation = useCreateEpisode();
  const updateMutation = useUpdateEpisode();
  const deleteMutation = useDeleteEpisode();

  const episodes = data?.result ?? [];
  const seasons = seasonsData?.result ?? [];
  const shows = showsData?.result ?? [];

  // Shows com episódios + contagem, ordenados por count desc
  const showsWithEpisodes = useMemo(() => {
    const episodeCountMap = new Map<string, number>();
    for (const ep of episodes) {
      const title = ep.season?.tvShow?.title;
      if (title) {
        episodeCountMap.set(title, (episodeCountMap.get(title) ?? 0) + 1);
      }
    }
    return shows
      .filter((show) => episodeCountMap.has(show.title))
      .map((show) => ({
        show,
        episodeCount: episodeCountMap.get(show.title) ?? 0,
      }))
      .sort((a, b) => b.episodeCount - a.episodeCount);
  }, [shows, episodes]);

  // Featured show: o que tem mais episódios
  const featuredShow = useMemo(() => {
    if (showsWithEpisodes.length === 0) return null;
    return showsWithEpisodes[0];
  }, [showsWithEpisodes]);

  // Séries com 10+ episódios
  const manyEpisodes = useMemo(() => {
    return showsWithEpisodes.filter(({ episodeCount }) => episodeCount >= 10);
  }, [showsWithEpisodes]);

  // Seasons do show selecionado (drill-down)
  const { seasons: seasonsForShow, isLoading: seasonsForShowLoading } = useSeasonsForShow(
    view.level !== 'shows' ? view.show.title : ''
  );

  // Episodes da season selecionada
  const episodesForSeason = useMemo(() => {
    if (view.level !== 'episodes') return [];
    return episodes
      .filter(
        (e) =>
          e.season?.tvShow?.title === view.show.title &&
          e.season?.number === view.season.number
      )
      .sort((a, b) => a.episodeNumber - b.episodeNumber);
  }, [episodes, view]);

  function handleCreate(formData: {
    season: { '@assetType': 'seasons'; number: number; tvShow: { '@assetType': 'tvShows'; title: string } };
    episodeNumber: number;
    title: string;
    releaseDate: string;
    description: string;
    rating?: number;
  }) {
    createMutation.mutate(formData, {
      onSuccess: () => {
        setFormMode({ type: 'closed' });
        toast.success('Episódio criado', { description: formData.title });
        confetti({
          particleCount: 90,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#E50914', '#E5E5E5', '#FFD700'],
        });
      },
    });
  }

  function handleUpdate(formData: {
    season: { '@assetType': 'seasons'; number: number; tvShow: { '@assetType': 'tvShows'; title: string } };
    episodeNumber: number;
    title: string;
    releaseDate: string;
    description: string;
    rating?: number;
  }) {
    updateMutation.mutate(formData, {
      onSuccess: () => {
        setFormMode({ type: 'closed' });
        toast.success('Episódio atualizado', { description: formData.title });
      },
    });
  }

  function handleDelete(episode: Episode) {
    deleteMutation.mutate(
      {
        season: {
          '@assetType': 'seasons' as const,
          number: episode.season.number,
          tvShow: { '@assetType': 'tvShows' as const, title: episode.season.tvShow?.title ?? '' },
        },
        episodeNumber: episode.episodeNumber,
      },
      {
        onSuccess: () => {
          setConfirmDelete(null);
          toast.success('Episódio excluído', { description: episode.title });
        },
      }
    );
  }

  if (isLoading) return <LoadingPage />;

  if (error) {
    return (
      <div className="min-h-screen px-4 pt-40 md:px-12">
        <ErrorState title="Falha ao carregar episódios" message={error.message} onRetry={() => refetch()} />
      </div>
    );
  }

  if (episodes.length === 0) {
    return (
      <div className="min-h-screen px-4 pt-40 md:px-12">
        <EmptyState
          title="Nenhum episódio cadastrado"
          description="Adicione episódios para acompanhar temporadas com mais controle."
        >
          <Button variant="netflix" onClick={() => setFormMode({ type: 'create' })}>
            <Plus className="mr-1 h-4 w-4" /> Novo Episódio
          </Button>
        </EmptyState>

        <Modal open={formMode.type !== 'closed'} onClose={() => setFormMode({ type: 'closed' })} title="Novo Episódio" size="xl">
          <EpisodeForm
            seasons={seasons}
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
              : `Temporada ${view.season.number}${view.season.year ? ` (${view.season.year})` : ''} — ${episodesForSeason.length} episódio${episodesForSeason.length !== 1 ? 's' : ''}`
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
              {view.level === 'episodes' && (
                <button
                  onClick={() => setFormMode({ type: 'create' })}
                  className="flex h-11 items-center gap-2 rounded-full bg-white px-5 sm:px-7 text-sm sm:text-base font-semibold text-nf-black shadow-lg transition-colors hover:bg-white/80"
                >
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                  Novo Episódio
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
                backdropUrl={view.show.backdropUrl}
                showTitle={view.show.title}
              />
            </>
          )}

          {/* Level: Episodes for a season */}
          {view.level === 'episodes' && (
            <>
              <h3 className="mb-4 text-lg font-semibold text-white sm:text-xl">Episódios</h3>
              <EpisodeListInline episodes={episodesForSeason} />
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
          title={formMode.type === 'create' ? 'Novo Episódio' : 'Editar Episódio'}
          size="xl"
        >
          <EpisodeForm
            defaultValues={formMode.type === 'edit' ? formMode.episode : undefined}
            seasons={seasons}
            onSubmit={formMode.type === 'create' ? handleCreate : handleUpdate}
            onCancel={() => setFormMode({ type: 'closed' })}
            isLoading={createMutation.isPending || updateMutation.isPending}
            isEdit={formMode.type === 'edit'}
          />
        </Modal>

        <Modal open={confirmDelete !== null} onClose={() => setConfirmDelete(null)} title="Confirmar exclusão" size="sm">
          <p className="text-sm text-nf-gray-100">
            Excluir o episódio <strong className="text-white">{confirmDelete?.title}</strong>? Essa ação não pode ser desfeita.
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
              {deleteMutation.isPending ? 'Excluindo...' : 'Excluir episódio'}
            </Button>
          </div>
        </Modal>

        <button
          className="touch-target-exempt fixed bottom-6 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-nf-red text-white shadow-lg shadow-nf-red/30 transition-all hover:bg-nf-red-hover active:scale-95 md:hidden"
          style={{ marginBottom: 'var(--safe-bottom)' }}
          onClick={() => setFormMode({ type: 'create' })}
          aria-label="Adicionar novo episódio"
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
          {showsWithEpisodes.slice(0, CAROUSEL_LIMIT).map(({ show, episodeCount }) => (
            <ShowBrowseCard
              key={show.title}
              show={show}
              subtitle={`${episodeCount} episódio${episodeCount > 1 ? 's' : ''}`}
              onClick={(s) => setView({ level: 'seasons', show: s })}
            />
          ))}
        </CarouselRow>

        {manyEpisodes.length > 0 && (
          <CarouselRow title="Mais Episódios">
            {manyEpisodes.slice(0, CAROUSEL_LIMIT).map(({ show, episodeCount }) => (
              <ShowBrowseCard
                key={show.title}
                show={show}
                subtitle={`${episodeCount} episódio${episodeCount > 1 ? 's' : ''}`}
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
        title={formMode.type === 'create' ? 'Novo Episódio' : 'Editar Episódio'}
        size="xl"
      >
        <EpisodeForm
          defaultValues={formMode.type === 'edit' ? formMode.episode : undefined}
          seasons={seasons}
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
        aria-label="Adicionar novo episódio"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
