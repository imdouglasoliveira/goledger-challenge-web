'use client';

import { useState, useMemo, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import type { TvShow } from '@/lib/api';
import { useTvShows, useCreateTvShow, useUpdateTvShow, useDeleteTvShow } from '@/lib/hooks/use-tvshows';
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

export function TvShowsPage() {
  const [formMode, setFormMode] = useState<FormMode>({ type: 'closed' });
  const [confirmDelete, setConfirmDelete] = useState<TvShow | null>(null);
  const [detailShow, setDetailShow] = useState<TvShow | null>(null);

  useEffect(() => {
    const openCreate = () => setFormMode({ type: 'create' });
    window.addEventListener('open-create-show', openCreate);
    return () => window.removeEventListener('open-create-show', openCreate);
  }, []);

  const { data, isLoading, error, refetch } = useTvShows(100);
  const createMutation = useCreateTvShow();
  const updateMutation = useUpdateTvShow();
  const deleteMutation = useDeleteTvShow();

  const shows = data?.result ?? [];

  function handleCreate(formData: { title: string; description: string; recommendedAge: number }) {
    createMutation.mutate(formData, {
      onSuccess: () => {
        setFormMode({ type: 'closed' });
        toast.success('Show criado', { description: formData.title });
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E50914', '#E5E5E5', '#FFD700'],
        });
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
    if (!show) return;
    deleteMutation.mutate(show.title, {
      onSuccess: () => {
        setConfirmDelete(null);
        toast.success('Show excluído', { description: show.title });
      },
    });
  }

  // Derived state
  const featuredShow = useMemo(() => {
    if (shows.length === 0) return null;
    // Pseudo-random but stable: hash based on shows.length so it changes when list changes
    let hash = 0;
    for (const s of shows) {
      for (let i = 0; i < s.title.length; i++) {
        hash = s.title.charCodeAt(i) + ((hash << 5) - hash);
      }
    }
    return shows[Math.abs(hash) % shows.length];
  }, [shows]);
  
  const recentShows = useMemo(() => {
    return [...shows]
      .sort((a, b) => new Date(b['@lastUpdated']).getTime() - new Date(a['@lastUpdated']).getTime())
      .slice(0, 10);
  }, [shows]);

  const matureShows = useMemo(() => {
    return shows.filter(s => s.recommendedAge >= 16);
  }, [shows]);

  // Loading state
  if (isLoading) {
    return <LoadingPage />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen pt-24 px-4 md:px-12">
        <ErrorState
          title="Falha ao carregar TV Shows"
          message={error.message}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  // Empty state
  if (shows.length === 0) {
    return (
      <div className="min-h-screen pt-24 px-4 md:px-12">
        <EmptyState
          title="Nenhum TV Show"
          description="Comece adicionando seu primeiro show."
        >
          <Button variant="netflix" onClick={() => setFormMode({ type: 'create' })}>
            <Plus className="h-4 w-4 mr-1" /> Novo Show
          </Button>
        </EmptyState>

        {/* Modal: Create */}
        <Modal 
          open={formMode.type !== 'closed'} 
          onClose={() => setFormMode({ type: 'closed' })} 
          title="Novo TV Show"
        >
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

  // Main UI
  return (
    <div className="min-h-screen pb-24 relative overflow-x-clip">
      {/* Hero */}
      {featuredShow && (
        <HeroBanner
          show={featuredShow}
          onEdit={(s) => setFormMode({ type: 'edit', show: s })}
          onMoreInfo={(s) => setDetailShow(s)}
        />
      )}

      {/* Content area — overlaps hero bottom */}
      <div className="-mt-16 relative z-10" data-content-area>
        {/* Row: Todos os Shows */}
        <CarouselRow title="Todos os Shows">
          {shows.map(show => (
            <TvShowThumbnail 
              key={show['@key']} 
              show={show} 
              onEdit={(s) => setFormMode({ type: 'edit', show: s })} 
              onDelete={(s) => setConfirmDelete(s)}
              onMoreInfo={(s) => setDetailShow(s)}
            />
          ))}
        </CarouselRow>

        {/* Row: Atualizados Recentemente */}
        {recentShows.length > 0 && (
          <CarouselRow title="Atualizados Recentemente">
            {recentShows.map(show => (
              <TvShowThumbnail 
                key={show['@key']} 
                show={show} 
                onEdit={(s) => setFormMode({ type: 'edit', show: s })} 
                onDelete={(s) => setConfirmDelete(s)}
                onMoreInfo={(s) => setDetailShow(s)}
              />
            ))}
          </CarouselRow>
        )}

        {/* Row: Maduros 16+ */}
        {matureShows.length > 0 && (
          <CarouselRow title="Para Maiores de 16">
            {matureShows.map(show => (
              <TvShowThumbnail
                key={show['@key']}
                show={show}
                onEdit={(s) => setFormMode({ type: 'edit', show: s })}
                onDelete={(s) => setConfirmDelete(s)}
                onMoreInfo={(s) => setDetailShow(s)}
              />
            ))}
          </CarouselRow>
        )}
      </div>

      {/* Modal: Create/Edit */}
      <Modal 
        open={formMode.type !== 'closed'} 
        onClose={() => setFormMode({ type: 'closed' })} 
        title={formMode.type === 'create' ? 'Novo TV Show' : undefined}
      >
        <TvShowForm
          defaultValues={formMode.type === 'edit' ? formMode.show : undefined}
          onSubmit={formMode.type === 'create' ? handleCreate : handleUpdate}
          onCancel={() => setFormMode({ type: 'closed' })}
          isLoading={createMutation.isPending || updateMutation.isPending}
          isEdit={formMode.type === 'edit'}
        />
      </Modal>

      {/* Modal: Delete Confirmation */}
      <Modal 
        open={confirmDelete !== null} 
        onClose={() => setConfirmDelete(null)} 
        title="Confirmar Exclusão" 
        size="sm"
      >
        <p className="text-nf-gray-200">
          Tem certeza que deseja excluir <strong className="text-white">{confirmDelete?.title}</strong>?
        </p>
        <div className="flex gap-3 justify-end mt-6">
          <Button
            variant="netflixOutline"
            onClick={() => setConfirmDelete(null)}
          >
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

      {/* Modal: Show Details */}
      <ShowDetailModal
        show={detailShow}
        onClose={() => setDetailShow(null)}
        onEdit={(s) => { setDetailShow(null); setFormMode({ type: 'edit', show: s }); }}
        onDelete={(s) => { setDetailShow(null); setConfirmDelete(s); }}
      />

      {/* FAB: Floating Action Button */}
      <button
        className="fixed bottom-6 right-4 sm:right-6 z-40 w-14 h-14 rounded-full bg-nf-red text-white shadow-lg shadow-nf-red/30 hover:bg-nf-red-hover active:scale-95 sm:hover:scale-105 transition-all flex items-center justify-center cursor-pointer touch-target-exempt"
        style={{ marginBottom: 'var(--safe-bottom)' }}
        onClick={() => setFormMode({ type: 'create' })}
        aria-label="Adicionar novo TV Show"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
