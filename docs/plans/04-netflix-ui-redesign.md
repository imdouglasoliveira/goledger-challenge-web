# 04 - Netflix UI Redesign Plan

- Status: approved
- Prioridade: P1
- Agents: `a8z-master`, `ux-design-expert`
- Skills: `design-to-code`, `figma-design-system-rules`, `figma-make-analyzer`

## Contexto

A UI atual e um CRUD basico com grid de cards em fundo escuro — funcional mas visualmente pobre. O objetivo e transformar a experiencia visual inspirando-se na Netflix, extraindo o melhor de 3 repositorios de referencia e melhorando alem deles.

Pre-requisitos: todas as tasks T021-T030 (backend-first + UI basica de tvShows) foram concluidas com sucesso. O BFF Fastify esta funcional na porta 3001 com CRUD completo para 4 entidades. A UI Next.js esta na porta 3000 com proxy funcional.

## Repositorios de Referencia (3)

### 1. leovargasdev/netflix-clone (TypeScript + Styled-Components)
- **Melhor em:** Navbar com transicao transparente→solido no scroll, Hero banner com gradientes cinematograficos (top-fade + left-to-right), carousel com controle manual de margin-left
- **Extrair:** Logica de scroll detection, gradient overlays (rgba(0,0,0,0.6) 40%, transparent 60%), paddings generosos (40px lateral), transicao de 0.8s no header
- **Stack:** React 16 + styled-components + react-icons + polished

### 2. JosinJojy/Netflix-reactjs (React + Tailwind + Swiper)
- **Melhor em:** Carousel avancado com Swiper.js (breakpoints responsivos 2-6 slides), hover effects sofisticados (scale 1.5x com translateX nos vizinhos), star ratings, badges de info
- **Extrair:** Pattern de hover com scale + z-index + overlay info panel, breakpoints de Swiper adaptados, layout responsivo, skeleton loading com bg-neutral-900
- **Stack:** React 18 + Vite + Tailwind 3 + Swiper + Firebase

### 3. ivisconfessor/netflix-clone-react (Vanilla JS + CSS puro)
- **Melhor em:** Simplicidade — CSS puro para carousel (transition: all ease 0.5s), arrows com opacity reveal no hover, card hover scale 0.9→1.0, overlay com bg rgba(26,26,26,0.98)
- **Extrair:** CSS-only carousel pattern (sem dependencia de lib), reveal de botoes no hover com opacity transition, movie card hover com overlay de info + action buttons circulares
- **Stack:** React 16 + CSS puro + Material-UI Icons

## Mapa de Extracao (melhor dos 3)

| Pattern | Fonte | Adaptacao |
|---------|-------|-----------|
| Navbar scroll transition | leovargasdev | useEffect + scrollY > 10 → bg-solid, 700ms transition |
| Hero banner gradients | leovargasdev | 2 overlays: bottom-to-top + left-to-right fade |
| Carousel scroll | ivisconfessor | CSS overflow-x + scroll-smooth + JS arrows (sem Swiper) |
| Card hover scale + overlay | JosinJojy | scale(1.3) + z-index elevation + info panel |
| Arrow reveal on hover | ivisconfessor | opacity-0 → opacity-100 via group-hover |
| Responsive breakpoints | JosinJojy | Adaptive card widths por viewport |
| Loading skeleton | JosinJojy | Pulse animation com cores Netflix |
| Color palette | Todos | #141414 bg, #E50914 red, #E5E5E5 text |

## Melhorias alem dos 3 repos

1. **Gradientes unicos por show** — sem imagens reais, gerar gradientes deterministicos por hash do titulo (nenhum repo faz isso)
2. **Modal CRUD** — nenhum repo tem CRUD; nosso app mantem create/edit/delete via modal overlay
3. **Age badges** — classificacao indicativa estilo Netflix com pill badges
4. **Multiple carousel rows** — "Todos", "Recentes", "Maduros 16+" com dados reais filtrados
5. **Floating action button** — acesso rapido a criacao (pattern mobile-first)
6. **Skeleton Netflix-fiel** — loading state que espelha o layout final (hero + rows)
7. **Transicoes e animacoes** — fade-in, slide-up, scale-in com @keyframes customizados

## Decisoes tecnicas

- **Zero dependencias novas** — tudo com Tailwind CSS v4 + lucide-react existente
- **Manter Next.js 16** — App Router, Turbopack, sem mudanca de framework
- **Data layer intocado** — `lib/api.ts`, `lib/hooks/use-tvshows.ts`, `app/providers.tsx` nao mudam
- **CSS-only carousel** — sem Swiper.js, usa overflow-x + scroll-smooth + JS arrows
- **Dark-only** — remover prefers-color-scheme, app e permanentemente escuro
- **Tailwind v4 @theme** — registrar cores Netflix via diretiva @theme (fallback: arbitrary values)

## Task Index

- [x] T031 → `TASK-01-theme-foundation.md` — Paleta Netflix, animacoes, scrollbar
- [x] T032 → `TASK-02-header-navbar.md` — Navbar fixa com transicao no scroll
- [x] T033 → `TASK-03-modal-badge-components.md` — Modal portal + AgeBadge
- [x] T034 → `TASK-04-tvshow-thumbnail.md` — Card Netflix com hover scale + overlay
- [x] T035 → `TASK-05-carousel-row.md` — Row horizontal com arrows e scroll
- [x] T036 → `TASK-06-hero-banner.md` — Banner destaque com gradientes
- [x] T037 → `TASK-07-tvshows-page-rewrite.md` — Recomposicao da pagina principal
- [x] T038 → `TASK-08-form-states-polish.md` — Form no modal + estados Netflix
- [x] T039 → `TASK-09-button-input-primitives.md` — Variantes Netflix nos primitivos UI
- [x] T040 → `TASK-10-validation-build.md` — Validacao E2E e build

Arquivos detalhados das tasks: `docs/tasks/03-netflix-ui-redesign/`

## Ordem obrigatoria

```
T031 (theme) → T032 (header) → T033 (modal+badge) → T034 (thumbnail)
    → T035 (carousel) → T036 (hero) → T037 (page rewrite)
    → T038 (form+states) → T039 (primitives) → T040 (validation)
```

- **Fundacao:** T031-T033 (cores, animacoes, header, modal, badge)
- **Building Blocks:** T034-T036 (thumbnail, carousel, hero)
- **Composicao:** T037 (rewrite da pagina usando todos os blocks)
- **Polish:** T038-T039 (form, estados, primitivos UI)
- **Validacao:** T040 (E2E + build)

## Agents e Skills a8z

| Task | Agent/Skill | Motivo |
|------|-------------|--------|
| T031 | `ux-design-expert` (*tokenize) | Definicao de design tokens Netflix |
| T032-T036 | `design-to-code` | Conversao de patterns visuais em componentes React |
| T037 | `a8z-master` | Orquestracao da recomposicao da pagina |
| T038-T039 | `ux-design-expert` (*build) | Polish de componentes atomicos |
| T040 | `a8z-master` | Validacao de integridade e build |

## Arquivos por task

### T031 — Theme Foundation
- **Rewrite:** `app/globals.css`

### T032 — Header/Navbar
- **New:** `components/layout/header.tsx`
- **Modify:** `app/layout.tsx`

### T033 — Modal + Badge
- **New:** `components/ui/modal.tsx`
- **New:** `components/ui/badge.tsx`

### T034 — Thumbnail Card
- **New:** `components/tvshows/tvshow-thumbnail.tsx`
- **Modify:** `lib/utils.ts` (add titleToGradient)

### T035 — Carousel Row
- **New:** `components/layout/carousel-row.tsx`

### T036 — Hero Banner
- **New:** `components/layout/hero-banner.tsx`

### T037 — Page Rewrite
- **Rewrite:** `components/tvshows/tvshows-page.tsx`

### T038 — Form + States
- **Modify:** `components/tvshows/tvshow-form.tsx`
- **Modify:** `components/states/loading-card.tsx`
- **Modify:** `components/states/empty-state.tsx`
- **Modify:** `components/states/error-state.tsx`

### T039 — UI Primitives
- **Modify:** `components/ui/button.tsx`
- **Modify:** `components/ui/input.tsx`

### T040 — Validation
- Nenhum arquivo novo; testa tudo

## Intocados (nao modificar)

- `lib/api.ts` — cliente HTTP frontend
- `lib/hooks/use-tvshows.ts` — hooks TanStack Query
- `app/providers.tsx` — QueryClient config
- `app/page.tsx` — entry point (importa TvShowsPage)
- `components/tvshows/tvshow-card.tsx` — mantido para backward compat
- `next.config.ts` — proxy rewrites para BFF
- Toda pasta `src/` (BFF Fastify backend)

## Verificacao final (criterios T040)

1. `pnpm dev` — pagina carrega em http://localhost:3000 com tema Netflix escuro
2. Hero banner mostra show destaque com gradiente unico
3. Carousel rows scrollam horizontal com setas left/right
4. Hover em thumbnail escala 1.3x e mostra overlay com acoes (edit/delete)
5. Click "Add" → modal abre → form submete → cria show → modal fecha → lista atualiza
6. Click edit no thumbnail → modal pre-preenchido → update funciona
7. Click delete → modal confirmacao → delete funciona
8. Scroll down → header transita de transparente para solido (#141414)
9. Loading state mostra skeleton Netflix-fiel (hero placeholder + row placeholders)
10. Empty state e error state renderizam corretamente com tema Netflix
11. `pnpm build` passa sem erros
