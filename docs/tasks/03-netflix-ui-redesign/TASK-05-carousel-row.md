# TASK-05 (T035) - Carousel Row Horizontal com Arrows

- Status: done
- Prioridade: P1
- Depende de: T034 (thumbnail card)
- Agent/Skill: `design-to-code`
- Referencia: ivisconfessor (CSS-only scroll + arrow opacity reveal), JosinJojy (breakpoints responsivos)

## O que fazer

1. Criar `components/layout/carousel-row.tsx` — container de scroll horizontal com arrows

## Por que fazer

- Layout principal de conteudo da Netflix: rows horizontais de thumbnails
- Arrows com reveal no hover do row e pattern reconhecivel
- Usado na pagina principal (T037) para "Todos", "Recentes", "Maduros 16+"
- CSS-only approach — sem Swiper.js, mantendo zero deps novas

## Como fazer

### CarouselRow (`components/layout/carousel-row.tsx`)

**Diretiva:** `'use client'`

**Props:**
```typescript
interface CarouselRowProps {
  title: string;
  children: React.ReactNode;
}
```

**Estrutura:**

1. **Section wrapper:** `group/row relative mb-8`

2. **Title:** `text-xl md:text-2xl font-bold text-nf-gray-100 mb-3 px-4 md:px-12`

3. **Scroll container:** `ref={scrollRef}`
   - Classes: `flex gap-2 overflow-x-auto scroll-smooth hide-scrollbar px-4 md:px-12 pb-24`
   - `pb-24` e CRITICO: da espaco vertical para o hover overlay do thumbnail expandir sem ser clipado pelo overflow

4. **Arrow left:** `absolute left-0 top-0 h-[calc(100%-6rem)] z-20`
   - Visibilidade: `opacity-0 group-hover/row:opacity-100 transition-opacity duration-300`
   - Background: `bg-gradient-to-r from-nf-black/80 to-transparent w-12`
   - Icone: `ChevronLeft` do lucide-react, centralizado vertical
   - Click: `scrollRef.current.scrollBy({ left: -800, behavior: 'smooth' })`
   - Condicional: so renderiza se `canScrollLeft === true`

5. **Arrow right:** espelho do left
   - Background: `bg-gradient-to-l from-nf-black/80 to-transparent`
   - Icone: `ChevronRight`
   - Click: `scrollBy({ left: 800 })`
   - Condicional: so renderiza se `canScrollRight === true`

**Estado interno:**
```typescript
const scrollRef = useRef<HTMLDivElement>(null);
const [canScrollLeft, setCanScrollLeft] = useState(false);
const [canScrollRight, setCanScrollRight] = useState(true);
```

**Scroll handler:**
```typescript
function updateScrollState() {
  const el = scrollRef.current;
  if (!el) return;
  setCanScrollLeft(el.scrollLeft > 0);
  setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
}
```
- Attached via `onScroll` no scroll container
- Tambem via `useEffect` no mount (para estado inicial)

**Inspiracao combinada:**
- Arrows com opacity reveal: ivisconfessor (opacity: 0 → show on hover)
- CSS scroll: ivisconfessor (transition: all ease 0.5s, sem lib)
- Named group (`group/row`): Tailwind v4 feature para isolar hover do row

## Arquivo afetado

- **New:** `components/layout/carousel-row.tsx`

## Nota tecnica: overflow clipping

CSS nao permite `overflow-x: auto` com `overflow-y: visible` simultaneamente. Quando se define `overflow-x: auto`, o browser forca `overflow-y: auto` tambem. O `pb-24` no scroll container e o workaround: da espaco suficiente dentro do container para que o hover overlay (que cresce verticalmente) tenha esaco para expandir antes de ser clipado. Se 24 (96px) for insuficiente, aumentar para `pb-32`.

## Criterio de pronto

- Row exibe titulo e thumbnails em scroll horizontal
- Scroll funciona com mouse wheel e touch/drag
- Setas left/right aparecem ao hover no row
- Setas somem quando nao ha mais scroll na direcao
- Click na seta scrolla ~800px com animacao smooth
- Thumbnails dentro do row expandem no hover sem ser clipados
- Padding lateral de 16px (mobile) e 48px (desktop)
- `.hide-scrollbar` esconde scrollbar nativa
