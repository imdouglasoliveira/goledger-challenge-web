# TASK-06 (T036) - Hero Banner com Gradientes Cinematograficos

- Status: done
- Prioridade: P1
- Depende de: T034 (thumbnail — usa titleToGradient de lib/utils)
- Agent/Skill: `design-to-code`
- Referencia: leovargasdev (100vh + dual gradient overlays), JosinJojy (diagonal gradient + badge)

## O que fazer

1. Criar `components/layout/hero-banner.tsx` — banner de destaque estilo Netflix

## Por que fazer

- Hero banner e o elemento visual mais impactante da Netflix
- Apresenta show em destaque com gradientes cinematograficos
- Cria hierarquia visual clara: hero → rows de conteudo
- Sem imagens reais, o gradiente deterministico cria identidade visual unica

## Como fazer

### HeroBanner (`components/layout/hero-banner.tsx`)

**Diretiva:** `'use client'`

**Props:**
```typescript
interface HeroBannerProps {
  show: TvShow;
  onEdit: (show: TvShow) => void;
  onAddToList?: () => void;
}
```

**Estrutura:**

1. **Container:** `relative w-full h-[60vh] md:h-[70vh] overflow-hidden`

2. **Background:** `absolute inset-0`
   - Base: `style={{ backgroundImage: titleToGradient(show.title) }}`
   - Overlay radial vermelho sutil: `bg-[radial-gradient(ellipse_at_top_right,_rgba(229,9,20,0.15)_0%,_transparent_60%)]`

3. **Gradient overlay bottom-to-top:** `absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-nf-black via-nf-black/50 to-transparent`
   - Garante que o conteudo abaixo (carousel rows) se mistura suavemente

4. **Gradient overlay left-to-right:** `absolute inset-0 bg-gradient-to-r from-nf-black/70 via-transparent to-transparent`
   - Garante legibilidade do texto a esquerda (pattern do leovargasdev)

5. **Content:** `absolute bottom-[15%] left-0 px-4 md:px-12 max-w-2xl`
   - Titulo: `text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg`
   - Descricao: `text-sm md:text-base text-nf-gray-200 mt-3 line-clamp-3`
   - Badge: `<AgeBadge age={show.recommendedAge} />` com `mt-3`
   - Botoes: `flex gap-3 mt-4`
     - "Editar": `bg-nf-red text-white px-6 py-2 rounded font-semibold hover:bg-nf-red-hover` → chama `onEdit(show)`
     - "Mais Info": `bg-nf-gray-400/70 text-white px-6 py-2 rounded font-semibold hover:bg-nf-gray-400` → scroll para conteudo ou onAddToList

**Inspiracao combinada:**
- Height 100vh → reduzido para 60-70vh (nao queremos esconder todo o conteudo)
- Dual gradient overlays do leovargasdev (bottom + left)
- Badge/info do JosinJojy
- Botoes Play+Info do Netflix original → adaptados para Edit+Info (CRUD context)

## Arquivo afetado

- **New:** `components/layout/hero-banner.tsx`

## Criterio de pronto

- Banner ocupa 60-70% da viewport (responsivo)
- Gradiente de fundo e unico por show (via titleToGradient)
- Overlay radial vermelho sutil visivel
- Gradientes bottom-to-top e left-to-right criam legibilidade
- Titulo do show em tamanho grande com drop-shadow
- Descricao truncada em 3 linhas
- AgeBadge exibido corretamente
- Botao "Editar" funcional (chama onEdit)
- Botao "Mais Info" presente
- Responsivo: texto menor em mobile, maior em desktop
- Transicao visual suave para o conteudo abaixo (gradient bottom fade para #141414)
