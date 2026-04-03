# TASK-06 — Thumbnail com Poster Real

- Status: todo
- Prioridade: P1
- Plano: `docs/plans/06-tmdb-image-enrichment.md`
- Depende de: T055

## Por que fazer

Os thumbnails dos shows usam gradientes CSS como placeholder — visualmente genericos e nao identificam o show. Com a `posterUrl` agora disponivel na interface (T055), podemos mostrar o poster real do TMDB nos cards do carousel. Isso transforma a UI de "prototipo" para "Netflix-like" real.

## O que fazer

1. Configurar dominio TMDB no `next.config.ts` (obrigatorio para `next/image`)
2. Modificar `tvshow-thumbnail.tsx` para usar `<Image>` quando `posterUrl` existe
3. Manter gradiente como fallback quando nao ha imagem

## Arquivos a modificar

- `next.config.ts`
- `components/tvshows/tvshow-thumbnail.tsx`

## Como fazer

### 1. Configurar dominio TMDB no `next.config.ts`

O `next/image` so aceita imagens de dominios autorizados. Adicionar `image.tmdb.org`:

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // BFF runs on port 3001, proxy API calls to it
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },

  // Permitir imagens do TMDB CDN
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
  },
};

export default nextConfig;
```

### 2. Modificar `tvshow-thumbnail.tsx`

#### 2a. Adicionar import do Image

```typescript
import Image from 'next/image';
```

#### 2b. Substituir area visual

Trocar a div com `backgroundImage: gradientStr` por renderizacao condicional:

**Antes:**
```tsx
<div
  className="relative aspect-video w-full bg-nf-surface"
  style={{ backgroundImage: gradientStr }}
>
```

**Depois:**
```tsx
<div className="relative aspect-video w-full bg-nf-surface">
  {/* Imagem real do TMDB ou gradiente fallback */}
  {show.posterUrl ? (
    <Image
      src={show.posterUrl}
      alt={show.title}
      fill
      className="object-cover"
      sizes="250px"
    />
  ) : (
    <div
      className="absolute inset-0"
      style={{ backgroundImage: gradientStr }}
    />
  )}
```

#### 2c. Watermark condicional

O watermark (letra grande) so faz sentido quando nao ha imagem real:

```tsx
{/* Watermark — so mostra quando nao tem imagem */}
{!show.posterUrl && (
  <div className="absolute inset-0 flex items-center justify-center">
    <span className="select-none text-6xl font-bold text-white/10">
      {show.title.charAt(0).toUpperCase()}
    </span>
  </div>
)}
```

#### 2d. Codigo completo da area visual

```tsx
{/* Visual Area */}
<div className="relative aspect-video w-full bg-nf-surface">
  {show.posterUrl ? (
    <Image
      src={show.posterUrl}
      alt={show.title}
      fill
      className="object-cover"
      sizes="250px"
    />
  ) : (
    <div
      className="absolute inset-0"
      style={{ backgroundImage: gradientStr }}
    />
  )}

  {/* Watermark — so quando nao tem imagem */}
  {!show.posterUrl && (
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="select-none text-6xl font-bold text-white/10">
        {show.title.charAt(0).toUpperCase()}
      </span>
    </div>
  )}

  {/* Bottom fade — igual ao original */}
  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-nf-card to-transparent transition-opacity duration-300 group-hover/card:from-nf-card" />
  <h3 className="absolute bottom-2 left-3 right-3 truncate text-sm font-semibold text-white drop-shadow-md transition-opacity duration-300 group-hover/card:opacity-0">
    {show.title}
  </h3>
</div>
```

### Detalhes do `<Image>`

| Prop | Valor | Por que |
|------|-------|---------|
| `fill` | true | Preenche o container pai (aspect-video) |
| `className="object-cover"` | — | Imagem cobre a area sem distorcer |
| `sizes="250px"` | — | Informa o browser que o card tem 250px — evita baixar imagem maior que necessario |
| `alt={show.title}` | — | Acessibilidade |
| Sem `priority` | — | Thumbnails estao below-the-fold, lazy loading e melhor |

## Como testar

1. `pnpm dev` — iniciar frontend + backend
2. Abrir http://localhost:3000
3. **Shows com imagem:** card mostra poster real (foto, nao gradiente)
4. **Shows sem imagem:** card mostra gradiente colorido com watermark (letra grande)
5. **Hover:** painel inferior abre normalmente sobre a imagem
6. **DevTools Network:** imagens vem de `image.tmdb.org` (CDN) via `/_next/image` (otimizacao)
7. **DevTools Network:** imagens sao servidas como WebP (Content-Type: image/webp)

### Teste de fallback

Para testar o fallback, editar `data/images.json` e setar `posterPath: null` em um show. Recarregar — esse show deve mostrar gradiente.

## Criterio de pronto

- [ ] `next.config.ts` tem `image.tmdb.org` em `remotePatterns`
- [ ] Cards com `posterUrl` mostram imagem real (nao gradiente)
- [ ] Cards sem `posterUrl` mostram gradiente + watermark (fallback)
- [ ] Watermark (letra) nao aparece sobre imagens reais
- [ ] Hover panel continua funcionando (botoes edit/delete, descricao)
- [ ] Sem layout shift (aspect-ratio preservado)
- [ ] `next/image` gera WebP (verificar Content-Type no DevTools)
- [ ] `pnpm build` compila sem erros
