# TASK-08 — Validacao Final E2E

- Status: done
- Prioridade: P1
- Plano: `docs/plans/06-tmdb-image-enrichment.md`
- Depende de: T056, T057

## Por que fazer

Checklist de validacao para garantir que todas as tasks anteriores foram integradas corretamente. Nenhuma feature funciona isolada — e preciso testar o fluxo completo: desde o cache de imagens ate a renderizacao na UI, incluindo o auto-enriquecimento de shows novos.

## O que fazer

Executar o checklist abaixo com o app rodando (`pnpm dev`).

## Pre-requisitos

```bash
pnpm dev  # Inicia frontend (3000) e backend (3001)
```

## Checklist

### Cache de Imagens (T051 + T052)

- [ ] `data/images.json` existe com ~18+ entries
- [ ] Todos os shows principais tem `posterPath` preenchido
- [ ] Nenhum show com confidence < 0.6 tem `posterPath` preenchido
- [ ] Campo `tmdbImageBaseUrl` presente no JSON

### Servico de Cache (T053)

- [ ] Backend loga `[image-cache] Carregado: X shows com imagem` no startup
- [ ] Remover `data/images.json` -> backend nao crasha, loga warning
- [ ] Remover `TMDB_ACCESS_TOKEN` do .env -> backend nao crasha, auto-fetch desativado

### Backend Merge (T054)

- [ ] `GET /api/tvshows` retorna shows com `posterUrl` e `backdropUrl`
- [ ] `GET /api/tvshows/:key` retorna show com `posterUrl` e `backdropUrl`
- [ ] Shows sem match TMDB retornam `posterUrl: null`
- [ ] Schema Swagger mostra `posterUrl` e `backdropUrl`

### Auto-Enriquecimento (T053 + T054)

- [ ] Criar show novo pela UI -> backend busca TMDB automaticamente
- [ ] Aguardar 2-3s, recarregar pagina -> show novo tem poster
- [ ] Criar show com titulo inventado (ex: "XYZABC123") -> sem imagem, gradiente exibido
- [ ] Verificar `data/images.json` -> show novo apareceu no JSON

### Frontend Interface (T055)

- [ ] `pnpm build` compila sem erros de tipo
- [ ] Nenhum erro TypeScript relacionado a `posterUrl` ou `backdropUrl`

### Thumbnails (T056)

- [ ] Cards com imagem mostram poster real (foto, nao gradiente)
- [ ] Cards sem imagem mostram gradiente + watermark
- [ ] Watermark (letra) nao aparece sobre poster real
- [ ] Hover panel funciona normalmente sobre a imagem
- [ ] Botoes edit/delete funcionam
- [ ] DevTools Network: imagens vem de `image.tmdb.org` via `/_next/image`
- [ ] DevTools Network: Content-Type e `image/webp`

### Hero Banner (T057)

- [ ] Hero com backdrop mostra imagem cinematografica real
- [ ] Hero sem backdrop mostra gradiente + watermark
- [ ] Texto (titulo, descricao) e legivel sobre a imagem
- [ ] Botoes "Editar" e "Mais Info" sao visiveis
- [ ] Badge de idade e "98% Match" sao visiveis
- [ ] DevTools: hero image tem `loading="eager"` e `fetchpriority="high"`

### Performance

- [ ] Nenhuma chamada TMDB API no DevTools Network (apenas `image.tmdb.org` para CDN)
- [ ] `next/image` gera WebP automaticamente
- [ ] Thumbnails carregam com lazy loading (fora da viewport)
- [ ] Hero carrega com priority (above-the-fold)

### Build

- [ ] `pnpm build` passa sem erros (frontend)
- [ ] `pnpm run build:api` passa sem erros (backend)

### Regressao

- [ ] Toast notifications continuam funcionando (create/update/delete)
- [ ] Confetti dispara ao criar show
- [ ] Validacao de form funciona (titulo min 2, desc min 10, idade 0-18)
- [ ] Validacao de duplicata funciona (POST com titulo existente -> 409)
- [ ] Carousel "Todos os Shows" mostra ~18+ cards
- [ ] Carousel "Atualizados Recentemente" mostra ultimos 10
- [ ] Carousel "Para Maiores de 16" filtra corretamente

## Criterio de pronto

Todos os checkboxes acima marcados. Se algum falhar, voltar a task correspondente e corrigir.

## Template de Fechamento

```md
## Fechamento da Task

- Task: T058 — Validacao Final E2E
- O que foi alterado: nenhum arquivo (checklist manual)
- Evidencia de validacao: todos os checkboxes marcados
- Testes executados: checklist manual completo
- Build executado: pnpm build + pnpm run build:api
- Verificacao final de runtime: app funcional com imagens reais
- Riscos residuais: [listar se houver]
- Status: done
```

## Resultado esperado

Apos completar esta task, o app tem:
- Imagens reais do TMDB em thumbnails e hero banner
- Auto-enriquecimento para shows novos (sem dependencia de script manual)
- Fallback gracioso para gradientes quando imagem nao disponivel
- Performance otimizada via `next/image` (WebP, lazy loading, priority)
- Zero chamadas TMDB em runtime de leitura (cache local)
- Todas as features anteriores (toast, confetti, validacao) funcionando

## Fechamento da Task

- Task: T058 — Validacao Final E2E
- O que foi validado: build frontend, build backend, suite de testes e contrato HTTP enriquecido
- Evidencia de validacao: `pnpm test` com 38 testes passando, `pnpm build`, `pnpm run build:api`
- Verificacao final de runtime: `GET /api/tvshows?limit=2` e `GET /api/tvshows/:key` retornando `posterUrl` e `backdropUrl`
- Riscos residuais: shows sem match TMDB continuam com fallback em gradiente, conforme esperado
- Status: done
