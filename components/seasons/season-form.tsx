'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { TvShow } from '@/lib/api';

const baseSeasonSchema = z.object({
  number: z
    .string()
    .min(1, 'Número é obrigatório')
    .refine((v) => parseInt(v, 10) >= 1, 'Número deve ser maior que 0'),
  tvShowTitle: z
    .string()
    .min(1, 'Selecione um TV Show'),
  year: z
    .string()
    .refine(
      (v) => !v || (parseInt(v, 10) >= 1900 && parseInt(v, 10) <= 2100),
      'Ano deve estar entre 1900 e 2100'
    ),
});

const createSeasonSchema = baseSeasonSchema.refine(
  (data) => data.year.length > 0,
  { message: 'Ano é obrigatório', path: ['year'] }
);

type SeasonFormValues = z.infer<typeof baseSeasonSchema>;

interface SeasonFormProps {
  defaultValues?: Partial<{
    number: number;
    tvShow: { '@assetType': 'tvShows'; title?: string };
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
    resolver: zodResolver(isEdit ? baseSeasonSchema : createSeasonSchema),
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
            <input type="hidden" {...register('tvShowTitle')} />
            <select
              id="tvShowTitle"
              value={defaultValues?.tvShow?.title ?? ''}
              disabled
              className={cn(
                'w-full rounded-md border border-nf-gray-400/55 bg-nf-surface px-3 py-2 text-sm text-white focus:border-nf-red focus:outline-none focus:ring-1 focus:ring-nf-red',
                'cursor-not-allowed opacity-70'
              )}
            >
              <option value={defaultValues?.tvShow?.title ?? ''}>{defaultValues?.tvShow?.title ?? 'Selecione...'}</option>
            </select>
          </>
        ) : (
          <select
            id="tvShowTitle"
            {...register('tvShowTitle')}
            className="w-full rounded-md border border-nf-gray-400/55 bg-nf-surface px-3 py-2 text-sm text-white focus:border-nf-red focus:outline-none focus:ring-1 focus:ring-nf-red"
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
            <input type="hidden" {...register('number')} />
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
            {...register('number')}
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
          {...register('year')}
          placeholder="Ex: 2024"
        />
        {errors.year && <p className="mt-1 text-sm text-red-500">{errors.year.message}</p>}
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
