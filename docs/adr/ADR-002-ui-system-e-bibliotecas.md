# ADR-002 - UI System e Bibliotecas Complementares

- Status: accepted
- Data: 2026-03-30
- Decisores: projeto GoLedger

## 1. Contexto

O desafio pede uma UI bonita, nao apenas funcional. Precisamos de velocidade com controle visual.

## 2. Decisao

Base visual:

- `Tailwind CSS`
- `shadcn/ui`
- `Lucide`
- `Radix UI` apenas indiretamente, via ecossistema do shadcn

Bibliotecas complementares aprovadas para uso pontual:

- `Sonner` para toasts e feedback
- `canvas-confetti` para animacoes de celebracao
- `motion` para transicoes e animacoes

## 3. Regras de uso

- `shadcn/ui` continua sendo a base principal
- usar bibliotecas complementares apenas quando trouxerem ganho real
- evitar visual "template marketplace"
- evitar excesso de animacao
- implementar `loading`, `skeleton`, `empty state` e `error state` quando houver fetch ou mutacao perceptivel
- preferir `skeleton` com layout real em vez de spinner de pagina inteira quando a estrutura da tela ja for conhecida
- evitar codigo duplicado de query keys, api client, schemas, skeletons e wrappers de estado
- priorizar carregamento percebido: manter dados anteriores quando fizer sentido, evitar waterfalls e adiar componentes pesados

## 4. Bibliotecas a evitar neste desafio

- `Material UI`
- `Ant Design`
- `Chakra UI`
- `Hero UI`
- `Mantine`
- `Untitled UI`
- `React Aria` como base primaria
- `Base UI` como base primaria
- `Aceternity UI`, salvo uso muito pontual de marketing

Motivo comum:

- criam overlap com a base escolhida
- aumentam peso visual ou tecnico
- tornam a UI menos consistente
- desviam foco da entrega do desafio

## 5. Consequencias

### Positivas

- mais velocidade de construcao
- UI mais forte para avaliacao
- base reutilizavel

### Negativas

- risco de inconsistencias se misturarmos bibliotecas demais
- maior necessidade de criterio visual

## 6. Guardrails

- preferir composicao e customizacao local
- manter tokens visuais centralizados
