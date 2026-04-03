# 06 - Enriquecimento de Imagens via TMDB

- Status: approved
- Prioridade: P1
- Publico: dev junior
- Agent: `a8z-master`

## Contexto

A aplicacao Netflix-like esta funcional com dados limpos (plano 05), porem **todas as imagens sao placeholders CSS** — gradientes gerados pela funcao `titleToGradient()` em `lib/utils.ts`. O hero banner e os thumbnails nao possuem nenhuma imagem real dos shows.

**Problema:** O blockchain GoLedger **nao suporta campos extras** — testamos via PUT com campo `imageUrl` e ele foi silenciosamente descartado pelo chaincode. Nao e possivel salvar URLs de imagem no ledger.

**Solucao encontrada:** Criar um **cache local JSON** (`data/images.json`) mapeando titulos para URLs de imagem do TMDB (The Movie Database). Um script de enriquecimento faz o seed inicial, e o backend busca automaticamente no TMDB quando um show novo e criado pela UI. Zero dependencia de revisao manual para shows novos.

### Estado atual vs. esperado

| Componente | Antes | Depois |
|------------|-------|--------|
| `tvshow-thumbnail.tsx` | Gradiente CSS | Poster TMDB via `next/image` (fallback: gradiente) |
| `hero-banner.tsx` | Gradiente CSS | Backdrop TMDB como background (fallback: gradiente) |
| `lib/api.ts` TvShow | Sem campos de imagem | `posterUrl?: string`, `backdropUrl?: string` |
| Backend GET routes | Dados puros do GoLedger | Mergeia URLs do `data/images.json` |
| Backend POST route | Apenas cria no GoLedger | Cria + busca imagem TMDB automaticamente |
| `data/images.json` | Nao existe | Cache com ~18+ mapeamentos titulo -> TMDB |

## Por que fazer

| Problema | Impacto no usuario | Impacto tecnico | Solucao |
|----------|-------------------|-----------------|---------|
| Sem imagens reais | UI generica, nao parece Netflix | Gradientes nao identificam shows | Poster/backdrop do TMDB CDN |
| Blockchain sem campo imagem | Impossivel salvar URL no ledger | Campo descartado silenciosamente | Cache local JSON commitado |
| Risco de imagem errada | Show com poster de outro show | Dados incorretos | Confidence score >= 0.6 + fallback seguro |
| Shows novos sem imagem | Criou pela UI, nao tem poster | Depende de revisao manual | Auto-fetch TMDB no POST |
| Imagens sem otimizacao | Carregamento lento | LCP alto | `next/image` com lazy loading e WebP |

## Detalhes tecnicos

### Arquitetura

```
FLUXO 1 — Seed inicial (offline, 1x)
  scripts/enrich-images.ts
    -> GET /api/tvshows              (lista ~18 shows do GoLedger)
    -> TMDB API search/tv?query=X   (busca imagem por titulo)
    -> Salva data/images.json        (cache local)

FLUXO 2 — Auto-enriquecimento (runtime, automatico)
  Usuario cria show pela UI -> POST /api/tvshows -> sucesso
    -> Backend detecta: titulo nao esta no cache
    -> Backend busca TMDB automaticamente (async, nao bloqueia resposta)
    -> Atualiza data/images.json com novo match
    -> Proximo GET ja retorna com imagem

data/images.json                  (commitado no git, atualizado em runtime)
  -> { shows: [{ title, tmdbId, posterPath, backdropPath, confidence }] }

src/services/image-cache.ts       (carrega JSON no startup + auto-fetch)
  -> Map<string, { posterUrl, backdropUrl }>
  -> fetchAndCacheImage(title): busca TMDB e persiste no JSON

src/routes/tvshows.ts             (merge layer)
  -> GET /tvshows: { ...show, ...imageCache.get(title) }
  -> GET /tvshows/:key: mesmo merge
  -> POST /tvshows (apos sucesso): trigger auto-fetch imagem

Frontend                          (consome posterUrl/backdropUrl)
  -> tvshow-thumbnail.tsx: posterUrl ? <Image> : gradiente
  -> hero-banner.tsx: backdropUrl ? <Image> : gradiente
```

### Auto-enriquecimento — como funciona

Quando um show **nao tem imagem no cache**, o sistema busca automaticamente:

1. **No POST (criacao):** apos criar com sucesso no GoLedger, o backend chama `fetchAndCacheImage(title)` em background (nao bloqueia a resposta ao usuario)
2. **No GET (leitura):** se um show nao esta no cache, dispara busca lazy em background. O show aparece com gradiente na primeira vez, e com imagem na proxima
3. **Fallback sempre seguro:** se TMDB nao encontrar, o show mantem gradiente CSS

```
POST /tvshows { title: "Novo Show" }
  -> Cria no GoLedger ok
  -> Responde 200 ao frontend ok
  -> Background: busca TMDB, salva no cache
  -> Proximo GET retorna com posterUrl/backdropUrl
```

**Importante:** a busca TMDB e **fire-and-forget** — nunca bloqueia nem falha a resposta principal. Se TMDB estiver fora, o show aparece com gradiente ate a proxima tentativa.

### TMDB API

| Item | Detalhe |
|------|---------|
| Endpoint | `https://api.themoviedb.org/3/search/tv?query={title}&language=pt-BR` |
| Auth | Header `Authorization: Bearer {TMDB_ACCESS_TOKEN}` |
| Rate limit | 40 req/s (mais que suficiente para ~18 shows) |
| Poster URL | `https://image.tmdb.org/t/p/w500/{posterPath}` |
| Backdrop URL | `https://image.tmdb.org/t/p/w1280/{backdropPath}` |
| Cadastro | Gratuito em https://www.themoviedb.org/settings/api |

### Formato do `data/images.json`

```json
{
  "shows": [
    {
      "title": "Breaking Bad",
      "tmdbId": 1396,
      "posterPath": "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
      "backdropPath": "/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
      "confidence": 1.0,
      "tmdbName": "Breaking Bad"
    }
  ],
  "generatedAt": "2026-03-31T12:00:00Z",
  "tmdbImageBaseUrl": "https://image.tmdb.org/t/p"
}
```

### Mecanismo anti-imagem-errada

1. **Confidence score** — compara titulo local vs. nome TMDB (1.0 = exato, <0.8 = flag)
2. **Filtro automatico** — so aceita match se confidence >= 0.6 (evita associar "Dark" com "Dark Shadows")
3. **Console output** — script de seed imprime tabela com titulo local, nome TMDB e score para revisao inicial
4. **Auto-fetch em runtime** — shows novos criados pela UI sao enriquecidos automaticamente com mesmo filtro de confidence
5. **Fallback seguro** — se TMDB nao encontrou ou confidence < 0.6, campo fica `null` e frontend usa gradiente
6. **JSON auditavel** — `data/images.json` e commitado, qualquer correcao manual e um `git diff` visivel

### Performance

- JSON carregado **1x no startup** do Fastify (nao por request)
- Auto-fetch e **async** — nao bloqueia nenhuma resposta HTTP
- Imagens servidas pelo **CDN do TMDB** (nao armazenadas localmente)
- `next/image` gera **WebP + srcSet** automaticamente
- Hero banner com `priority` (LCP otimizado)
- Thumbnails com `loading="lazy"` (carregam sob demanda)

## Estrutura de Tasks

-> Ver `docs/tasks/05-tmdb-image-enrichment-tasks.md`

- [ ] T051 -> `TASK-01-script-enrich-images.md` — Script de enriquecimento TMDB (seed inicial)
- [ ] T052 -> `TASK-02-executar-e-revisar.md` — Executar script e revisar matches iniciais
- [ ] T053 -> `TASK-03-image-cache-service.md` — Servico de cache com auto-fetch TMDB
- [ ] T054 -> `TASK-04-backend-merge-layer.md` — Merge layer nas rotas + trigger no POST
- [ ] T055 -> `TASK-05-frontend-interface-update.md` — Atualizar interface TvShow
- [ ] T056 -> `TASK-06-thumbnail-com-imagens.md` — Thumbnail com poster real
- [ ] T057 -> `TASK-07-hero-banner-com-imagens.md` — Hero banner com backdrop real
- [ ] T058 -> `TASK-08-validacao-final.md` — Checklist de validacao E2E

## Ordem obrigatoria

```
T051 (script) -> T052 (executar) -> T053 (cache service)
  -> T054 (merge layer + trigger) -> T055 (interface)
    -> T056 (thumbnail) ---+
       T057 (hero banner) -+-> T058 (validacao)
```

T051-T052 sao seed inicial. T053-T054 sao backend. T055-T057 sao frontend. T058 e qualidade.
T056 e T057 podem ser feitas em **paralelo** apos T055.

## Arquivos por task

| Task | Arquivos | Acao |
|------|----------|------|
| T051 | `scripts/enrich-images.ts` (novo) | Criar script de busca TMDB |
| T052 | `data/images.json` (novo) | Executar script, revisar, commitar |
| T053 | `src/services/image-cache.ts` (novo) | Cache em memoria + auto-fetch TMDB |
| T054 | `src/routes/tvshows.ts`, `src/schemas/tvshows.schema.ts` | Merge layer nos GETs + trigger no POST |
| T055 | `lib/api.ts` | Adicionar `posterUrl?` e `backdropUrl?` |
| T056 | `components/tvshows/tvshow-thumbnail.tsx`, `next.config.ts` | Poster via `next/image` |
| T057 | `components/layout/hero-banner.tsx` | Backdrop via `next/image` |
| T058 | Nenhum | Checklist manual E2E |

## Dependencias

| Item | Status | Nota |
|------|--------|------|
| `TMDB_ACCESS_TOKEN` | Obter | Gratuito em themoviedb.org — necessario no `.env` do backend E no script |
| `next/image` | Ja disponivel | Next.js inclui nativamente |
| `tsx` | Ja instalado | Para executar o script TS |
| **Nenhum npm install necessario** | — | Tudo usa fetch nativo + libs existentes |

**Env var no backend:** `TMDB_ACCESS_TOKEN` deve estar no `.env` para o auto-fetch funcionar em runtime. Sem ela, o auto-fetch e desativado silenciosamente (graceful degradation).

## Regras operacionais obrigatorias (licoes do plano 05)

Referencia: `.temp/docs/relatorios/2026-03-31-relatorio-prevencao-erros-dev-junior-planos-tasks.md`

### Antes de marcar qualquer task como `done`

1. **Validar runtime real** — nao basta compilar. Verificar o resultado final na API ou na UI.
2. **Conferir criterios de aceite** — cada checkbox da task deve ser testado individualmente.
3. **Rodar build completo** — `pnpm build` (frontend) e `pnpm run build:api` (backend).
4. **Nao assumir** — se a task pede "poster aparece no card", abrir o browser e conferir.

### Anti-patterns especificos deste plano

| Nao fazer | Fazer |
|-----------|-------|
| Commitar `data/images.json` sem revisar cada match | Abrir o JSON, verificar cada `tmdbName` vs `title` |
| Assumir que o merge funciona porque o JSON existe | Fazer GET na API e conferir que `posterUrl` aparece |
| Usar `<img>` em vez de `next/image` | Usar `<Image>` de `next/image` para otimizacao |
| Esquecer o fallback quando imagem e `null` | Testar com show sem match — deve mostrar gradiente |
| Nao testar o hero banner com show sem backdrop | Remover temporariamente um backdrop e verificar |
| Ignorar o confidence score do script | Revisar TODOS os scores < 1.0 manualmente |
| Criar show pela UI e nao conferir se imagem apareceu | Criar show, aguardar 2s, recarregar — poster deve aparecer |

### Template de fechamento (usar em cada task)

```md
## Fechamento da Task

- Task: [ID e titulo]
- O que foi alterado:
- Evidencia de validacao:
- Testes executados:
- Build executado:
- Verificacao final de runtime:
- Riscos residuais:
- Status: done / blocked
```

## Saida esperada

- `docs/plans/06-tmdb-image-enrichment.md` — este plano
- `docs/tasks/05-tmdb-image-enrichment-tasks.md` — indice de tasks
- `docs/tasks/05-tmdb-image-enrichment/TASK-01` ate `TASK-08`
- `data/images.json` — cache de imagens (gerado na T052, atualizado automaticamente em runtime)
- `scripts/enrich-images.ts` — script de enriquecimento (criado na T051)
- `src/services/image-cache.ts` — servico de cache com auto-fetch (criado na T053)
