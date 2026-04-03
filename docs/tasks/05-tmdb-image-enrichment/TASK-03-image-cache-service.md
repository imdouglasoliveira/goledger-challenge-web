# TASK-03 — Servico de Cache com Auto-Fetch TMDB

- Status: todo
- Prioridade: P1
- Plano: `docs/plans/06-tmdb-image-enrichment.md`
- Depende de: T052

## Por que fazer

O `data/images.json` criado na T051-T052 cobre os shows existentes, mas **shows novos criados pela UI nao teriam imagem** — o usuario criaria um show e veria apenas gradiente, sem nenhum feedback visual real. O servico de cache resolve isso: carrega o JSON no startup e busca automaticamente no TMDB quando detecta um titulo sem imagem. Isso torna o sistema **autonomo** — nao depende de rodar o script manualmente toda vez que um show e criado.

## O que fazer

Criar `src/services/image-cache.ts` com:
1. Carregamento do JSON no startup
2. Lookup por titulo (Map em memoria)
3. Auto-fetch no TMDB para titulos nao cacheados
4. Persistencia automatica no JSON (para nao perder entre restarts)
5. Graceful degradation se TMDB estiver indisponivel ou sem token

## Pre-requisitos

- `data/images.json` existente (T052)
- `TMDB_ACCESS_TOKEN` no `.env`

## Arquivo a criar

- `src/services/image-cache.ts`

## Codigo esperado

```typescript
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
    }
  } catch (err) {
    console.error('[image-cache] Erro ao carregar JSON:', err);
    cacheData = { shows: [], generatedAt: new Date().toISOString(), tmdbImageBaseUrl: IMAGE_BASE_URL };
  }
}

/**
 * Retorna URLs de imagem para um show, ou null se nao cacheado.
 */
export function getShowImages(title: string): ShowImages | null {
  return imageMap.get(title) || null;
}

/**
 * Busca imagem no TMDB para um titulo e salva no cache.
 * Fire-and-forget — nao lanca excecoes, apenas loga warnings.
 * Retorna true se encontrou imagem, false caso contrario.
 */
export async function fetchAndCacheImage(title: string): Promise<boolean> {
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) {
    console.warn('[image-cache] TMDB_ACCESS_TOKEN nao definido — auto-fetch desativado');
    return false;
  }

  // Ja esta no cache? Nao buscar de novo
  if (imageMap.has(title)) return true;

  try {
    const url = `${TMDB_BASE}/search/tv?query=${encodeURIComponent(title)}&language=pt-BR`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.warn(`[image-cache] TMDB ${res.status} para "${title}"`);
      return false;
    }

    const data = await res.json();
    if (!data.results || data.results.length === 0) {
      console.warn(`[image-cache] "${title}" nao encontrado no TMDB`);
      addEmptyEntry(title);
      return false;
    }

    const result = data.results[0];
    const confidence = calculateConfidence(title, result.name);

    if (confidence < MIN_CONFIDENCE) {
      console.warn(`[image-cache] "${title}" -> "${result.name}" rejeitado (confidence ${confidence.toFixed(2)})`);
      addEmptyEntry(title);
      return false;
    }

    // Adicionar ao cache
    const entry: ImageEntry = {
      title,
      tmdbId: result.id,
      tmdbName: result.name,
      posterPath: result.poster_path,
      backdropPath: result.backdrop_path,
      confidence,
    };

    if (!cacheData) {
      cacheData = { shows: [], generatedAt: new Date().toISOString(), tmdbImageBaseUrl: IMAGE_BASE_URL };
    }

    cacheData.shows.push(entry);
    imageMap.set(title, {
      posterUrl: buildPosterUrl(entry.posterPath),
      backdropUrl: buildBackdropUrl(entry.backdropPath),
    });

    persistCache();
    console.log(`[image-cache] "${title}" -> "${result.name}" [${confidence.toFixed(2)}] cacheado`);
    return true;
  } catch (err) {
    console.warn(`[image-cache] Erro ao buscar "${title}":`, err);
    return false;
  }
}

function addEmptyEntry(title: string) {
  if (!cacheData) return;
  cacheData.shows.push({
    title,
    tmdbId: null,
    tmdbName: null,
    posterPath: null,
    backdropPath: null,
    confidence: 0,
  });
  imageMap.set(title, { posterUrl: null, backdropUrl: null });
  persistCache();
}
```

### Detalhes do design

| Decisao | Motivo |
|---------|--------|
| `Map` em memoria | Lookup O(1) por titulo — nao le JSON a cada request |
| `persistCache()` sincrono | Simples, ~18 entries e instantaneo. Para >1000 entries, trocar por async |
| `addEmptyEntry()` | Evita re-buscar titulo que o TMDB nao conhece |
| `MIN_CONFIDENCE = 0.6` | Mesmo threshold do script de seed — consistente |
| `console.warn` em vez de throw | Fire-and-forget — erro de imagem nunca crasha o servidor |

## Como testar

### Teste manual

```bash
# 1. Verificar que o servico carrega sem erro
# Adicionar ao final do src/server.ts temporariamente:
# import { loadImageCache } from './services/image-cache.js';
# loadImageCache();
# Iniciar o backend e verificar no console:
# [image-cache] Carregado: 18 shows com imagem

# 2. Verificar graceful degradation
# Renomear data/images.json temporariamente
mv data/images.json data/images.json.bak
# Reiniciar backend — deve logar:
# [image-cache] data/images.json nao encontrado — iniciando vazio
mv data/images.json.bak data/images.json

# 3. Verificar auto-fetch
# Remover um show do data/images.json manualmente
# Chamar fetchAndCacheImage('Breaking Bad') — deve buscar no TMDB e adicionar
```

### Teste de compilacao

```bash
# Verificar que compila sem erros
pnpm run build:api
```

## Criterio de pronto

- [ ] Arquivo `src/services/image-cache.ts` criado
- [ ] `loadImageCache()` carrega JSON sem erro
- [ ] `loadImageCache()` funciona quando JSON nao existe (graceful)
- [ ] `getShowImages(title)` retorna URLs corretas para shows cacheados
- [ ] `getShowImages(title)` retorna `null` para shows nao cacheados
- [ ] `fetchAndCacheImage(title)` busca no TMDB e salva no cache + JSON
- [ ] `fetchAndCacheImage(title)` respeita MIN_CONFIDENCE (rejeita < 0.6)
- [ ] `fetchAndCacheImage(title)` nao crasha se TMDB estiver fora
- [ ] `fetchAndCacheImage(title)` nao crasha se TMDB_ACCESS_TOKEN nao existir
- [ ] `pnpm run build:api` compila sem erros
