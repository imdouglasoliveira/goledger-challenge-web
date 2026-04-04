# QA 01 - Estrategia de testes

## Objetivo

Cobrir a arquitetura em dois niveis: API interna (BFF) e frontend (componentes).

## API interna (Vitest + Fastify inject)

- validar contrato OpenAPI
- validar healthcheck
- validar CRUD de `tvShows` (list, create, update, delete)
- validar cenarios de erro (duplicatas, inputs invalidos, campos extras)
- validar rate limit e headers
- validar sanitizacao de payloads e trimming

## Frontend (Vitest + React Testing Library)

- validar formularios (tvshow-form, season-form, episode-form, watchlist-form)
- validar estados de loading/error/empty
- validar componentes de UI (header, hero-banner, thumbnail)
- validar interacoes (modal, toast, confetti, watchlist toggle)

## Ferramentas

- `Vitest` como test runner
- `React Testing Library` para testes de componentes
- `@testing-library/jest-dom` para matchers DOM

## Cobertura atual

- 44 testes em 10 arquivos
- 100% passando
- Testes de componentes: forms, pages, UI primitivos
- Testes de API: rotas BFF com mocks do GoLedger client
