'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import type { Watchlist } from '@/lib/api';
import { useWatchlists, useCreateWatchlist, useUpdateWatchlist, useDeleteWatchlist } from '@/lib/hooks/use-watchlist';
import { useTvShows } from '@/lib/hooks/use-tvshows';
import { WatchlistForm } from './watchlist-form';
import { WatchlistCard } from './watchlist-card';
import { LoadingGrid } from '@/components/states/loading-card';
import { EmptyState } from '@/components/states/empty-state';
import { ErrorState } from '@/components/states/error-state';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

type FormMode = { type: 'closed' } | { type: 'create' } | { type: 'edit'; watchlist: Watchlist };

export function WatchlistPage() {
  const [formMode, setFormMode] = useState<FormMode>({ type: 'closed' });
  const [confirmDelete, setConfirmDelete] = useState<Watchlist | null>(null);

  useEffect(() => {
    const openCreate = () => setFormMode({ type: 'create' });
    window.addEventListener('open-create-watchlist', openCreate);
    return () => window.removeEventListener('open-create-watchlist', openCreate);
  }, []);

  const { data, isLoading, error, refetch } = useWatchlists(100);
  const { data: showsData } = useTvShows(100);
  const createMutation = useCreateWatchlist();
  const updateMutation = useUpdateWatchlist();
  const deleteMutation = useDeleteWatchlist();

  const watchlists = data?.result ?? [];
  const shows = showsData?.result ?? [];

  function handleCreate(formData: { title: string; description?: string; tvShows?: { '@assetType': 'tvShows'; title: string }[] }) {
    createMutation.mutate(formData, {
      onSuccess: () => {
        setFormMode({ type: 'closed' });
        toast.success('Watchlist criada', { description: formData.title });
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
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

  function handleDelete(wl: Watchlist) {
    if (!wl) return;
    deleteMutation.mutate(wl.title, {
      onSuccess: () => {
        setConfirmDelete(null);
        toast.success('Watchlist excluída', { description: wl.title });
      },
    });
  }

  if (isLoading) {
    return <LoadingGrid count={6} />;
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 px-4 md:px-12">
        <ErrorState
          title="Falha ao carregar watchlists"
          message={error.message}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (watchlists.length === 0) {
    return (
      <div className="min-h-screen pt-24 px-4 md:px-12">
        <EmptyState
          title="Nenhuma Watchlist"
          description="Comece criando sua primeira lista."
        >
          <Button variant="netflix" onClick={() => setFormMode({ type: 'create' })}>
            <Plus className="h-4 w-4 mr-1" /> Nova Lista
          </Button>
        </EmptyState>

        <Modal
          open={formMode.type !== 'closed'}
          onClose={() => setFormMode({ type: 'closed' })}
          title="Nova Watchlist"
        >
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

  return (
    <div className="min-h-screen pt-24 px-4 md:px-12 pb-24">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Watchlists</h1>
        <span className="text-sm text-nf-gray-300">{watchlists.length} lista(s)</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {watchlists.map((wl) => (
          <WatchlistCard
            key={wl['@key']}
            watchlist={wl}
            onEdit={(w) => setFormMode({ type: 'edit', watchlist: w })}
            onDelete={(w) => setConfirmDelete(w)}
          />
        ))}
      </div>

      <Modal
        open={formMode.type !== 'closed'}
        onClose={() => setFormMode({ type: 'closed' })}
        title={formMode.type === 'create' ? 'Nova Watchlist' : undefined}
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

      <button
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-nf-red text-white shadow-lg shadow-nf-red/30 hover:bg-nf-red-hover hover:scale-105 transition-all flex items-center justify-center cursor-pointer"
        onClick={() => setFormMode({ type: 'create' })}
        aria-label="Adicionar nova watchlist"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
