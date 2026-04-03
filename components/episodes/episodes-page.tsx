'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import type { Episode } from '@/lib/api';
import { useCreateEpisode, useDeleteEpisode, useEpisodes, useUpdateEpisode } from '@/lib/hooks/use-episodes';
import { useSeasons } from '@/lib/hooks/use-seasons';
import { useTvShows } from '@/lib/hooks/use-tvshows';
import { EmptyState } from '@/components/states/empty-state';
import { ErrorState } from '@/components/states/error-state';
import { LoadingGrid } from '@/components/states/loading-card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { EpisodeCard } from './episode-card';
import { EpisodeForm } from './episode-form';

type FormMode = { type: 'closed' } | { type: 'create' } | { type: 'edit'; episode: Episode };

export function EpisodesPage() {
  const [formMode, setFormMode] = useState<FormMode>({ type: 'closed' });
  const [confirmDelete, setConfirmDelete] = useState<Episode | null>(null);
  const [filterShow, setFilterShow] = useState('');
  const [filterSeason, setFilterSeason] = useState('');

  useEffect(() => {
    const openCreate = () => setFormMode({ type: 'create' });
    window.addEventListener('open-create-episode', openCreate);
    return () => window.removeEventListener('open-create-episode', openCreate);
  }, []);

  const { data, isLoading, error, refetch } = useEpisodes(100);
  const { data: seasonsData } = useSeasons(100);
  const { data: showsData } = useTvShows(100);
  const createMutation = useCreateEpisode();
  const updateMutation = useUpdateEpisode();
  const deleteMutation = useDeleteEpisode();

  const episodes = data?.result ?? [];
  const seasons = seasonsData?.result ?? [];
  const shows = showsData?.result ?? [];

  const filteredSeasons = useMemo(() => {
    if (!filterShow) return [];
    return seasons
      .filter((season) => season.tvShow?.title === filterShow)
      .sort((a, b) => a.number - b.number);
  }, [filterShow, seasons]);

  const filteredEpisodes = useMemo(() => {
    return episodes.filter((episode) => {
      if (filterShow && episode.season?.tvShow?.title !== filterShow) return false;
      if (filterSeason && episode.season?.number?.toString() !== filterSeason) return false;
      return true;
    });
  }, [episodes, filterSeason, filterShow]);

  function handleShowFilter(showTitle: string) {
    setFilterShow(showTitle);
    setFilterSeason('');
  }

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
        toast.success('Episodio criado', { description: formData.title });
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
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
        toast.success('Episodio atualizado', { description: formData.title });
      },
    });
  }

  function handleDelete(episode: Episode) {
    deleteMutation.mutate(
      { season: episode.season, episodeNumber: episode.episodeNumber },
      {
        onSuccess: () => {
          setConfirmDelete(null);
          toast.success('Episodio excluído', { description: episode.title });
        },
      }
    );
  }

  if (isLoading) {
    return <LoadingGrid count={6} />;
  }

  if (error) {
    return (
      <div className="min-h-screen px-4 pt-24 md:px-12">
        <ErrorState title="Falha ao carregar episodios" message={error.message} onRetry={() => refetch()} />
      </div>
    );
  }

  if (episodes.length === 0) {
    return (
      <div className="min-h-screen px-4 pt-24 md:px-12">
        <EmptyState title="Nenhum Episodio" description="Comece adicionando seu primeiro episodio.">
          <Button variant="netflix" onClick={() => setFormMode({ type: 'create' })}>
            <Plus className="mr-1 h-4 w-4" /> Novo Episodio
          </Button>
        </EmptyState>

        <Modal open={formMode.type !== 'closed'} onClose={() => setFormMode({ type: 'closed' })} title="Novo Episodio">
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

  return (
    <div className="min-h-screen px-4 pb-24 pt-24 md:px-12">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Episodios</h1>
          <span className="text-sm text-nf-gray-300">{filteredEpisodes.length} episodio(s)</span>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <select
            aria-label="Filtrar episodios por show"
            value={filterShow}
            onChange={(event) => handleShowFilter(event.target.value)}
            className="rounded-md border border-nf-gray-400/30 bg-nf-card px-3 py-2 text-sm text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
          >
            <option value="">Todos os Shows</option>
            {shows.map((show) => (
              <option key={show.title} value={show.title}>
                {show.title}
              </option>
            ))}
          </select>

          <select
            aria-label="Filtrar episodios por temporada"
            value={filterSeason}
            onChange={(event) => setFilterSeason(event.target.value)}
            disabled={!filterShow}
            className="rounded-md border border-nf-gray-400/30 bg-nf-card px-3 py-2 text-sm text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            <option value="">Todas as Temporadas</option>
            {filteredSeasons.map((season) => (
              <option key={`${season.tvShow?.title ?? 'show'}-${season.number}`} value={season.number}>
                Temporada {season.number}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredEpisodes.length === 0 ? (
        <EmptyState
          title="Nenhum episodio encontrado"
          description="Ajuste os filtros ou crie um novo episodio."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredEpisodes.map((episode) => (
            <EpisodeCard
              key={episode['@key']}
              episode={episode}
              onEdit={(item) => setFormMode({ type: 'edit', episode: item })}
              onDelete={(item) => setConfirmDelete(item)}
            />
          ))}
        </div>
      )}

      <Modal
        open={formMode.type !== 'closed'}
        onClose={() => setFormMode({ type: 'closed' })}
        title={formMode.type === 'create' ? 'Novo Episodio' : undefined}
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

      <Modal open={confirmDelete !== null} onClose={() => setConfirmDelete(null)} title="Confirmar Exclusão" size="sm">
        <p className="text-nf-gray-200">
          Tem certeza que deseja excluir <strong className="text-white">{confirmDelete?.title}</strong>?
        </p>
        <div className="mt-6 flex justify-end gap-3">
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
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-nf-red text-white shadow-lg shadow-nf-red/30 transition-all hover:scale-105 hover:bg-nf-red-hover"
        onClick={() => setFormMode({ type: 'create' })}
        aria-label="Adicionar novo episodio"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
