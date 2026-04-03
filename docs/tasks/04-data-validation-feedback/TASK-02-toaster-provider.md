# TASK-02 — Configurar Sonner Toaster

- Status: todo
- Prioridade: P1
- Plano: `docs/plans/05-data-validation-feedback.md`
- Depende de: T041

## Por que fazer

`sonner` (v2.0.7) ja esta instalado no projeto mas o componente `<Toaster>` nunca foi adicionado ao layout. Sem ele, chamadas a `toast()` nao renderizam nada. Este e o pre-requisito para qualquer notificacao ao usuario.

## O que fazer

Adicionar o `<Toaster>` provider no `app/providers.tsx` com tema dark consistente com o design Netflix.

## Arquivo a modificar

- `app/providers.tsx`

## Como fazer

1. Importar `Toaster` do sonner
2. Adicionar `<Toaster>` dentro do `QueryClientProvider`, apos `{children}`
3. Configurar com tema dark e cores Netflix

### Codigo esperado

```tsx
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: '#232323',
            border: '1px solid #404040',
            color: '#E5E5E5',
          },
        }}
        richColors
        closeButton
      />
    </QueryClientProvider>
  );
}
```

### Detalhes das props

| Prop | Valor | Por que |
|------|-------|---------|
| `theme` | `"dark"` | Consistencia com tema Netflix |
| `position` | `"top-right"` | Padrao de mercado, nao bloqueia conteudo principal |
| `toastOptions.style` | cores nf-card/nf-gray | Integra com design tokens existentes |
| `richColors` | `true` | Success = verde, error = vermelho, automatico |
| `closeButton` | `true` | Permite fechar manualmente |

## Como testar

1. Abrir http://localhost:3000
2. Abrir DevTools console
3. Executar: `import('sonner').then(m => m.toast('Test!'))`
4. Um toast deve aparecer no canto superior direito com estilo dark

## Criterio de pronto

- [ ] `<Toaster>` renderiza no DOM (inspecionar com DevTools)
- [ ] Toast manual via console funciona
- [ ] Estilo dark com cores Netflix
- [ ] Position top-right
