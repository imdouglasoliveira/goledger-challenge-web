# TASK-03 — Toast em Todas as Mutacoes

- Status: todo
- Prioridade: P1
- Plano: `docs/plans/05-data-validation-feedback.md`
- Depende de: T042

## Por que fazer

Atualmente as mutacoes (create/update/delete) completam silenciosamente — o usuario nao recebe feedback visual. Isso causa cliques repetidos, incerteza, e uma experiencia pobre. Toast notifications sao o padrao de mercado para feedback de acoes assincronas.

## O que fazer

Adicionar `toast.success()` e `toast.error()` nos hooks de mutacao e nos handlers da pagina.

## Arquivos a modificar

- `lib/hooks/use-tvshows.ts` — callbacks `onError` globais
- `components/tvshows/tvshows-page.tsx` — `toast.success()` nos handlers `onSuccess`

## Como fazer

### 1. Hooks — adicionar `onError` global

```tsx
// lib/hooks/use-tvshows.ts
import { toast } from 'sonner';

export function useCreateTvShow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tvShowsApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TVSHOWS_KEY }),
    onError: (error) => toast.error('Erro ao criar show', { description: error.message }),
  });
}

export function useUpdateTvShow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tvShowsApi.update,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TVSHOWS_KEY }),
    onError: (error) => toast.error('Erro ao atualizar show', { description: error.message }),
  });
}

export function useDeleteTvShow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tvShowsApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TVSHOWS_KEY }),
    onError: (error) => toast.error('Erro ao excluir show', { description: error.message }),
  });
}
```

### 2. Page — adicionar `toast.success()` nos handlers

```tsx
// components/tvshows/tvshows-page.tsx
import { toast } from 'sonner';

function handleCreate(formData: { title: string; description: string; recommendedAge: number }) {
  createMutation.mutate(formData, {
    onSuccess: () => {
      setFormMode({ type: 'closed' });
      toast.success('Show criado com sucesso!', { description: formData.title });
    },
  });
}

function handleUpdate(formData: { title: string; description: string; recommendedAge: number }) {
  updateMutation.mutate(formData, {
    onSuccess: () => {
      setFormMode({ type: 'closed' });
      toast.success('Show atualizado!', { description: formData.title });
    },
  });
}

function handleDelete(show: TvShow) {
  if (!show) return;
  deleteMutation.mutate(show.title, {
    onSuccess: () => {
      setConfirmDelete(null);
      toast.success('Show excluido', { description: show.title });
    },
  });
}
```

### 3. Remover mensagens de erro inline dos modais

Apos adicionar os toasts, remover os blocos de erro inline que existem nos modais:

```tsx
// REMOVER estes blocos de tvshows-page.tsx:
{(createMutation.error || updateMutation.error) && (
  <p className="text-sm text-red-500 mt-4">...</p>
)}
{deleteMutation.error && (
  <p className="text-sm text-red-500 mt-2">...</p>
)}
```

**Por que remover:** com toasts, erros aparecem como notificacao global. Manter erro inline + toast criaria feedback duplicado.

## Como testar

1. Criar um show → toast verde "Show criado com sucesso!" aparece
2. Editar um show → toast verde "Show atualizado!" aparece
3. Excluir um show → toast verde "Show excluido" aparece
4. Tentar criar com dados invalidos → toast vermelho com mensagem de erro
5. Desligar o backend → qualquer mutacao → toast vermelho com erro de rede

## Criterio de pronto

- [ ] Create mostra toast de sucesso
- [ ] Update mostra toast de sucesso
- [ ] Delete mostra toast de sucesso
- [ ] Erros de API mostram toast vermelho com mensagem
- [ ] Nenhuma mensagem de erro inline duplicada nos modais
