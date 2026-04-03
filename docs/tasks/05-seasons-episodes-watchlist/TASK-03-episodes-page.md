# TASK-03 (T093) — Pagina de Episodes (CRUD Completo)

- Status: todo
- Prioridade: P0
- Depende de: T091 (fundacao), T092 (seasons — precisa de seasons existentes para referenciar)
- Agent/Skill: `design-to-code`
- Plano: `docs/plans/07-seasons-episodes-watchlist.md`

## O que fazer

1. Criar `app/episodes/page.tsx` (rota Next.js)
2. Criar `components/episodes/episodes-page.tsx` (pagina principal)
3. Criar `components/episodes/episode-form.tsx` (form create/edit com selects em cascata)
4. Criar `components/episodes/episode-card.tsx` (card no grid)

## Por que fazer

Episodes e a terceira entidade obrigatoria. A complexidade aqui e maior porque episode referencia season que referencia tvShow (3 niveis de aninhamento).

## Arquivos a criar

- `app/episodes/page.tsx`
- `components/episodes/episodes-page.tsx`
- `components/episodes/episode-form.tsx`
- `components/episodes/episode-card.tsx`

## Como fazer

### 1. `app/episodes/page.tsx`

```typescript
import { EpisodesPage } from '@/components/episodes/episodes-page';

export default function Page() {
  return <EpisodesPage />;
}
```

### 2. `components/episodes/episodes-page.tsx`

**Seguir padrao de seasons-page.tsx, mas com 2 filtros em cascata.**

```typescript
'use client';

import { useState, useMemo } from 'react';
import { useEpisodes, useCreateEpisode, useUpdateEpisode, useDeleteEpisode } from '@/lib/hooks/use-episodes';
import { useSeasons } from '@/lib/hooks/use-seasons';
import { useTvShows } from '@/lib/hooks/use-tvshows';
import type { Episode } from '@/lib/api';

type FormMode =
  | { type: 'closed' }
  | { type: 'create' }
  | { type: 'edit'; episode: Episode };

export function EpisodesPage() {
  const [formMode, setFormMode] = useState<FormMode>({ type: 'closed' });
  const [confirmDelete, setConfirmDelete] = useState<Episode | null>(null);
  const [filterShow, setFilterShow] = useState<string>('');
  const [filterSeason, setFilterSeason] = useState<string>(''); // "number" como string

  const { data, isLoading, error, refetch } = useEpisodes(100);
  const { data: seasonsData } = useSeasons(100);
  const { data: showsData } = useTvShows(100);

  const episodes = data?.result ?? [];
  const seasons = seasonsData?.result ?? [];
  const shows = showsData?.result ?? [];

  // Seasons filtradas pelo show selecionado (para o dropdown de season)
  const filteredSeasons = useMemo(() => {
    if (!filterShow) return seasons;
    return seasons.filter(s => s.tvShow.title === filterShow);
  }, [seasons, filterShow]);

  // Episodes filtrados por show + season
  const filteredEpisodes = useMemo(() => {
    let result = episodes;
    if (filterShow) {
      result = result.filter(e => e.season.tvShow.title === filterShow);
    }
    if (filterSeason) {
      result = result.filter(e => String(e.season.number) === filterSeason);
    }
    return result;
  }, [episodes, filterShow, filterSeason]);

  // Quando troca o show, resetar filtro de season
  const handleShowFilter = (showTitle: string) => {
    setFilterShow(showTitle);
    setFilterSeason('');
  };

  // ... handlers, modals, FAB (mesmo padrao)
}
```

**Layout JSX — 2 filtros lado a lado:**

```
<div className="flex gap-3 mb-6 flex-wrap">
  <select value={filterShow} onChange={e => handleShowFilter(e.target.value)} ...>
    <option value="">Todos os Shows</option>
    {shows.map(s => <option ...>{s.title}</option>)}
  </select>

  <select value={filterSeason} onChange={e => setFilterSeason(e.target.value)}
    disabled={!filterShow} ...>
    <option value="">Todas as Temporadas</option>
    {filteredSeasons.map(s => <option value={String(s.number)}>Temporada {s.number}</option>)}
  </select>
</div>
```

### 3. `components/episodes/episode-card.tsx`

```typescript
interface EpisodeCardProps {
  episode: Episode;
  onEdit: () => void;
  onDelete: () => void;
}
```

**Visual:**
- `bg-nf-card rounded-lg border border-nf-gray-400/20 p-4`
- Titulo: "E{episodeNumber}: {title}" em `text-lg font-bold text-white`
- Subtitulo: "Temporada {season.number} — {tvShow.title}" em `text-sm text-nf-gray-200`
- Descricao: `line-clamp-2 text-sm text-nf-gray-300`
- Badge rating: se existir, mostrar `{rating}/10` com icone estrela (Star de lucide)
- Data de lancamento: formatada com `new Date(releaseDate).toLocaleDateString('pt-BR')`
- Botoes hover: Edit + Delete

### 4. `components/episodes/episode-form.tsx`

**Campos do form (React Hook Form):**

| Campo | Tipo | Validacao | Edit mode |
|-------|------|-----------|-----------|
| TV Show | `<select>` | required | **readonly** |
| Season | `<select>` (cascata) | required | **readonly** |
| Numero do episodio | `<input type="number">` | required, min: 1 | **readonly** |
| Titulo | `<input type="text">` | required, 1-200 chars | editavel |
| Descricao | `<textarea>` | required, 1-2000 chars | editavel |
| Data de lancamento | `<input type="date">` | required | editavel |
| Rating | `<input type="number">` | opcional, 0-10, step 0.1 | editavel |

**IMPORTANTE — Selects em cascata no form:**

```typescript
const [selectedShow, setSelectedShow] = useState('');

// Quando muda show, filtrar seasons disponiveis
const availableSeasons = useMemo(() => {
  if (!selectedShow) return [];
  return seasons.filter(s => s.tvShow.title === selectedShow);
}, [seasons, selectedShow]);
```

Ao selecionar TV Show, o select de Season atualiza automaticamente mostrando so as seasons daquele show.

**Payload de submit (create):**
```typescript
{
  season: {
    '@assetType': 'seasons',
    number: 1,
    tvShow: { '@assetType': 'tvShows', title: 'Breaking Bad' }
  },
  episodeNumber: 1,
  title: 'Pilot',
  description: 'A high school chemistry teacher is diagnosed with cancer...',
  releaseDate: '2008-01-20T00:00:00Z',
  rating: 9.0
}
```

**Payload de submit (update):**
```typescript
{
  season: { ... },           // key - obrigatorio
  episodeNumber: 1,          // key - obrigatorio
  title: 'Pilot (Updated)',  // editavel
  description: '...',        // editavel
  releaseDate: '...',        // editavel
  rating: 9.5                // editavel
}
```

**Dica para data:** O input type="date" retorna `YYYY-MM-DD`. Converter para ISO antes de enviar:
```typescript
const isoDate = new Date(dateValue).toISOString();
```

## Como testar

1. **Pre-requisito:** Ter pelo menos 1 TV Show e 1 Season criados
2. Acessar `http://localhost:3000/episodes`
3. **Create:** FAB → selecionar show → selecionar season → preencher dados → Criar
   - Verificar cascata: selecionar show filtra seasons automaticamente
   - Verificar que episodio aparece no grid
4. **Edit:** Hover → pencil → mudar titulo/descricao/rating → Salvar
5. **Delete:** Hover → trash → confirmar
6. **Filtros cascata:** Selecionar show → seasons dropdown atualiza → selecionar season → grid filtra
7. **Rating badge:** Episodios com rating mostram o badge com estrela

## Criterio de pronto

- [ ] `/episodes` renderiza lista de episodios em grid responsivo
- [ ] Create com selects em cascata (show → season) funciona
- [ ] Edit funciona (show/season/numero readonly, demais editaveis)
- [ ] Delete com confirmacao
- [ ] Filtros em cascata funcionam (show → season → episodios)
- [ ] Rating badge visivel quando existe
- [ ] Data formatada em pt-BR
- [ ] Descricao truncada no card (line-clamp-2)
- [ ] Loading, error, empty states
- [ ] FAB funcional
- [ ] Toast notifications
- [ ] Tema Netflix consistente
