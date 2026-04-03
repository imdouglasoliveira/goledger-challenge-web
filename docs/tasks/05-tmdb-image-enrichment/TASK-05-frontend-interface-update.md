# TASK-05 — Atualizar Interface TvShow no Frontend

- Status: todo
- Prioridade: P1
- Plano: `docs/plans/06-tmdb-image-enrichment.md`
- Depende de: T054

## Por que fazer

O backend agora retorna `posterUrl` e `backdropUrl` nas respostas GET (T054), mas o frontend ignora esses campos porque a interface `TvShow` em `lib/api.ts` nao os declara. Sem atualizar o tipo, o TypeScript nao permite acessar esses campos nos componentes — e qualquer tentativa de usar `show.posterUrl` gera erro de compilacao.

## O que fazer

Adicionar campos opcionais `posterUrl` e `backdropUrl` a interface `TvShow`.

## Arquivo a modificar

- `lib/api.ts`

## Como fazer

Localizar a interface `TvShow` e adicionar os dois campos:

```typescript
// lib/api.ts
export interface TvShow {
  '@key': string;
  '@assetType': string;
  '@lastUpdated': string;
  title: string;
  description: string;
  recommendedAge: number;
  posterUrl?: string | null;    // URL do poster TMDB (w500)
  backdropUrl?: string | null;  // URL do backdrop TMDB (w1280)
}
```

### Por que `?` e `| null`

- `?` (opcional): o campo pode nao existir na resposta (shows antigos sem cache)
- `| null`: o campo pode existir mas ser `null` (show sem match TMDB)
- Isso permite ambos os cenarios: `show.posterUrl === undefined` e `show.posterUrl === null`

### O que NAO mudar

- Nao alterar `tvShowsApi.create()` — create nao envia imagem (o backend busca automaticamente)
- Nao alterar `tvShowsApi.update()` — update nao altera imagem
- Nao alterar `SearchResult<T>` — generico, nao precisa de mudanca

## Como testar

```bash
# 1. Verificar compilacao
pnpm build

# 2. Verificar que nao quebrou nada
pnpm dev
# Abrir http://localhost:3000 — app deve funcionar normalmente
```

## Criterio de pronto

- [ ] Interface `TvShow` tem `posterUrl?: string | null`
- [ ] Interface `TvShow` tem `backdropUrl?: string | null`
- [ ] `pnpm build` compila sem erros
- [ ] App funciona normalmente (nenhuma regressao visual)
- [ ] Nenhum outro arquivo foi alterado alem de `lib/api.ts`
