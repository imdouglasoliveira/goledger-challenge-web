# 03 - Frontend Next.js

## Estrutura do projeto

```text
app/
  layout.tsx
  page.tsx                # Home (TV Shows)
  seasons/
  episodes/
  watchlists/
components/
  tvshows/                # TvShowsPage, TvShowForm, TvShowThumbnail, etc.
  seasons/                # SeasonsPage, SeasonForm, SeasonCard
  episodes/               # EpisodesPage, EpisodeForm, EpisodeCard
  watchlist/               # WatchlistPage, WatchlistForm, WatchlistCard
  ui/                     # Button, Input, Badge, Modal, Skeleton, etc.
  layout/                 # Header, Sidebar, PageContainer
lib/
  api.ts                  # API client (fetch para /api/*)
  hooks/                  # React Query hooks (use-tvshows, use-seasons, etc.)
  utils.ts                # Utilitarios (cn, titleToGradient, etc.)
```

## Regras de loading e carregamento percebido

- usar `skeleton` quando a estrutura final da tela ja for conhecida
- usar spinner pequeno ou indicador discreto apenas para refetch, acoes secundarias ou mutacoes pontuais
- evitar spinner de pagina inteira se o shell, tabela ou cards puderem renderizar placeholder real
- diferenciar:
  - carga inicial
  - refetch em background
  - mutacao em andamento
  - estado vazio
  - estado de erro

## Diretrizes de performance

- evitar waterfalls de fetch
- preferir prefetch e paralelizacao para dados independentes
- manter dados anteriores quando filtros e listagens atualizarem rapidamente
- aplicar importacao dinamica em componentes pesados ou nao criticos
- evitar enviar ao cliente dados que nao serao usados pela UI inicial
- manter query keys, api client e schemas centralizados

## Anti-duplicacao

- extrair query keys compartilhadas
- extrair wrappers de estado como `PageSkeleton`, `SectionSkeleton`, `EmptyState` e `ErrorState`
- evitar duplicar mapeamento de payloads e validacoes
- evitar duplicar logica de loading em cada tela quando houver padrao reutilizavel

## Direcao de UX

- interface Netflix-inspired com hero banner, carousels e hover cards
- foco visual em `tvShows` na home
- combinacao de cards, modais e formularios
- mobile-first com breakpoints responsivos
- dark theme exclusivo com paleta Netflix (nf-red, nf-black, nf-surface)
