# TASK-05 - Leitura tvShows primeiro

- Status: todo
- Prioridade: P0

## O que fazer

1. implementar rota interna de listagem de `tvShows`
2. validar resposta com payload real
3. mapear erro externo para erro interno claro
4. criar rota de detalhe se necessario

## Por que fazer

- leitura e o caminho mais seguro para validar a integracao
- `tvShows` e o primeiro recurso do dominio com retorno real

## Como fazer

- usar `search` com `@assetType = tvShows`
- nao avancar para mutacao antes da leitura estar confiavel

## Criterio de pronto

- listagem de `tvShows` responde no BFF
- payload esta compreendido e tipado
