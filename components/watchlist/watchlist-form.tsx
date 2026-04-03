'use client';

import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { TvShow, Watchlist } from '@/lib/api';

interface WatchlistFormValues {
  title: string;
  description: string;
  selectedShows: string[];
}

interface WatchlistFormProps {
  defaultValues?: Partial<Watchlist>;
  shows: TvShow[];
  onSubmit: (data: { title: string; description?: string; tvShows?: { '@assetType': 'tvShows'; title: string }[] }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export function WatchlistForm({ defaultValues, shows, onSubmit, onCancel, isLoading, isEdit }: WatchlistFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<WatchlistFormValues>({
    defaultValues: {
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      selectedShows: defaultValues?.tvShows?.map((t) => t.title) ?? [],
    },
  });

  const descriptionValue = watch('description') ?? '';
  const selectedShows = watch('selectedShows') ?? [];
  const DESC_MAX = 2000;

  const submitHandler = handleSubmit((data) => {
    onSubmit({
      title: data.title.trim(),
      description: data.description.trim() || undefined,
      tvShows: data.selectedShows.length > 0
        ? data.selectedShows.map((title) => ({ '@assetType': 'tvShows' as const, title }))
        : undefined,
    });
  });

  return (
    <form onSubmit={submitHandler} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-nf-gray-200" htmlFor="title">
          Título da Watchlist
        </label>
        {isEdit ? (
          <>
            <input type="hidden" {...register('title', {
              required: 'Título é obrigatório',
              setValueAs: (value) => (typeof value === 'string' ? value.trim() : value),
              minLength: { value: 2, message: 'Título deve ter no mínimo 2 caracteres' },
              maxLength: { value: 200, message: 'Título deve ter no máximo 200 caracteres' },
            })} />
            <Input
              id="title"
              value={defaultValues?.title ?? ''}
              disabled
              readOnly
            />
          </>
        ) : (
          <Input
            id="title"
            {...register('title', {
              required: 'Título é obrigatório',
              setValueAs: (value) => (typeof value === 'string' ? value.trim() : value),
              minLength: { value: 2, message: 'Título deve ter no mínimo 2 caracteres' },
              maxLength: { value: 200, message: 'Título deve ter no máximo 200 caracteres' },
            })}
            placeholder="Ex: Minha Lista, Para Assistir..."
          />
        )}
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
        {isEdit && (
          <p className="mt-1 text-xs text-nf-gray-300">
            O título identifica a watchlist e não pode ser alterado.
          </p>
        )}
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm font-medium text-nf-gray-200" htmlFor="description">
            Descrição (opcional)
          </label>
          <span className={cn(
            "text-xs tabular-nums",
            descriptionValue.length > DESC_MAX ? 'text-red-500' : 'text-nf-gray-300'
          )}>
            {descriptionValue.length}/{DESC_MAX}
          </span>
        </div>
        <textarea
          id="description"
          {...register('description', {
            setValueAs: (value) => (typeof value === 'string' ? value.trim() : value),
            maxLength: { value: DESC_MAX, message: `Descrição deve ter no máximo ${DESC_MAX} caracteres` },
          })}
          placeholder="Descreva sua watchlist"
          rows={2}
          className="w-full rounded-md border border-nf-gray-400 bg-nf-surface px-3 py-2 text-sm text-white placeholder:text-nf-gray-300 focus:border-white focus:outline-none focus:ring-1 focus:ring-white resize-y min-h-[60px] max-h-[200px] disabled:cursor-not-allowed disabled:opacity-50"
        />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-nf-gray-200">
          TV Shows ({selectedShows.length} selecionado(s))
        </label>
        <Controller
          name="selectedShows"
          control={control}
          render={({ field }) => (
            <div className="max-h-48 overflow-y-auto space-y-1 rounded-md border border-nf-gray-400 bg-nf-surface p-2">
              {shows.length === 0 ? (
                <p className="text-xs text-nf-gray-300 p-2">Nenhum TV Show disponível. Crie um primeiro.</p>
              ) : (
                shows.map((show) => {
                  const checked = field.value.includes(show.title);
                  return (
                    <label
                      key={show.title}
                      className={cn(
                        'flex items-center gap-2 rounded px-2 py-1.5 cursor-pointer transition-colors',
                        checked ? 'bg-nf-red/10' : 'hover:bg-nf-gray-500/30'
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        const next = checked
                          ? field.value.filter((t: string) => t !== show.title)
                          : [...field.value, show.title];
                        field.onChange(next);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        readOnly
                        className="h-4 w-4 rounded border-nf-gray-400 text-nf-red focus:ring-nf-red focus:ring-offset-0 bg-nf-gray-500 pointer-events-none"
                      />
                      <span className="text-sm text-white">{show.title}</span>
                      {show.recommendedAge > 0 && (
                        <span className="ml-auto text-xs text-nf-gray-300">{show.recommendedAge}+</span>
                      )}
                    </label>
                  );
                })
              )}
            </div>
          )}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="netflixOutline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="netflix" disabled={isLoading}>
          {isLoading ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar'}
        </Button>
      </div>
    </form>
  );
}
