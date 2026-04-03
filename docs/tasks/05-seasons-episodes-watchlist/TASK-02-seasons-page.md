# TASK-02 (T092) — Pagina de Seasons (CRUD Completo)

- Status: todo
- Prioridade: P0
- Depende de: T091 (fundacao)
- Agent/Skill: `design-to-code`
- Plano: `docs/plans/07-seasons-episodes-watchlist.md`

## O que fazer

1. Criar `app/seasons/page.tsx` (rota Next.js)
2. Criar `components/seasons/seasons-page.tsx` (pagina principal)
3. Criar `components/seasons/season-form.tsx` (form create/edit)
4. Criar `components/seasons/season-card.tsx` (card no grid)

## Por que fazer

Seasons e a segunda entidade obrigatoria do desafio. Sem CRUD de seasons o desafio esta incompleto.

## Arquivos a criar

- `app/seasons/page.tsx`
- `components/seasons/seasons-page.tsx`
- `components/seasons/season-form.tsx`
- `components/seasons/season-card.tsx`

## Como fazer

### 1. `app/seasons/page.tsx`

```typescript
import { SeasonsPage } from '@/components/seasons/seasons-page';

export default function Page() {
  return <SeasonsPage />;
}
```

### 2. `components/seasons/seasons-page.tsx`

**Seguir padrao de `components/tvshows/tvshows-page.tsx`.**

**Estrutura:**

```typescript
'use client';

import { useState, useMemo } from 'react';
import { useSeasons, useCreateSeason, useUpdateSeason, useDeleteSeason } from '@/lib/hooks/use-seasons';
import { useTvShows } from '@/lib/hooks/use-tvshows';
import type { Season } from '@/lib/api';
// ... demais imports

type FormMode =
  | { type: 'closed' }
  | { type: 'create' }
  | { type: 'edit'; season: Season };

export function SeasonsPage() {
  const [formMode, setFormMode] = useState<FormMode>({ type: 'closed' });
  const [confirmDelete, setConfirmDelete] = useState<Season | null>(null);
  const [filterShow, setFilterShow] = useState<string>(''); // titulo do show para filtrar

  const { data, isLoading, error, refetch } = useSeasons(100);
  const { data: showsData } = useTvShows(100);
  const createMutation = useCreateSeason();
  const updateMutation = useUpdateSeason();
  const deleteMutation = useDeleteSeason();

  const seasons = data?.result ?? [];
  const shows = showsData?.result ?? [];

  // Filtrar por show selecionado
  const filteredSeasons = useMemo(() => {
    if (!filterShow) return seasons;
    return seasons.filter(s => s.tvShow.title === filterShow);
  }, [seasons, filterShow]);

  // ... handlers (handleCreate, handleUpdate, handleDelete)
  // ... loading/error/empty states
  // ... JSX com grid + modals + FAB
}
```

**Layout JSX:**

```
<div className="min-h-screen bg-nf-black pt-20 px-4 md:px-12">
  {/* Titulo + Filtro */}
  <div className="flex items-center justify-between mb-6">
    <h1 className="text-2xl font-bold text-white">Temporadas</h1>
    <select value={filterShow} onChange={...}
      className="bg-nf-card border border-nf-gray-400/30 text-white rounded px-3 py-2">
      <option value="">Todos os Shows</option>
      {shows.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
    </select>
  </div>

  {/* Grid de cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {filteredSeasons.map(s => (
      <SeasonCard key={s['@key']} season={s}
        onEdit={() => setFormMode({ type: 'edit', season: s })}
        onDelete={() => setConfirmDelete(s)} />
    ))}
  </div>

  {/* Modal Create/Edit */}
  <Modal open={formMode.type !== 'closed'}
    onClose={() => setFormMode({ type: 'closed' })}
    title={formMode.type === 'create' ? 'Nova Temporada' : 'Editar Temporada'}>
    <SeasonForm
      mode={formMode}
      shows={shows}
      onSubmit={...}
      isPending={createMutation.isPending || updateMutation.isPending} />
  </Modal>

  {/* Modal Delete */}
  <Modal open={confirmDelete !== null} onClose={() => setConfirmDelete(null)}
    title="Confirmar Exclusao" size="sm">
    ...botoes Cancelar/Excluir...
  </Modal>

  {/* FAB */}
  <button className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-nf-red ..."
    onClick={() => setFormMode({ type: 'create' })}>
    <Plus className="h-6 w-6" />
  </button>
</div>
```

### 3. `components/seasons/season-card.tsx`

```typescript
interface SeasonCardProps {
  season: Season;
  onEdit: () => void;
  onDelete: () => void;
}
```

**Visual:**
- `bg-nf-card rounded-lg border border-nf-gray-400/20 p-4`
- Titulo: "Temporada {number}" em `text-lg font-bold text-white`
- Subtitulo: `{tvShow.title}` em `text-sm text-nf-gray-200`
- Badge: ano em `text-xs bg-nf-gray-500 px-2 py-0.5 rounded`
- Hover: `hover:border-nf-red/50 transition-colors`
- Botoes Edit/Delete: aparecem no hover (`opacity-0 group-hover:opacity-100`)
- Usar icones `Pencil` e `Trash2` de lucide-react (tamanho h-4 w-4)

### 4. `components/seasons/season-form.tsx`

**Campos do form (React Hook Form):**

| Campo | Tipo | Validacao | Edit mode |
|-------|------|-----------|-----------|
| TV Show | `<select>` com shows | required | **readonly** (disabled) |
| Numero | `<input type="number">` | required, min: 1 | **readonly** (disabled) |
| Ano | `<input type="number">` | required, 1900-2100 | editavel |

**Props:**
```typescript
interface SeasonFormProps {
  mode: FormMode;
  shows: TvShow[];
  onSubmit: (data: any) => void;
  isPending: boolean;
}
```

**Payload de submit (create):**
```typescript
{
  number: 1,
  tvShow: { '@assetType': 'tvShows', title: 'Breaking Bad' },
  year: 2008
}
```

**Payload de submit (update):**
```typescript
{
  number: 1,                                    // key - obrigatorio
  tvShow: { '@assetType': 'tvShows', title: 'Breaking Bad' }, // key - obrigatorio
  year: 2009                                    // campo editavel
}
```

## Como testar

1. Acessar `http://localhost:3000/seasons` no browser
2. **Create:** Clicar FAB → selecionar show → numero 1 → ano 2024 → Criar
   - Verificar que season aparece no grid
   - Toast de sucesso aparece
3. **Edit:** Hover no card → clicar pencil → mudar ano → Salvar
   - Verificar que ano atualizou
4. **Delete:** Hover no card → clicar trash → confirmar
   - Verificar que card sumiu do grid
5. **Filtro:** Selecionar show no dropdown → grid mostra so seasons daquele show
6. **Empty state:** Sem seasons → mensagem amigavel
7. **Erro:** Desligar BFF → ver estado de erro com botao retry

## Criterio de pronto

- [ ] `/seasons` renderiza lista de temporadas em grid responsivo
- [ ] Create via modal funciona (select de show + numero + ano)
- [ ] Edit via modal funciona (ano editavel, show+numero readonly)
- [ ] Delete com confirmacao funciona
- [ ] Filtro por show funciona
- [ ] Loading state (skeleton ou spinner)
- [ ] Error state com botao retry
- [ ] Empty state com mensagem amigavel
- [ ] FAB funcional (bottom-right)
- [ ] Toast notifications no create/edit/delete
- [ ] Tema Netflix consistente (cores, fonts, spacing)
