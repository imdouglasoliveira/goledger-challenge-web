# TASK-04 (T094) — Pagina de Watchlist (CRUD + Selecao de Shows)

- Status: todo
- Prioridade: P0
- Depende de: T091 (fundacao)
- Agent/Skill: `design-to-code`
- Plano: `docs/plans/07-seasons-episodes-watchlist.md`

## O que fazer

1. Criar `app/watchlist/page.tsx` (rota Next.js)
2. Criar `components/watchlist/watchlist-page.tsx` (pagina principal)
3. Criar `components/watchlist/watchlist-form.tsx` (form com multi-select de shows)
4. Criar `components/watchlist/watchlist-card.tsx` (card no grid)

## Por que fazer

Watchlist e a quarta entidade obrigatoria. A diferenca aqui e o campo `tvShows` que e um array de referencias — precisa de um multi-select para o usuario escolher quais shows adicionar.

## Arquivos a criar

- `app/watchlist/page.tsx`
- `components/watchlist/watchlist-page.tsx`
- `components/watchlist/watchlist-form.tsx`
- `components/watchlist/watchlist-card.tsx`

## Como fazer

### 1. `app/watchlist/page.tsx`

```typescript
import { WatchlistPage } from '@/components/watchlist/watchlist-page';

export default function Page() {
  return <WatchlistPage />;
}
```

### 2. `components/watchlist/watchlist-page.tsx`

**Seguir padrao de seasons-page.tsx. Sem filtros — watchlists nao tem relacao hierarquica.**

```typescript
'use client';

import { useState } from 'react';
import { useWatchlists, useCreateWatchlist, useUpdateWatchlist, useDeleteWatchlist } from '@/lib/hooks/use-watchlist';
import { useTvShows } from '@/lib/hooks/use-tvshows';
import type { Watchlist } from '@/lib/api';

type FormMode =
  | { type: 'closed' }
  | { type: 'create' }
  | { type: 'edit'; watchlist: Watchlist };

export function WatchlistPage() {
  const [formMode, setFormMode] = useState<FormMode>({ type: 'closed' });
  const [confirmDelete, setConfirmDelete] = useState<Watchlist | null>(null);

  const { data, isLoading, error, refetch } = useWatchlists(100);
  const { data: showsData } = useTvShows(100);

  const watchlists = data?.result ?? [];
  const shows = showsData?.result ?? [];

  // ... handlers, loading/error/empty, JSX
}
```

**Layout:** Grid simples sem filtros.

### 3. `components/watchlist/watchlist-card.tsx`

```typescript
interface WatchlistCardProps {
  watchlist: Watchlist;
  onEdit: () => void;
  onDelete: () => void;
}
```

**Visual:**
- `bg-nf-card rounded-lg border border-nf-gray-400/20 p-4 group`
- Titulo da watchlist: `text-lg font-bold text-white`
- Badge: `{tvShows.length} shows` em `bg-nf-red/20 text-nf-red text-xs px-2 py-0.5 rounded`
- Lista de shows: mostrar ate 3 nomes, se mais mostrar "+X mais"
  ```typescript
  const displayShows = watchlist.tvShows.slice(0, 3);
  const remaining = watchlist.tvShows.length - 3;
  ```
  Cada nome em `text-sm text-nf-gray-200`
- Descricao: `line-clamp-2 text-sm text-nf-gray-300 mt-2`
- Botoes hover: Edit + Delete

### 4. `components/watchlist/watchlist-form.tsx` (MAIS COMPLEXO)

**Este e o form mais diferente — precisa de multi-select de TV Shows.**

**Campos do form:**

| Campo | Tipo | Validacao | Edit mode |
|-------|------|-----------|-----------|
| Titulo | `<input type="text">` | required, 1-200 chars | **readonly** |
| Descricao | `<textarea>` | opcional, 0-2000 chars | editavel |
| TV Shows | checkbox list | opcional | editavel |

**Multi-select de shows — implementacao:**

```typescript
interface WatchlistFormProps {
  mode: FormMode;
  shows: TvShow[];            // todos os shows disponiveis
  onSubmit: (data: any) => void;
  isPending: boolean;
}

export function WatchlistForm({ mode, shows, onSubmit, isPending }: WatchlistFormProps) {
  const isEdit = mode.type === 'edit';
  const defaults = isEdit ? mode.watchlist : { title: '', description: '', tvShows: [] };

  // State para shows selecionados
  const [selectedShows, setSelectedShows] = useState<string[]>(
    defaults.tvShows?.map(s => s.title) ?? []
  );

  const toggleShow = (title: string) => {
    setSelectedShows(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const handleSubmit = (formData: { title: string; description: string }) => {
    onSubmit({
      ...formData,
      tvShows: selectedShows.map(title => ({
        '@assetType': 'tvShows' as const,
        title,
      })),
    });
  };

  return (
    <form onSubmit={...}>
      {/* Titulo */}
      <Input ... disabled={isEdit} />

      {/* Descricao */}
      <textarea ... />

      {/* Multi-select de shows */}
      <div>
        <label className="text-sm font-medium text-nf-gray-200 mb-2 block">
          TV Shows ({selectedShows.length} selecionados)
        </label>
        <div className="max-h-60 overflow-y-auto space-y-1 border border-nf-gray-400/30 rounded-lg p-2">
          {shows.map(show => (
            <label key={show.title}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors
                ${selectedShows.includes(show.title)
                  ? 'bg-nf-red/20 border border-nf-red/50'
                  : 'hover:bg-nf-gray-500/30'}`}>
              <input type="checkbox"
                checked={selectedShows.includes(show.title)}
                onChange={() => toggleShow(show.title)}
                className="accent-nf-red" />
              <span className="text-sm text-white">{show.title}</span>
              {show.recommendedAge > 0 && (
                <span className="text-xs text-nf-gray-300 ml-auto">{show.recommendedAge}+</span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" variant="netflix" disabled={isPending}>
        {isPending ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar'}
      </Button>
    </form>
  );
}
```

**Payload de submit:**
```typescript
{
  title: 'Minha Lista',
  description: 'Shows favoritos para assistir',
  tvShows: [
    { '@assetType': 'tvShows', title: 'Breaking Bad' },
    { '@assetType': 'tvShows', title: 'Dark' },
    { '@assetType': 'tvShows', title: 'The Sopranos' }
  ]
}
```

## Como testar

1. **Pre-requisito:** Ter pelo menos 3-4 TV Shows criados
2. Acessar `http://localhost:3000/watchlist`
3. **Create:** FAB → titulo "Favoritos" → descricao → selecionar 3 shows → Criar
   - Verificar que card aparece com badge "3 shows" e nomes listados
4. **Edit:** Hover → pencil → desmarcar 1 show, marcar outro → Salvar
   - Verificar que lista de shows atualizou no card
5. **Delete:** Hover → trash → confirmar
6. **Card visual:** Verificar que mostra ate 3 nomes + "+X mais" quando tem mais
7. **Empty watchlist:** Criar watchlist sem shows → badge mostra "0 shows"

## Criterio de pronto

- [ ] `/watchlist` renderiza lista de watchlists em grid responsivo
- [ ] Create com multi-select de shows funciona
- [ ] Edit permite adicionar/remover shows (titulo readonly)
- [ ] Delete com confirmacao
- [ ] Cards mostram badge com quantidade de shows
- [ ] Cards mostram ate 3 nomes de shows + "+X mais"
- [ ] Descricao truncada no card
- [ ] Checkbox list com visual Netflix (highlight vermelho quando selecionado)
- [ ] Loading, error, empty states
- [ ] FAB funcional
- [ ] Toast notifications
- [ ] Tema Netflix consistente
