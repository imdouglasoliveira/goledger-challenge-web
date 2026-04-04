# Arquitetura da Solucao

- Data: 2026-03-30
- Status: Proposta ativa
- Stack alvo: Next.js + Fastify + Swagger + Scalar + Tailwind + shadcn/ui

## 1. Objetivo

Construir uma interface web para catalogo de series de TV com CRUD e busca para:

- `tvShows`
- `seasons`
- `episodes`
- `watchlist`

## 2. Drivers arquiteturais

- prazo curto de entrega
- API externa com Basic Auth
- necessidade de UX forte e UI memoravel
- desejo de demonstrar separacao clara entre web app e BFF
- necessidade de documentar e validar contratos internos

## 3. Topologia escolhida

```text
Browser
  -> Next.js App Router
    -> TanStack Query
      -> Fastify API BFF
        -> GoLedger REST API
```

## 4. Responsabilidades

### Next.js

- shell da aplicacao
- rotas de paginas
- estados visuais e navegacao
- rendering e composicao de tela
- consumo da API interna

### Fastify

- encapsular a API externa da GoLedger
- manter credenciais fora do cliente
- traduzir payloads de dominio
- expor API interna consistente
- aplicar rate limit, validacao e hardening

### Swagger + Scalar

- Swagger/OpenAPI como contrato da API interna
- Scalar como interface de navegacao e teste humano do contrato

## 5. Estrutura do projeto

```text
app/                    # Next.js App Router (layout, paginas)
components/             # Componentes React organizados por dominio
  tvshows/
  seasons/
  episodes/
  watchlist/
  ui/                   # Primitivos visuais (Button, Input, Badge, etc.)
lib/                    # Hooks, API client, utilitarios
  hooks/
  api.ts
  utils.ts
src/                    # Fastify BFF
  config/
  clients/
  routes/
  schemas/
  plugins/
  services/
  server.ts
__tests__/              # Testes unitarios e de integracao
```

## 6. UI stack

### Base

- `Tailwind CSS`
- `shadcn/ui`
- `Lucide`

### Complementos aprovados

Usar com moderacao e padronizacao visual:

- `Kibo UI` para componentes avancados do ecossistema shadcn
- `Shadcnblocks` para blocos utilitarios e dashboard sections
- `React Bits` para microinteracoes
- `Magic UI` apenas para efeitos pontuais de hero/empty state

### Regra de ouro

Nao misturar bibliotecas com linguagem visual muito distinta no mesmo fluxo principal.

## 7. Seguranca baseline

- Basic Auth apenas no Fastify
- validacao de entrada com schema em todas as rotas
- rate limit por IP
- helmet e headers seguros
- CORS restritivo entre `web` e `api`
- timeouts e limites de payload
- logging sem segredos

## 8. Performance e resiliencia

- cache control seletivo na API interna
- invalidacao via TanStack Query
- debounce em buscas
- paginação nas listagens quando necessario
- protecao contra burst e abuso
- testes de carga controlados com Loader.io apenas em ambiente de staging

## 9. Riscos

- setup maior que a alternativa com apenas Route Handlers
- deploy mais complexo
- tentacao de overengineering
- mistura excessiva de libs visuais

## 10. Mitigacoes

- limitar escopo do Fastify ao papel de BFF
- aprovar um pequeno set de libs complementares de UI
- priorizar vertical slice de `tvShows` antes do resto
