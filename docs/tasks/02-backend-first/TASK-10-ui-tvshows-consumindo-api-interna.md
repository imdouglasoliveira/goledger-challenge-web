# TASK-10 - UI de tvShows consumindo a API interna

- Status: todo
- Prioridade: P1

## O que fazer

1. implementar listagem de `tvShows`
2. implementar criar `tvShows`
3. implementar editar `tvShows`
4. implementar excluir `tvShows`
5. tratar loading, erro e estado vazio
6. tratar skeleton e carregamento incremental onde fizer sentido

## Por que fazer

- fecha a primeira vertical slice completa
- valida a integracao entre frontend e BFF
- cria a base para expandir `seasons`, `episodes` e `watchlist`

## Como fazer

- executar somente apos `T029`
- consumir somente a API interna
- nao chamar a API externa direto do cliente
- usar `TanStack Query`, `React Hook Form` e `Zod` apenas no escopo dessa tela
- validar UX minima: loading, erro, sucesso e confirmacao de exclusao
- usar estrategia de carregamento otimizada: `skeleton` para carga inicial, indicador discreto para refetch e loading inline em mutacoes
- evitar spinner de pagina inteira quando a estrutura visual da tela ja for conhecida
- evitar duplicar hooks, query keys, schemas e componentes de estado
- preferir manter dados anteriores em filtros/paginacao quando isso melhorar a percepcao de velocidade
- adiar componentes pesados ou secundarios quando nao forem necessarios no primeiro paint

## Criterio de pronto

- tela de `tvShows` funcional ponta a ponta
- leituras e mutacoes passam pelo BFF
- estados de loading e erro existem
- `skeleton` ou `loading state` existe onde o carregamento for perceptivel
- nao ha duplicacao evitavel de logica de fetch ou componentes de estado
- nenhum segredo aparece no cliente
