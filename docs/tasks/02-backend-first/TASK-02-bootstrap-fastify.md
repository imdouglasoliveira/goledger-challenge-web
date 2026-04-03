# TASK-02 - Bootstrap Fastify

- Status: todo
- Prioridade: P0

## O que fazer

1. criar app Fastify com TypeScript
2. estruturar:
   - `src/server.ts`
   - `src/plugins/`
   - `src/routes/`
   - `src/clients/`
   - `src/schemas/`
3. adicionar plugins basicos:
   - cors
   - helmet
   - rate-limit
4. preparar scripts e comandos usando `pnpm`

## Por que fazer

- o BFF e a parte mais critica do desafio
- ele protege a API externa e centraliza integracao e seguranca

## Como fazer

- criar servidor simples primeiro
- adicionar healthcheck
- subir localmente antes de integrar qualquer rota real
- manter package manager padrao como `pnpm`

## Criterio de pronto

- `GET /health` responde
- servidor sobe sem erro
- plugins base carregados
