# TASK-04 — Merge Layer nas Rotas + Trigger no POST

- Status: todo
- Prioridade: P1
- Plano: `docs/plans/06-tmdb-image-enrichment.md`
- Depende de: T053

## Por que fazer

O servico de cache (T053) sabe buscar e armazenar imagens, mas as rotas do backend ainda retornam shows **sem** `posterUrl`/`backdropUrl`. Precisamos:
1. Mergear imagens nas respostas GET (para que o frontend receba tudo junto)
2. Disparar auto-fetch apos um POST bem-sucedido (para que shows novos ganhem imagem automaticamente)

Sem isso, o frontend nao recebe URLs de imagem e continua mostrando apenas gradientes.

## O que fazer

1. Carregar image cache no startup do `tvShowsRoutes()`
2. Mergear imagens em cada show nos handlers GET
3. Disparar `fetchAndCacheImage()` em background apos POST bem-sucedido
4. Atualizar schema para incluir `posterUrl` e `backdropUrl` opcionais

## Arquivos a modificar

- `src/routes/tvshows.ts`
- `src/schemas/tvshows.schema.ts`

## Como fazer

### 1. Atualizar schema (`src/schemas/tvshows.schema.ts`)

Adicionar campos opcionais ao schema existente:

```typescript
export const tvShowProperties = {
  '@key': { type: 'string' },
  '@assetType': { type: 'string' },
  '@lastUpdated': { type: 'string' },
  title: { type: 'string' },
  description: { type: 'string' },
  recommendedAge: { type: 'number' },
  posterUrl: { type: 'string', nullable: true },
  backdropUrl: { type: 'string', nullable: true },
} as const;
```

### 2. Modificar rotas (`src/routes/tvshows.ts`)

#### 2a. Importar o servico

No topo do arquivo, adicionar:

```typescript
import { loadImageCache, getShowImages, fetchAndCacheImage } from '../services/image-cache.js';
```

#### 2b. Carregar cache no startup

No inicio da funcao `tvShowsRoutes()`, antes de registrar as rotas:

```typescript
export async function tvShowsRoutes(server: FastifyInstance): Promise<void> {
  // Carregar cache de imagens no startup
  loadImageCache();

  // ... resto das rotas
}
```

#### 2c. Criar funcao helper de merge

```typescript
function enrichWithImages(show: Record<string, unknown>): Record<string, unknown> {
  const title = show.title as string;
  const images = getShowImages(title);
  return {
    ...show,
    posterUrl: images?.posterUrl || null,
    backdropUrl: images?.backdropUrl || null,
  };
}
```

#### 2d. Modificar handler GET /tvshows (LIST)

Apos receber resultado do GoLedger, mapear cada show:

```typescript
// Dentro do handler GET /tvshows
try {
  const data = await search({ selector: { '@assetType': 'tvShows' }, limit, bookmark });
  const result = data as { metadata: unknown; result: Record<string, unknown>[] };

  // Mergear imagens em cada show
  return {
    metadata: result.metadata,
    result: result.result.map(enrichWithImages),
  };
} catch (err: any) {
  // ...erro existente
}
```

**Nota sobre auto-fetch lazy:** no GET, se um show nao tem imagem no cache, disparar busca em background:

```typescript
// Dentro do handler GET, apos o return (usar setImmediate ou similar)
// Alternativa: disparar no map
result.result.map(show => {
  const enriched = enrichWithImages(show);
  // Se nao tem imagem, buscar em background (fire-and-forget)
  if (!enriched.posterUrl && typeof show.title === 'string') {
    fetchAndCacheImage(show.title as string).catch(() => {});
  }
  return enriched;
});
```

#### 2e. Modificar handler GET /tvshows/:key

```typescript
// Dentro do handler GET /tvshows/:key
try {
  const show = await readAsset({ '@assetType': 'tvShows', '@key': key });
  return enrichWithImages(show as Record<string, unknown>);
} catch (err: any) {
  // ...erro existente
}
```

#### 2f. Adicionar trigger no POST /tvshows

Apos criar com sucesso no GoLedger, disparar busca de imagem em background:

```typescript
// Dentro do handler POST /tvshows, apos createAsset
try {
  // ... validacao existente ...
  const created = await createAsset([{ '@assetType': 'tvShows', ...body }]);

  // Auto-fetch imagem em background (fire-and-forget)
  fetchAndCacheImage(body.title).catch(() => {});

  return created;
} catch (err: any) {
  // ...erro existente
}
```

### Resumo das mudancas

| Rota | Mudanca |
|------|---------|
| `GET /tvshows` | Cada show ganha `posterUrl` e `backdropUrl` (merge) + lazy fetch |
| `GET /tvshows/:key` | Show ganha `posterUrl` e `backdropUrl` (merge) |
| `POST /tvshows` | Apos sucesso, dispara `fetchAndCacheImage()` em background |
| `PUT /tvshows` | Sem mudanca (titulo nao muda, imagem ja esta cacheada) |
| `DELETE /tvshows` | Sem mudanca (imagem no cache e inofensiva) |

## Como testar

### 1. Testar merge no GET

```bash
# Reiniciar backend
pnpm dev:api

# Buscar shows — devem ter posterUrl e backdropUrl
curl -s http://localhost:3001/api/tvshows?limit=3 | jq '.result[] | {title, posterUrl, backdropUrl}'
```

Saida esperada:
```json
{
  "title": "Breaking Bad",
  "posterUrl": "https://image.tmdb.org/t/p/w500/ggFH...",
  "backdropUrl": "https://image.tmdb.org/t/p/w1280/tsRy..."
}
```

### 2. Testar auto-fetch no POST

```bash
# Criar show novo que NAO esta no cache
curl -X POST http://localhost:3001/api/tvshows \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Squid Game",
    "description": "Centenas de jogadores endividados aceitam um convite para competir em jogos infantis por um premio milionario, mas as consequencias de perder sao mortais.",
    "recommendedAge": 16
  }'

# Aguardar 2 segundos (auto-fetch e async)
sleep 2

# Verificar que agora tem imagem
curl -s http://localhost:3001/api/tvshows?limit=50 | jq '.result[] | select(.title == "Squid Game") | {title, posterUrl}'
```

### 3. Testar graceful degradation

```bash
# Remover TMDB_ACCESS_TOKEN do .env temporariamente
# Reiniciar backend
# Criar show — deve funcionar normalmente, so sem imagem
# Verificar log: "[image-cache] TMDB_ACCESS_TOKEN nao definido — auto-fetch desativado"
```

### 4. Testar build

```bash
pnpm run build:api
# Deve compilar sem erros
```

## Criterio de pronto

- [ ] `GET /api/tvshows` retorna shows com `posterUrl` e `backdropUrl`
- [ ] `GET /api/tvshows/:key` retorna show com `posterUrl` e `backdropUrl`
- [ ] Shows sem imagem retornam `posterUrl: null`, `backdropUrl: null`
- [ ] `POST /api/tvshows` com titulo novo dispara auto-fetch em background
- [ ] Apos 2-3s do POST, proximo GET retorna com imagem
- [ ] Backend nao crasha se `data/images.json` nao existir
- [ ] Backend nao crasha se `TMDB_ACCESS_TOKEN` nao existir
- [ ] `pnpm run build:api` compila sem erros
- [ ] Schema Swagger/OpenAPI mostra `posterUrl` e `backdropUrl` como campos opcionais
