# TASK-07 (T037) - Recomposicao da Pagina Principal

- Status: done
- Prioridade: P0
- Depende de: T036 (hero banner) — todas as tasks T031-T036 devem estar completas
- Agent/Skill: `a8z-master` (orquestracao)
- Referencia: Composicao original — nenhum repo Netflix tem CRUD

## O que fazer

1. Reescrever `components/tvshows/tvshows-page.tsx` — compor hero + carousels + modals

## Por que fazer

- Integra todos os building blocks criados nas tasks anteriores
- Transforma a experiencia de grid basico para layout Netflix completo
- Mantem toda a funcionalidade CRUD existente via modals
- E a task de maior impacto visual

## Como fazer

### O que PRESERVAR (verbatim, sem mudancas)

```typescript
type FormMode = { type: 'closed' } | { type: 'create' } | { type: 'edit'; show: TvShow };

// Estados
const [formMode, setFormMode] = useState<FormMode>({ type: 'closed' });
const [confirmDelete, setConfirmDelete] = useState<TvShow | null>(null);

// Hooks
const { data, isLoading, error, refetch, isFetching } = useTvShows(100);
const createMutation = useCreateTvShow();
const updateMutation = useUpdateTvShow();
const deleteMutation = useDeleteTvShow();

// Derivacao
const shows = data?.result ?? [];

// Handlers (mesma logica exata)
function handleCreate(formData) { ... }
function handleUpdate(formData) { ... }
function handleDelete(show) { ... }
```

### O que MUDAR (layout e composicao JSX)

**Novos imports:**
- `HeroBanner` de `@/components/layout/hero-banner`
- `CarouselRow` de `@/components/layout/carousel-row`
- `TvShowThumbnail` de `@/components/tvshows/tvshow-thumbnail`
- `Modal` de `@/components/ui/modal`
- `LoadingPage` de `@/components/states/loading-card`

**Derivacoes com useMemo:**
```typescript
const featuredShow = useMemo(() => {
  if (shows.length === 0) return null;
  // Selecao pseudo-aleatoria mas estavel (baseada em shows.length)
  return shows[shows.length % shows.length]; // ou Math.floor(Math.random() * shows.length) com seed
}, [shows.length]);

const recentShows = useMemo(() =>
  [...shows].sort((a, b) =>
    new Date(b['@lastUpdated']).getTime() - new Date(a['@lastUpdated']).getTime()
  ).slice(0, 10),
  [shows]
);

const matureShows = useMemo(() =>
  shows.filter(s => s.recommendedAge >= 16),
  [shows]
);
```

**Novo JSX (estrutura):**

```
<div className="min-h-screen">
  {/* Hero */}
  {featuredShow && <HeroBanner show={featuredShow} onEdit={...} />}

  {/* Content area — overlaps hero bottom */}
  <div className="-mt-16 relative z-10">

    {/* Row: Todos os Shows */}
    <CarouselRow title="Todos os Shows">
      {shows.map(show => <TvShowThumbnail key={...} show={show} onEdit={...} onDelete={...} />)}
    </CarouselRow>

    {/* Row: Atualizados Recentemente */}
    {recentShows.length > 0 && (
      <CarouselRow title="Atualizados Recentemente">
        {recentShows.map(show => <TvShowThumbnail ... />)}
      </CarouselRow>
    )}

    {/* Row: Maduros 16+ */}
    {matureShows.length > 0 && (
      <CarouselRow title="Para Maiores de 16">
        {matureShows.map(show => <TvShowThumbnail ... />)}
      </CarouselRow>
    )}
  </div>

  {/* Modal: Create/Edit */}
  <Modal open={formMode.type !== 'closed'} onClose={() => setFormMode({ type: 'closed' })} title={...}>
    <TvShowForm ... />
  </Modal>

  {/* Modal: Delete Confirmation */}
  <Modal open={confirmDelete !== null} onClose={() => setConfirmDelete(null)} title="Confirmar Exclusao" size="sm">
    <p>Tem certeza que deseja excluir <strong>{confirmDelete?.title}</strong>?</p>
    <div className="flex gap-2 justify-end mt-4">
      <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
      <Button variant="destructive" onClick={() => handleDelete(confirmDelete!)} disabled={deleteMutation.isPending}>
        {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
      </Button>
    </div>
  </Modal>

  {/* FAB: Floating Action Button */}
  <button
    className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-nf-red text-white shadow-lg hover:bg-nf-red-hover ..."
    onClick={() => setFormMode({ type: 'create' })}
  >
    <Plus className="h-6 w-6" />
  </button>
</div>
```

**Estados de loading/empty/error:**
- Loading: `<LoadingPage />` (skeleton Netflix do T038)
- Error: `<ErrorState ... />` com tema Netflix
- Empty: `<EmptyState ... />` com tema Netflix

### Interacao com Header (T032)

O header de `layout.tsx` ja fornece o botao "+" global. Na pagina, o FAB e uma segunda opcao de acesso. Ambos chamam `setFormMode({ type: 'create' })`. Para conectar o header, duas opcoes:
1. Usar React Context para compartilhar o callback (mais complexo)
2. Manter o FAB como ponto primario de criacao (mais simples)

**Recomendacao:** opcao 2 (FAB) por simplicidade. O botao do header pode scrollar para o topo.

## Arquivo afetado

- **Rewrite:** `components/tvshows/tvshows-page.tsx`

## Criterio de pronto

- Pagina renderiza hero banner com show destaque
- Pelo menos 2 carousel rows visiveis ("Todos", "Recentes")
- Row "Maduros 16+" aparece condicionalmente
- Hover em thumbnail escala e mostra overlay
- Click edit no thumbnail → modal abre com form pre-preenchido
- Click delete no thumbnail → modal de confirmacao
- Create via FAB → modal de criacao → show aparece na lista
- Update via modal → show atualizado na lista
- Delete via modal → show removido da lista
- Loading state mostra skeleton Netflix
- Error state mostra mensagem com retry
- Empty state mostra mensagem com CTA
- Nenhuma funcionalidade CRUD perdida em relacao a versao anterior
- `-mt-16` faz o conteudo sobrepor a base do hero suavemente
