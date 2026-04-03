const API_BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

// Types
export interface TvShow {
  '@key': string;
  '@assetType': 'tvShows';
  '@lastUpdated': string;
  title: string;
  description: string;
  recommendedAge: number;
  posterUrl?: string | null;
  backdropUrl?: string | null;
}

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
  season: { '@assetType': 'seasons'; number: number; tvShow: { '@assetType': 'tvShows'; title: string } };
  episodeNumber: number;
  title: string;
  releaseDate: string;
  description: string;
  rating?: number;
}

export interface Watchlist {
  '@key': string;
  '@assetType': 'watchlist';
  '@lastUpdated': string;
  title: string;
  description?: string;
  tvShows: { '@assetType': 'tvShows'; title: string }[];
}

export interface SearchResult<T> {
  metadata: { bookmark: string; fetched_records_count: number };
  result: T[];
}

// TV Shows API
export const tvShowsApi = {
  list: (limit = 20, bookmark = '') =>
    request<SearchResult<TvShow>>(`/tvshows?limit=${limit}&bookmark=${encodeURIComponent(bookmark)}`),

  get: (key: string) =>
    request<TvShow>(`/tvshows/${encodeURIComponent(key)}`),

  create: (data: { title: string; description: string; recommendedAge: number }) =>
    request<TvShow>('/tvshows', { method: 'POST', body: JSON.stringify(data) }),

  update: (data: { title: string; description?: string; recommendedAge?: number }) =>
    request<TvShow>('/tvshows', { method: 'PUT', body: JSON.stringify(data) }),

  delete: (title: string) =>
    request<TvShow>('/tvshows', { method: 'DELETE', body: JSON.stringify({ title }) }),
};

// Seasons API
export const seasonsApi = {
  list: (limit = 20, bookmark = '') =>
    request<SearchResult<Season>>(`/seasons?limit=${limit}&bookmark=${encodeURIComponent(bookmark)}`),

  get: (key: string) =>
    request<Season>(`/seasons/${encodeURIComponent(key)}`),

  create: (data: { number: number; tvShow: { '@assetType': 'tvShows'; title: string }; year: number }) =>
    request<Season>('/seasons', { method: 'POST', body: JSON.stringify(data) }),

  update: (data: { number: number; tvShow: { '@assetType': 'tvShows'; title: string }; year?: number }) =>
    request<Season>('/seasons', { method: 'PUT', body: JSON.stringify(data) }),

  delete: (data: { number: number; tvShow: { '@assetType': 'tvShows'; title: string } }) =>
    request<Season>('/seasons', { method: 'DELETE', body: JSON.stringify(data) }),
};

// Episodes API
export const episodesApi = {
  list: (limit = 20, bookmark = '') =>
    request<SearchResult<Episode>>(`/episodes?limit=${limit}&bookmark=${encodeURIComponent(bookmark)}`),

  get: (key: string) =>
    request<Episode>(`/episodes/${encodeURIComponent(key)}`),

  create: (data: {
    season: { '@assetType': 'seasons'; number: number; tvShow: { '@assetType': 'tvShows'; title: string } };
    episodeNumber: number;
    title: string;
    releaseDate: string;
    description: string;
    rating?: number;
  }) =>
    request<Episode>('/episodes', { method: 'POST', body: JSON.stringify(data) }),

  update: (data: {
    season: { '@assetType': 'seasons'; number: number; tvShow: { '@assetType': 'tvShows'; title: string } };
    episodeNumber: number;
    title?: string;
    releaseDate?: string;
    description?: string;
    rating?: number;
  }) =>
    request<Episode>('/episodes', { method: 'PUT', body: JSON.stringify(data) }),

  delete: (data: {
    season: { '@assetType': 'seasons'; number: number; tvShow: { '@assetType': 'tvShows'; title: string } };
    episodeNumber: number;
  }) =>
    request<Episode>('/episodes', { method: 'DELETE', body: JSON.stringify(data) }),
};

// Watchlist API
export const watchlistApi = {
  list: (limit = 20, bookmark = '') =>
    request<SearchResult<Watchlist>>(`/watchlist?limit=${limit}&bookmark=${encodeURIComponent(bookmark)}`),

  get: (key: string) =>
    request<Watchlist>(`/watchlist/${encodeURIComponent(key)}`),

  create: (data: { title: string; description?: string; tvShows?: Watchlist['tvShows'] }) =>
    request<Watchlist>('/watchlist', { method: 'POST', body: JSON.stringify(data) }),

  update: (data: { title: string; description?: string; tvShows?: Watchlist['tvShows'] }) =>
    request<Watchlist>('/watchlist', { method: 'PUT', body: JSON.stringify(data) }),

  delete: (title: string) =>
    request<Watchlist>('/watchlist', { method: 'DELETE', body: JSON.stringify({ title }) }),
};
