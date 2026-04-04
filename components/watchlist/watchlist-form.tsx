'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Check, Search } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AgeBadge } from '@/components/ui/badge';
import { cn, titleToGradient } from '@/lib/utils';
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
  const [searchQuery, setSearchQuery] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, dirtyFields },
  } = useForm<WatchlistFormValues>({
    defaultValues: {
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      selectedShows: defaultValues?.tvShows?.map((t) => t.title) ?? [],
    },
  });

  const descriptionValue = watch('description') ?? '';
  const selectedShows = watch('selectedShows') ?? [];
  const titleValue = watch('title') ?? '';

  // Auto-preencher título com nome do primeiro show selecionado (apenas ao criar)
  const titleWasTouched = dirtyFields.title;
  if (!isEdit && !titleWasTouched && selectedShows.length > 0 && !titleValue) {
    setValue('title', selectedShows[0]);
  }
  const DESC_MAX = 2000;

  const filteredShows = searchQuery.trim()
    ? shows.filter((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : shows;

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
          className="w-full rounded-md border border-nf-gray-400/55 bg-nf-surface px-3 py-2 text-base sm:text-sm text-white placeholder:text-nf-gray-200/75 focus:border-nf-red focus:outline-none focus:ring-1 focus:ring-nf-red resize-y min-h-[60px] max-h-[200px] disabled:cursor-not-allowed disabled:opacity-50"
        />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-nf-gray-200">
          TV Shows ({selectedShows.length} selecionado{selectedShows.length !== 1 ? 's' : ''})
        </label>
        <Controller
          name="selectedShows"
          control={control}
          render={({ field }) => (
            <div className="rounded-lg border border-nf-gray-400/55 bg-nf-surface overflow-hidden">
              {/* Search filter */}
              {shows.length > 4 && (
                <div className="relative border-b border-nf-gray-400/30 px-2 py-1.5">
                  <Search className="absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-nf-gray-300" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar show..."
                    className="w-full bg-transparent py-1 pl-6 pr-2 text-sm text-white placeholder:text-nf-gray-300 focus:outline-none"
                  />
                </div>
              )}

              {/* Shows list */}
              <div className="max-h-56 overflow-y-auto overscroll-contain p-1 sm:max-h-60 sm:p-1.5">
                {shows.length === 0 ? (
                  <p className="p-3 text-xs text-nf-gray-300">Nenhum TV Show disponível. Crie um primeiro.</p>
                ) : filteredShows.length === 0 ? (
                  <p className="p-3 text-xs text-nf-gray-300">Nenhum resultado para &ldquo;{searchQuery}&rdquo;</p>
                ) : (
                  filteredShows.map((show) => {
                    const checked = field.value.includes(show.title);
                    const thumbnailUrl = show.posterUrl || show.backdropUrl;

                    return (
                      <button
                        type="button"
                        key={show.title}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-md px-2 py-2 sm:py-1.5 text-left transition-colors',
                          checked
                            ? 'bg-nf-red/10'
                            : 'hover:bg-nf-gray-500/30'
                        )}
                        onClick={() => {
                          const next = checked
                            ? field.value.filter((t: string) => t !== show.title)
                            : [...field.value, show.title];
                          field.onChange(next);
                        }}
                      >
                        {/* Custom checkbox */}
                        <span className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all duration-150',
                          checked
                            ? 'border-nf-red bg-nf-red text-white'
                            : 'border-nf-gray-400 bg-nf-gray-500'
                        )}>
                          {checked && <Check className="h-3 w-3" strokeWidth={3} />}
                        </span>

                        {/* Show thumbnail */}
                        <div className="relative h-9 w-6 shrink-0 overflow-hidden rounded-sm bg-nf-gray-500">
                          {thumbnailUrl ? (
                            <Image
                              src={thumbnailUrl}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="24px"
                            />
                          ) : (
                            <div
                              className="absolute inset-0 flex items-center justify-center"
                              style={{ backgroundImage: titleToGradient(show.title) }}
                            >
                              <span className="text-[8px] font-bold text-white/40">{show.title.charAt(0)}</span>
                            </div>
                          )}
                        </div>

                        {/* Show info */}
                        <span className="min-w-0 flex-1 truncate text-sm text-white">{show.title}</span>

                        <AgeBadge age={show.recommendedAge} className="shrink-0" />
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        />
      </div>

      <div className="mt-2 flex justify-end gap-3 border-t border-nf-gray-400/30 pt-4">
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
