# TASK-01 - Preflight seguranca e ambiente

- Status: todo
- Prioridade: P0

## O que fazer

1. confirmar Node e npm funcionando
2. criar `.env.example`
3. definir variaveis:
   - `GOLEDGER_BASE_URL`
   - `GOLEDGER_USERNAME`
   - `GOLEDGER_PASSWORD`
4. garantir que `.env` esta ignorado no git
5. anotar no README que segredo nunca vai para frontend

## Por que fazer

- sem ambiente limpo, o junior vai quebrar setup logo no inicio
- sem segredos isolados, o risco de vazamento cresce

## Como fazer

- validar versoes do runtime
- criar arquivo de exemplo sem valores reais
- usar variaveis apenas no servidor Fastify

## Criterio de pronto

- ambiente sobe
- secrets fora do git
- time sabe onde configurar credenciais
