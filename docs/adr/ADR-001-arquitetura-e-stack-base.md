# ADR-001 - Arquitetura e Stack Base

- Status: accepted
- Data: 2026-03-30
- Decisores: projeto GoLedger

## 1. Contexto

O desafio pede uma interface web em React para operar uma API blockchain externa via CRUD e busca. A API usa Basic Auth fixo, o prazo e curto e a avaliacao tende a considerar:

- aderencia ao enunciado
- clareza de arquitetura
- UX/UI
- completude funcional

## 2. Decisao

Adotar a seguinte stack principal:

- `Next.js`
- `Fastify`
- `Swagger/OpenAPI`
- `Scalar`
- `TypeScript`
- `pnpm`
- `Tailwind CSS`
- `shadcn/ui`
- `TanStack Query`
- `React Hook Form`
- `Zod`
- `Lucide`

Arquitetura escolhida:

- `Next.js` para frontend, layout, paginas e consumo da API interna
- `Fastify` como BFF/proxy para encapsular chamadas para a API da GoLedger
- `Swagger/OpenAPI + Scalar` para contrato e exploracao da API interna

## 3. Motivadores

- esconder credenciais de Basic Auth do navegador
- manter um backend mais explicito do que simples Route Handlers
- documentar a API interna de forma clara
- criar base mais forte para QA e evolucao tecnica

## 4. Alternativas consideradas

### Alternativa A - Next.js + Route Handlers

- Pros:
  - menor complexidade
  - deploy mais simples
  - aderencia literal ao enunciado
- Contras:
  - API interna menos formal
  - menor ergonomia para documentacao OpenAPI real
  - menor separacao entre app e BFF

### Alternativa B - Next.js + Fastify + Swagger + Scalar

- Pros:
  - BFF mais organizado
  - contrato OpenAPI formal
  - melhor demonstracao de arquitetura backend
  - facilita rate limit, logs e middleware de seguranca
- Contras:
  - setup inicial maior
  - deploy mais complexo que Next puro

## 5. Consequencias

### Positivas

- credenciais ficam protegidas
- backend e frontend possuem fronteira clara
- seguranca e observabilidade ficam mais faceis de organizar

### Negativas e trade-offs

- duas camadas para manter
- maior custo inicial de bootstrap
- precisamos controlar bem escopo para nao inflar a implementacao

## 6. Decisoes complementares

- usar `pnpm` como package manager oficial do workspace
- usar `Portless` como ferramenta global opcional/dirigida de DX local, nunca como dependencia do projeto
- nao usar ORM nesta fase
- nao usar TanStack Router no frontend
- nao usar bibliotecas UI fechadas como base primaria; o core visual sera `shadcn/ui + Tailwind`
- estrutura interna do BFF e pragmatica (hexagonal simplificada) — ver ADR-003

## 7. Plano de implementacao

1. bootstrap de `Next.js`
2. bootstrap do `Fastify`
3. modelagem da API interna via OpenAPI
4. vertical slice de `tvShows`
5. extensao para `seasons`, `episodes` e `watchlist`
