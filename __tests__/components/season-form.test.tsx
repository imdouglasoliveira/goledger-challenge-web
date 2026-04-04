import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SeasonForm } from '@/components/seasons/season-form';
import type { TvShow } from '@/lib/api';

const shows: TvShow[] = [
  {
    '@key': 'tvShows:dark',
    '@assetType': 'tvShows',
    '@lastUpdated': '2026-03-31T15:00:00Z',
    title: 'Dark',
    description: 'Descricao',
    recommendedAge: 16,
  },
];

describe('SeasonForm', () => {
  it('exige ano na criacao para respeitar o contrato do backend', async () => {
    const onSubmit = vi.fn();

    render(
      <SeasonForm
        shows={shows}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText(/tv show/i), { target: { value: 'Dark' } });
    fireEvent.change(screen.getByLabelText(/n.mero da temporada/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /criar/i }));

    expect(await screen.findByText(/ano . obrigat.rio/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('mantem o numero bloqueado em modo de edicao', async () => {
    const onSubmit = vi.fn();

    render(
      <SeasonForm
        shows={shows}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
        isEdit
        defaultValues={{
          number: 2,
          tvShow: { '@assetType': 'tvShows', title: 'Dark' },
          year: 2019,
        }}
      />,
    );

    expect(screen.getByText(/faz parte da chave do registro/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/^ano/i), { target: { value: '2020' } });
    fireEvent.click(screen.getByRole('button', { name: /atualizar/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        number: 2,
        tvShow: { '@assetType': 'tvShows', title: 'Dark' },
        year: 2020,
      });
    });
  });
});
