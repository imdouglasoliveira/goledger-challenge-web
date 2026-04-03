# TASK-10 (T040) - Validacao E2E e Build

- Status: done
- Prioridade: P0
- Depende de: T039 (todas as tasks anteriores completas)
- Agent/Skill: `a8z-master` (validacao de integridade)

## O que fazer

1. Validar todas as funcionalidades CRUD end-to-end
2. Validar todos os elementos visuais Netflix
3. Executar `pnpm build` e corrigir erros
4. Validar responsividade basica

## Por que fazer

- Garante que nenhuma funcionalidade foi perdida na transformacao visual
- Build passing e requisito para deploy
- Validacao e2e confirma integracao frontend ↔ BFF ↔ GoLedger

## Checklist de validacao

### Visual (tema Netflix)

- [ ] Fundo da pagina e #141414 (nf-black)
- [ ] Texto primario e #E5E5E5 (nf-gray-100)
- [ ] Header fixo no topo com transicao transparente→solido no scroll
- [ ] Brand "GOLEDGER" visivel em vermelho
- [ ] Hero banner ocupa 60-70vh com gradientes
- [ ] Hero mostra titulo grande, descricao truncada, AgeBadge
- [ ] Carousel rows com scroll horizontal
- [ ] Setas do carousel aparecem no hover
- [ ] Thumbnail cards com gradiente unico por show
- [ ] Hover em thumbnail escala 1.3x com overlay
- [ ] Overlay mostra botoes edit/delete, badge, descricao
- [ ] FAB vermelho no canto inferior direito
- [ ] Modal abre com animacao scale-in
- [ ] Modal tem backdrop escuro com blur
- [ ] Scrollbar customizada (thin, dark)

### Funcional (CRUD)

- [ ] Listar shows — carousel rows populados com dados reais
- [ ] Criar show — FAB → modal → form → submit → show aparece
- [ ] Editar show — thumbnail hover → edit → modal pre-preenchido → submit → atualizado
- [ ] Excluir show — thumbnail hover → delete → modal confirmacao → confirmar → removido
- [ ] Loading state — skeleton Netflix (hero + rows) durante carregamento
- [ ] Error state — mensagem + retry funcional
- [ ] Empty state — mensagem + CTA para criar primeiro show
- [ ] Background refetch indicator (se houver)

### Responsividade

- [ ] Desktop (1280px+): hero grande, 3+ thumbnails visiveis por row
- [ ] Tablet (768px-1279px): hero medio, 2-3 thumbnails por row
- [ ] Mobile (< 768px): hero menor, nav links hidden, 1-2 thumbnails por row

### Build

- [ ] `pnpm build` passa sem erros
- [ ] Nenhum warning de TypeScript critico
- [ ] Nenhum import quebrado

### Seguranca (regressao)

- [ ] Nenhum segredo exposto no cliente (verificar Network tab)
- [ ] API calls passam pelo proxy Next.js (/api/*) nao direto ao BFF
- [ ] CORS funcional (BFF aceita requests de localhost:3000)

## Como executar

```bash
# 1. Garantir BFF rodando
cd e:/Github/desafios-vagas/go-ledger
# (assumir que BFF ja esta na porta 3001)

# 2. Iniciar Next.js
pnpm dev

# 3. Validar no browser
# Abrir http://localhost:3000
# Executar checklist visual e funcional manualmente

# 4. Build
pnpm build
```

## Correcoes esperadas

Se o build falhar, causas provaveis:
- Import de componente novo com path incorreto
- Classe Tailwind `@theme` nao reconhecida → fallback para arbitrary values
- TypeScript strict mode reclamando de tipo
- Missing `'use client'` em componente que usa hooks

## Criterio de pronto

- Todos os itens do checklist visual marcados
- Todos os itens do checklist funcional marcados
- Responsividade basica validada nos 3 breakpoints
- `pnpm build` passa sem erros
- Nenhuma regressao de seguranca
