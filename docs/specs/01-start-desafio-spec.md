---
id: 01-start-desafio
title: Start do desafio GoLedger
status: approved
created: 2026-03-30T00:00:00Z
author: codex
---

# Spec - Start do desafio GoLedger

## 1. Objetivo

Definir a implementacao inicial do projeto com:

- frontend Next.js
- backend Fastify
- contrato via Swagger/OpenAPI
- docs navegaveis com Scalar
- UI base com Tailwind + shadcn/ui
- Storybook desde cedo

## 2. Escopo tecnico

- bootstrap do monorepo simples em `apps/web` e `apps/api`
- integracao inicial com a API externa
- definicao de schemas e contratos
- setup de seguranca baseline
- setup de Storybook

## 3. User stories

### US1 - Fundacao

Como desenvolvedor, quero um workspace inicial com frontend, backend, docs e scripts, para iniciar implementacao sem retrabalho estrutural.

### US2 - Integracao segura

Como desenvolvedor, quero encapsular a API externa em Fastify, para evitar expor segredos e padronizar contratos.

### US3 - UI reutilizavel

Como desenvolvedor, quero um catalogo inicial de componentes em Storybook, para acelerar a construcao e o polimento visual.

### US4 - Operacao segura

Como mantenedor, quero baseline de hardening e plano de teste de carga, para reduzir vulnerabilidades e abuso acidental.

## 4. Decisoes tecnicas

- Next.js sera usado no frontend
- Fastify sera o BFF
- Swagger sera a especificacao da API interna
- Scalar sera a interface de docs da API interna
- Storybook sera usado desde o inicio
- ORM nao sera usado na fase inicial

## 5. API interna inicial

- `GET /health`
- `GET /schema`
- `GET /tv-shows`
- `POST /tv-shows`
- `PUT /tv-shows/:id`
- `DELETE /tv-shows/:id`

## 6. Seguranca

- secrets somente no backend
- validacao de payload
- rate limiting
- hardening de headers
- tratamento de erro sem vazar detalhes internos

## 7. Testes

- unitarios para mapeadores e validadores
- integracao para API Fastify
- component stories para estados-chave
- E2E minimo depois da vertical slice de `tvShows`

## 8. Criterios de aceite tecnicos

1. Monorepo inicial sobe localmente.
2. Web e API possuem scripts claros.
3. API interna fica acessivel e documentada.
4. Storybook sobe com componentes base.
5. Guidelines de seguranca e carga estao documentadas.
