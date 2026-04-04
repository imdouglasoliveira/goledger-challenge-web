'use client';

import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { seasonsApi } from '@/lib/api';

export const SEASONS_KEY = ['seasons'] as const;

export function useSeasons(limit = 100) {
  return useQuery({
    queryKey: [...SEASONS_KEY, limit],
    queryFn: () => seasonsApi.list(limit),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useCreateSeason() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: seasonsApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SEASONS_KEY }),
    onError: (error) => toast.error('Erro ao criar temporada', { description: error.message }),
  });
}

export function useUpdateSeason() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: seasonsApi.update,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SEASONS_KEY }),
    onError: (error) => toast.error('Erro ao atualizar temporada', { description: error.message }),
  });
}

export function useDeleteSeason() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: seasonsApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SEASONS_KEY }),
    onError: (error) => toast.error('Erro ao excluir temporada', { description: error.message }),
  });
}

export function useSeasonsForShow(showTitle: string) {
  const { data, ...rest } = useSeasons(400);
  const seasons = useMemo(
    () =>
      (data?.result ?? [])
        .filter((s) => s.tvShow?.title === showTitle)
        .sort((a, b) => a.number - b.number),
    [data, showTitle]
  );
  return { ...rest, seasons };
}
