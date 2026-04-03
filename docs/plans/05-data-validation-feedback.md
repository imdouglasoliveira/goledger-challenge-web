# 05 - Correcao de Dados, Validacoes, Toast, Confetti e Testes

- Status: approved
- Prioridade: P1
- Publico: dev junior
- Agent: `a8z-master`

## Contexto

Apos a implementacao do Netflix UI redesign (plano 04), a aplicacao esta visualmente polida mas apresenta tres lacunas criticas que impactam a experiencia do usuario e a integridade dos dados:

1. **Dados sujos no GoLedger** — shows com idades absurdas (1231308), descricoes lixo ("x", "1231", Lorem Ipsum), registros de teste com timestamps no titulo. Impacto: UI mostra badges como "1231308+" e cards sem descricao.
2. **Sem feedback ao usuario** — mutacoes (create/update/delete) completam silenciosamente. O usuario nao sabe se a acao funcionou ou falhou. `sonner` esta instalado (v2.0.7) mas o `<Toaster>` provider nunca foi adicionado.
3. **Sem validacao de duplicatas** — a API aceita titulos duplicados e dados invalidos. Nao ha verificacao no backend nem regras robustas no frontend.
4. **Sem testes** — nenhum teste automatizado para detectar gaps como botoes sem handler, fluxos quebrados, ou regressoes.

## Por que fazer cada melhoria

| Problema | Impacto no usuario | Impacto tecnico | Solucao |
|----------|-------------------|-----------------|---------|
| Dados sujos | Badge "1231308+", descricao "x" visivel | Dados inconsistentes no blockchain | Corrigir via PUT/DELETE/POST |
| Sem feedback | Nao sabe se acao funcionou; repete cliques | Sem observabilidade de erros | Integrar sonner Toaster |
| Sem validacao duplicatas | Cria shows duplicados sem saber | Dados duplicados no ledger | Check no backend + rules no form |
| Sem celebracao | Experiencia fria ao criar conteudo | Nenhum | canvas-confetti no sucesso |
| Sem testes | Bugs silenciosos passam despercebidos | Regressoes nao detectadas | Testes de integridade |

## Diagnostico dos dados (auditoria 2026-03-31)

| # | Show | Idade | Descricao | Problema | Acao |
|---|------|-------|-----------|----------|------|
| 1 | Breaking Bad | 1231308 | "1231" | Idade absurda + desc lixo | PUT (idade: 16, desc real) |
| 2 | The Big Bang Theory | 12 | "x" | Desc invalida | PUT (desc real) |
| 3 | The Big Bang Theory 1774966262343 | 12 | ok | Teste | DELETE |
| 4 | The Big Bang Theory 1774966238272 | 12 | ok | Teste | DELETE |
| 5 | Stranger Things test | 16 | ok | "test" no titulo | DELETE + POST |
| 6 | Como vender drogas online rapido | 15 | Lorem Ipsum | Desc placeholder | PUT (desc real) |
| 7 | Dexter | 18 | "Melhor serie" | Desc pobre | PUT (desc real) |
| 8 | Bates Motel | 24 | ok | Idade incorreta | PUT (idade: 18) |
| 9 | The Sopranos | 21 | ok | Idade incorreta | PUT (idade: 18) |
| 10 | Dark | 16 | ok (ingles) | Desc em ingles | PUT (desc pt-BR) |
| 11 | Supernatural | 14 | ok | -- | Nenhuma |

## Seed de shows novos (10 titulos)

| # | Show | Idade | Genero |
|---|------|-------|--------|
| 1 | Game of Thrones | 18 | Drama/Fantasia |
| 2 | Friends | 12 | Comedia |
| 3 | The Office | 12 | Comedia |
| 4 | Black Mirror | 16 | Sci-Fi |
| 5 | The Crown | 12 | Drama Historico |
| 6 | Rick and Morty | 16 | Animacao Adulta |
| 7 | La Casa de Papel | 16 | Thriller |
| 8 | The Mandalorian | 12 | Sci-Fi/Acao |
| 9 | Arcane | 14 | Animacao |
| 10 | Peaky Blinders | 16 | Drama/Crime |

## Detalhes tecnicos da API

- **PUT /api/tvshows** — identifica por `title` (obrigatorio), atualiza `description` e `recommendedAge`
- **DELETE /api/tvshows** — identifica por `title` no body
- **POST /api/tvshows** — requer `title`, `description`, `recommendedAge`
- **Rate limit:** 30 req/min (create/update), 10 req/min (delete)
- **Nota:** `title` e a chave primaria no GoLedger, nao pode ser alterado via PUT

## Estrutura de Tasks

→ Ver `docs/tasks/04-data-validation-feedback-tasks.md` para indice completo

- [ ] T041 → `TASK-01-auditoria-e-correcao-dados.md`
- [ ] T042 → `TASK-02-toaster-provider.md`
- [ ] T043 → `TASK-03-toast-mutations.md`
- [ ] T044 → `TASK-04-validacao-backend-duplicatas.md`
- [ ] T045 → `TASK-05-validacao-frontend-form.md`
- [ ] T046 → `TASK-06-confetti-criacao.md`
- [ ] T047 → `TASK-07-seed-novos-shows.md`
- [ ] T048 → `TASK-08-testes-integridade.md`
- [ ] T049 → `TASK-09-validacao-final.md`

## Ordem obrigatoria

```
T041 (dados) → T042 (toaster) → T043 (toasts) → T044 (backend)
  → T045 (frontend) → T046 (confetti) → T047 (seed) → T048 (testes) → T049 (validacao)
```

## Dependencias

- `sonner` v2.0.7 — ja instalado, falta provider
- `canvas-confetti` v1.9.4 — ja instalado
- `@types/canvas-confetti` v1.9.0 — ja instalado

## Lib para enriquecimento futuro

**`moviedb-promise`** — wrapper TMDB. Suporta `language: 'pt-BR'`, classificacao indicativa via `/tv/{id}/content_ratings`. NAO instalar agora — seed manual e suficiente.
