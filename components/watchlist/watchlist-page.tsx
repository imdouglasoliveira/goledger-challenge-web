'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import type { TvShow, Watchlist } from '@/lib/api';
import { useWatchlists, useCreateWatchlist, useUpdateWatchlist, useDeleteWatchlist } from '@/lib/hooks/use-watchlist';
import { useTvShows } from '@/lib/hooks/use-tvshows';
import { useSeasonsForShow } from '@/lib/hooks/use-seasons';
import { useEpisodesForSeason } from '@/lib/hooks/use-episodes';
import { SeasonListInline } from '@/components/tvshows/season-list-inline';
import { EpisodeListInline } from '@/components/tvshows/episode-list-inline';
import { WatchlistForm } from './watchlist-form';
import { LoadingPage } from '@/components/states/loading-card';
import { EmptyState } from '@/components/states/empty-state';
import { ErrorState } from '@/components/states/error-state';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { PageHero } from '@/components/layout/page-hero';
import { CarouselRow } from '@/components/layout/carousel-row';
import { WatchlistBrowseCard } from '@/components/shared/watchlist-browse-card';
import { ShowBrowseCard } from '@/components/shared/show-browse-card';

type FormMode = { type: 'closed' } | { type: 'create' } | { type: 'edit'; watchlist: Watchlist };

const CAROUSEL_LIMIT = 20;

export function WatchlistPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [formMode, setFormMode] = useState<FormMode>({ type: 'closed' });
  const [confirmDelete, setConfirmDelete] = useState<Watchlist | null>(null);

  // URL-driven navigation state
  const selectedTitle = searchParams.get('wl');
  const drillShowTitle = searchParams.get('show');
  const drillSeasonNum = searchParams.get('season');

  const navigate = useCallback((params: { wl?: string; show?: string; season?: string } | null) => {
    if (!params) {
      router.push('/watchlist');
      return;
    }
    const sp = new URLSearchParams();
    if (params.wl) sp.set('wl', params.wl);
    if (params.show) sp.set('show', params.show);
    if (params.season) sp.set('season', params.season);
    router.push(`/watchlist?${sp.toString()}`);
  }, [router]);

  useEffect(() => {
    const openCreate = () => setFormMode({ type: 'create' });
    window.addEventListener('open-create-watchlist', openCreate);
    return () => window.removeEventListener('open-create-watchlist', openCreate);
  }, []);

  // Scroll to top on navigation changes
  useEffect(() => {
    if (selectedTitle) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedTitle, drillShowTitle, drillSeasonNum]);

  const { data, isLoading, error, refetch } = useWatchlists(250);
  const { data: showsData } = useTvShows(250);
  const createMutation = useCreateWatchlist();
  const updateMutation = useUpdateWatchlist();
  const deleteMutation = useDeleteWatchlist();

  const watchlists = data?.result ?? [];
  const shows = showsData?.result ?? [];

  // Resolve entities from URL params
  const selectedWatchlist = useMemo(() => {
    if (!selectedTitle) return null;
    return watchlists.find((w) => w.title === selectedTitle) ?? null;
  }, [selectedTitle, watchlists]);

  const drillShow = useMemo(() => {
    if (!drillShowTitle) return null;
    return shows.find((s) => s.title === drillShowTitle) ?? null;
  }, [drillShowTitle, shows]);

  // Watchlists ordenadas por count desc (para hero + "Maiores")
  const watchlistsByCount = useMemo(() => {
    return [...watchlists].sort((a, b) => (b.tvShows?.length ?? 0) - (a.tvShows?.length ?? 0));
  }, [watchlists]);

  // Watchlists ordenadas por update desc (para "Recentes")
  const watchlistsByRecent = useMemo(() => {
    return [...watchlists].sort((a, b) =>
      new Date(b['@lastUpdated']).getTime() - new Date(a['@lastUpdated']).getTime()
    );
  }, [watchlists]);

  // Featured watchlist: a que tem mais shows
  const featuredWatchlist = useMemo(() => {
    if (watchlistsByCount.length === 0) return null;
    return watchlistsByCount[0];
  }, [watchlistsByCount]);

  // Resolve o backdrop da featured watchlist
  const featuredBackdrop = useMemo(() => {
    if (!featuredWatchlist) return null;
    const showMap = new Map(shows.map((s) => [s.title, s]));
    const firstShow = (featuredWatchlist.tvShows ?? [])
      .map((ref) => showMap.get(ref.title))
      .find((s): s is TvShow => s != null);
    return firstShow?.backdropUrl || firstShow?.posterUrl || null;
  }, [featuredWatchlist, shows]);

  // Resolve shows de uma watchlist selecionada
  const resolvedDetailShows = useMemo(() => {
    if (!selectedWatchlist) return [];
    const showMap = new Map(shows.map((s) => [s.title, s]));
    return (selectedWatchlist.tvShows ?? [])
      .map((ref) => showMap.get(ref.title))
      .filter((s): s is TvShow => s != null);
  }, [selectedWatchlist, shows]);

  const { seasons: drillSeasons, isLoading: seasonsLoading } = useSeasonsForShow(drillShow?.title ?? '');

  const drillSeason = useMemo(() => {
    if (drillSeasonNum == null) return null;
    const num = Number(drillSeasonNum);
    return drillSeasons.find((s) => s.number === num) ?? null;
  }, [drillSeasonNum, drillSeasons]);

  const { episodes: drillEpisodes, isLoading: episodesLoading } = useEpisodesForSeason(
    drillShow?.title ?? '',
    drillSeason?.number,
  );

  function handleCreate(formData: { title: string; description?: string; tvShows?: { '@assetType': 'tvShows'; title: string }[] }) {
    createMutation.mutate(formData, {
      onSuccess: () => {
        setFormMode({ type: 'closed' });
        toast.success('Watchlist criada', { description: formData.title });
        confetti({
          particleCount: 90,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#E50914', '#E5E5E5', '#FFD700'],
        });
      },
    });
  }

  function handleUpdate(formData: { title: string; description?: string; tvShows?: { '@assetType': 'tvShows'; title: string }[] }) {
    updateMutation.mutate(formData, {
      onSuccess: () => {
        setFormMode({ type: 'closed' });
        toast.success('Watchlist atualizada', { description: formData.title });
      },
    });
  }

  function handleDelete(watchlist: Watchlist) {
    deleteMutation.mutate(watchlist.title, {
      onSuccess: () => {
        setConfirmDelete(null);
        if (selectedTitle === watchlist.title) {
          navigate(null);
        }
        toast.success('Watchlist excluída', { description: watchlist.title });
      },
    });
  }

  if (isLoading) return <LoadingPage />;

  if (error) {
    return (
      <div className="min-h-screen px-4 pt-40 md:px-12">
        <ErrorState title="Falha ao carregar watchlists" message={error.message} onRetry={() => refetch()} />
      </div>
    );
  }

  if (watchlists.length === 0) {
    return (
      <div className="min-h-screen px-4 pt-40 md:px-12">
        <EmptyState
          title="Nenhuma watchlist cadastrada"
          description="Crie sua primeira lista para começar a organizar os shows que você quer acompanhar."
        >
          <Button variant="netflix" onClick={() => setFormMode({ type: 'create' })}>
            <Plus className="mr-1 h-4 w-4" /> Nova Lista
          </Button>
        </EmptyState>

        <Modal open={formMode.type !== 'closed'} onClose={() => setFormMode({ type: 'closed' })} title="Nova Watchlist" size="xl">
          <WatchlistForm
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

  // Detail view — drill-down: shows → seasons → episodes
  if (selectedWatchlist) {
    const showCount = resolvedDetailShows.length;
    const updatedAt = new Date(selectedWatchlist['@lastUpdated']).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    // Hero context changes per drill-down level
    const heroTitle = drillSeason
      ? `Temporada ${drillSeason.number}`
      : drillShow
        ? drillShow.title
        : selectedWatchlist.title;

    const heroSubtitle = drillSeason
      ? drillShow?.title ?? ''
      : drillShow
        ? `${drillSeasons.length} ${drillSeasons.length === 1 ? 'temporada' : 'temporadas'}`
        : `${showCount} ${showCount === 1 ? 'show' : 'shows'}`;

    const heroDescription = drillSeason
      ? undefined
      : drillShow
        ? drillShow.description
        : selectedWatchlist.description;

    const heroBackdrop = drillShow
      ? drillShow.backdropUrl || drillShow.posterUrl || null
      : resolvedDetailShows[0]?.backdropUrl || resolvedDetailShows[0]?.posterUrl || null;

    const heroMetadataLabel = drillSeason
      ? drillShow?.title ?? ''
      : drillShow
        ? 'Série'
        : 'Coleção';

    const handleBack = () => {
      if (drillSeason) {
        navigate({ wl: selectedTitle!, show: drillShowTitle! });
      } else if (drillShow) {
        navigate({ wl: selectedTitle! });
      } else {
        navigate(null);
      }
    };

    return (
      <div className="relative min-h-screen overflow-x-clip pb-24">
        <PageHero
          title={heroTitle}
          subtitle={heroSubtitle}
          description={heroDescription}
          backdropUrl={heroBackdrop}
          gradientTitle={heroTitle}
          metadata={
            <span className="text-xs font-medium text-nf-gray-200 sm:text-sm" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.6)' }}>{heroMetadataLabel}</span>
          }
          actions={
            <>
              <button
                onClick={handleBack}
                className="flex h-11 items-center gap-2 rounded-full bg-[rgba(109,109,110,0.7)] px-5 sm:px-7 text-sm sm:text-base font-semibold text-white shadow-lg transition-colors hover:bg-[rgba(109,109,110,0.4)]"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                Voltar
              </button>
              {!drillShow && (
                <>
                  <button
                    onClick={() => setFormMode({ type: 'edit', watchlist: selectedWatchlist })}
                    className="flex h-11 items-center gap-2 rounded-full bg-white px-5 sm:px-7 text-sm sm:text-base font-semibold text-nf-black shadow-lg transition-colors hover:bg-white/80"
                  >
                    <Pencil className="h-4 w-4 sm:h-5 sm:w-5" />
                    Editar
                  </button>
                  <button
                    onClick={() => setConfirmDelete(selectedWatchlist)}
                    className="flex h-11 items-center gap-2 rounded-full border border-white/30 bg-black/40 px-5 sm:px-7 text-sm sm:text-base font-semibold text-nf-gray-100 shadow-lg backdrop-blur-sm transition-colors hover:border-nf-red hover:text-nf-red hover:bg-nf-red/10"
                  >
                    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    Excluir
                  </button>
                </>
              )}
            </>
          }
        />

        <div className="relative z-10 -mt-6 md:-mt-16 pb-8">
          {/* Level 3: Episodes */}
          {drillSeason ? (
            <div className="px-4 md:px-12">
              <EpisodeListInline episodes={drillEpisodes} isLoading={episodesLoading} />
            </div>
          ) : drillShow ? (
            /* Level 2: Seasons */
            <div className="px-4 md:px-12">
              <SeasonListInline
                seasons={drillSeasons}
                isLoading={seasonsLoading}
                onSelectSeason={(s) => navigate({ wl: selectedTitle!, show: drillShowTitle!, season: String(s.number) })}
                backdropUrl={drillShow.backdropUrl || drillShow.posterUrl}
                showTitle={drillShow.title}
              />
            </div>
          ) : (
            /* Level 1: Shows in watchlist */
            <>
              {resolvedDetailShows.length === 0 ? (
                <div className="px-4 md:px-12">
                  <EmptyState
                    title="Nenhum show nesta lista"
                    description="Edite a watchlist para adicionar shows."
                  >
                    <Button variant="netflix" onClick={() => setFormMode({ type: 'edit', watchlist: selectedWatchlist })}>
                      Editar Lista
                    </Button>
                  </EmptyState>
                </div>
              ) : (
                <CarouselRow title="Shows nesta Lista">
                  {resolvedDetailShows.map((show) => (
                    <ShowBrowseCard
                      key={show.title}
                      show={show}
                      onClick={(s) => navigate({ wl: selectedTitle!, show: s.title })}
                    />
                  ))}
                </CarouselRow>
              )}

              <div className="mt-8 border-t border-nf-gray-400/30 pt-3 text-xs text-nf-gray-200 px-4 md:px-12">
                Atualizado em <span className="font-semibold text-nf-gray-100">{updatedAt}</span>
              </div>
            </>
          )}
        </div>

        {/* Modals */}
        <Modal
          open={formMode.type !== 'closed'}
          onClose={() => setFormMode({ type: 'closed' })}
          title={formMode.type === 'create' ? 'Nova Watchlist' : 'Editar Watchlist'}
          size="xl"
        >
          <WatchlistForm
            defaultValues={formMode.type === 'edit' ? formMode.watchlist : undefined}
            shows={shows}
            onSubmit={formMode.type === 'create' ? handleCreate : handleUpdate}
            onCancel={() => setFormMode({ type: 'closed' })}
            isLoading={createMutation.isPending || updateMutation.isPending}
            isEdit={formMode.type === 'edit'}
          />
        </Modal>

        <Modal open={confirmDelete !== null} onClose={() => setConfirmDelete(null)} title="Confirmar exclusão" size="sm">
          <p className="text-sm text-nf-gray-100">
            Você está prestes a excluir a watchlist <strong className="text-white">{confirmDelete?.title}</strong>. Essa ação não pode ser desfeita.
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
              {deleteMutation.isPending ? 'Excluindo...' : 'Excluir watchlist'}
            </Button>
          </div>
        </Modal>

        {!drillShow && (
          <button
            className="touch-target-exempt fixed bottom-6 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-nf-red text-white shadow-lg shadow-nf-red/30 transition-all hover:bg-nf-red-hover active:scale-95 md:hidden"
            style={{ marginBottom: 'var(--safe-bottom)' }}
            onClick={() => setFormMode({ type: 'edit', watchlist: selectedWatchlist })}
            aria-label="Editar watchlist"
          >
            <Pencil className="h-6 w-6" />
          </button>
        )}
      </div>
    );
  }

  // Main View — Hero + Carousel (Netflix-style)
  return (
    <div className="relative min-h-screen overflow-x-clip pb-24">
      {featuredWatchlist && (
        <PageHero
          title={featuredWatchlist.title}
          subtitle={`${featuredWatchlist.tvShows?.length ?? 0} shows`}
          description={featuredWatchlist.description}
          backdropUrl={featuredBackdrop}
          gradientTitle={featuredWatchlist.title}
          actions={
            <>
              <button
                onClick={() => setFormMode({ type: 'edit', watchlist: featuredWatchlist })}
                className="flex h-11 items-center gap-2 rounded-full bg-white px-5 sm:px-7 text-sm sm:text-base font-semibold text-nf-black shadow-lg transition-colors hover:bg-white/80"
              >
                <Pencil className="h-4 w-4 sm:h-5 sm:w-5" />
                Editar
              </button>
              <button
                onClick={() => navigate({ wl: featuredWatchlist.title })}
                className="flex h-11 items-center gap-2 rounded-full bg-[rgba(109,109,110,0.7)] px-5 sm:px-7 text-sm sm:text-base font-semibold text-white shadow-lg transition-colors hover:bg-[rgba(109,109,110,0.4)]"
              >
                Ver Lista
              </button>
            </>
          }
        />
      )}

      <div className="relative z-10 -mt-6 md:-mt-16">
        <CarouselRow title="Suas Listas">
          {watchlistsByCount.slice(0, CAROUSEL_LIMIT).map((wl) => (
            <WatchlistBrowseCard
              key={wl['@key']}
              watchlist={wl}
              shows={shows}
              onEdit={(watchlist) => setFormMode({ type: 'edit', watchlist })}
              onDelete={(watchlist) => setConfirmDelete(watchlist)}
              onClick={(watchlist) => navigate({ wl: watchlist.title })}
            />
          ))}
        </CarouselRow>

        {watchlistsByRecent.length > 1 && (
          <CarouselRow title="Atualizadas Recentemente">
            {watchlistsByRecent.slice(0, CAROUSEL_LIMIT).map((wl) => (
              <WatchlistBrowseCard
                key={wl['@key']}
                watchlist={wl}
                shows={shows}
                onEdit={(watchlist) => setFormMode({ type: 'edit', watchlist })}
                onDelete={(watchlist) => setConfirmDelete(watchlist)}
                onClick={(watchlist) => navigate({ wl: watchlist.title })}
              />
            ))}
          </CarouselRow>
        )}
      </div>

      {/* Modals */}
      <Modal
        open={formMode.type !== 'closed'}
        onClose={() => setFormMode({ type: 'closed' })}
        title={formMode.type === 'create' ? 'Nova Watchlist' : 'Editar Watchlist'}
        size="xl"
      >
        <WatchlistForm
          defaultValues={formMode.type === 'edit' ? formMode.watchlist : undefined}
          shows={shows}
          onSubmit={formMode.type === 'create' ? handleCreate : handleUpdate}
          onCancel={() => setFormMode({ type: 'closed' })}
          isLoading={createMutation.isPending || updateMutation.isPending}
          isEdit={formMode.type === 'edit'}
        />
      </Modal>

      <Modal open={confirmDelete !== null} onClose={() => setConfirmDelete(null)} title="Confirmar exclusão" size="sm">
        <p className="text-sm text-nf-gray-100">
          Você está prestes a excluir a watchlist <strong className="text-white">{confirmDelete?.title}</strong>. Essa ação não pode ser desfeita.
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
            {deleteMutation.isPending ? 'Excluindo...' : 'Excluir watchlist'}
          </Button>
        </div>
      </Modal>

      <button
        className="touch-target-exempt fixed bottom-6 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-nf-red text-white shadow-lg shadow-nf-red/30 transition-all hover:bg-nf-red-hover active:scale-95 md:hidden"
        style={{ marginBottom: 'var(--safe-bottom)' }}
        onClick={() => setFormMode({ type: 'create' })}
        aria-label="Adicionar nova watchlist"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
