import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Header } from '@/components/layout/header';

vi.mock('next/navigation', () => ({
  usePathname: () => '/seasons',
}));

describe('Header', () => {
  it('abre a navegacao mobile com os links das entidades', () => {
    render(<Header />);

    fireEvent.click(screen.getByLabelText(/abrir navegac/i));

    expect(screen.getAllByRole('link', { name: 'Temporadas' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'Watchlist' }).length).toBeGreaterThan(0);
  });
});
