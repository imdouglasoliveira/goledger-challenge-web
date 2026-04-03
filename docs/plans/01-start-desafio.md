---
id: 01-start-desafio
title: Start do desafio GoLedger
status: approved
created: 2026-03-30T00:00:00Z
author: codex
spec_path: docs/specs/01-start-desafio-spec.md
progress_path: docs/progress/01-start-desafio.progress.md
---

# Start do desafio GoLedger Implementation Plan

**Goal:** Criar a base operacional e arquitetural do desafio com stack moderna, segura e pronta para execucao incremental, priorizando backend/API antes da UI.

**Architecture:** O projeto sera dividido entre `apps/web` em Next.js e `apps/api` em Fastify. A API interna documentada via Swagger/Scalar protegera a integracao com a API externa e sera implementada antes da UI para estabilizar contrato, seguranca e integracao.

**Tech Stack:** Next.js, Fastify, Swagger, Scalar, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, React Hook Form, Zod, Lucide, Storybook.

**Estimated Tasks:** 10 tasks em 5 waves.

---

## Tasks

### Wave 1: Foundation

### Task 1: Inicializar workspace
- Criar estrutura `apps/web`, `apps/api`, `packages/config` se necessario.
- Ajustar `package.json` raiz para scripts orquestrados.
- Por que: sem foundation limpa, o jr perde tempo reorganizando estrutura no meio da entrega.

### Task 2: Bootstrap do Fastify
- Criar app API com TypeScript.
- Adicionar `GET /health` e `GET /ready`.
- Por que: o backend precisa existir primeiro para proteger segredos e servir de base para o frontend.

### Wave 2: Security and Integration

### Task 3: Hardening inicial do Fastify
- Adicionar plugins de Swagger, Scalar, CORS, Helmet e rate limit.
- Definir body limit, timeout, headers e padrao de erro.
- Por que: seguranca baseline nao pode entrar so no final.

### Task 4: Integracao com a API externa
- Criar cliente GoLedger.
- Definir schemas, mapeadores e erros.
- Validar chamadas reais com `getSchema`, `getTx` e `search`.
- Por que: isso reduz retrabalho no frontend e evita payload errado.

### Task 5: API interna de `tvShows`
- Implementar schema e CRUD inicial de `tvShows`.
- Expor contrato no Swagger/Scalar.
- Por que: `tvShows` sera a vertical slice backend.

### Wave 3: Frontend Shell

### Task 6: Bootstrap do Next.js
- Criar app web com TypeScript, App Router e Tailwind.
- Configurar base de componentes, aliases e providers.
- Por que: agora o frontend nasce em cima de um backend funcional.

### Task 7: Design system base e Storybook
- Configurar shadcn/ui.
- Adotar set minimo de componentes base.
- Configurar Storybook.
- Por que: a UI passa a evoluir com consistencia e reuso.

### Wave 4: Vertical Slice

### Task 8: Primeira vertical slice
- Construir fluxo funcional de `tvShows` ponta a ponta.
- Por que: valida frontend + backend + UX + dados em um unico fluxo.

### Task 9: Expansao
- Repetir padrao para `seasons`, `episodes` e `watchlist`.
- Por que: reaproveita o padrao ja estabilizado.

### Wave 5: Final Hardening

### Task 10: Performance, carga e QA final
- Preparar smoke tests e plano de carga com Loader.io para staging controlado.
- Definir limites seguros para nao abusar da API externa.
- Rodar auditoria de dependencias.
- Por que: fechamos qualidade e seguranca sem estressar o ambiente do desafio.

---

## Execution Notes

- **Wave strategy:** backend/API first, depois shell do frontend, depois vertical slice.
- **Dependencies:** credenciais da API externa, Node/npm funcionais, decisoes de stack aprovadas.
- **Risks:** excesso de setup, mistura visual excessiva, atraso por polimento precoce, deploy da API separada.
