# TASK-08 - Liberacao Next.js UI

- Status: todo
- Prioridade: P1

## O que fazer

1. bootstrap do Next.js
2. configurar providers e Query Client
3. integrar UI apenas com a API interna pronta
4. alinhar scripts de frontend com `pnpm`
5. preparar uso de `Portless` para DX local sem adicionar dependencia ao projeto
6. liberar o inicio de `T029` e `T030`

## Por que fazer

- com a API pronta, a UI vira integracao controlada e nao exploracao caotica

## Como fazer

- começar por `tvShows`
- consumir apenas o BFF interno
- nao chamar a API externa direto do cliente
- usar `pnpm` como package manager oficial
- `Portless` entra apenas como ferramenta global de desenvolvimento
- nao adicionar `Portless` ao `package.json`
- liberar `T029` e `T030` somente apos cumprir todos os bloqueios de seguranca

## Criterio de pronto

- frontend sobe
- frontend esta pronto para iniciar Storybook e a UI real
- nenhuma chamada direta do cliente para a API externa existe
- estrategia local com `pnpm` e `Portless` esta documentada
