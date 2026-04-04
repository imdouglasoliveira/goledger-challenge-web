import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EpisodeForm } from '@/components/episodes/episode-form';

import type { Season } from '@/lib/api';

const seasons: Season[] = [
  {
    '@key': 'seasons:dark:1',
    '@assetType': 'seasons',
    '@lastUpdated': '2026-03-31T15:00:00Z',
    number: 1,
    tvShow: { '@assetType': 'tvShows', title: 'Dark' },
    year: 2017,
  },
];

describe('EpisodeForm', () => {
  it('normaliza releaseDate para date-time ISO antes de submeter', async () => {
    const onSubmit = vi.fn();

    render(
      <EpisodeForm
        seasons={seasons}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText(/tv show/i), { target: { value: 'Dark' } });
    fireEvent.change(screen.getByLabelText(/temporada/i), { target: { value: 'Dark|1' } });
    fireEvent.change(screen.getByLabelText(/n.mero do epis.dio/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/t.tulo/i), { target: { value: 'Pilot' } });
    fireEvent.change(screen.getByLabelText(/data de lan.amento/i), { target: { value: '2017-12-01' } });
    fireEvent.change(screen.getByLabelText(/descri..o/i), { target: { value: 'Descricao suficientemente longa.' } });
    fireEvent.click(screen.getByRole('button', { name: /criar/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        season: {
          '@assetType': 'seasons',
          number: 1,
          tvShow: { '@assetType': 'tvShows', title: 'Dark' },
        },
        episodeNumber: 1,
        title: 'Pilot',
        releaseDate: '2017-12-01T00:00:00.000Z',
        description: 'Descricao suficientemente longa.',
        rating: undefined,
      });
    });
  });

  it('mantem a chave do episodio bloqueada na edicao', async () => {
    const onSubmit = vi.fn();

    render(
      <EpisodeForm
        seasons={seasons}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
        isEdit
        defaultValues={{
          '@key': 'episodes:dark:1:2',
          '@assetType': 'episodes',
          '@lastUpdated': '2026-03-31T15:00:00Z',
          season: { '@assetType': 'seasons', number: 1, tvShow: { '@assetType': 'tvShows', title: 'Dark' } },
          episodeNumber: 2,
          title: 'Episode 2',
          releaseDate: '2017-12-08T00:00:00.000Z',
          description: 'Descricao suficientemente longa.',
          rating: 8.5,
        }}
      />,
    );

    expect(screen.getByText((content) => content.includes('fazem parte da chave'))).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/t.tulo/i), { target: { value: 'Episode 2 - editado' } });
    fireEvent.click(screen.getByRole('button', { name: /atualizar/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          episodeNumber: 2,
          title: 'Episode 2 - editado',
        }),
      );
    });
  });
});
