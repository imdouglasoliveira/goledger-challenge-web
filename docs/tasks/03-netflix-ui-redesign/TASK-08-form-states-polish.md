# TASK-08 (T038) - Form no Modal + Estados Loading/Empty/Error Netflix

- Status: done
- Prioridade: P1
- Depende de: T037 (page rewrite)
- Agent/Skill: `ux-design-expert` (*build)
- Referencia: JosinJojy (skeleton com bg-neutral-900), melhoria propria (Netflix loading layout)

## O que fazer

1. Ajustar `components/tvshows/tvshow-form.tsx` — estilos para contexto de modal escuro
2. Expandir `components/states/loading-card.tsx` — adicionar LoadingRow, LoadingHero, LoadingPage
3. Atualizar `components/states/empty-state.tsx` — cores Netflix
4. Atualizar `components/states/error-state.tsx` — cores Netflix

## Por que fazer

- Form precisa ficar bonito dentro do modal escuro (bg-nf-card)
- Loading skeleton precisa espelhar o layout final (hero + rows) para percepção de velocidade
- Empty e error states precisam seguir o tema Netflix para coerência visual

## Como fazer

### Form (`components/tvshows/tvshow-form.tsx`)

**Mudancas minimas — preservar toda logica de react-hook-form:**
- Labels: `text-nf-gray-200` (antes era `text-sm font-medium` sem cor explicita)
- Error messages: manter `text-red-500` (funciona no tema escuro)
- Submit button: usar `variant="netflix"` (do T039) ou `bg-nf-red text-white` direto
- Cancel button: manter `variant="outline"`
- Inputs herdam estilo do T039

### Loading States (`components/states/loading-card.tsx`)

**Manter exports existentes** (`LoadingCard`, `LoadingGrid`) para backward compat.

**Adicionar 3 novos exports:**

1. **LoadingRow:**
   ```tsx
   export function LoadingRow() {
     return (
       <div className="mb-8">
         <Skeleton className="h-7 w-48 mb-3 ml-4 md:ml-12 bg-nf-surface" />
         <div className="flex gap-2 px-4 md:px-12">
           {Array.from({ length: 6 }).map((_, i) => (
             <Skeleton key={i} className="w-[250px] flex-shrink-0 aspect-video rounded-md bg-nf-surface" />
           ))}
         </div>
       </div>
     );
   }
   ```

2. **LoadingHero:**
   ```tsx
   export function LoadingHero() {
     return (
       <div className="relative w-full h-[60vh] md:h-[70vh] bg-nf-surface animate-pulse">
         <div className="absolute bottom-[15%] left-0 px-4 md:px-12">
           <Skeleton className="h-12 w-96 mb-3 bg-nf-card" />
           <Skeleton className="h-4 w-64 mb-2 bg-nf-card" />
           <Skeleton className="h-4 w-48 mb-4 bg-nf-card" />
           <div className="flex gap-3">
             <Skeleton className="h-10 w-28 rounded bg-nf-card" />
             <Skeleton className="h-10 w-28 rounded bg-nf-card" />
           </div>
         </div>
       </div>
     );
   }
   ```

3. **LoadingPage:**
   ```tsx
   export function LoadingPage() {
     return (
       <div className="min-h-screen">
         <LoadingHero />
         <div className="-mt-16 relative z-10">
           <LoadingRow />
           <LoadingRow />
         </div>
       </div>
     );
   }
   ```

### Empty State (`components/states/empty-state.tsx`)

**Trocar 4 classes de cor:**
- `text-zinc-400` → `text-nf-gray-300` (icone)
- `text-zinc-700 dark:text-zinc-300` → `text-nf-gray-100` (titulo)
- `text-zinc-500 dark:text-zinc-400` → `text-nf-gray-200` (descricao)
- Remover prefixos `dark:` (app e sempre escuro)

### Error State (`components/states/error-state.tsx`)

**Trocar mesmas classes + botao:**
- `text-zinc-700 dark:text-zinc-300` → `text-nf-gray-100`
- `text-zinc-500 dark:text-zinc-400` → `text-nf-gray-200`
- Retry button: `variant="netflix"` (se T039 ja executado) ou `variant="outline"` por ora

## Arquivos afetados

- **Modify:** `components/tvshows/tvshow-form.tsx`
- **Modify:** `components/states/loading-card.tsx`
- **Modify:** `components/states/empty-state.tsx`
- **Modify:** `components/states/error-state.tsx`

## Criterio de pronto

- Form renderiza corretamente dentro do modal escuro
- Labels legíveis em fundo `bg-nf-card`
- LoadingPage mostra hero skeleton + 2 row skeletons
- LoadingRow mostra titulo skeleton + 6 card skeletons horizontais
- LoadingHero mostra area grande com titulos e botoes skeleton
- Empty state usa cores Netflix (nf-gray-*)
- Error state usa cores Netflix (nf-gray-*)
- Nenhuma referencia a `dark:` restante nos arquivos modificados
- LoadingCard e LoadingGrid originais ainda funcionam (backward compat)
