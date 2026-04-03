# TASK-04 (T034) - Thumbnail Card Netflix com Hover Scale + Overlay

- Status: done
- Prioridade: P1
- Depende de: T033 (modal + badge)
- Agent/Skill: `design-to-code`
- Referencia: JosinJojy (scale 1.5x + overlay), ivisconfessor (card hover 0.9→1.0 + rgba overlay)

## O que fazer

1. Adicionar funcao `titleToGradient(title)` em `lib/utils.ts`
2. Criar `components/tvshows/tvshow-thumbnail.tsx` — card visual estilo Netflix

## Por que fazer

- Substitui visualmente o card plano atual (tvshow-card.tsx)
- Hover com scale + overlay e o pattern mais reconhecivel da Netflix
- Gradiente deterministico por titulo cria identidade visual unica por show
- E o building block principal do carousel (T035)

## Como fazer

### titleToGradient (`lib/utils.ts`)

Funcao utilitaria que gera gradiente CSS unico baseado no titulo:

```typescript
export function titleToGradient(title: string): string {
  // Hash simples do titulo para dois valores de hue (0-360)
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue1 = Math.abs(hash % 360);
  const hue2 = Math.abs((hash * 7) % 360);
  return `linear-gradient(135deg, hsl(${hue1}, 70%, 25%) 0%, hsl(${hue2}, 60%, 15%) 100%)`;
}
```

**Propriedades:** deterministico (mesmo titulo = mesmo gradiente), escuro o suficiente para texto branco, visualmente variado.

### TvShowThumbnail (`components/tvshows/tvshow-thumbnail.tsx`)

**Diretiva:** `'use client'`

**Props:**
```typescript
interface TvShowThumbnailProps {
  show: TvShow;
  onEdit: (show: TvShow) => void;
  onDelete: (show: TvShow) => void;
}
```

**Estrutura do card:**

1. **Container externo:** `group relative w-[250px] flex-shrink-0 cursor-pointer`
   - Transition: `transition-transform duration-300 ease-out`
   - Hover: `hover:scale-[1.3] hover:z-[30]`

2. **Visual area:** `aspect-video rounded-md overflow-hidden relative`
   - Background: `style={{ backgroundImage: titleToGradient(show.title) }}`
   - Watermark: primeira letra do titulo, `text-6xl font-bold text-white/10` centralizado
   - Bottom gradient: `absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent`
   - Title: `absolute bottom-2 left-3 text-sm font-semibold text-white truncate`

3. **Hover overlay panel:** `opacity-0 group-hover:opacity-100 transition-opacity duration-300`
   - Background: `bg-nf-card rounded-b-md p-3 -mt-1`
   - Shadow: `shadow-lg`
   - Conteudo:
     - Row de botoes icone: Edit (Pencil), Delete (Trash2) — circular `w-8 h-8 rounded-full border border-nf-gray-300`
     - AgeBadge do show
     - Descricao truncada em 2 linhas: `line-clamp-2 text-xs text-nf-gray-200`

**Inspiracao combinada:**
- Scale 1.3x do JosinJojy (mas sem translateX nos vizinhos — simplificacao)
- Overlay bg rgba(26,26,26,0.98) do ivisconfessor → adaptado para `bg-nf-card`
- Botoes circulares com borda do ivisconfessor
- Transition 300ms ease-out do JosinJojy

## Arquivos afetados

- **Modify:** `lib/utils.ts` (adicionar titleToGradient)
- **New:** `components/tvshows/tvshow-thumbnail.tsx`

## Criterio de pronto

- titleToGradient gera gradientes diferentes para titulos diferentes
- titleToGradient gera o mesmo gradiente para o mesmo titulo (deterministico)
- Card exibe gradiente de fundo unico por show
- Primeira letra do titulo aparece como watermark translucido
- Titulo do show aparece na parte inferior do card
- Hover escala o card 1.3x com transicao suave
- Hover revela overlay com botoes de edit/delete, badge de idade e descricao
- Botoes de edit e delete chamam os callbacks corretos
- Card tem aspect-ratio 16:9 (video)
- Card tem largura fixa (~250px) e flex-shrink-0 para carousel
