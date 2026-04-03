# 03 - Frontend Next.js e Storybook

## Estrutura sugerida

```text
src/
  app/
    layout.tsx
    page.tsx
    tv-shows/
    seasons/
    episodes/
    watchlists/
  components/
    ui/
    layout/
    shared/
  features/
    tv-shows/
    seasons/
    episodes/
    watchlists/
  lib/
    api/
    query/
    validation/
    utils/
  types/
```

## Storybook

Storybook sera usado para:

- documentar componentes base
- validar estados visuais
- testar variantes antes de integrar em telas

Prioridade de stories:

1. botao, input, select, textarea, card, dialog, badge
2. tabelas e cards de dominio
3. formularios de `tvShows`
4. componentes de feedback e loading

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

- shell com sidebar e area principal
- foco visual em `tvShows`
- combinacao de cards, tabelas e formularios em drawer/dialog
- responsivo primeiro para desktop e laptop
