# TASK-04 — Validacao de Duplicatas no Backend

- Status: todo
- Prioridade: P1
- Plano: `docs/plans/05-data-validation-feedback.md`
- Depende de: T043

## Por que fazer

A API aceita titulos duplicados no POST — o GoLedger nao rejeita automaticamente. Isso cria registros duplicados que poluem a lista e confundem o usuario. A validacao de unicidade deve ser feita no BFF (camada que controlamos) antes de enviar ao blockchain.

## O que fazer

No endpoint `POST /tvshows`, buscar se ja existe um show com o mesmo titulo antes de criar. Retornar 409 Conflict se existir.

## Arquivo a modificar

- `src/routes/tvshows.ts` — handler do POST

## Como fazer

### 1. Adicionar verificacao de duplicata no POST

```typescript
// src/routes/tvshows.ts — dentro do handler POST

// CREATE
server.post('/tvshows', {
  config: { rateLimit: { max: 30, timeWindow: '1 minute' } },
  schema: {
    tags: ['tvShows'],
    summary: 'Create TV Show',
    body: createTvShowBody,
    response: { 200: tvShowSchema, 400: errorResponse, 409: errorResponse, 502: errorResponse },
  },
}, async (request, reply) => {
  const body = request.body as { title: string; description: string; recommendedAge: number };
  try {
    // Checar duplicata por titulo
    const existing = await search({
      selector: { '@assetType': 'tvShows', title: body.title },
      limit: 1,
    });
    if (existing.result && existing.result.length > 0) {
      reply.status(409);
      return { error: `TV Show "${body.title}" já existe`, statusCode: 409 };
    }
    return await createAsset([{ '@assetType': 'tvShows', ...body }]);
  } catch (err: any) {
    reply.status(err.status || 502);
    return { error: err.message, statusCode: err.status || 502 };
  }
});
```

### 2. Adicionar validacao extra nos schemas

No `createTvShowBody`, reforcar limites:

```typescript
const createTvShowBody = {
  type: 'object' as const,
  required: ['title', 'description', 'recommendedAge'],
  properties: {
    title: { type: 'string', minLength: 2, maxLength: 200 },
    description: { type: 'string', minLength: 10, maxLength: 2000 },
    recommendedAge: { type: 'integer', minimum: 0, maximum: 18 },
  },
  additionalProperties: false,
};
```

**Mudancas nos schemas:**
- `title.minLength`: 1 → 2 (evitar titulos de 1 caractere)
- `description.minLength`: 1 → 10 (evitar descricoes como "x")
- `recommendedAge.maximum`: 100 → 18 (classificacao indicativa brasileira vai ate 18)

Aplicar as mesmas mudancas no `updateTvShowBody`.

## Como testar

1. Criar um show "Test Show" → sucesso (200)
2. Tentar criar "Test Show" novamente → erro 409 "TV Show 'Test Show' já existe"
3. Tentar criar com titulo "A" → erro 400 (minLength 2)
4. Tentar criar com descricao "abc" → erro 400 (minLength 10)
5. Tentar criar com idade 25 → erro 400 (maximum 18)
6. Deletar "Test Show" apos teste

## Criterio de pronto

- [ ] POST com titulo duplicado retorna 409
- [ ] Mensagem de erro inclui o nome do show
- [ ] Titulo minimo 2 caracteres validado
- [ ] Descricao minima 10 caracteres validada
- [ ] Idade maxima 18 validada
- [ ] Swagger mostra 409 como resposta possivel
