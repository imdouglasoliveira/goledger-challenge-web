# TASK-07 (T097) — Build + Validacao E2E

- Status: todo
- Prioridade: P0
- Depende de: T096 (seed executado)
- Agent/Skill: `a8z-master`
- Plano: `docs/plans/07-seasons-episodes-watchlist.md`

## O que fazer

Validar que o desafio esta 100% completo e pronto para entrega.

## Por que fazer

Garantir que nao ha erros de build, types quebrados, ou funcionalidades faltando antes de submeter ao avaliador.

## Checklist de validacao

### Build
- [ ] `pnpm build` sem erros de tipo ou compilacao

### TV Shows (`/`)
- [ ] Listagem em carousels Netflix-style
- [ ] Create via FAB → modal com form → show aparece
- [ ] Edit via hover → pencil → modal com form → show atualizado
- [ ] Delete via hover → trash → modal confirmacao → show removido
- [ ] Hero banner funcional

### Seasons (`/seasons`)
- [ ] Listagem em grid responsivo
- [ ] Create via FAB → modal com select de show + numero + ano → season aparece
- [ ] Edit via hover → pencil → modal com ano editavel → season atualizada
- [ ] Delete via hover → trash → confirmacao → season removida
- [ ] Filtro por TV Show funciona

### Episodes (`/episodes`)
- [ ] Listagem em grid responsivo
- [ ] Create via FAB → selects cascata (show → season) + campos → episode aparece
- [ ] Edit via hover → pencil → campos editaveis → episode atualizado
- [ ] Delete via hover → trash → confirmacao → episode removido
- [ ] Filtros em cascata (show → season) funcionam
- [ ] Rating badge visivel quando existe
- [ ] Data formatada em pt-BR

### Watchlist (`/watchlist`)
- [ ] Listagem em grid responsivo
- [ ] Create via FAB → titulo + descricao + multi-select shows → watchlist aparece
- [ ] Edit via hover → pencil → adicionar/remover shows → watchlist atualizada
- [ ] Delete via hover → trash → confirmacao → watchlist removida
- [ ] Cards mostram quantidade e nomes dos shows

### Navegacao
- [ ] Header links funcionam para todas as 4 paginas
- [ ] Indicador visual de pagina ativa
- [ ] Navegacao client-side (sem reload)

### UX geral
- [ ] Loading state em todas as paginas
- [ ] Error state com retry em todas as paginas
- [ ] Empty state em todas as paginas
- [ ] Toast notifications em todas as operacoes
- [ ] Tema Netflix consistente (cores, fonts, spacing)
- [ ] Mobile minimamente responsivo

### Seed
- [ ] Script `seed-all.mjs` executa sem erros
- [ ] Dados aparecem corretamente em todas as paginas

## Como executar a validacao

```bash
# 1. Build
pnpm build

# 2. Subir dev server
pnpm dev

# 3. Executar seed (se necessario)
node scripts/seed-all.mjs

# 4. Testar cada pagina manualmente no browser
# http://localhost:3000/           → TV Shows
# http://localhost:3000/seasons    → Seasons
# http://localhost:3000/episodes   → Episodes
# http://localhost:3000/watchlist  → Watchlist

# 5. Para cada pagina, testar:
# - Create (FAB → form → submit)
# - Edit (hover → pencil → form → submit)
# - Delete (hover → trash → confirm)
# - Filtros (se aplicavel)
```

## Criterio de pronto

- [ ] TODOS os itens do checklist acima marcados
- [ ] Desafio GoLedger 100% completo: CRUD para TV Shows, Seasons, Episodes e Watchlists
