'use client';

import { useMemo, useCallback } from 'react';
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

export function useWatchlistLookup() {
  const { data } = useWatchlists(250);
  const updateMutation = useUpdateWatchlist();
  const createMutation = useCreateWatchlist();

  const watchlists = data?.result ?? [];

  const showSet = useMemo(() => {
    const set = new Set<string>();
    for (const wl of watchlists) {
      for (const s of wl.tvShows ?? []) {
        set.add(s.title);
      }
    }
    return set;
  }, [watchlists]);

  const isInWatchlist = useCallback(
    (title: string) => showSet.has(title),
    [showSet]
  );

  const toggleShow = useCallback(
    (title: string) => {
      const existing = watchlists.find((wl) =>
        wl.tvShows?.some((s) => s.title === title)
      );

      if (existing) {
        updateMutation.mutate(
          {
            title: existing.title,
            tvShows: existing.tvShows
              .filter((s) => s.title !== title)
              .map((s) => ({ '@assetType': 'tvShows' as const, title: s.title })),
          },
          { onSuccess: () => toast.success('Removido da watchlist', { description: title }) }
        );
      } else {
        const target = watchlists[0];
        if (target) {
          updateMutation.mutate(
            {
              title: target.title,
              tvShows: [
                ...(target.tvShows ?? []).map((s) => ({ '@assetType': 'tvShows' as const, title: s.title })),
                { '@assetType': 'tvShows' as const, title },
              ],
            },
            { onSuccess: () => toast.success('Adicionado à watchlist', { description: title }) }
          );
        } else {
          createMutation.mutate(
            {
              title: 'Minha Lista',
              tvShows: [{ '@assetType': 'tvShows' as const, title }],
            },
            { onSuccess: () => toast.success('Adicionado à watchlist', { description: title }) }
          );
        }
      }
    },
    [watchlists, updateMutation, createMutation]
  );

  return {
    isInWatchlist,
    toggleShow,
    isPending: updateMutation.isPending || createMutation.isPending,
  };
}
