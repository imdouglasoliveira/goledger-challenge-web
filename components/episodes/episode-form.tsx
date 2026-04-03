'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Episode, Season } from '@/lib/api';

interface EpisodeFormValues {
  tvShowTitle: string;
  seasonKey: string;
  episodeNumber: string;
  title: string;
  releaseDate: string;
  description: string;
  rating: string;
}

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
    defaultValues: {
      tvShowTitle: defaultValues?.season?.tvShow.title ?? '',
      seasonKey: defaultValues?.season ? `${defaultValues.season.tvShow.title}|${defaultValues.season.number}` : '',
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
    () => [...new Set(selectableSeasons.map((season) => season.tvShow.title))].sort((a, b) => a.localeCompare(b)),
    [selectableSeasons]
  );

  const availableSeasons = useMemo(() => {
    const filtered = selectedShow
      ? selectableSeasons.filter((season) => season.tvShow.title === selectedShow)
      : selectableSeasons;

    return filtered.sort((a, b) => {
      const byTitle = a.tvShow.title.localeCompare(b.tvShow.title);
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
            <input type="hidden" {...register('tvShowTitle', { required: 'Selecione um TV Show' })} />
            <Input id="tvShowTitle" value={defaultValues?.season?.tvShow.title ?? ''} disabled readOnly />
          </>
        ) : (
          <select
            id="tvShowTitle"
            {...register('tvShowTitle', {
              onChange: () => setValue('seasonKey', ''),
            })}
            className="w-full rounded-md border border-nf-gray-400 bg-nf-surface px-3 py-2 text-sm text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
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
            <input type="hidden" {...register('seasonKey', { required: 'Selecione uma temporada' })} />
            <Input id="seasonKey" value={`${defaultValues?.season?.tvShow.title} - Temporada ${defaultValues?.season?.number ?? ''}`} disabled readOnly />
          </>
        ) : (
          <select
            id="seasonKey"
            {...register('seasonKey', { required: 'Selecione uma temporada' })}
            className={cn(
              'w-full rounded-md border border-nf-gray-400 bg-nf-surface px-3 py-2 text-sm text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white'
            )}
          >
            <option value="">Selecione...</option>
            {availableSeasons.map((season) => {
              const seasonKey = `${season.tvShow.title}|${season.number}`;
              return (
                <option key={seasonKey} value={seasonKey}>
                  {season.tvShow.title} - Temporada {season.number}
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
            <input type="hidden" {...register('episodeNumber', {
              required: 'Número é obrigatório',
              setValueAs: (value) => value.toString(),
              min: { value: 1, message: 'Número deve ser maior que 0' },
            })} />
            <Input id="episodeNumber" value={defaultValues?.episodeNumber?.toString() ?? ''} disabled readOnly />
          </>
        ) : (
          <Input
            id="episodeNumber"
            type="number"
            min="1"
            {...register('episodeNumber', {
              required: 'Número é obrigatório',
              setValueAs: (value) => value.toString(),
              min: { value: 1, message: 'Número deve ser maior que 0' },
            })}
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
          {...register('title', {
            required: 'Título é obrigatório',
            setValueAs: (value) => (typeof value === 'string' ? value.trim() : value),
            minLength: { value: 2, message: 'Título deve ter no mínimo 2 caracteres' },
            maxLength: { value: 200, message: 'Título deve ter no máximo 200 caracteres' },
          })}
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
            {...register('releaseDate', {
              required: 'Data é obrigatória',
            })}
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
            {...register('rating', {
              setValueAs: (value) => (value ? value.toString() : ''),
              min: { value: 0, message: 'Avaliação deve ser maior ou igual a 0' },
              max: { value: 10, message: 'Avaliação deve ser menor ou igual a 10' },
            })}
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
          {...register('description', {
            required: 'Descrição é obrigatória',
            setValueAs: (value) => (typeof value === 'string' ? value.trim() : value),
            minLength: { value: 10, message: 'Descrição deve ter no mínimo 10 caracteres' },
            maxLength: { value: DESC_MAX, message: `Descrição deve ter no máximo ${DESC_MAX} caracteres` },
          })}
          placeholder="Descreva o episodio em pelo menos 10 caracteres"
          rows={3}
          className="min-h-[80px] w-full resize-y rounded-md border border-nf-gray-400 bg-nf-surface px-3 py-2 text-base sm:text-sm text-white placeholder:text-nf-gray-300 focus:border-white focus:outline-none focus:ring-1 focus:ring-white disabled:cursor-not-allowed disabled:opacity-50"
        />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
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
