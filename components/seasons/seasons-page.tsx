'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import type { Season } from '@/lib/api';
import { useSeasons, useCreateSeason, useUpdateSeason, useDeleteSeason } from '@/lib/hooks/use-seasons';
import { useTvShows } from '@/lib/hooks/use-tvshows';
import { SeasonForm } from './season-form';
import { SeasonCard } from './season-card';
import { LoadingGrid } from '@/components/states/loading-card';
import { EmptyState } from '@/components/states/empty-state';
import { ErrorState } from '@/components/states/error-state';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

type FormMode = { type: 'closed' } | { type: 'create' } | { type: 'edit'; season: Season };

export function SeasonsPage() {
  const [formMode, setFormMode] = useState<FormMode>({ type: 'closed' });
  const [confirmDelete, setConfirmDelete] = useState<Season | null>(null);
  const [filterShow, setFilterShow] = useState('');

  useEffect(() => {
    const openCreate = () => setFormMode({ type: 'create' });
    window.addEventListener('open-create-season', openCreate);
    return () => window.removeEventListener('open-create-season', openCreate);
  }, []);

  const { data, isLoading, error, refetch } = useSeasons(100);
  const { data: showsData } = useTvShows(100);
  const createMutation = useCreateSeason();
  const updateMutation = useUpdateSeason();
  const deleteMutation = useDeleteSeason();

  const seasons = data?.result ?? [];
  const shows = showsData?.result ?? [];
  const filteredSeasons = useMemo(() => {
    if (!filterShow) return seasons;
    return seasons.filter((season) => season.tvShow.title === filterShow);
  }, [filterShow, seasons]);

  function handleCreate(formData: { number: number; tvShow: { '@assetType': 'tvShows'; title: string }; year?: number }) {
    const { year } = formData;

    if (year == null) {
      return;
    }

    createMutation.mutate({ ...formData, year }, {
      onSuccess: () => {
        setFormMode({ type: 'closed' });
        toast.success('Temporada criada', { description: `Temporada ${formData.number} — ${formData.tvShow.title}` });
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E50914', '#E5E5E5', '#FFD700'],
        });
      },
    });
  }

  function handleUpdate(formData: { number: number; tvShow: { '@assetType': 'tvShows'; title: string }; year?: number }) {
    updateMutation.mutate(formData, {
      onSuccess: () => {
        setFormMode({ type: 'closed' });
        toast.success('Temporada atualizada', { description: `Temporada ${formData.number}` });
      },
    });
  }

  function handleDelete(season: Season) {
    if (!season) return;
    deleteMutation.mutate({ number: season.number, tvShow: season.tvShow }, {
      onSuccess: () => {
        setConfirmDelete(null);
        toast.success('Temporada excluída', { description: `Temporada ${season.number} — ${season.tvShow.title}` });
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
          title="Falha ao carregar temporadas"
          message={error.message}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (seasons.length === 0) {
    return (
      <div className="min-h-screen pt-24 px-4 md:px-12">
        <EmptyState
          title="Nenhuma Temporada"
          description="Comece adicionando sua primeira temporada."
        >
          <Button variant="netflix" onClick={() => setFormMode({ type: 'create' })}>
            <Plus className="h-4 w-4 mr-1" /> Nova Temporada
          </Button>
        </EmptyState>

        <Modal
          open={formMode.type !== 'closed'}
          onClose={() => setFormMode({ type: 'closed' })}
          title="Nova Temporada"
        >
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

  return (
    <div className="min-h-screen pt-24 px-4 md:px-12 pb-24">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between sm:block">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Temporadas</h1>
          <span className="text-sm text-nf-gray-300 sm:hidden">{filteredSeasons.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <select
            aria-label="Filtrar temporadas por TV Show"
            value={filterShow}
            onChange={(event) => setFilterShow(event.target.value)}
            className="flex-1 sm:flex-none rounded-md border border-nf-gray-400/30 bg-nf-card px-3 py-2.5 text-sm text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
          >
            <option value="">Todos os Shows</option>
            {shows.map((show) => (
              <option key={show.title} value={show.title}>
                {show.title}
              </option>
            ))}
          </select>
          <span className="hidden sm:inline text-sm text-nf-gray-300">{filteredSeasons.length} temporada(s)</span>
        </div>
      </div>

      {filteredSeasons.length === 0 ? (
        <EmptyState
          title="Nenhuma temporada encontrada"
          description={filterShow ? `Nenhuma temporada encontrada para ${filterShow}.` : 'Nenhuma temporada encontrada.'}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSeasons.map((season) => (
            <SeasonCard
              key={season['@key']}
              season={season}
              onEdit={(s) => setFormMode({ type: 'edit', season: s })}
              onDelete={(s) => setConfirmDelete(s)}
            />
          ))}
        </div>
      )}

      <Modal
        open={formMode.type !== 'closed'}
        onClose={() => setFormMode({ type: 'closed' })}
        title={formMode.type === 'create' ? 'Nova Temporada' : undefined}
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

      <Modal
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        title="Confirmar Exclusão"
        size="sm"
      >
        <p className="text-nf-gray-200">
          Tem certeza que deseja excluir <strong className="text-white">Temporada {confirmDelete?.number}</strong> de {confirmDelete?.tvShow.title}?
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
        className="fixed bottom-6 right-4 sm:right-6 z-40 w-14 h-14 rounded-full bg-nf-red text-white shadow-lg shadow-nf-red/30 hover:bg-nf-red-hover active:scale-95 sm:hover:scale-105 transition-all flex items-center justify-center cursor-pointer touch-target-exempt"
        style={{ marginBottom: 'var(--safe-bottom)' }}
        onClick={() => setFormMode({ type: 'create' })}
        aria-label="Adicionar nova temporada"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
