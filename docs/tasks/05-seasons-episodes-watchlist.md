# Tasks 05 - Seasons, Episodes & Watchlist

Plano: `docs/plans/07-seasons-episodes-watchlist.md`

## Ordem canonica

- [ ] T091 → `TASK-01-foundation-types-hooks.md`
- [ ] T092 → `TASK-02-seasons-page.md`
- [ ] T093 → `TASK-03-episodes-page.md`
- [ ] T094 → `TASK-04-watchlist-page.md`
- [ ] T095 → `TASK-05-navigation.md`
- [ ] T096 → `TASK-06-seed-data.md`
- [ ] T097 → `TASK-07-build-validation.md`

## Fases

- **Fundacao (T091):** types, API client, React Query hooks para 3 entidades
- **Paginas CRUD (T092-T094):** seasons, episodes, watchlist — cada uma com page, form, card
- **Integracao (T095):** header links ativos + indicador de pagina ativa
- **Demonstracao (T096):** seed de dados realistas
- **Validacao (T097):** build + checklist E2E

## Regra de execucao

Nao pular para a proxima task sem cumprir o criterio de pronto da anterior.

Se houver divergencia entre a task detalhada e outro documento, vence a task detalhada da etapa atual.

## Agents e skills a8z

| Task | Agent/Skill |
|------|-------------|
| T091 | `a8z-master` |
| T092-T094 | `design-to-code` |
| T095 | `a8z-master` |
| T096 | `a8z-master` |
| T097 | `a8z-master` |

## Arquivos por task

| Task | Arquivos | Acao |
|------|----------|------|
| T091 | `lib/api.ts`, `lib/hooks/use-seasons.ts`, `use-episodes.ts`, `use-watchlist.ts` | Editar + criar |
| T092 | `components/seasons/*` (3), `app/seasons/page.tsx` | Criar |
| T093 | `components/episodes/*` (3), `app/episodes/page.tsx` | Criar |
| T094 | `components/watchlist/*` (3), `app/watchlist/page.tsx` | Criar |
| T095 | `components/layout/header.tsx` | Editar |
| T096 | `scripts/seed-all.mjs` | Criar + executar |
| T097 | Nenhum | Checklist manual |
