# TASK-09 — Validacao Final E2E

- Status: todo
- Prioridade: P1
- Plano: `docs/plans/05-data-validation-feedback.md`
- Depende de: T048

## Por que fazer

Checklist manual de validacao para garantir que todas as tasks anteriores foram integradas corretamente e a experiencia do usuario esta completa. Nenhuma feature funciona isolada — e preciso testar os fluxos de ponta a ponta.

## O que fazer

Executar o checklist abaixo com o app rodando (`pnpm dev`).

## Pre-requisitos

```bash
pnpm dev  # Inicia frontend (3000) e backend (3001)
```

## Checklist

### Dados (T041 + T047)

- [ ] `GET /api/tvshows?limit=50` retorna ~18 shows
- [ ] Nenhum show com `recommendedAge > 18`
- [ ] Nenhum show com descricao menor que 10 caracteres
- [ ] Nenhum show com timestamp ou "test" no titulo
- [ ] "Stranger Things" existe (sem "test")
- [ ] 10 shows novos presentes (Game of Thrones, Friends, etc.)

### Toast Notifications (T042 + T043)

- [ ] Criar show → toast verde "Show criado com sucesso!" com titulo
- [ ] Editar show → toast verde "Show atualizado!" com titulo
- [ ] Excluir show → toast verde "Show excluido" com titulo
- [ ] Erro de rede (desligar backend) → toast vermelho com mensagem
- [ ] Toast aparece no canto superior direito
- [ ] Toast tem estilo dark (fundo #232323, borda #404040)
- [ ] Toast tem botao de fechar

### Validacao Backend (T044)

- [ ] POST com titulo duplicado → 409 "ja existe"
- [ ] POST com titulo < 2 chars → 400
- [ ] POST com descricao < 10 chars → 400
- [ ] POST com idade > 18 → 400
- [ ] PUT com idade > 18 → 400

### Validacao Frontend (T045)

- [ ] Form vazio → mensagens de erro em todos os campos
- [ ] Titulo < 2 chars → erro inline
- [ ] Descricao < 10 chars → erro inline
- [ ] Idade > 18 → erro inline
- [ ] Labels em portugues
- [ ] Descricao usa textarea (nao input)

### Confetti (T046)

- [ ] Criar show com sucesso → confetti dispara
- [ ] Editar show → sem confetti
- [ ] Excluir show → sem confetti
- [ ] Confetti usa cores Netflix (vermelho, branco, dourado)

### UI Geral

- [ ] Hero banner mostra show com gradiente
- [ ] Carousel "Todos os Shows" mostra ~18 cards
- [ ] Carousel "Atualizados Recentemente" mostra ultimos 10
- [ ] Carousel "Para Maiores de 16" filtra corretamente
- [ ] Hover em thumbnail: scale 1.3x + panel com acoes
- [ ] Scroll → header transita transparente → solido
- [ ] FAB (botao +) abre modal de criacao

### Testes (T048)

- [ ] `pnpm test` passa sem erros
- [ ] Nenhum botao fantasma detectado
- [ ] Nenhum import morto detectado

### Build

- [ ] `pnpm build` passa sem erros

## Criterio de pronto

Todos os checkboxes acima marcados. Se algum falhar, voltar a task correspondente e corrigir.

## Resultado esperado

Apos completar esta task, o app tem:
- Dados limpos e enriquecidos
- Feedback visual em todas as acoes (toast)
- Validacao robusta em frontend e backend
- Celebracao ao criar conteudo (confetti)
- Testes automatizados de integridade
- Zero botoes fantasmas ou handlers mortos
