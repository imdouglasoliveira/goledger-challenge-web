import type { ComponentProps } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HeroBanner } from '@/components/layout/hero-banner';

vi.mock('next/image', () => ({
  default: ({ alt = '', ...props }: ComponentProps<'img'>) => <img alt={alt} {...props} />,
}));

const mockShow = {
  '@key': 'tvShows:test-key',
  '@assetType': 'tvShows',
  '@lastUpdated': '2026-03-31T15:00:00Z',
  title: 'Breaking Bad',
  description: 'Um professor de quimica entra para o submundo do crime para sustentar a familia.',
  recommendedAge: 16,
};

describe('HeroBanner', () => {
  it('renderiza backdrop real quando backdropUrl existe', () => {
    render(
      <HeroBanner
        show={{ ...mockShow, backdropUrl: 'https://image.tmdb.org/t/p/w1280/backdrop.jpg' }}
        onEdit={vi.fn()}
        onMoreInfo={vi.fn()}
      />,
    );

    const image = document.querySelector('img');
    expect(image).not.toBeNull();
    expect(image).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w1280/backdrop.jpg');
  });

  it('mantem fallback com watermark quando backdropUrl nao existe', () => {
    render(<HeroBanner show={mockShow} onEdit={vi.fn()} onMoreInfo={vi.fn()} />);

    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('aciona onEdit ao clicar no botao editar', () => {
    const onEdit = vi.fn();
    render(<HeroBanner show={mockShow} onEdit={onEdit} onMoreInfo={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /editar/i }));

    expect(onEdit).toHaveBeenCalledWith(mockShow);
  });
});
