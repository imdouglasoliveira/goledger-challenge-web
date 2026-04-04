'use client';

import { useState, useMemo, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import type { TvShow } from '@/lib/api';
import { useTvShows, useCreateTvShow, useUpdateTvShow, useDeleteTvShow } from '@/lib/hooks/use-tvshows';
import { useWatchlistLookup } from '@/lib/hooks/use-watchlist';
import { TvShowForm } from './tvshow-form';
import { LoadingPage } from '@/components/states/loading-card';
import { EmptyState } from '@/components/states/empty-state';
import { ErrorState } from '@/components/states/error-state';
import { Button } from '@/components/ui/button';
import { HeroBanner } from '@/components/layout/hero-banner';
import { CarouselRow } from '@/components/layout/carousel-row';
import { TvShowThumbnail } from '@/components/tvshows/tvshow-thumbnail';
import { Modal } from '@/components/ui/modal';
import { ShowDetailModal } from '@/components/tvshows/show-detail-modal';

type FormMode = { type: 'closed' } | { type: 'create' } | { type: 'edit'; show: TvShow };

const HOME_ROW_LIMIT = 16;

export function TvShowsPage() {
  const [formMode, setFormMode] = useState<FormMode>({ type: 'closed' });
  const [confirmDelete, setConfirmDelete] = useState<TvShow | null>(null);
  const [detailShow, setDetailShow] = useState<TvShow | null>(null);
  const [showAllRows, setShowAllRows] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const openCreate = () => setFormMode({ type: 'create' });
    window.addEventListener('open-create-show', openCreate);
    return () => window.removeEventListener('open-create-show', openCreate);
  }, []);

  const { data, isLoading, error, refetch } = useTvShows(300);
  const createMutation = useCreateTvShow();
  const updateMutation = useUpdateTvShow();
  const deleteMutation = useDeleteTvShow();
  const watchlistLookup = useWatchlistLookup();

  const shows = data?.result ?? [];

  function handleCreate(formData: { title: string; description: string; recommendedAge: number }) {
    createMutation.mutate(formData, {
      onSuccess: () => {
        setFormMode({ type: 'closed' });
        toast.success('Show criado', { description: formData.title });
        confetti({ particleCount: 90, spread: 60, origin: { y: 0.65 }, colors: ['#E50914', '#E5E5E5', '#FFD700'] });
      },
    });
  }

  function handleUpdate(formData: { title: string; description: string; recommendedAge: number }) {
    updateMutation.mutate(formData, {
      onSuccess: () => {
        setFormMode({ type: 'closed' });
        toast.success('Show atualizado', { description: formData.title });
      },
    });
  }

  function handleDelete(show: TvShow) {
    deleteMutation.mutate(show.title, {
      onSuccess: () => {
        setConfirmDelete(null);
        toast.success('Show excluído', { description: show.title });
      },
    });
  }

  const featuredShow = useMemo(() => {
    if (shows.length === 0) return null;
    let hash = 0;
    for (const item of shows) {
      for (let i = 0; i < item.title.length; i++) {
        hash = item.title.charCodeAt(i) + ((hash << 5) - hash);
      }
    }
    return shows[Math.abs(hash) % shows.length];
  }, [shows]);

  const recentShows = useMemo(() => {
    return [...shows]
      .sort((a, b) => new Date(b['@lastUpdated']).getTime() - new Date(a['@lastUpdated']).getTime())
      .slice(0, 40);
  }, [shows]);

  const matureShows = useMemo(() => {
    return shows.filter((show) => show.recommendedAge >= 16).slice(0, 40);
  }, [shows]);

  const allShowsForHome = useMemo(() => shows.slice(0, 40), [shows]);

  if (isLoading) return <LoadingPage />;

  if (error) {
    return (
      <div className="min-h-screen px-4 pt-40 md:px-12">
        <ErrorState title="Falha ao carregar TV Shows" message={error.message} onRetry={() => refetch()} />
      </div>
    );
  }

  if (shows.length === 0) {
    return (
      <div className="min-h-screen px-4 pt-40 md:px-12">
        <EmptyState title="Nenhum TV Show" description="Comece adicionando seu primeiro show.">
          <Button variant="netflix" onClick={() => setFormMode({ type: 'create' })}>
            <Plus className="mr-1 h-4 w-4" /> Novo Show
          </Button>
        </EmptyState>

        <Modal open={formMode.type !== 'closed'} onClose={() => setFormMode({ type: 'closed' })} title="Novo TV Show" size="lg">
          <TvShowForm
            onSubmit={handleCreate}
            onCancel={() => setFormMode({ type: 'closed' })}
            isLoading={createMutation.isPending}
            isEdit={false}
          />
        </Modal>
      </div>
    );
  }

  function resolveRowItems(rowKey: string, items: TvShow[]) {
    return showAllRows[rowKey] ? items : items.slice(0, HOME_ROW_LIMIT);
  }

  function resolveRowActionLabel(rowKey: string, totalCount: number) {
    const isExpanded = Boolean(showAllRows[rowKey]);
    if (isExpanded) return 'Mostrar menos';
    if (totalCount <= HOME_ROW_LIMIT) return undefined;
    return `Ver todos (${totalCount})`;
  }

  return (
    <div className="relative min-h-screen overflow-x-clip pb-24">
      {featuredShow ? (
        <HeroBanner
          show={featuredShow}
          onEdit={(show) => setFormMode({ type: 'edit', show })}
          onMoreInfo={(show) => setDetailShow(show)}
          isInWatchlist={watchlistLookup.isInWatchlist(featuredShow.title)}
          onToggleWatchlist={() => watchlistLookup.toggleShow(featuredShow.title)}
        />
      ) : null}

      <div className="relative z-10 -mt-6 md:-mt-16">
        <CarouselRow
          title="Todos os Shows"
          actionLabel={resolveRowActionLabel('all', allShowsForHome.length)}
          onAction={() => setShowAllRows((prev) => ({ ...prev, all: !prev.all }))}
        >
          {resolveRowItems('all', allShowsForHome).map((show) => (
            <TvShowThumbnail
              key={show['@key']}
              show={show}
              onEdit={(item) => setFormMode({ type: 'edit', show: item })}
              onDelete={(item) => setConfirmDelete(item)}
              onMoreInfo={(item) => setDetailShow(item)}
              isInWatchlist={watchlistLookup.isInWatchlist(show.title)}
              onToggleWatchlist={() => watchlistLookup.toggleShow(show.title)}
            />
          ))}
        </CarouselRow>

        {recentShows.length > 0 ? (
          <CarouselRow
            title="Atualizados Recentemente"
            actionLabel={resolveRowActionLabel('recent', recentShows.length)}
            onAction={() => setShowAllRows((prev) => ({ ...prev, recent: !prev.recent }))}
          >
            {resolveRowItems('recent', recentShows).map((show) => (
              <TvShowThumbnail
                key={show['@key']}
                show={show}
                onEdit={(item) => setFormMode({ type: 'edit', show: item })}
                onDelete={(item) => setConfirmDelete(item)}
                onMoreInfo={(item) => setDetailShow(item)}
              />
            ))}
          </CarouselRow>
        ) : null}

        {matureShows.length > 0 ? (
          <CarouselRow
            title="Para Maiores de 16"
            actionLabel={resolveRowActionLabel('mature', matureShows.length)}
            onAction={() => setShowAllRows((prev) => ({ ...prev, mature: !prev.mature }))}
          >
            {resolveRowItems('mature', matureShows).map((show) => (
              <TvShowThumbnail
                key={show['@key']}
                show={show}
                onEdit={(item) => setFormMode({ type: 'edit', show: item })}
                onDelete={(item) => setConfirmDelete(item)}
                onMoreInfo={(item) => setDetailShow(item)}
              />
            ))}
          </CarouselRow>
        ) : null}
      </div>

      <Modal
        open={formMode.type !== 'closed'}
        onClose={() => setFormMode({ type: 'closed' })}
        title={formMode.type === 'create' ? 'Novo TV Show' : undefined}
        size="lg"
      >
        <TvShowForm
          defaultValues={formMode.type === 'edit' ? formMode.show : undefined}
          onSubmit={formMode.type === 'create' ? handleCreate : handleUpdate}
          onCancel={() => setFormMode({ type: 'closed' })}
          isLoading={createMutation.isPending || updateMutation.isPending}
          isEdit={formMode.type === 'edit'}
        />
      </Modal>

      <Modal open={confirmDelete !== null} onClose={() => setConfirmDelete(null)} title="Confirmar exclusão" size="sm">
        <p className="text-sm text-nf-gray-100">
          Excluir <strong className="text-white">{confirmDelete?.title}</strong>? Essa ação remove o show da base.
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
            {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
          </Button>
        </div>
      </Modal>

      <ShowDetailModal
        show={detailShow}
        onClose={() => setDetailShow(null)}
        onEdit={(show) => {
          setDetailShow(null);
          setFormMode({ type: 'edit', show });
        }}
        onDelete={(show) => {
          setDetailShow(null);
          setConfirmDelete(show);
        }}
        isInWatchlist={detailShow ? watchlistLookup.isInWatchlist(detailShow.title) : false}
        onToggleWatchlist={detailShow ? () => watchlistLookup.toggleShow(detailShow.title) : undefined}
      />

      <button
        className="touch-target-exempt fixed bottom-6 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-nf-red text-white shadow-lg shadow-nf-red/30 transition-all hover:bg-nf-red-hover active:scale-95 md:hidden"
        style={{ marginBottom: 'var(--safe-bottom)' }}
        onClick={() => setFormMode({ type: 'create' })}
        aria-label="Adicionar novo TV Show"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
