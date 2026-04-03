# TASK-01 — Script de Enriquecimento TMDB (Seed Inicial)

- Status: todo
- Prioridade: P1
- Plano: `docs/plans/06-tmdb-image-enrichment.md`

## Por que fazer

A UI usa gradientes CSS como placeholder porque o blockchain GoLedger nao suporta campos de imagem (testado e confirmado — campo `imageUrl` e descartado silenciosamente). Precisamos de um script que busque imagens reais no TMDB e salve localmente em `data/images.json`, criando o seed inicial para os ~18 shows existentes.

## O que fazer

Criar `scripts/enrich-images.ts` — um script TypeScript executavel com `tsx` que:
1. Busca todos os shows do backend local
2. Para cada show, consulta a TMDB API por titulo
3. Calcula confidence score (similaridade do titulo)
4. Salva resultado em `data/images.json`
5. Imprime tabela de revisao no console

## Pre-requisitos

1. Obter TMDB API key gratuita em https://www.themoviedb.org/settings/api
2. Backend rodando: `pnpm dev:api`

## Arquivo a criar

- `scripts/enrich-images.ts`

## Codigo esperado

```typescript
import fs from 'fs';
import path from 'path';

// ============================================================
// Configuracao
// ============================================================

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;
const API_BASE = 'http://localhost:3001/api';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const OUTPUT_PATH = path.resolve('data/images.json');
const MIN_CONFIDENCE = 0.6;

if (!TMDB_ACCESS_TOKEN) {
  console.error('Erro: TMDB_ACCESS_TOKEN nao definido.');
  console.error('Uso: TMDB_ACCESS_TOKEN=seu_token npx tsx scripts/enrich-images.ts');
  process.exit(1);
}

// ============================================================
// Tipos
// ============================================================

interface TvShow {
  '@key': string;
  title: string;
}

interface TmdbResult {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

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

// ============================================================
// Funcoes auxiliares
// ============================================================

function calculateConfidence(localTitle: string, tmdbName: string): number {
  const a = localTitle.toLowerCase().trim();
  const b = tmdbName.toLowerCase().trim();

  if (a === b) return 1.0;
  if (b.includes(a) || a.includes(b)) return 0.8;

  // Similaridade por palavras em comum
  const wordsA = new Set(a.split(/\s+/));
  const wordsB = new Set(b.split(/\s+/));
  const intersection = [...wordsA].filter(w => wordsB.has(w));
  const union = new Set([...wordsA, ...wordsB]);
  return intersection.length / union.size;
}

async function searchTmdb(title: string): Promise<TmdbResult | null> {
  const url = `${TMDB_BASE}/search/tv?query=${encodeURIComponent(title)}&language=pt-BR`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TMDB_ACCESS_TOKEN}` },
  });

  if (res.status === 429) {
    console.log('  Rate limit atingido, aguardando 2s...');
    await new Promise(r => setTimeout(r, 2000));
    return searchTmdb(title); // retry
  }

  if (!res.ok) {
    console.error(`  TMDB erro ${res.status} para "${title}"`);
    return null;
  }

  const data = await res.json();
  if (!data.results || data.results.length === 0) return null;

  // Retorna o primeiro resultado (TMDB ordena por relevancia)
  return data.results[0];
}

async function fetchAllShows(): Promise<TvShow[]> {
  const res = await fetch(`${API_BASE}/tvshows?limit=100`);
  if (!res.ok) throw new Error(`Backend erro ${res.status}`);
  const data = await res.json();
  return data.result;
}

// ============================================================
// Main
// ============================================================

async function main() {
  console.log('=== TMDB Image Enrichment Script ===\n');

  // 1. Buscar shows do backend
  console.log('Buscando shows do backend...');
  const shows = await fetchAllShows();
  console.log(`Encontrados: ${shows.length} shows\n`);

  // 2. Buscar imagens no TMDB
  const entries: ImageEntry[] = [];

  for (const show of shows) {
    process.stdout.write(`Buscando "${show.title}"... `);

    const tmdbResult = await searchTmdb(show.title);

    if (!tmdbResult) {
      console.log('NAO ENCONTRADO');
      entries.push({
        title: show.title,
        tmdbId: null,
        tmdbName: null,
        posterPath: null,
        backdropPath: null,
        confidence: 0,
      });
      continue;
    }

    const confidence = calculateConfidence(show.title, tmdbResult.name);
    const accepted = confidence >= MIN_CONFIDENCE;

    entries.push({
      title: show.title,
      tmdbId: accepted ? tmdbResult.id : null,
      tmdbName: tmdbResult.name,
      posterPath: accepted ? tmdbResult.poster_path : null,
      backdropPath: accepted ? tmdbResult.backdrop_path : null,
      confidence,
    });

    const status = accepted ? 'OK' : 'REJEITADO (confidence baixa)';
    console.log(`${tmdbResult.name} [${confidence.toFixed(2)}] ${status}`);

    // Pequeno delay para nao bater rate limit
    await new Promise(r => setTimeout(r, 300));
  }

  // 3. Salvar JSON
  const cache: ImageCache = {
    shows: entries,
    generatedAt: new Date().toISOString(),
    tmdbImageBaseUrl: IMAGE_BASE_URL,
  };

  // Criar diretorio data/ se nao existir
  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(cache, null, 2), 'utf-8');
  console.log(`\nSalvo em: ${OUTPUT_PATH}`);

  // 4. Imprimir tabela de revisao
  console.log('\n=== TABELA DE REVISAO ===\n');
  console.log('| # | Titulo Local | Nome TMDB | Confidence | Poster | Backdrop |');
  console.log('|---|-------------|-----------|------------|--------|----------|');

  entries.forEach((entry, i) => {
    const poster = entry.posterPath ? 'SIM' : 'NAO';
    const backdrop = entry.backdropPath ? 'SIM' : 'NAO';
    const conf = entry.confidence.toFixed(2);
    const flag = entry.confidence < 1.0 && entry.confidence >= MIN_CONFIDENCE ? ' ⚠️' : '';
    console.log(
      `| ${i + 1} | ${entry.title} | ${entry.tmdbName || '-'} | ${conf}${flag} | ${poster} | ${backdrop} |`
    );
  });

  // 5. Resumo
  const withImage = entries.filter(e => e.posterPath).length;
  const rejected = entries.filter(e => e.confidence < MIN_CONFIDENCE && e.confidence > 0).length;
  const notFound = entries.filter(e => e.confidence === 0).length;

  console.log(`\n=== RESUMO ===`);
  console.log(`Total: ${entries.length} shows`);
  console.log(`Com imagem: ${withImage}`);
  console.log(`Rejeitados (confidence < ${MIN_CONFIDENCE}): ${rejected}`);
  console.log(`Nao encontrados: ${notFound}`);
  console.log(`\nRevise a tabela acima. Corrija manualmente em data/images.json se necessario.`);
}

main().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
```

### Detalhes do confidence score

| Score | Significado | Acao |
|-------|------------|------|
| 1.0 | Titulo exato (case-insensitive) | Aceito automaticamente |
| 0.8 | Um titulo contem o outro | Aceito, verificar manualmente |
| 0.6-0.79 | Palavras em comum | Aceito com cautela |
| < 0.6 | Match fraco | **Rejeitado** — posterPath fica `null` |
| 0 | Nao encontrado no TMDB | posterPath fica `null` |

## Como executar

```bash
# 1. Garantir que o backend esta rodando
pnpm dev:api

# 2. Executar o script
TMDB_ACCESS_TOKEN=seu_token_aqui npx tsx scripts/enrich-images.ts
```

## Como testar

1. Script executa sem erros
2. `data/images.json` foi criado
3. JSON contem array `shows` com ~18 entries
4. Tabela de revisao aparece no console
5. Shows conhecidos (Breaking Bad, Friends, etc.) tem confidence 1.0
6. Shows nao encontrados tem `posterPath: null`

## Criterio de pronto

- [ ] Arquivo `scripts/enrich-images.ts` criado
- [ ] Script executa sem erros com `TMDB_ACCESS_TOKEN` valido
- [ ] Script aborta com mensagem clara se token nao for fornecido
- [ ] `data/images.json` e gerado com formato correto
- [ ] Tabela de revisao impressa no console
- [ ] Confidence score calculado corretamente para cada show
- [ ] Shows com confidence < 0.6 tem `posterPath: null`
- [ ] Rate limit respeitado (delay de 300ms entre requests)
