'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { watchlistApi } from '@/lib/api';

export const WATCHLIST_KEY = ['watchlist'] as const;

export function useWatchlists(limit = 100) {
  return useQuery({
    queryKey: [...WATCHLIST_KEY, limit],
    queryFn: () => watchlistApi.list(limit),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
    retry: 1,
  });
}

export const useWatchlist = useWatchlists;

export function useCreateWatchlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: watchlistApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WATCHLIST_KEY }),
    onError: (error) => toast.error('Erro ao criar watchlist', { description: error.message }),
  });
}

export function useUpdateWatchlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: watchlistApi.update,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WATCHLIST_KEY }),
    onError: (error) => toast.error('Erro ao atualizar watchlist', { description: error.message }),
  });
}

export function useDeleteWatchlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: watchlistApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WATCHLIST_KEY }),
    onError: (error) => toast.error('Erro ao excluir watchlist', { description: error.message }),
  });
}
