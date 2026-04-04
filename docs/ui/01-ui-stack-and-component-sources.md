# 01 - UI Stack and Component Sources

## Base

- `Tailwind CSS 4` para tokens, layout e customizacao
- `shadcn/ui` como foundation de componentes
- `Lucide` para iconografia

## Complementares em uso

### Sonner

Toasts e feedbacks de sistema com tema dark.

### canvas-confetti

Animacoes de celebracao no create de TV Shows.

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
- desviam do foco do desafio

## Regras

- base em `shadcn/ui`
- complementar com parcimonia
- priorizar coerencia visual sobre quantidade de libs
- evitar misturar dois sistemas completos de componentes
