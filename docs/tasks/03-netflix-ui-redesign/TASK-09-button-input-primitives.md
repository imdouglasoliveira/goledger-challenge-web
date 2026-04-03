# TASK-09 (T039) - Variantes Netflix nos Primitivos UI

- Status: done
- Prioridade: P2
- Depende de: T037 (page rewrite)
- Agent/Skill: `ux-design-expert` (*build)
- Referencia: Netflix UI (botoes red CTA + muted outline)

## O que fazer

1. Adicionar variantes Netflix em `components/ui/button.tsx`
2. Atualizar estilos de `components/ui/input.tsx` para tema escuro

## Por que fazer

- Botoes Netflix red (`bg-nf-red`) sao usados no hero (T036), form (T038) e FAB (T037)
- Botoes outline Netflix sao usados no hero ("Mais Info") e modals
- Input precisa ter contraste adequado no fundo escuro do modal (`bg-nf-card`)
- Variantes existentes (default, destructive, etc.) foram feitas para tema claro/escuro toggle — agora sao dark-only

## Como fazer

### Button (`components/ui/button.tsx`)

**Adicionar 2 novas variantes ao objeto CVA:**

```typescript
netflix: 'bg-nf-red text-white hover:bg-nf-red-hover font-semibold shadow-md',
netflixOutline: 'border border-nf-gray-300 bg-transparent text-nf-gray-100 hover:border-white hover:text-white',
```

**Atualizar 3 variantes existentes para dark-only:**

```typescript
destructive: 'bg-red-700 text-white hover:bg-red-800',
outline: 'border border-nf-gray-400 bg-transparent text-nf-gray-100 hover:bg-nf-gray-500 hover:text-white',
ghost: 'text-nf-gray-200 hover:bg-nf-gray-500 hover:text-white',
```

**Manter sem mudanca:** `default`, `secondary`, `link` (podem ser atualizados depois se necessario)

### Input (`components/ui/input.tsx`)

**Reescrever className para dark-only:**

```
flex h-10 w-full rounded-md
bg-nf-gray-500 border border-nf-gray-400
px-3 py-2 text-sm text-white
placeholder:text-nf-gray-300
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nf-red/50 focus-visible:border-nf-red
disabled:cursor-not-allowed disabled:opacity-50
```

**Remover:** todas as classes `dark:` e referencias a tema claro

## Arquivos afetados

- **Modify:** `components/ui/button.tsx`
- **Modify:** `components/ui/input.tsx`

## Criterio de pronto

- `<Button variant="netflix">` renderiza com fundo vermelho Netflix e hover mais claro
- `<Button variant="netflixOutline">` renderiza com borda cinza e hover branco
- `<Button variant="destructive">` funciona em fundo escuro
- `<Button variant="outline">` funciona em fundo escuro
- `<Button variant="ghost">` funciona em fundo escuro
- Input tem fundo `#2A2A2A` com borda `#404040`
- Input focus ring e vermelho Netflix (ring-nf-red/50)
- Input text e branco, placeholder e cinza muted
- Nenhuma classe `dark:` restante nos arquivos modificados
- Todos os formularios existentes continuam funcionando
