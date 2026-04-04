import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { WatchlistForm } from '@/components/watchlist/watchlist-form';
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
  {
    '@key': 'tvShows:bb',
    '@assetType': 'tvShows',
    '@lastUpdated': '2026-03-31T15:00:00Z',
    title: 'Breaking Bad',
    description: 'Descricao',
    recommendedAge: 16,
  },
];

describe('WatchlistForm', () => {
  it('mantem o titulo bloqueado na edicao e preserva a chave enviada ao backend', async () => {
    const onSubmit = vi.fn();

    render(
      <WatchlistForm
        shows={shows}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
        isEdit
        defaultValues={{
          '@key': 'watchlist:minha-lista',
          '@assetType': 'watchlist',
          '@lastUpdated': '2026-03-31T15:00:00Z',
          title: 'Minha Lista',
          description: 'Lista inicial',
          tvShows: [{ '@assetType': 'tvShows', title: 'Dark' }],
        }}
      />,
    );

    expect(screen.getByText((content) => content.includes('não pode ser alterado'))).toBeInTheDocument();

    fireEvent.click(screen.getByText('Breaking Bad'));
    fireEvent.click(screen.getByRole('button', { name: /atualizar/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Minha Lista',
        description: 'Lista inicial',
        tvShows: [
          { '@assetType': 'tvShows', title: 'Dark' },
          { '@assetType': 'tvShows', title: 'Breaking Bad' },
        ],
      });
    });
  });
});
