# 01 - UI Stack and Component Sources

## Base

- `Tailwind CSS`
- `shadcn/ui`
- `Lucide`
- `Storybook`

## Base recomendada para este desafio

- `shadcn/ui` como foundation de componentes
- `Tailwind CSS` para tokens, layout e customizacao
- `Lucide` para iconografia
- `Storybook` para catalogar variantes e validar regressao visual

Racional:

- combina velocidade com controle
- e o melhor encaixe para `Next.js + Storybook`
- e a opcao mais AI-friendly para iteracao rapida

## Complementares aprovadas

### Kibo UI

Usar para componentes mais complexos quando o shadcn puro ficar caro de montar.

### Magic UI

Usar para detalhes visuais pontuais, nao para transformar tudo em landing page animada.

### React Bits

Usar para microinteracoes e motion refinado.

### Shadcnblocks

Usar para acelerar composicao de secoes e estruturas.

### Sonner

Usar para toasts e feedbacks de sistema.

### Vaul

Usar para drawers e bottom sheets mobile-first.

### cmdk

Usar para command palette e busca rapida.

### TanStack Table

Usar para tabelas mais complexas do catalogo.

### Recharts

Usar apenas se surgir necessidade real de metricas ou visualizacoes.

### React Day Picker

Usar para datas quando o dominio exigir.

### Embla Carousel

Usar para carrosseis pontuais sem inflar a UI.

## Bibliotecas a evitar neste desafio

- `Material UI`
- `Ant Design`
- `Chakra UI`
- `Hero UI`
- `Mantine`
- `Untitled UI`
- `React Aria` como base principal
- `Base UI` como base principal
- `Aceternity UI` como camada ampla de marketing

Racional:

- sobrepoem a base `shadcn/ui`
- aumentam lock-in visual
- adicionam peso e mais superficie de manutencao
- desviam do foco do desafio, que e entregar rapido com UI consistente

## Regras

- base em `shadcn/ui`
- complementar com parcimonia
- priorizar coerencia visual sobre quantidade de libs
- criar stories para os componentes adaptados
- evitar misturar dois sistemas completos de componentes

## Storybook

O Storybook sera o catalogo da UI.

Componentes que devem ter story:

- button
- input
- select
- dialog
- card
- badge
- skeleton
- tabela/lista de `tvShows`
- formulario de `tvShows`

## Bootstrap fechado

A lista fechada de dependencias aprovadas para o bootstrap esta em:

- [02-approved-bootstrap-dependencies.md](e:/Github/desafios-vagas/go-ledger/docs/ui/02-approved-bootstrap-dependencies.md)
