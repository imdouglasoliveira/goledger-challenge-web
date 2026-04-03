# TASK-06 — Efeito Confetti ao Criar Show

- Status: todo
- Prioridade: P2
- Plano: `docs/plans/05-data-validation-feedback.md`
- Depende de: T045

## Por que fazer

Criar conteudo e a acao mais importante do app. Celebrar visualmente o sucesso da criacao (nao do update ou delete) recompensa o usuario e torna a experiencia memoravel. `canvas-confetti` e a lib padrao de mercado para isso — leve (4KB gzip), sem dependencias, usada pelo GitHub, Notion e outros.

## O que fazer

Disparar confetti ao criar um show com sucesso, junto com o toast de sucesso.

## Dependencia ja instalada

- `canvas-confetti` v1.9.4
- `@types/canvas-confetti` v1.9.0

## Arquivo a modificar

- `components/tvshows/tvshows-page.tsx` — handler `handleCreate`

## Como fazer

### 1. Importar confetti

```tsx
import confetti from 'canvas-confetti';
```

### 2. Disparar no onSuccess do create

```tsx
function handleCreate(formData: { title: string; description: string; recommendedAge: number }) {
  createMutation.mutate(formData, {
    onSuccess: () => {
      setFormMode({ type: 'closed' });
      toast.success('Show criado com sucesso!', { description: formData.title });

      // Confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E50914', '#E5E5E5', '#FFD700'],
      });
    },
  });
}
```

### Detalhes da configuracao

| Prop | Valor | Por que |
|------|-------|---------|
| `particleCount` | 100 | Quantidade equilibrada — visivel mas nao exagerada |
| `spread` | 70 | Angulo de dispersao amplo |
| `origin.y` | 0.6 | Origem no terco inferior da tela |
| `colors` | vermelho Netflix, branco, dourado | Paleta festiva alinhada com o tema |

### Nota

Confetti so dispara em **criacao** (nao em update ou delete). Update e uma acao rotineira, delete e destrutiva — nenhum dos dois merece celebracao.

## Como testar

1. Criar um show com dados validos
2. Ao fechar o modal, confetti deve disparar do centro-inferior da tela
3. Confetti desaparece apos ~2 segundos (comportamento padrao)
4. Editar um show → sem confetti
5. Excluir um show → sem confetti

## Criterio de pronto

- [ ] Confetti dispara ao criar show com sucesso
- [ ] Cores incluem vermelho Netflix
- [ ] Nao dispara em update ou delete
- [ ] Nao bloqueia interacao (canvas temporario)
