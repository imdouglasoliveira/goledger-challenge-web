'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { episodesApi } from '@/lib/api';

export const EPISODES_KEY = ['episodes'] as const;

export function useEpisodes(limit = 100) {
  return useQuery({
    queryKey: [...EPISODES_KEY, limit],
    queryFn: () => episodesApi.list(limit),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useCreateEpisode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: episodesApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EPISODES_KEY }),
    onError: (error) => toast.error('Erro ao criar episodio', { description: error.message }),
  });
}

export function useUpdateEpisode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: episodesApi.update,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EPISODES_KEY }),
    onError: (error) => toast.error('Erro ao atualizar episodio', { description: error.message }),
  });
}

export function useDeleteEpisode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: episodesApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EPISODES_KEY }),
    onError: (error) => toast.error('Erro ao excluir episodio', { description: error.message }),
  });
}
