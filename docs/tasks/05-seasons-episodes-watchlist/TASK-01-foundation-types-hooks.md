# TASK-01 (T091) — Fundacao: Types + API Client + Hooks

- Status: todo
- Prioridade: P0
- Depende de: nenhuma
- Agent/Skill: `a8z-master`
- Plano: `docs/plans/07-seasons-episodes-watchlist.md`

## O que fazer

1. Adicionar types `Season`, `Episode`, `Watchlist` em `lib/api.ts`
2. Adicionar API objects `seasonsApi`, `episodesApi`, `watchlistApi` em `lib/api.ts`
3. Criar `lib/hooks/use-seasons.ts` com hooks React Query
4. Criar `lib/hooks/use-episodes.ts` com hooks React Query
5. Criar `lib/hooks/use-watchlist.ts` com hooks React Query

## Por que fazer

Toda a camada de dados (types, fetch, cache) precisa existir antes de criar qualquer componente visual. E a base para todas as tasks seguintes.

## Arquivos a modificar

- **Editar:** `lib/api.ts`
- **Criar:** `lib/hooks/use-seasons.ts`
- **Criar:** `lib/hooks/use-episodes.ts`
- **Criar:** `lib/hooks/use-watchlist.ts`

## Como fazer

### 1. Types em `lib/api.ts`

Adicionar abaixo da interface `TvShow` existente:

```typescript
export interface Season {
  '@key': string;
  '@assetType': 'seasons';
  '@lastUpdated': string;
  number: number;
  tvShow: { '@assetType': 'tvShows'; title: string };
  year: number;
}

export interface Episode {
  '@key': string;
  '@assetType': 'episodes';
  '@lastUpdated': string;
  season: {
    '@assetType': 'seasons';
    number: number;
    tvShow: { '@assetType': 'tvShows'; title: string };
  };
  episodeNumber: number;
  title: string;
  description: string;
  releaseDate: string;
  rating?: number;
}

export interface Watchlist {
  '@key': string;
  '@assetType': 'watchlist';
  '@lastUpdated': string;
  title: string;
  description?: string;
  tvShows: Array<{ '@assetType': 'tvShows'; title: string }>;
}
```

### 2. API objects em `lib/api.ts`

Adicionar abaixo do `tvShowsApi` existente. Seguir o mesmo padrao exato:

```typescript
export const seasonsApi = {
  list: (limit = 20, bookmark = '') =>
    request<SearchResult<Season>>(`/seasons?limit=${limit}&bookmark=${bookmark}`),
  get: (key: string) =>
    request<Season>(`/seasons/${encodeURIComponent(key)}`),
  create: (data: { number: number; tvShow: { '@assetType': 'tvShows'; title: string }; year: number }) =>
    request<Season>('/seasons', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: { number: number; tvShow: { '@assetType': 'tvShows'; title: string }; year?: number }) =>
    request<Season>('/seasons', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (data: { number: number; tvShow: { '@assetType': 'tvShows'; title: string } }) =>
    request<Season>('/seasons', { method: 'DELETE', body: JSON.stringify(data) }),
};

export const episodesApi = {
  list: (limit = 20, bookmark = '') =>
    request<SearchResult<Episode>>(`/episodes?limit=${limit}&bookmark=${bookmark}`),
  get: (key: string) =>
    request<Episode>(`/episodes/${encodeURIComponent(key)}`),
  create: (data: Omit<Episode, '@key' | '@assetType' | '@lastUpdated'>) =>
    request<Episode>('/episodes', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: Record<string, unknown>) =>
    request<Episode>('/episodes', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (data: { season: Episode['season']; episodeNumber: number }) =>
    request<Episode>('/episodes', { method: 'DELETE', body: JSON.stringify(data) }),
};

export const watchlistApi = {
  list: (limit = 20, bookmark = '') =>
    request<SearchResult<Watchlist>>(`/watchlist?limit=${limit}&bookmark=${bookmark}`),
  get: (key: string) =>
    request<Watchlist>(`/watchlist/${encodeURIComponent(key)}`),
  create: (data: { title: string; description?: string; tvShows?: Watchlist['tvShows'] }) =>
    request<Watchlist>('/watchlist', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: { title: string; description?: string; tvShows?: Watchlist['tvShows'] }) =>
    request<Watchlist>('/watchlist', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (title: string) =>
    request<Watchlist>('/watchlist', { method: 'DELETE', body: JSON.stringify({ title }) }),
};
```

### 3. `lib/hooks/use-seasons.ts`

Copiar o padrao exato de `lib/hooks/use-tvshows.ts`:

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { seasonsApi } from '@/lib/api';
import { toast } from 'sonner';

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
  const qc = useQueryClient();
  return useMutation({
    mutationFn: seasonsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SEASONS_KEY });
    },
    onError: (e) => toast.error('Erro ao criar temporada', { description: e.message }),
  });
}

export function useUpdateSeason() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: seasonsApi.update,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SEASONS_KEY });
    },
    onError: (e) => toast.error('Erro ao atualizar temporada', { description: e.message }),
  });
}

export function useDeleteSeason() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: seasonsApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SEASONS_KEY });
    },
    onError: (e) => toast.error('Erro ao excluir temporada', { description: e.message }),
  });
}
```

### 4. `lib/hooks/use-episodes.ts`

Mesmo padrao, trocando `seasons` por `episodes`:

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { episodesApi } from '@/lib/api';
import { toast } from 'sonner';

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
  const qc = useQueryClient();
  return useMutation({
    mutationFn: episodesApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EPISODES_KEY });
    },
    onError: (e) => toast.error('Erro ao criar episodio', { description: e.message }),
  });
}

export function useUpdateEpisode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: episodesApi.update,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EPISODES_KEY });
    },
    onError: (e) => toast.error('Erro ao atualizar episodio', { description: e.message }),
  });
}

export function useDeleteEpisode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: episodesApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EPISODES_KEY });
    },
    onError: (e) => toast.error('Erro ao excluir episodio', { description: e.message }),
  });
}
```

### 5. `lib/hooks/use-watchlist.ts`

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { watchlistApi } from '@/lib/api';
import { toast } from 'sonner';

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

export function useCreateWatchlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: watchlistApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: WATCHLIST_KEY });
    },
    onError: (e) => toast.error('Erro ao criar watchlist', { description: e.message }),
  });
}

export function useUpdateWatchlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: watchlistApi.update,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: WATCHLIST_KEY });
    },
    onError: (e) => toast.error('Erro ao atualizar watchlist', { description: e.message }),
  });
}

export function useDeleteWatchlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: watchlistApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: WATCHLIST_KEY });
    },
    onError: (e) => toast.error('Erro ao excluir watchlist', { description: e.message }),
  });
}
```

## Como testar

```bash
# 1. Subir o BFF
pnpm dev

# 2. Verificar build (types corretos)
pnpm build

# 3. Testar endpoints no browser console
fetch('/api/seasons').then(r => r.json()).then(console.log)
fetch('/api/episodes').then(r => r.json()).then(console.log)
fetch('/api/watchlist').then(r => r.json()).then(console.log)
```

## Criterio de pronto

- [ ] Types `Season`, `Episode`, `Watchlist` exportados de `lib/api.ts`
- [ ] `seasonsApi`, `episodesApi`, `watchlistApi` exportados com 5 metodos cada (list, get, create, update, delete)
- [ ] `lib/hooks/use-seasons.ts` criado com 4 hooks (useSeasons, useCreate, useUpdate, useDelete)
- [ ] `lib/hooks/use-episodes.ts` criado com 4 hooks
- [ ] `lib/hooks/use-watchlist.ts` criado com 4 hooks
- [ ] `pnpm build` passa sem erros de tipo
