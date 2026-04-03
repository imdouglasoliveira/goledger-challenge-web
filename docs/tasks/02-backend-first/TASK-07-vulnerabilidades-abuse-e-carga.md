# TASK-07 - Vulnerabilidades abuse e carga

- Status: todo
- Prioridade: P0

## O que fazer

1. rodar `pnpm audit`
2. revisar findings altos e criticos
3. validar logs, timeouts e retries
4. testar burst leve no BFF
5. documentar regra de uso seguro do Loader.io

## Por que fazer

- seguranca e parte obrigatoria do desafio
- carga mal planejada pode abusar da API externa

## Como fazer

- testar carga somente no BFF ou staging controlado
- nunca bater forte no endpoint da GoLedger
- tratar risco residual por escrito se necessario
- executar o checklist de `docs/security/02-rigid-pentest-checklist.md`

## Criterio de pronto

- findings criticos tratados ou documentados
- politica de carga segura registrada
- checklist de pentest executado com evidencia minima
- backend pronto para liberar UI
