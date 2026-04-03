# 01 - Visao Geral do Sistema

## Arquitetura escolhida

```text
Browser
  -> Next.js App
      -> pages/layouts/components
      -> TanStack Query
          -> Fastify BFF
              -> GoLedger External API
```

## Modulos principais

- `Next.js` para UX, shell e navegacao
- `Fastify` para BFF, autenticacao e contrato interno
- `Swagger/OpenAPI + Scalar` para documentar e testar a API interna
- `Storybook` para design system aplicado

## Responsabilidades

### Next.js

- shell da aplicacao
- paginas e layouts
- experiencia do usuario
- consumo da API interna
- Storybook e design system

### Fastify

- proxy para API da GoLedger
- autenticacao Basic Auth no servidor
- normalizacao de payloads
- rate limiting
- headers de seguranca
- exposicao de OpenAPI e Scalar

## Organizacao interna do BFF

Estrutura pragmatica inspirada em hexagonal, sem cerimonia formal (ADR-003):

```text
src/
  config/env.ts           # ambiente
  clients/goledger.ts     # adapter de saida (unico ponto de contato com API externa)
  schemas/*.schema.ts     # validacao + tipos compartilhados
  routes/*.ts             # adapters de entrada (rotas HTTP)
  plugins/security.ts     # cors, helmet, rate-limit
  server.ts               # bootstrap
```

Principios:
- `clients/` centraliza auth, timeout e error handling — nenhuma rota faz fetch direto
- `schemas/` e compartilhado entre validacao de input e documentacao OpenAPI
- sem camada `domain/`, `services/` ou `repositories/` — o BFF e proxy com validacao, nao tem regras de negocio complexas

## Fontes de verdade tecnicas

- `.temp/swagger.yaml`
- respostas reais de `getSchema`
- respostas reais de `getTx`
- README do desafio
