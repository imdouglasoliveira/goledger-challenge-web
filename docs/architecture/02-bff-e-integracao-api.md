# 02 - BFF e Integracao com a API

## Objetivo do BFF

O BFF existe para:

- esconder credenciais
- simplificar payloads
- proteger a API externa
- criar um contrato interno mais amigavel ao frontend

## Endpoints externos validados

- `POST /api/query/getSchema`
- `POST /api/query/search`
- `POST /api/query/readAsset`
- `POST /api/invoke/createAsset`
- `POST /api/invoke/updateAsset`
- `POST /api/invoke/deleteAsset`

## Endpoints internos sugeridos

- `GET /schema`
- `GET /tv-shows`
- `POST /tv-shows`
- `PUT /tv-shows/:key`
- `DELETE /tv-shows/:key`
- repetir o padrao para `seasons`, `episodes` e `watchlists`

## Middlewares e plugins obrigatorios

- `@fastify/cors`
- `@fastify/helmet`
- `@fastify/rate-limit`
- `@fastify/swagger`
- `@fastify/swagger-ui` ou exposicao JSON do OpenAPI
- `Scalar` como referencia navegavel

## Organizacao interna

Estrutura pragmatica (ADR-003) — hexagonal simplificada:

- `clients/goledger.ts` — unico modulo que fala com a API externa. Centraliza Basic Auth, timeout, headers e tratamento de erro. Nenhuma rota faz fetch direto.
- `schemas/*.schema.ts` — tipos e validacao compartilhados entre rotas e documentacao OpenAPI.
- `routes/*.ts` — adapters de entrada HTTP. Cada asset type tem seu arquivo.

Nao usar: camada `domain/`, `services/`, `repositories/` ou interfaces `Port` abstratas. O BFF e proxy com validacao — o dominio e fino demais para justificar essas camadas.

## Guardrails

- nunca logar `Authorization`
- validar payloads com schema
- retornar erros claros e sem vazar detalhes internos
- limitar burst e throughput nas rotas de mutacao
