import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TvShowForm } from '@/components/tvshows/tvshow-form';

describe('TvShowForm', () => {
  const mockSubmit = vi.fn();
  const mockCancel = vi.fn();

  function renderForm() {
    mockSubmit.mockClear();
    mockCancel.mockClear();

    render(<TvShowForm onSubmit={mockSubmit} onCancel={mockCancel} />);
  }

  it('renderiza todos os campos obrigatorios', () => {
    renderForm();

    expect(screen.getByPlaceholderText(/breaking bad, stranger things/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/descreva o show/i)).toBeInTheDocument();
    expect(screen.getByText(/classifica..o indicativa/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/descreva o show/i).tagName).toBe('TEXTAREA');
  });

  it('mostra erros ao submeter vazio', async () => {
    renderForm();

    fireEvent.click(screen.getByText(/criar/i));

    expect(await screen.findByText(/título é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/descrição é obrigatória/i)).toBeInTheDocument();
    expect(screen.getByText(/selecione uma classificação/i)).toBeInTheDocument();
  });

  it('desabilita titulo em modo edicao', () => {
    render(
      <TvShowForm
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        isEdit
        defaultValues={{ title: 'Test' }}
      />,
    );

    expect(screen.getByDisplayValue('Test')).toBeDisabled();
    expect(screen.getByDisplayValue('Test')).toHaveValue('Test');
    expect(screen.getByText((content) => content.includes('chave do registro') && content.includes('não pode ser alterado'))).toBeInTheDocument();
  });

  it('valida titulo curto, descricao curta e idade acima do limite', async () => {
    renderForm();

    fireEvent.change(screen.getByPlaceholderText(/breaking bad, stranger things/i), {
      target: { value: 'A' },
    });
    fireEvent.change(screen.getByPlaceholderText(/descreva o show/i), {
      target: { value: 'abc' },
    });

    fireEvent.click(screen.getByText(/criar/i));

    expect(await screen.findByText('Título deve ter no mínimo 2 caracteres')).toBeInTheDocument();
    expect(screen.getByText('Descrição deve ter no mínimo 10 caracteres')).toBeInTheDocument();
    expect(screen.getByText('Selecione uma classificação')).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('botao cancelar chama onCancel', () => {
    renderForm();

    fireEvent.click(screen.getByText(/cancel/i));

    expect(mockCancel).toHaveBeenCalled();
  });

  it('submete quando os dados sao validos', async () => {
    renderForm();

    fireEvent.change(screen.getByPlaceholderText(/breaking bad, stranger things/i), {
      target: { value: 'Breaking Bad' },
    });
    fireEvent.change(screen.getByPlaceholderText(/descreva o show/i), {
      target: { value: 'Descricao suficientemente longa para passar na validacao.' },
    });
    fireEvent.click(screen.getByRole('button', { name: '16+' }));

    fireEvent.click(screen.getByText(/criar/i));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        title: 'Breaking Bad',
        description: 'Descricao suficientemente longa para passar na validacao.',
        recommendedAge: 16,
      });
    });
  });

  it('normaliza titulo e descricao antes de submeter', async () => {
    renderForm();

    fireEvent.change(screen.getByPlaceholderText(/breaking bad, stranger things/i), {
      target: { value: '  Dark  ' },
    });
    fireEvent.change(screen.getByPlaceholderText(/descreva o show/i), {
      target: { value: '  Serie sobre viagem no tempo em uma pequena cidade alema.  ' },
    });
    fireEvent.click(screen.getByRole('button', { name: '16+' }));

    fireEvent.click(screen.getByText(/criar/i));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        title: 'Dark',
        description: 'Serie sobre viagem no tempo em uma pequena cidade alema.',
        recommendedAge: 16,
      });
    });
  });
});
