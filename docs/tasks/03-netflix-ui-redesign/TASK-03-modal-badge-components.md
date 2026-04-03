# TASK-03 (T033) - Modal Portal + AgeBadge

- Status: done
- Prioridade: P10
- Depende de: T031 (theme foundation)
- Agent/Skill: `design-to-code`
- Referencia: Melhoria propria (nenhum repo Netflix tem CRUD modal)

## O que fazer

1. Criar `components/ui/modal.tsx` — modal portal-based para CRUD
2. Criar `components/ui/badge.tsx` — badge de classificacao indicativa

## Por que fazer

- Modal substitui o formulario inline atual (melhora UX, limpa a pagina)
- Usado na pagina principal (T037) para create, edit e delete confirmation
- AgeBadge e usado no thumbnail (T034), hero (T036) e pagina (T037)

## Como fazer

### Modal (`components/ui/modal.tsx`)

**Diretiva:** `'use client'`

**Props:**
```typescript
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}
```

**Implementacao:**
- Usar `createPortal(jsx, document.body)` de `react-dom`
- Guard SSR: retornar `null` se `typeof window === 'undefined'` ou `!open`
- Tres camadas: backdrop (z-[100]), centering container (z-[101]), content panel

**Backdrop:**
- `fixed inset-0 bg-black/70 backdrop-blur-[2px]`
- Click no backdrop chama `onClose`

**Content panel:**
- `bg-nf-card rounded-lg shadow-2xl`
- Animacao: `scale-in` (keyframe do T031)
- `e.stopPropagation()` no click do content para nao fechar ao clicar dentro
- Size mapping: sm=`max-w-md`, md=`max-w-lg`, lg=`max-w-2xl` — todos com `w-full`

**Comportamentos:**
- Escape key fecha: `useEffect` com `keydown` listener para `e.key === 'Escape'`
- Body scroll lock: `document.body.style.overflow = 'hidden'` quando open, cleanup no effect
- Title: se fornecido, renderizar header com titulo + botao X (lucide-react `X` icon)

### AgeBadge (`components/ui/badge.tsx`)

**Props:**
```typescript
interface AgeBadgeProps {
  age: number;
  className?: string;
}
```

**Implementacao:**
- Pill bordado: `border border-nf-gray-300 text-nf-gray-100 text-xs px-2 py-0.5 rounded`
- Caso especial: `age === 0` → exibir "L" (livre) ao inves de "0+"
- Demais: `{age}+`
- Usar `cn()` de `lib/utils` para merge de className

## Arquivos afetados

- **New:** `components/ui/modal.tsx`
- **New:** `components/ui/badge.tsx`

## Criterio de pronto

- Modal abre e fecha corretamente
- Backdrop escurece a pagina e fecha ao clicar
- Escape key fecha o modal
- Body scroll trava quando modal esta aberto
- Animacao de scale-in ao abrir
- Tres tamanhos (sm/md/lg) funcionam
- AgeBadge exibe "L" para age 0 e "{n}+" para demais
- AgeBadge aceita className customizado
- Ambos componentes funcionam sem erros no SSR (guard de window)
