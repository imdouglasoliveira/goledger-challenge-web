'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { TvShow } from '@/lib/api';

interface SeasonFormValues {
  number: string;
  tvShowTitle: string;
  year: string;
}

interface SeasonFormProps {
  defaultValues?: Partial<{
    number: number;
    tvShow: { '@assetType': 'tvShows'; title: string };
    year?: number;
  }>;
  shows: TvShow[];
  onSubmit: (data: { number: number; tvShow: { '@assetType': 'tvShows'; title: string }; year: number } | { number: number; tvShow: { '@assetType': 'tvShows'; title: string }; year?: number }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export function SeasonForm({ defaultValues, shows, onSubmit, onCancel, isLoading, isEdit }: SeasonFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SeasonFormValues>({
    defaultValues: {
      number: defaultValues?.number?.toString() ?? '',
      tvShowTitle: defaultValues?.tvShow?.title ?? '',
      year: defaultValues?.year?.toString() ?? '',
    },
  });

  const submitHandler = handleSubmit((data) => {
    onSubmit({
      number: parseInt(data.number, 10),
      tvShow: { '@assetType': 'tvShows', title: data.tvShowTitle.trim() },
      year: data.year ? parseInt(data.year, 10) : undefined,
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
            <select
              id="tvShowTitle"
              value={defaultValues?.tvShow?.title ?? ''}
              disabled
              className={cn(
                'w-full rounded-md border border-nf-gray-400 bg-nf-surface px-3 py-2 text-sm text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white',
                'cursor-not-allowed opacity-70'
              )}
            >
              <option value={defaultValues?.tvShow?.title ?? ''}>{defaultValues?.tvShow?.title ?? 'Selecione...'}</option>
            </select>
          </>
        ) : (
          <select
            id="tvShowTitle"
            {...register('tvShowTitle', { required: 'Selecione um TV Show' })}
            className="w-full rounded-md border border-nf-gray-400 bg-nf-surface px-3 py-2 text-sm text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
          >
            <option value="">Selecione...</option>
            {shows.map((show) => (
              <option key={show.title} value={show.title}>
                {show.title}
              </option>
            ))}
          </select>
        )}
        {errors.tvShowTitle && <p className="mt-1 text-sm text-red-500">{errors.tvShowTitle.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-nf-gray-200" htmlFor="number">
          Número da Temporada
        </label>
        {isEdit ? (
          <>
            <input type="hidden" {...register('number', {
              required: 'Número é obrigatório',
              setValueAs: (v) => v.toString(),
              min: { value: 1, message: 'Número deve ser maior que 0' },
            })} />
            <Input
              id="number"
              type="number"
              value={defaultValues?.number?.toString() ?? ''}
              disabled
              readOnly
            />
          </>
        ) : (
          <Input
            id="number"
            type="number"
            min="1"
            {...register('number', {
              required: 'Número é obrigatório',
              setValueAs: (v) => v.toString(),
              min: { value: 1, message: 'Número deve ser maior que 0' },
            })}
            placeholder="Ex: 1, 2, 3"
          />
        )}
        {errors.number && <p className="mt-1 text-sm text-red-500">{errors.number.message}</p>}
        {isEdit && (
          <p className="mt-1 text-xs text-nf-gray-300">
            O número da temporada faz parte da chave do registro e não pode ser alterado.
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-nf-gray-200" htmlFor="year">
          Ano {isEdit ? '(opcional)' : ''}
        </label>
        <Input
          id="year"
          type="number"
          {...register('year', {
            required: isEdit ? false : 'Ano é obrigatório',
            setValueAs: (v) => (v ? v.toString() : ''),
            min: { value: 1900, message: 'Ano deve ser maior que 1900' },
            max: { value: 2100, message: 'Ano deve ser menor que 2100' },
          })}
          placeholder="Ex: 2024"
        />
        {errors.year && <p className="mt-1 text-sm text-red-500">{errors.year.message}</p>}
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
