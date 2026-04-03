# QA 01 - Estrategia de testes

## Objetivo

Cobrir a arquitetura em tres niveis: API interna, frontend e experiencia do usuario.

## API interna

- validar contrato OpenAPI
- validar healthcheck
- validar CRUD de `tvShows`
- validar cenarios de erro
- validar rate limit e headers

## Frontend

- validar formularios
- validar estados de loading/error/empty
- validar componentes base no Storybook

## E2E minimo

- criar `tvShow`
- editar `tvShow`
- excluir `tvShow`
- criar uma `season`
- criar um `episode`

## Ferramentas sugeridas

- `Vitest`
- `Playwright`
- `Loader.io` para smoke controlado
