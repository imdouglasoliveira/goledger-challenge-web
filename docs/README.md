# Documentacao do Projeto

Documentacao tecnica do desafio GoLedger — catalogo Netflix-inspired de TV Shows com CRUD completo para 4 entidades, BFF com Fastify e integracao blockchain.

## Stack

- `Next.js 16` + `React 19`
- `Fastify 5` (BFF)
- `TypeScript 6`
- `Tailwind CSS 4`
- `TanStack Query 5`
- `React Hook Form 7` + `Zod 4`
- `Swagger/OpenAPI` + `Scalar`
- `shadcn/ui` + `Lucide`
- `Vitest` + `React Testing Library`
- `Sonner` + `canvas-confetti`

## Estrutura de pastas

```
docs/
  adr/            # Architecture Decision Records
  architecture/   # Documentacao de arquitetura
  prd/            # Product Requirements Document
  security/       # Baseline, hardening e pentest checklist
  qa/             # Estrategia de testes
  ui/             # Stack UI e dependencias aprovadas
```

## Documentos por categoria

### ADR (Architecture Decision Records)

- [ADR-001 - Arquitetura e Stack Base](adr/ADR-001-arquitetura-e-stack-base.md)
- [ADR-002 - UI System e Bibliotecas](adr/ADR-002-ui-system-e-bibliotecas.md)
- [ADR-003 - Estrutura Pragmatica do BFF](adr/ADR-003-estrutura-pragmatica-bff.md)

### Arquitetura

- [01 - Arquitetura da Solucao](architecture/01-arquitetura-solucao.md)
- [01 - Visao Geral do Sistema](architecture/01-system-overview.md)
- [02 - BFF e Integracao com a API](architecture/02-bff-e-integracao-api.md)
- [03 - Frontend Next.js](architecture/03-frontend-nextjs.md)
- [04 - Local Dev com pnpm](architecture/04-local-dev-pnpm-portless.md)

### Produto

- [01 - GoLedger Challenge PRD](prd/01-goledger-challenge-prd.md)

### Seguranca

- [01 - Security Baseline](security/01-security-baseline.md)
- [01 - Security Hardening](security/01-security-hardening.md)
- [02 - Rigid Pentest Checklist](security/02-rigid-pentest-checklist.md)

### QA

- [01 - Estrategia de Testes](qa/01-test-strategy.md)

### UI

- [01 - UI Stack e Component Sources](ui/01-ui-stack-and-component-sources.md)
- [02 - Dependencias Aprovadas](ui/02-approved-bootstrap-dependencies.md)
- [03 - Loading, Performance e Reuso](ui/03-loading-performance-and-reuse-guidelines.md)

## Precedencia canonica

Quando dois documentos divergirem:

1. ADR aplicavel
2. documento de arquitetura aplicavel
3. PRD
4. esta README
