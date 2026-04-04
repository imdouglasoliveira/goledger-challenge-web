'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Episode, Season } from '@/lib/api';

const episodeSchema = z.object({
  tvShowTitle: z.string(),
  seasonKey: z.string().min(1, 'Selecione uma temporada'),
  episodeNumber: z
    .string()
    .min(1, 'Número é obrigatório')
    .refine((v) => parseInt(v, 10) >= 1, 'Número deve ser maior que 0'),
  title: z
    .string()
    .trim()
    .min(2, 'Título deve ter no mínimo 2 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres'),
  releaseDate: z.string().min(1, 'Data é obrigatória'),
  description: z
    .string()
    .trim()
    .min(10, 'Descrição deve ter no mínimo 10 caracteres')
    .max(2000, 'Descrição deve ter no máximo 2000 caracteres'),
  rating: z
    .string()
    .refine(
      (v) => !v || (parseFloat(v) >= 0 && parseFloat(v) <= 10),
      'Avaliação deve estar entre 0 e 10'
    ),
});

type EpisodeFormValues = z.infer<typeof episodeSchema>;

interface EpisodeFormProps {
  defaultValues?: Partial<Episode>;
  seasons: Season[];
  onSubmit: (data: {
    season: { '@assetType': 'seasons'; number: number; tvShow: { '@assetType': 'tvShows'; title: string } };
    episodeNumber: number;
    title: string;
    releaseDate: string;
    description: string;
    rating?: number;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

const DESC_MAX = 2000;

export function EpisodeForm({ defaultValues, seasons, onSubmit, onCancel, isLoading, isEdit }: EpisodeFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EpisodeFormValues>({
    resolver: zodResolver(episodeSchema),
    defaultValues: {
      tvShowTitle: defaultValues?.season?.tvShow?.title ?? '',
      seasonKey: defaultValues?.season?.tvShow?.title ? `${defaultValues.season.tvShow.title}|${defaultValues.season.number}` : '',
      episodeNumber: defaultValues?.episodeNumber?.toString() ?? '',
      title: defaultValues?.title ?? '',
      releaseDate: defaultValues?.releaseDate ? defaultValues.releaseDate.split('T')[0] : '',
      description: defaultValues?.description ?? '',
      rating: defaultValues?.rating?.toString() ?? '',
    },
  });

  const selectedShow = watch('tvShowTitle') ?? '';
  const selectedSeasonKey = watch('seasonKey') ?? '';
  const descriptionValue = watch('description') ?? '';
  const selectableSeasons = useMemo(
    () => seasons.filter((season) => typeof season.tvShow?.title === 'string' && season.tvShow.title.length > 0),
    [seasons]
  );

  const availableShows = useMemo(
    () => [...new Set(selectableSeasons.map((season) => season.tvShow.title!))].sort((a, b) => a.localeCompare(b)),
    [selectableSeasons]
  );

  const availableSeasons = useMemo(() => {
    const filtered = selectedShow
      ? selectableSeasons.filter((season) => season.tvShow.title === selectedShow)
      : selectableSeasons;

    return filtered.sort((a, b) => {
      const byTitle = (a.tvShow.title ?? '').localeCompare(b.tvShow.title ?? '');
      if (byTitle !== 0) return byTitle;
      return a.number - b.number;
    });
  }, [selectableSeasons, selectedShow]);

  useEffect(() => {
    if (isEdit || !selectedSeasonKey) return;
    const [showTitle] = selectedSeasonKey.split('|');
    if (showTitle && showTitle !== selectedShow) {
      setValue('tvShowTitle', showTitle);
    }
  }, [isEdit, selectedSeasonKey, selectedShow, setValue]);

  const submitHandler = handleSubmit((data) => {
    const [tvShowTitle, seasonNumber] = data.seasonKey.split('|');

    onSubmit({
      season: {
        '@assetType': 'seasons',
        number: parseInt(seasonNumber, 10),
        tvShow: { '@assetType': 'tvShows', title: tvShowTitle.trim() },
      },
      episodeNumber: parseInt(data.episodeNumber, 10),
      title: data.title.trim(),
      releaseDate: new Date(`${data.releaseDate}T00:00:00Z`).toISOString(),
      description: data.description.trim(),
      rating: data.rating ? parseFloat(data.rating) : undefined,
    });
  });

  return (
    <form onSubmit={submitHandler} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-nf-gray-200" htmlFor="tvShowTitle">
          TV Show
        </label>
        {isEdit ? (
          <>
            <input type="hidden" {...register('tvShowTitle')} />
            <Input id="tvShowTitle" value={defaultValues?.season?.tvShow?.title ?? ''} disabled readOnly />
          </>
        ) : (
          <select
            id="tvShowTitle"
            {...register('tvShowTitle', {
              onChange: () => setValue('seasonKey', ''),
            })}
            className="w-full rounded-md border border-nf-gray-400/55 bg-nf-surface px-3 py-2 text-sm text-white focus:border-nf-red focus:outline-none focus:ring-1 focus:ring-nf-red"
          >
            <option value="">Todos os Shows</option>
            {availableShows.map((showTitle) => (
              <option key={showTitle} value={showTitle}>
                {showTitle}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-nf-gray-200" htmlFor="seasonKey">
          Temporada
        </label>
        {isEdit ? (
          <>
            <input type="hidden" {...register('seasonKey')} />
            <Input id="seasonKey" value={`${defaultValues?.season?.tvShow?.title ?? ''} - Temporada ${defaultValues?.season?.number ?? ''}`} disabled readOnly />
          </>
        ) : (
          <select
            id="seasonKey"
            {...register('seasonKey')}
            className={cn(
              'w-full rounded-md border border-nf-gray-400/55 bg-nf-surface px-3 py-2 text-sm text-white focus:border-nf-red focus:outline-none focus:ring-1 focus:ring-nf-red'
            )}
          >
            <option value="">Selecione...</option>
            {availableSeasons.map((season) => {
              const seasonKey = `${season.tvShow.title ?? ''}|${season.number}`;
              return (
                <option key={seasonKey} value={seasonKey}>
                  {season.tvShow.title ?? ''} - Temporada {season.number}
                </option>
              );
            })}
          </select>
        )}
        {errors.seasonKey && <p className="mt-1 text-sm text-red-500">{errors.seasonKey.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-nf-gray-200" htmlFor="episodeNumber">
          Número do Episódio
        </label>
        {isEdit ? (
          <>
            <input type="hidden" {...register('episodeNumber')} />
            <Input id="episodeNumber" value={defaultValues?.episodeNumber?.toString() ?? ''} disabled readOnly />
          </>
        ) : (
          <Input
            id="episodeNumber"
            type="number"
            min="1"
            {...register('episodeNumber')}
            placeholder="Ex: 1, 2, 3"
          />
        )}
        {errors.episodeNumber && <p className="mt-1 text-sm text-red-500">{errors.episodeNumber.message}</p>}
        {isEdit && (
          <p className="mt-1 text-xs text-nf-gray-300">
            TV Show, temporada e número do episódio fazem parte da chave e não podem ser alterados.
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-nf-gray-200" htmlFor="title">
          Título
        </label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Ex: Pilot, The One Where..."
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
      </div>

      {/* Date + Rating side by side on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-nf-gray-200" htmlFor="releaseDate">
            Data de Lançamento
          </label>
          <Input
            id="releaseDate"
            type="date"
            {...register('releaseDate')}
          />
          {errors.releaseDate && <p className="mt-1 text-sm text-red-500">{errors.releaseDate.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-nf-gray-200" htmlFor="rating">
            Avaliação (opcional, 0-10)
          </label>
          <Input
            id="rating"
            type="number"
            step="0.1"
            min="0"
            max="10"
            {...register('rating')}
            placeholder="Ex: 8.5"
          />
          {errors.rating && <p className="mt-1 text-sm text-red-500">{errors.rating.message}</p>}
        </div>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm font-medium text-nf-gray-200" htmlFor="description">
            Descrição
          </label>
          <span
            className={cn(
              'text-xs tabular-nums',
              descriptionValue.length > DESC_MAX ? 'text-red-500' : 'text-nf-gray-300'
            )}
          >
            {descriptionValue.length}/{DESC_MAX}
          </span>
        </div>
        <textarea
          id="description"
          {...register('description')}
          placeholder="Descreva o episodio em pelo menos 10 caracteres"
          rows={3}
          className="min-h-[80px] w-full resize-y rounded-md border border-nf-gray-400/55 bg-nf-surface px-3 py-2 text-base sm:text-sm text-white placeholder:text-nf-gray-200/75 focus:border-nf-red focus:outline-none focus:ring-1 focus:ring-nf-red disabled:cursor-not-allowed disabled:opacity-50"
        />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
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
