import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TvShowsPage } from '@/components/tvshows/tvshows-page';

const {
  toastSuccess,
  confettiMock,
  useTvShowsMock,
  useCreateTvShowMock,
  useUpdateTvShowMock,
  useDeleteTvShowMock,
  useWatchlistLookupMock,
} = vi.hoisted(() => ({
  toastSuccess: vi.fn(),
  confettiMock: vi.fn(),
  useTvShowsMock: vi.fn(),
  useCreateTvShowMock: vi.fn(),
  useUpdateTvShowMock: vi.fn(),
  useDeleteTvShowMock: vi.fn(),
  useWatchlistLookupMock: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: toastSuccess,
    error: vi.fn(),
  },
}));

vi.mock('canvas-confetti', () => ({
  default: confettiMock,
}));

vi.mock('@/lib/hooks/use-tvshows', () => ({
  useTvShows: useTvShowsMock,
  useCreateTvShow: useCreateTvShowMock,
  useUpdateTvShow: useUpdateTvShowMock,
  useDeleteTvShow: useDeleteTvShowMock,
}));

vi.mock('@/lib/hooks/use-watchlist', () => ({
  useWatchlistLookup: useWatchlistLookupMock,
}));

const mockShow = {
  '@key': 'tvShows:test-key',
  '@assetType': 'tvShows',
  '@lastUpdated': '2026-03-31T15:00:00Z',
  title: 'Breaking Bad',
  description: 'Um professor de quimica entra para o submundo do crime para sustentar a familia.',
  recommendedAge: 16,
};

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe('TvShowsPage', () => {
  const createMutate = vi.fn();
  const updateMutate = vi.fn();
  const deleteMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useWatchlistLookupMock.mockReturnValue({
      isInWatchlist: () => false,
      toggleShow: vi.fn(),
      isPending: false,
    });

    useTvShowsMock.mockReturnValue({
      data: { result: [mockShow] },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    useCreateTvShowMock.mockReturnValue({
      mutate: createMutate,
      isPending: false,
    });

    useUpdateTvShowMock.mockReturnValue({
      mutate: updateMutate,
      isPending: false,
    });

    useDeleteTvShowMock.mockReturnValue({
      mutate: deleteMutate,
      isPending: false,
    });
  });

  it('abre o modal de criacao pelo FAB', () => {
    renderWithProviders(<TvShowsPage />);

    fireEvent.click(screen.getByLabelText(/adicionar novo tv show/i));

    expect(screen.getByRole('heading', { name: /novo tv show/i })).toBeInTheDocument();
  });

  it('mostra toast e confetti ao criar show com sucesso', async () => {
    createMutate.mockImplementation((_payload, callbacks) => {
      callbacks?.onSuccess?.();
    });

    renderWithProviders(<TvShowsPage />);

    fireEvent.click(screen.getByLabelText(/adicionar novo tv show/i));
    fireEvent.change(screen.getByPlaceholderText(/breaking bad, stranger things/i), { target: { value: 'Dark' } });
    fireEvent.change(screen.getByPlaceholderText(/descreva o show/i), {
      target: { value: 'Serie sobre viagem no tempo em uma pequena cidade alema.' },
    });
    fireEvent.click(screen.getByRole('button', { name: '16+' }));
    fireEvent.click(screen.getByText(/^criar$/i));

    await waitFor(() => {
      expect(createMutate).toHaveBeenCalledWith(
        {
          title: 'Dark',
          description: 'Serie sobre viagem no tempo em uma pequena cidade alema.',
          recommendedAge: 16,
        },
        expect.objectContaining({
          onSuccess: expect.any(Function),
        }),
      );
    });

    expect(toastSuccess).toHaveBeenCalledWith('Show criado', {
      description: 'Dark',
    });
    expect(confettiMock).toHaveBeenCalledTimes(1);
  });

  it('mostra toast ao excluir sem disparar confetti', async () => {
    deleteMutate.mockImplementation((_title, callbacks) => {
      callbacks?.onSuccess?.();
    });

    renderWithProviders(<TvShowsPage />);

    fireEvent.click(screen.getAllByLabelText(/excluir show/i)[0]);
    fireEvent.click(screen.getByRole('button', { name: /^excluir$/i }));

    await waitFor(() => {
      expect(deleteMutate).toHaveBeenCalledWith(
        'Breaking Bad',
        expect.objectContaining({
          onSuccess: expect.any(Function),
        }),
      );
    });

    expect(toastSuccess).toHaveBeenCalledWith('Show excluído', {
      description: 'Breaking Bad',
    });
    expect(confettiMock).not.toHaveBeenCalled();
  });
});
