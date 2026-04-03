# Documentacao do Projeto

Este diretorio concentra a documentacao oficial do desafio GoLedger, organizada para planejamento, execucao, seguranca, QA, Storybook e entrega.

## Stack oficial

- `Next.js`
- `Fastify`
- `Swagger/OpenAPI`
- `Scalar`
- `TypeScript`
- `pnpm`
- `TanStack Query`
- `Tailwind CSS`
- `shadcn/ui`
- `Lucide`
- `React Hook Form`
- `Zod`
- `Storybook`

## Estrutura de pastas

- [adr](e:/Github/desafios-vagas/go-ledger/docs/adr)
- [architecture](e:/Github/desafios-vagas/go-ledger/docs/architecture)
- [prd](e:/Github/desafios-vagas/go-ledger/docs/prd)
- [plans](e:/Github/desafios-vagas/go-ledger/docs/plans)
- [tasks](e:/Github/desafios-vagas/go-ledger/docs/tasks)
- [security](e:/Github/desafios-vagas/go-ledger/docs/security)
- [qa](e:/Github/desafios-vagas/go-ledger/docs/qa)
- [ui](e:/Github/desafios-vagas/go-ledger/docs/ui)
- [storybook](e:/Github/desafios-vagas/go-ledger/docs/storybook)
- [postman](e:/Github/desafios-vagas/go-ledger/docs/postman)

## Trilha principal para execucao

Se o objetivo for minimizar erro operacional, seguir a trilha `backend-first` como caminho preferencial.

1. [ADR-001 - Arquitetura e Stack Base](e:/Github/desafios-vagas/go-ledger/docs/adr/ADR-001-arquitetura-e-stack-base.md)
1b. [ADR-003 - Estrutura Pragmatica do BFF](e:/Github/desafios-vagas/go-ledger/docs/adr/ADR-003-estrutura-pragmatica-bff.md)
2. [01 - GoLedger Challenge PRD](e:/Github/desafios-vagas/go-ledger/docs/prd/01-goledger-challenge-prd.md)
3. [01 - Visao Geral do Sistema](e:/Github/desafios-vagas/go-ledger/docs/architecture/01-system-overview.md)
4. [02 - BFF e Integracao com a API](e:/Github/desafios-vagas/go-ledger/docs/architecture/02-bff-e-integracao-api.md)
5. [03 - Backend First Execution Plan](e:/Github/desafios-vagas/go-ledger/docs/plans/03-backend-first-execution-plan.md)
6. [02 - Backend First Tasks](e:/Github/desafios-vagas/go-ledger/docs/tasks/02-backend-first-tasks.md)
7. [01 - Security Baseline](e:/Github/desafios-vagas/go-ledger/docs/security/01-security-baseline.md)
8. [01 - Security Hardening](e:/Github/desafios-vagas/go-ledger/docs/security/01-security-hardening.md)
9. [02 - Rigid Pentest Checklist](e:/Github/desafios-vagas/go-ledger/docs/security/02-rigid-pentest-checklist.md)
10. [04 - Local Dev com pnpm e Portless](e:/Github/desafios-vagas/go-ledger/docs/architecture/04-local-dev-pnpm-portless.md)

Somente apos `T028` liberar UI:

11. [ADR-002 - UI System, Storybook e Bibliotecas Complementares](e:/Github/desafios-vagas/go-ledger/docs/adr/ADR-002-ui-system-storybook-e-bibliotecas.md)
12. [03 - Frontend Next.js e Storybook](e:/Github/desafios-vagas/go-ledger/docs/architecture/03-frontend-nextjs-e-storybook.md)
13. [03 - Loading, Performance e Reuso](e:/Github/desafios-vagas/go-ledger/docs/ui/03-loading-performance-and-reuse-guidelines.md)

## Precedencia canonica

Quando dois arquivos canonicos divergirem, siga esta ordem:

1. task detalhada da etapa atual
2. [02 - Backend First Tasks](e:/Github/desafios-vagas/go-ledger/docs/tasks/02-backend-first-tasks.md)
3. [03 - Backend First Execution Plan](e:/Github/desafios-vagas/go-ledger/docs/plans/03-backend-first-execution-plan.md)
4. ADR aplicavel
5. documento de arquitetura aplicavel
6. PRD
7. esta README

Para contrato da API externa:

1. [swagger.yaml](e:/Github/desafios-vagas/go-ledger/.temp/swagger.yaml) e a fonte de verdade para endpoints, payloads e status codes
2. Postman e docs textuais so complementam entendimento operacional
3. se houver conflito entre `swagger.yaml` e texto, vence `swagger.yaml`
4. se houver conflito entre dois canonicos sem regra clara, abrir `BLOQUEIO DOCUMENTAL`

## Apoios complementares

- [Security baseline](e:/Github/desafios-vagas/go-ledger/docs/security/01-security-baseline.md)
- [Security hardening](e:/Github/desafios-vagas/go-ledger/docs/security/01-security-hardening.md)
- [Rigid pentest checklist](e:/Github/desafios-vagas/go-ledger/docs/security/02-rigid-pentest-checklist.md)
- [QA strategy](e:/Github/desafios-vagas/go-ledger/docs/qa/01-test-strategy.md)
- [UI stack and component sources](e:/Github/desafios-vagas/go-ledger/docs/ui/01-ui-stack-and-component-sources.md)
- [Approved bootstrap dependencies](e:/Github/desafios-vagas/go-ledger/docs/ui/02-approved-bootstrap-dependencies.md)
- [01 - Start Desafio](e:/Github/desafios-vagas/go-ledger/docs/plans/01-start-desafio.md)
- [01 - Start Desafio GoLedger](e:/Github/desafios-vagas/go-ledger/.temp/01-start-desafio.md)

## Convencoes

- `plans/` e `tasks/` usam prefixo numerico.
- arquivos concluidos recebem sufixo `-done`.
- ADRs e PRDs nao usam `done`.
- os arquivos legados em `specs/`, `progress/`, `adrs/` e variantes `*-jr-*` podem ser usados como apoio, mas a trilha canonica esta nesta README.
