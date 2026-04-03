# ADR-003 - Estrutura Pragmatica do BFF (Hexagonal Simplificada)

- Status: accepted
- Data: 2026-03-31
- Decisores: projeto GoLedger

## 1. Contexto

Com o bootstrap do Fastify concluido (T021/T022), a proxima etapa e criar o cliente GoLedger e as rotas de CRUD. Antes de implementar, e necessario definir a organizacao interna do BFF.

A arquitetura hexagonal (ports & adapters) foi avaliada como opcao para o BFF. Embora conceitualmente adequada — o BFF e literalmente um adapter layer entre frontend e API externa — a versao academica completa (interfaces Port, classes Adapter, camada UseCase) seria desproporcional ao problema.

## 2. Decisao

Adotar uma estrutura **pragmatica inspirada em hexagonal**, sem a cerimonia formal de ports & adapters.

```text
src/
  config/
    env.ts                    # configuracao de ambiente
  clients/
    goledger.ts               # adapter de saida (HTTP client para API externa)
  schemas/
    tv-show.schema.ts         # validacao + tipos compartilhados
    season.schema.ts
    episode.schema.ts
    watchlist.schema.ts
  routes/
    health.ts                 # health check
    tv-shows.ts               # adapter de entrada (rotas HTTP)
    seasons.ts
    episodes.ts
    watchlists.ts
  plugins/
    security.ts               # cors, helmet, rate-limit
  server.ts                   # bootstrap
```

## 3. Motivadores

### Por que nao hexagonal puro

1. **Dominio fino demais** — o BFF nao tem regras de negocio complexas. E proxy com validacao de schema. Criar use cases que so chamam o client seria boilerplate sem valor.
2. **4 asset types com operacoes identicas** — o padrao CRUD se repete. Abstrair em Port/Adapter/UseCase por entidade geraria cerimonia sem ganho.
3. **E um desafio tecnico** — avaliadores querem codigo limpo e funcional, nao overengineering. Uma camada de domain vazia mostra falta de pragmatismo.
4. **Testabilidade ja esta garantida** — com um unico `goledger.ts` centralizado, mock do client nas rotas e trivial.

### Por que nao flat (tudo em routes)

1. **Client HTTP centralizado e obrigatorio** — a TASK-03 exige "modulo unico de cliente, nao espalhar fetch direto pelas rotas".
2. **Schemas compartilhados** — os mesmos schemas servem para validacao de input, documentacao OpenAPI e tipagem TypeScript.
3. **Separacao clara de responsabilidades** — routes (entrada HTTP), clients (saida HTTP), schemas (contrato).

## 4. Alternativas consideradas

### Alternativa A - Hexagonal academica

```text
src/
  domain/
    entities/
    ports/
    use-cases/
  adapters/
    inbound/
      http/
    outbound/
      goledger-api/
  infrastructure/
```

- Pros: separacao maxima, testabilidade academica
- Contras: boilerplate desproporcional, domain vazio, formalismo sem ganho real

### Alternativa B - Flat (tudo em routes)

```text
src/
  routes/
    health.ts
    tv-shows.ts  # client inline, schemas inline
```

- Pros: minimalista
- Contras: duplicacao de client HTTP, auth espalhada, dificil de testar

### Alternativa C - Pragmatica (escolhida)

- Pros: separacao clara sem cerimonia, facil de testar, escala para 4 entidades sem duplicacao
- Contras: nenhuma significativa para este escopo

## 5. Consequencias

### Positivas

- zero boilerplate desnecessario
- client HTTP centralizado com auth, timeout e error handling em um unico lugar
- schemas reutilizaveis entre validacao e documentacao
- facil de testar (mock do client)
- estrutura legivel para avaliadores

### Negativas e trade-offs

- se o dominio crescesse muito (improvavel neste desafio), seria necessario adicionar camadas
- nao e "hexagonal de livro" — quem espera ports/adapters formais nao encontrara

## 6. Regras derivadas

- `clients/goledger.ts` e o unico ponto de contato com a API externa
- nenhuma rota pode fazer fetch direto para a GoLedger
- schemas em `schemas/` sao a fonte de verdade para tipos e validacao
- nao criar pasta `domain/`, `services/` ou `repositories/` enquanto o escopo nao justificar
