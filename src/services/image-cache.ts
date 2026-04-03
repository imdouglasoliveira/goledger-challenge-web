import fs from 'fs';
import path from 'path';

// ============================================================
// Tipos
// ============================================================

interface ImageEntry {
  title: string;
  tmdbId: number | null;
  tmdbName: string | null;
  posterPath: string | null;
  backdropPath: string | null;
  confidence: number;
}

interface ImageCache {
  shows: ImageEntry[];
  generatedAt: string;
  tmdbImageBaseUrl: string;
}

export interface ShowImages {
  posterUrl: string | null;
  backdropUrl: string | null;
}

// ============================================================
// Constantes
// ============================================================

const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const POSTER_SIZE = 'w500';
const BACKDROP_SIZE = 'w1280';
const MIN_CONFIDENCE = 0.6;
const JSON_PATH = path.resolve('data/images.json');

// ============================================================
// Estado em memoria
// ============================================================

let imageMap = new Map<string, ShowImages>();
let cacheData: ImageCache | null = null;
const pendingFetches = new Map<string, Promise<boolean>>();

// ============================================================
// Funcoes auxiliares
// ============================================================

function buildPosterUrl(posterPath: string | null): string | null {
  if (!posterPath) return null;
  return `${IMAGE_BASE_URL}/${POSTER_SIZE}${posterPath}`;
}

function buildBackdropUrl(backdropPath: string | null): string | null {
  if (!backdropPath) return null;
  return `${IMAGE_BASE_URL}/${BACKDROP_SIZE}${backdropPath}`;
}

function calculateConfidence(localTitle: string, tmdbName: string): number {
  const a = localTitle.toLowerCase().trim();
  const b = tmdbName.toLowerCase().trim();
  if (a === b) return 1.0;
  if (b.includes(a) || a.includes(b)) return 0.8;
  const wordsA = new Set(a.split(/\s+/));
  const wordsB = new Set(b.split(/\s+/));
  const intersection = [...wordsA].filter(w => wordsB.has(w));
  const union = new Set([...wordsA, ...wordsB]);
  return intersection.length / union.size;
}

function rebuildMap() {
  imageMap = new Map();
  if (!cacheData) return;

  for (const entry of cacheData.shows) {
    imageMap.set(entry.title, {
      posterUrl: buildPosterUrl(entry.posterPath),
      backdropUrl: buildBackdropUrl(entry.backdropPath),
    });
  }
}

function persistCache() {
  if (!cacheData) return;
  try {
    const dir = path.dirname(JSON_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(JSON_PATH, JSON.stringify(cacheData, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[image-cache] Erro ao persistir cache:', err);
  }
}

// ============================================================
// API publica
// ============================================================

/**
 * Carrega o cache do JSON. Chamar 1x no startup do servidor.
 * Se o arquivo nao existir, inicia com cache vazio (sem erro).
 */
export function loadImageCache(): void {
  try {
    if (fs.existsSync(JSON_PATH)) {
      const raw = fs.readFileSync(JSON_PATH, 'utf-8');
      cacheData = JSON.parse(raw);
      rebuildMap();
      console.log(`[image-cache] Carregado: ${imageMap.size} shows com imagem`);
    } else {
      console.warn('[image-cache] data/images.json nao encontrado — iniciando vazio');
      cacheData = { shows: [], generatedAt: new Date().toISOString(), tmdbImageBaseUrl: IMAGE_BASE_URL };
      rebuildMap();
    }
  } catch (err) {
    console.error('[image-cache] Erro ao carregar JSON:', err);
    cacheData = { shows: [], generatedAt: new Date().toISOString(), tmdbImageBaseUrl: IMAGE_BASE_URL };
    rebuildMap();
  }
}

/**
 * Retorna URLs de imagem para um show, ou null se nao cacheado.
 */
export function getShowImages(title: string): ShowImages | null {
  return imageMap.get(title) || null;
}

function upsertEntry(entry: ImageEntry) {
  if (!cacheData) {
    cacheData = { shows: [], generatedAt: new Date().toISOString(), tmdbImageBaseUrl: IMAGE_BASE_URL };
  }

  const existingIndex = cacheData.shows.findIndex((cachedEntry) => cachedEntry.title === entry.title);
  if (existingIndex >= 0) {
    cacheData.shows[existingIndex] = entry;
  } else {
    cacheData.shows.push(entry);
  }

  imageMap.set(entry.title, {
    posterUrl: buildPosterUrl(entry.posterPath),
    backdropUrl: buildBackdropUrl(entry.backdropPath),
  });
  persistCache();
}

/**
 * Busca imagem no TMDB para um titulo e salva no cache.
 * Fire-and-forget — nao lanca excecoes, apenas loga warnings.
 * Retorna true se encontrou imagem, false caso contrario.
 */
export async function fetchAndCacheImage(title: string): Promise<boolean> {
  const normalizedTitle = title.trim();
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!normalizedTitle) {
    return false;
  }

  if (!token) {
    console.warn('[image-cache] TMDB_ACCESS_TOKEN nao definido — auto-fetch desativado');
    return false;
  }

  // Ja esta no cache? Nao buscar de novo
  if (imageMap.has(normalizedTitle)) return true;
  if (pendingFetches.has(normalizedTitle)) {
    return pendingFetches.get(normalizedTitle)!;
  }

  const fetchPromise = (async () => {
    try {
      const url = `${TMDB_BASE}/search/tv?query=${encodeURIComponent(normalizedTitle)}&language=pt-BR`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.warn(`[image-cache] TMDB ${res.status} para "${normalizedTitle}"`);
        return false;
      }

      const data = await res.json() as { results?: Array<{ id: number; name: string; poster_path: string | null; backdrop_path: string | null }> };
      if (!data.results || data.results.length === 0) {
        console.warn(`[image-cache] "${normalizedTitle}" nao encontrado no TMDB`);
        addEmptyEntry(normalizedTitle);
        return false;
      }

      const result = data.results[0];
      const confidence = calculateConfidence(normalizedTitle, result.name);

      if (confidence < MIN_CONFIDENCE) {
        console.warn(`[image-cache] "${normalizedTitle}" -> "${result.name}" rejeitado (confidence ${confidence.toFixed(2)})`);
        addEmptyEntry(normalizedTitle);
        return false;
      }

      const entry: ImageEntry = {
        title: normalizedTitle,
        tmdbId: result.id,
        tmdbName: result.name,
        posterPath: result.poster_path,
        backdropPath: result.backdrop_path,
        confidence,
      };

      upsertEntry(entry);
      console.log(`[image-cache] "${normalizedTitle}" -> "${result.name}" [${confidence.toFixed(2)}] cacheado`);
      return true;
    } catch (err) {
      console.warn(`[image-cache] Erro ao buscar "${normalizedTitle}":`, err);
      return false;
    } finally {
      pendingFetches.delete(normalizedTitle);
    }
  })();

  pendingFetches.set(normalizedTitle, fetchPromise);
  return fetchPromise;
}

function addEmptyEntry(title: string) {
  upsertEntry({
    title,
    tmdbId: null,
    tmdbName: null,
    posterPath: null,
    backdropPath: null,
    confidence: 0,
  });
}
