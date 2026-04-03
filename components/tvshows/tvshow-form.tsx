'use client';

import { Controller, useForm } from 'react-hook-form';
import { Lock } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const AGE_OPTIONS = [
  { value: 0, label: 'L', active: 'bg-green-600 border-green-500 text-white' },
  { value: 10, label: '10+', active: 'bg-blue-600 border-blue-500 text-white' },
  { value: 12, label: '12+', active: 'bg-yellow-600 border-yellow-500 text-white' },
  { value: 14, label: '14+', active: 'bg-orange-600 border-orange-500 text-white' },
  { value: 16, label: '16+', active: 'bg-red-600 border-red-500 text-white' },
  { value: 18, label: '18+', active: 'bg-black border-white text-white' },
] as const;

interface TvShowFormValues {
  title: string;
  description: string;
  recommendedAge?: number;
}

interface TvShowFormData {
  title: string;
  description: string;
  recommendedAge: number;
}

interface TvShowFormProps {
  defaultValues?: Partial<TvShowFormData & { posterUrl?: string | null; backdropUrl?: string | null }>;
  onSubmit: (data: TvShowFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

const DESC_MAX = 2000;

export function TvShowForm({ defaultValues, onSubmit, onCancel, isLoading, isEdit }: TvShowFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<TvShowFormValues>({
    defaultValues: {
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      recommendedAge: defaultValues?.recommendedAge,
    },
  });

  const descriptionValue = watch('description') ?? '';
  const imageUrl = defaultValues?.backdropUrl || defaultValues?.posterUrl;
  const isPosterOnly = !defaultValues?.backdropUrl && !!defaultValues?.posterUrl;

  const submitHandler = handleSubmit((data) => {
    onSubmit({
      title: data.title.trim(),
      description: data.description.trim(),
      recommendedAge: Number(data.recommendedAge),
    });
  });

  const hasHeroImage = isEdit && imageUrl;

  return (
    <form onSubmit={submitHandler} className="space-y-5">
      {hasHeroImage && (
        <div className="-mx-6 -mt-6 mb-1">
          <div className="relative h-64 w-full overflow-hidden">
            <Image
              src={imageUrl}
              alt={defaultValues?.title ?? ''}
              fill
              className={cn('object-cover', isPosterOnly && 'object-top')}
              sizes="(max-width: 768px) 100vw, 500px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-nf-card from-5% via-nf-card/60 via-40% to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-4">
              <h3
                className="text-xl font-bold text-white leading-tight"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}
              >
                {defaultValues?.title}
              </h3>
            </div>
            <input type="hidden" {...register('title')} />
          </div>
        </div>
      )}

      {isEdit && !imageUrl && (
        <div>
          <label className="mb-1 block text-sm font-medium text-nf-gray-200" htmlFor="title">
            Titulo
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-nf-gray-300" />
            <Input
              id="title"
              aria-label="titulo"
              disabled
              readOnly
              className="pl-9"
              {...register('title')}
            />
          </div>
          <p className="mt-1 text-xs text-nf-gray-300">O título é a chave do registro e não pode ser alterado.</p>
        </div>
      )}

      {!isEdit && (
        <div>
          <label className="mb-1 block text-sm font-medium text-nf-gray-200" htmlFor="title">
            Título
          </label>
          <Input
            id="title"
            aria-label="titulo título"
            {...register('title', {
              required: 'Título é obrigatório',
              setValueAs: (value) => (typeof value === 'string' ? value.trim() : value),
              validate: (value) => {
                if (typeof value !== 'string' || value.length < 2) {
                  return 'Título deve ter no mínimo 2 caracteres';
                }
                if (value.length > 200) {
                  return 'Título deve ter no máximo 200 caracteres';
                }
                return true;
              },
            })}
            placeholder="Ex: Breaking Bad, Stranger Things"
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
        </div>
      )}

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
          aria-label="descricao descrição"
          {...register('description', {
            required: 'Descrição é obrigatória',
            setValueAs: (value) => (typeof value === 'string' ? value.trim() : value),
            validate: (value) => {
              if (typeof value !== 'string' || value.length < 10) {
                return 'Descrição deve ter no mínimo 10 caracteres';
              }
              if (value.length > DESC_MAX) {
                return `Descrição deve ter no máximo ${DESC_MAX} caracteres`;
              }
              return true;
            },
          })}
          placeholder="Descreva o show em pelo menos 10 caracteres"
          rows={3}
          className="min-h-[80px] w-full resize-y rounded-md border border-nf-gray-400 bg-nf-surface px-3 py-2 text-sm text-white placeholder:text-nf-gray-300 focus:border-white focus:outline-none focus:ring-1 focus:ring-white disabled:cursor-not-allowed disabled:opacity-50"
        />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-nf-gray-200">
          Classificação Indicativa
        </legend>
        <Controller
          name="recommendedAge"
          control={control}
          rules={{ required: 'Selecione uma classificação' }}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {AGE_OPTIONS.map((opt) => {
                const selected = field.value === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => field.onChange(opt.value)}
                    aria-pressed={selected}
                    className={cn(
                      'flex h-10 min-w-[3rem] items-center justify-center rounded-md border-2 px-3 text-sm font-bold transition-all duration-150 cursor-pointer',
                      selected
                        ? `${opt.active} scale-110`
                        : 'bg-transparent border-nf-gray-500 text-nf-gray-300 hover:border-nf-gray-300 hover:text-white'
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          )}
        />
        {errors.recommendedAge && <p className="mt-1.5 text-sm text-red-500">{errors.recommendedAge.message}</p>}
      </fieldset>

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
