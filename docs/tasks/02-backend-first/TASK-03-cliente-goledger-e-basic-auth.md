# TASK-03 - Cliente GoLedger e Basic Auth

- Status: todo
- Prioridade: P0

## O que fazer

1. criar cliente HTTP da API externa
2. injetar Basic Auth via env
3. centralizar timeout
4. tratar erro de autenticacao
5. mascarar segredos em logs

## Por que fazer

- essa e a fronteira mais sensivel do sistema
- se a autenticacao for feita errado, tudo acima quebra

## Como fazer

- criar modulo unico de cliente
- nao espalhar fetch/axios direto pelas rotas
- encapsular headers e auth nesse cliente

## Criterio de pronto

- chamada autenticada para `getSchema` funciona
- senha nao aparece em logs
- timeout configurado
