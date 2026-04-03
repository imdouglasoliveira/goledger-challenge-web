# 03 - Backend First Execution Plan

- Status: approved
- Publico: dev junior
- Prioridade: P0

## Objetivo

Executar o desafio priorizando backend/API antes da UI, para reduzir risco tecnico e garantir seguranca desde o inicio.

Padroes operacionais:

- usar `pnpm` como package manager do workspace
- usar `Portless` apenas como ferramenta de desenvolvimento local
- manter `Portless` fora de `package.json` e do lockfile do projeto

## Por que backend primeiro

- a maior integracao critica esta na API externa da GoLedger
- as credenciais de Basic Auth precisam ser protegidas cedo
- sem contrato interno estavel, a UI retrabalha
- Swagger e Scalar ajudam a validar a integracao antes de gastar energia em telas
- seguranca, rate limit e logs precisam nascer junto com o BFF

## Ordem obrigatoria

1. preflight de seguranca e ambiente
2. bootstrap do Fastify
3. cliente da GoLedger API e autenticacao
4. Swagger, Scalar e schemas
5. endpoints de leitura
6. endpoints de mutacao + hardening
7. smoke, vulnerabilidades e carga leve
8. so depois bootstrap do Next.js e UI

## Definition of Ready para iniciar a UI

A UI so pode comecar quando:

- BFF estiver subindo localmente
- credenciais estiverem fora do cliente
- Swagger e Scalar estiverem acessiveis
- healthcheck estiver funcionando
- `tvShows` leitura estiver validada
- rate limit, helmet, cors e logs estiverem configurados
- scripts do workspace estiverem alinhados com `pnpm`

## Estrutura interna do BFF

Definida em ADR-003. Estrutura pragmatica inspirada em hexagonal:

- `clients/goledger.ts` — adapter de saida, unico ponto de contato com API externa
- `schemas/*.schema.ts` — validacao e tipos compartilhados
- `routes/*.ts` — adapters de entrada HTTP
- sem camada `domain/`, `services/` ou `repositories/`

Motivo: o BFF e proxy com validacao — dominio fino demais para cerimonia formal de ports & adapters.

## Saida esperada

- backend pronto para ser consumido pelo frontend
- risco tecnico principal reduzido
- stack de seguranca minima aplicada
