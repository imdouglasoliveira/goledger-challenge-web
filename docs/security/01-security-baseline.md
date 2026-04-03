# 01 - Security Baseline

## Objetivo

Definir o minimo aceitavel de seguranca para este desafio.

## Ameaças principais

- exposicao do Basic Auth no cliente
- abuso de rotas do BFF
- inputs malformados
- regressao de dependencia vulneravel
- carga excessiva acidental na API externa

## Medidas obrigatorias

- segredos somente em env do servidor
- `@fastify/helmet`
- `@fastify/rate-limit`
- `cors` restritivo
- validacao Zod no frontend e no backend
- nunca expor stack traces ao cliente
- mascarar erros sensiveis
- logs sem credenciais

## Vulnerabilidades e tratamento

- rodar `pnpm audit`
- revisar manualmente findings criticos e altos
- aplicar upgrade ou override quando fizer sentido
- documentar aceites de risco temporarios

## DDoS e abuso

- limitar burst nas rotas de mutacao
- limitar chamadas por IP
- cachear leituras seguras quando possivel
- usar timeout curto para API externa
- abortar retries agressivos

## Loader.io e carga

- usar somente para o BFF proprio ou ambiente controlado
- nao usar carga pesada diretamente contra o endpoint da GoLedger
- foco: validar gargalos do nosso backend e do nosso frontend

## Ferramentas recomendadas

- `pnpm audit`
- SAST com ESLint rules e revisao manual
- Playwright para smoke critico
- Loader.io somente em ambiente permitido
