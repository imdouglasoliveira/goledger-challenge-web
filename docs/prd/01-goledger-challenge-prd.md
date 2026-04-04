# PRD - GoLedger Challenge Web

- Data: 2026-03-30
- Status: Implemented
- Owner: Projeto GoLedger

## 1. Problema

O desafio pede uma interface web para operar uma aplicacao blockchain externa com foco em catalogo de series de TV. O repositorio atual ainda nao contem a aplicacao.

## 2. Objetivo do produto

Entregar uma aplicacao web com boa UX, organizacao tecnica e acabamento visual para:

- criar
- editar
- buscar
- remover
- visualizar

os assets:

- `tvShows`
- `seasons`
- `episodes`
- `watchlist`

## 3. Publico alvo

- avaliadores tecnicos da GoLedger
- revisores de codigo
- avaliadores de UX/UI

## 4. Requisitos funcionais

1. Listar todos os `tvShows`.
2. Criar, editar e excluir `tvShows`.
3. Listar e manter `seasons`.
4. Listar e manter `episodes`.
5. Listar e manter `watchlists`.
6. Permitir busca por asset type.
7. Manter relacoes entre assets de forma inteligivel.

## 5. Requisitos nao funcionais

1. Credenciais da API externa nao podem ficar expostas no cliente.
2. Interface deve ser responsiva.
3. Fluxos criticos devem ter feedback de loading, erro e sucesso.
4. A API interna deve ser documentada.
5. Componentes principais devem ser testados com Vitest + React Testing Library.

## 6. Escopo visual

- interface moderna, nao genérica
- shell consistente
- formularios claros
- densidade equilibrada entre dashboard e catalogo
- microinteracoes pontuais

## 7. Fora de escopo

- autenticacao de usuarios finais
- banco proprio
- features offline
- analytics complexa

## 8. Criterios de sucesso

- CRUD funcional dos quatro asset types
- stack coerente e bem organizada
- deploy demonstravel
- narrativa arquitetural defensavel
- zero exposicao de segredo no cliente
