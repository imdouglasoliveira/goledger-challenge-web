# 03 - Backend First Jr Execution

## Objetivo

Executar o desafio priorizando backend/API e seguranca antes de qualquer esforco relevante de UI.

## Regra principal

Nao abrir frente nova enquanto a fase atual nao estiver:

- funcional
- validada manualmente
- com erro controlado
- com seguranca minima aplicada

## Sequencia canônica

### Fase 1 - Preflight e fundacao segura

1. [TASK-01 - Preflight seguranca e ambiente](e:/Github/desafios-vagas/go-ledger/docs/tasks/02-backend-first/TASK-01-preflight-seguranca-e-ambiente.md)
2. [TASK-02 - Bootstrap Fastify](e:/Github/desafios-vagas/go-ledger/docs/tasks/02-backend-first/TASK-02-bootstrap-fastify.md)
3. [TASK-03 - Cliente GoLedger e Basic Auth](e:/Github/desafios-vagas/go-ledger/docs/tasks/02-backend-first/TASK-03-cliente-goledger-e-basic-auth.md)

### Fase 2 - Contrato e validacao da API

4. [TASK-04 - OpenAPI, Swagger e Scalar](e:/Github/desafios-vagas/go-ledger/docs/tasks/02-backend-first/TASK-04-openapi-swagger-scalar.md)
5. [TASK-05 - Leitura tvShows primeiro](e:/Github/desafios-vagas/go-ledger/docs/tasks/02-backend-first/TASK-05-leitura-tvshows-primeiro.md)
6. [TASK-06 - Mutacoes validacao hardening](e:/Github/desafios-vagas/go-ledger/docs/tasks/02-backend-first/TASK-06-mutacoes-validacao-hardening.md)

### Fase 3 - Seguranca e readiness

7. [TASK-07 - Vulnerabilidades abuse e carga](e:/Github/desafios-vagas/go-ledger/docs/tasks/02-backend-first/TASK-07-vulnerabilidades-abuse-e-carga.md)

### Fase 4 - Liberacao de UI

8. [TASK-08 - Liberacao Next.js UI](e:/Github/desafios-vagas/go-ledger/docs/tasks/02-backend-first/TASK-08-liberacao-nextjs-ui.md)

## Por que essa ordem

- backend reduz o maior risco tecnico primeiro
- seguranca protege o projeto antes da expansao
- Swagger/Scalar aceleram QA e debugging
- UI nasce em cima de um contrato interno estavel

## O que o jr nao deve fazer

- nao chamar a API externa direto do browser
- nao testar carga forte no endpoint da GoLedger
- nao pular hardening so porque a feature “ja funciona”
- nao abrir `seasons`, `episodes` e `watchlist` antes de `tvShows` estar fechado
