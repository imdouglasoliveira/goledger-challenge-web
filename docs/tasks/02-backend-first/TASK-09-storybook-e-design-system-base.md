# TASK-09 - Storybook e design system base

- Status: todo
- Prioridade: P1

## O que fazer

1. configurar Storybook no app frontend
2. instalar e configurar `shadcn/ui`
3. preparar tokens basicos de tema com `Tailwind`
4. criar stories iniciais de componentes base
5. criar componentes ou padroes reutilizaveis para `loading`, `skeleton`, `empty state` e `error state`

## Por que fazer

- documenta o design system real do projeto
- reduz regressao visual
- organiza a base visual antes de expandir a UI

## Como fazer

- executar somente apos `T028`
- usar apenas a stack aprovada
- nao adicionar novas dependencias fora de `docs/ui/02-approved-bootstrap-dependencies.md`
- manter o escopo inicial pequeno: `button`, `input`, `select`, `card`, `dialog`, `skeleton`, `empty state`
- evitar duplicar skeletons por pagina quando o mesmo padrao puder ser reutilizado
- documentar no Storybook os estados base de carregamento e vazio

## Criterio de pronto

- Storybook sobe localmente
- componentes base possuem stories
- tema base do projeto esta consistente
- nenhuma chamada a API externa parte do Storybook
- existe base reutilizavel para `loading/skeleton/empty/error`
