# 07 — Seasons, Episodes & Watchlist — Frontend Completo

- Status: todo
- Prioridade: P0
- Estimativa: 7 tasks sequenciais

## Contexto

O desafio GoLedger pede: "implement a web interface to catalogue TV Shows, with series, seasons, episodes and watchlist registration" com CRUD completo para todas as entidades. O backend (Fastify BFF) ja esta 100% pronto para as 4 entidades. O frontend so cobre TV Shows. Faltam Seasons, Episodes e Watchlists — sem isso o desafio esta em ~40%.

## Objetivo

Criar frontend completo (paginas, componentes, hooks, API client) para Seasons, Episodes e Watchlists, seguindo os mesmos padroes ja estabelecidos em TV Shows.

## Arquivos de referencia (padroes a seguir)

| Arquivo | O que copiar |
|---------|-------------|
| `lib/api.ts` | API client com `request<T>()` helper e `tvShowsApi` object |
| `lib/hooks/use-tvshows.ts` | React Query hooks (query key, useMutation, invalidation, toast) |
| `components/tvshows/tvshows-page.tsx` | FormMode union, 3 modal states, carousel rows, FAB |
| `components/tvshows/tvshow-form.tsx` | React Hook Form, edit vs create, validation |
| `components/tvshows/tvshow-thumbnail.tsx` | Card 250px, hover panel, edit/delete actions |
| `components/tvshows/show-detail-modal.tsx` | Portal modal, hero image, metadata |
| `components/layout/header.tsx` | Nav links (seasons/episodes/watchlist atualmente disabled) |
| `components/ui/modal.tsx` | Modal reutilizavel (sm/md/lg) |

## Clones de referencia (inspiracao Netflix)

- `.backups/clones/descompactados/Netflix-reactjs-main/` — Tailwind + React 18, melhor referencia
- `.backups/clones/descompactados/netflix-clone-react-master/` — Material-UI, watchlist patterns

## API Contracts (backend ja pronto)

### Seasons
```
GET    /api/seasons?limit=20&bookmark=
GET    /api/seasons/:key
POST   /api/seasons    { number, tvShow: { @assetType: 'tvShows', title }, year }
PUT    /api/seasons    { number, tvShow: { @assetType: 'tvShows', title }, year? }
DELETE /api/seasons    { number, tvShow: { @assetType: 'tvShows', title } }
```

### Episodes
```
GET    /api/episodes?limit=20&bookmark=
GET    /api/episodes/:key
POST   /api/episodes   { season: { @assetType: 'seasons', number, tvShow: {...} }, episodeNumber, title, releaseDate, description, rating? }
PUT    /api/episodes   { season: {...}, episodeNumber, title?, releaseDate?, description?, rating? }
DELETE /api/episodes   { season: {...}, episodeNumber }
```

### Watchlist
```
GET    /api/watchlist?limit=20&bookmark=
GET    /api/watchlist/:key
POST   /api/watchlist  { title, description?, tvShows?: [{ @assetType: 'tvShows', title }] }
PUT    /api/watchlist  { title, description?, tvShows? }
DELETE /api/watchlist  { title }
```

## Tasks

- [ ] T091 — Fundacao: types + API client + hooks para Seasons, Episodes, Watchlist
- [ ] T092 — Pagina de Seasons (CRUD completo)
- [ ] T093 — Pagina de Episodes (CRUD completo)
- [ ] T094 — Pagina de Watchlist (CRUD completo + selecao de shows)
- [ ] T095 — Navegacao: habilitar rotas no App Router + header links
- [ ] T096 — Seed de dados (seasons, episodes, watchlist) para demonstracao
- [ ] T097 — Build + validacao E2E

## Ordem de execucao

```
T091 (fundacao) → T092 (seasons) → T093 (episodes) → T094 (watchlist) → T095 (nav) → T096 (seed) → T097 (build)
```

## Arquivos por task

| Task | Arquivos | Acao |
|------|----------|------|
| T091 | `lib/api.ts`, `lib/hooks/use-seasons.ts`, `use-episodes.ts`, `use-watchlist.ts` | Editar + criar |
| T092 | `components/seasons/*` (3 novos), `app/seasons/page.tsx` (novo) | Criar |
| T093 | `components/episodes/*` (3 novos), `app/episodes/page.tsx` (novo) | Criar |
| T094 | `components/watchlist/*` (3 novos), `app/watchlist/page.tsx` (novo) | Criar |
| T095 | `components/layout/header.tsx` | Editar |
| T096 | `scripts/seed-all.mjs` (novo) | Criar + executar |
| T097 | Nenhum | Checklist manual |

## Decisoes de design

1. **Routing:** App Router com paginas separadas (`/seasons`, `/episodes`, `/watchlist`)
2. **Layout:** Seasons/Episodes/Watchlist usam grid em vez de carousel (sem imagens, mais informativo)
3. **Filtros relacionais:** Dropdowns em cascata para navegacao show → season → episode
4. **Watchlist:** Multi-select com checkboxes para adicionar shows (inspirado em "My List" da Netflix)
5. **Consistencia:** Mesmo padrao de FormMode, modals, hooks e toast de TV Shows
