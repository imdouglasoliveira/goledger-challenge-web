# TASK-07 — Hero Banner com Backdrop Real

- Status: todo
- Prioridade: P1
- Plano: `docs/plans/06-tmdb-image-enrichment.md`
- Depende de: T055

## Por que fazer

O hero banner e o primeiro elemento visual que o usuario ve ao abrir o app. Atualmente mostra um gradiente CSS generico — com a `backdropUrl` disponivel, podemos mostrar uma imagem cinematografica real do show em destaque. Isso eleva drasticamente a percepcao de qualidade da UI.

## O que fazer

Modificar `hero-banner.tsx` para usar `<Image>` do `next/image` como background quando `backdropUrl` existe, mantendo todos os overlays de gradiente para legibilidade do texto.

## Arquivo a modificar

- `components/layout/hero-banner.tsx`

## Pre-requisito

- `next.config.ts` ja configurado com dominio `image.tmdb.org` (T056)

## Como fazer

### 1. Adicionar import

```typescript
import Image from 'next/image';
```

### 2. Substituir background

**Antes:**
```tsx
{/* Base Background Gradient */}
<div
  className="absolute inset-0"
  style={{ backgroundImage: gradientStr }}
/>

{/* Watermark Logo/Title overlay */}
<div className="absolute top-1/2 right-[10%] -translate-y-1/2 opacity-5 select-none text-[250px] md:text-[400px] font-black leading-none overflow-hidden">
  {show.title.charAt(0).toUpperCase()}
</div>
```

**Depois:**
```tsx
{/* Background — imagem real ou gradiente fallback */}
{show.backdropUrl ? (
  <Image
    src={show.backdropUrl}
    alt=""
    fill
    className="object-cover"
    priority
    sizes="100vw"
  />
) : (
  <>
    <div
      className="absolute inset-0"
      style={{ backgroundImage: gradientStr }}
    />
    {/* Watermark — so quando nao tem imagem */}
    <div className="absolute top-1/2 right-[10%] -translate-y-1/2 opacity-5 select-none text-[250px] md:text-[400px] font-black leading-none overflow-hidden">
      {show.title.charAt(0).toUpperCase()}
    </div>
  </>
)}
```

### 3. Manter overlays sobre a imagem

Os overlays existentes (red radial, left-to-right, bottom-to-top) devem ficar **apos** o background, nao dentro do condicional. Eles sao essenciais para legibilidade do texto sobre a imagem:

```tsx
{/* Background (imagem ou gradiente) */}
{show.backdropUrl ? (
  <Image src={show.backdropUrl} alt="" fill className="object-cover" priority sizes="100vw" />
) : (
  <>
    <div className="absolute inset-0" style={{ backgroundImage: gradientStr }} />
    <div className="absolute top-1/2 right-[10%] -translate-y-1/2 opacity-5 select-none text-[250px] md:text-[400px] font-black leading-none overflow-hidden">
      {show.title.charAt(0).toUpperCase()}
    </div>
  </>
)}

{/* Overlays — SEMPRE presentes, mesmo com imagem */}
<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(229,9,20,0.15)_0%,_transparent_60%)]" />
<div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 40%, transparent 60%)' }} />
<div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: 'linear-gradient(to top, #141414 10%, transparent 90%)' }} />

{/* Content — igual ao original */}
<div className="absolute bottom-[15%] left-0 px-4 md:px-12 w-full max-w-2xl z-10">
  ...
</div>
```

### Detalhes do `<Image>` no hero

| Prop | Valor | Por que |
|------|-------|---------|
| `fill` | true | Preenche o container hero (60-70vh) |
| `className="object-cover"` | — | Cobre a area sem distorcer |
| `priority` | true | **LCP** — hero e o primeiro elemento visivel, deve carregar com prioridade maxima |
| `sizes="100vw"` | — | Hero ocupa 100% da viewport width |
| `alt=""` | — | Imagem decorativa (o titulo ja esta no texto) |

### Por que `priority` no hero mas nao no thumbnail

O hero e **above-the-fold** — e o primeiro elemento visivel da pagina. `priority` faz o `next/image` usar `loading="eager"` e `fetchpriority="high"`, otimizando o LCP (Largest Contentful Paint). Thumbnails estao below-the-fold e devem usar lazy loading (default).

## Como testar

1. `pnpm dev` — iniciar frontend + backend
2. Abrir http://localhost:3000
3. **Show com backdrop:** hero mostra imagem cinematografica real
4. **Show sem backdrop:** hero mostra gradiente + watermark (fallback)
5. **Texto legivel:** titulo, descricao e botoes visiveis sobre a imagem (overlays funcionando)
6. **DevTools:** imagem do hero tem `loading="eager"` e `fetchpriority="high"` no HTML
7. **DevTools Network:** imagem vem via `/_next/image` (otimizacao Next.js)

### Teste de fallback

Editar `data/images.json` e setar `backdropPath: null` no show que aparece no hero. Recarregar — deve mostrar gradiente + watermark.

### Teste de legibilidade

Com imagem real no hero:
- Titulo branco e legivel?
- Descricao e legivel?
- Botoes "Editar" e "Mais Info" sao visiveis?
- Badge de idade e "98% Match" sao visiveis?

Se algo ficar ilegivel, verificar que os 3 overlays de gradiente estao presentes.

## Criterio de pronto

- [ ] Hero com `backdropUrl` mostra imagem real do TMDB
- [ ] Hero sem `backdropUrl` mostra gradiente + watermark (fallback)
- [ ] Watermark (letra gigante) nao aparece sobre imagem real
- [ ] Overlays de gradiente presentes sobre a imagem (legibilidade)
- [ ] Titulo, descricao e botoes sao legiveis sobre a imagem
- [ ] Imagem carrega com `priority` (verificar `loading="eager"` no HTML)
- [ ] `pnpm build` compila sem erros
