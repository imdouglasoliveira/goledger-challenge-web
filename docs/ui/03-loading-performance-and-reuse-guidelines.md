# 03 - Loading, Performance e Reuso

## Objetivo

Definir regras claras para estados de carregamento, performance percebida e reducao de duplicacao na UI.

## Regras de loading

- implementar `loading` ou `skeleton` sempre que houver espera perceptivel para o usuario
- preferir `skeleton` quando o layout final for conhecido
- usar loading inline em botao, drawer ou formulario durante mutacoes
- usar indicador discreto para refetch em background
- implementar `empty state` e `error state` de forma explicita
- evitar spinner de pagina inteira quando a tela puder renderizar shell ou placeholders reais

## Estrategia de carregamento

- carga inicial: `skeleton` estrutural
- refetch: manter dados anteriores e mostrar indicador leve
- mutacao: bloquear apenas a area afetada
- navegação entre telas relacionadas: prefetch quando houver alta probabilidade de proximo acesso
- busca digitada: usar debounce e evitar request a cada tecla sem controle

## Performance

- evitar waterfalls de request
- paralelizar carregamentos independentes
- usar importacao dinamica em componentes pesados
- evitar bundle desnecessario no primeiro paint
- reduzir dados enviados ao cliente para o minimo necessario
- evitar recalculos pesados a cada render sem motivo
- evitar re-render inutil por estado local mal posicionado

## Reuso e anti-duplicacao

- centralizar query keys
- centralizar client HTTP da API interna
- centralizar schemas `Zod` e mapeadores de payload
- extrair componentes compartilhados de `loading`, `skeleton`, `empty` e `error`
- evitar repetir a mesma regra de fetch ou validacao em multiplos componentes
- evitar duplicar markup de tabela, card ou formulario quando puder virar componente de dominio

## Checklist rapido

- existe `skeleton` onde o fetch inicial altera layout?
- existe loading inline nas mutacoes?
- existe indicador discreto para refetch?
- existe `empty state`?
- existe `error state`?
- a tela evita request duplicada?
- a tela evita componente pesado no primeiro paint sem necessidade?
- a logica compartilhada foi extraida?
