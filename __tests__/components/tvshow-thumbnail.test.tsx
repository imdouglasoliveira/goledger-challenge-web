import type { ComponentProps } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TvShowThumbnail } from '@/components/tvshows/tvshow-thumbnail';

vi.mock('next/image', () => ({
  default: ({ alt = '', ...props }: ComponentProps<'img'>) => <img alt={alt} {...props} />,
}));

const mockShow = {
  '@key': 'test-key',
  '@assetType': 'tvShows',
  '@lastUpdated': '2026-01-01T00:00:00Z',
  title: 'Test Show',
  description: 'A test show description',
  recommendedAge: 14,
};

const mockShowWithPoster = {
  ...mockShow,
  posterUrl: 'https://image.tmdb.org/t/p/w500/poster.jpg',
};

describe('TvShowThumbnail', () => {
  it('renderiza titulo do show', () => {
    render(
      <TvShowThumbnail show={mockShow} onEdit={vi.fn()} onDelete={vi.fn()} onMoreInfo={vi.fn()} />
    );
    const titles = screen.getAllByText('Test Show');
    expect(titles.length).toBeGreaterThanOrEqual(1);
  });

  it('botao edit chama onEdit com o show', () => {
    const onEdit = vi.fn();
    render(
      <TvShowThumbnail show={mockShow} onEdit={onEdit} onDelete={vi.fn()} onMoreInfo={vi.fn()} />
    );
    fireEvent.click(screen.getByLabelText('Editar show'));
    expect(onEdit).toHaveBeenCalledWith(mockShow);
  });

  it('botao delete chama onDelete com o show', () => {
    const onDelete = vi.fn();
    render(
      <TvShowThumbnail show={mockShow} onEdit={vi.fn()} onDelete={onDelete} onMoreInfo={vi.fn()} />
    );
    fireEvent.click(screen.getByLabelText('Excluir show'));
    expect(onDelete).toHaveBeenCalledWith(mockShow);
  });

  it('mostra badge de idade', () => {
    render(
      <TvShowThumbnail show={mockShow} onEdit={vi.fn()} onDelete={vi.fn()} onMoreInfo={vi.fn()} />
    );
    expect(screen.getByText('14+')).toBeInTheDocument();
  });

  it('renderiza poster real quando posterUrl existe', () => {
    render(
      <TvShowThumbnail show={mockShowWithPoster} onEdit={vi.fn()} onDelete={vi.fn()} onMoreInfo={vi.fn()} />
    );

    expect(screen.getByAltText('Test Show')).toHaveAttribute('src', mockShowWithPoster.posterUrl);
  });

  it('mantem watermark quando posterUrl nao existe', () => {
    render(
      <TvShowThumbnail show={mockShow} onEdit={vi.fn()} onDelete={vi.fn()} onMoreInfo={vi.fn()} />
    );

    expect(screen.getByText('T')).toBeInTheDocument();
  });
});
