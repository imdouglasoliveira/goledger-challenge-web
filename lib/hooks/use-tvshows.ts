'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { tvShowsApi } from '@/lib/api';

export const TVSHOWS_KEY = ['tvshows'] as const;

export function useTvShows(limit = 20) {
  return useQuery({
    queryKey: [...TVSHOWS_KEY, limit],
    queryFn: () => tvShowsApi.list(limit),
    placeholderData: (prev) => prev,
  });
}

export function useCreateTvShow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tvShowsApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TVSHOWS_KEY }),
    onError: (error) => toast.error('Erro ao criar show', { description: error.message }),
  });
}

export function useUpdateTvShow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tvShowsApi.update,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TVSHOWS_KEY }),
    onError: (error) => toast.error('Erro ao atualizar show', { description: error.message }),
  });
}

export function useDeleteTvShow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tvShowsApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TVSHOWS_KEY }),
    onError: (error) => toast.error('Erro ao excluir show', { description: error.message }),
  });
}
