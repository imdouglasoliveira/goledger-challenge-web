# TASK-06 - Mutacoes validacao hardening

- Status: todo
- Prioridade: P0

## O que fazer

1. implementar create/update/delete de `tvShows`
2. validar input com schema
3. retornar erros 4xx e 5xx de forma segura
4. aplicar rate limit mais restritivo nas mutacoes
5. revisar CORS e headers

## Por que fazer

- mutacao expande risco
- seguranca precisa acompanhar o crescimento funcional

## Como fazer

- uma mutacao por vez
- testar com payload real
- revisar logs e mensagens de erro a cada rota

## Criterio de pronto

- CRUD de `tvShows` funcional via API interna
- schemas cobrindo entradas
- rate limit aplicado nas mutacoes
