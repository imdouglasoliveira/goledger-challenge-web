# TASK-02 (T032) - Header/Navbar com Transicao no Scroll

- Status: done
- Prioridade: P10
- Depende de: T031 (theme foundation)
- Agent/Skill: `design-to-code`
- Referencia: leovargasdev (gradient→solid transition), ivisconfessor (scroll detection simples)

## O que fazer

1. Criar `components/layout/header.tsx` — navbar fixa estilo Netflix
2. Modificar `app/layout.tsx` — integrar header e offset do body

## Por que fazer

- Navegacao global e identidade visual da aplicacao
- Transicao transparente→solido no scroll e signature Netflix
- Necessario antes da composicao da pagina (T037)

## Como fazer

### Header (`components/layout/header.tsx`)

**Diretiva:** `'use client'`

**Props:**
- `onCreateClick?: () => void` — callback para abrir modal de criacao

**Estado interno:**
- `scrolled: boolean` — via `useEffect` com scroll listener
- Threshold: `window.scrollY > 10`

**Layout (3 secoes flex):**

1. **Left:** Logo/brand "GOLEDGER" em texto bold vermelho (#E50914), ou icone de TV
2. **Center:** Nav links — "TV Shows" (ativo, branco), "Seasons" / "Episodes" / "Watchlist" (disabled, `opacity-50 cursor-not-allowed` — paginas ainda nao existem)
3. **Right:** Botao "+" para criar novo show

**Estilos:**
- `fixed top-0 w-full z-50 h-16`
- Default: `bg-gradient-to-b from-black/80 to-transparent`
- Scrolled: `bg-nf-black/95 backdrop-blur-sm shadow-lg`
- Transition: `transition-all duration-700 ease-in-out`
- Padding: `px-4 md:px-12` (paddings generosos como Netflix)
- Container interno: `max-w-[1920px] mx-auto`

**Mobile:**
- Nav links hidden em telas < md
- Apenas logo + botao "+"

### Layout (`app/layout.tsx`)

**Mudancas:**
- Importar `Header` de `@/components/layout/header`
- Adicionar `<Header />` como primeiro filho dentro de `<Providers>`
- Envolver `{children}` em `<main className="pt-16">` para compensar header fixo de 64px
- Body className: `bg-nf-black text-nf-gray-100` (remover dark: classes)

## Arquivos afetados

- **New:** `components/layout/header.tsx`
- **Modify:** `app/layout.tsx`

## Criterio de pronto

- Header aparece fixo no topo em todas as paginas
- No topo da pagina: fundo transparente com gradiente
- Ao scrollar: transicao suave (700ms) para fundo solido #141414
- Brand "GOLEDGER" visivel em vermelho Netflix
- Nav link "TV Shows" ativo, demais desabilitados visualmente
- Botao "+" visivel e funcional (chama onCreateClick)
- Body tem padding-top de 64px para nao ficar sob o header
- Responsivo: nav links somem em mobile, botao permanece
