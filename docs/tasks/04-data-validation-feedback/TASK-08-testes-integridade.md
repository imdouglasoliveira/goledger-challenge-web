# TASK-08 — Testes de Integridade para Detectar Gaps

- Status: todo
- Prioridade: P1
- Plano: `docs/plans/05-data-validation-feedback.md`
- Depende de: T047

## Por que fazer

Sem testes automatizados, bugs silenciosos passam despercebidos: botoes sem handler (fantasmas), fluxos quebrados, imports mortos, props nao usadas, e regressoes de UI. Testes de integridade detectam esses gaps antes do usuario.

## O que fazer

Criar testes que validem:
1. **Componentes renderizam** sem crash
2. **Botoes tem handlers** (nenhum fantasma)
3. **Hooks retornam dados esperados**
4. **API responde corretamente** a cenarios de erro
5. **Fluxos CRUD** funcionam end-to-end

## Arquivos a criar

- `__tests__/components/tvshow-form.test.tsx`
- `__tests__/components/tvshow-thumbnail.test.tsx`
- `__tests__/components/tvshows-page.test.tsx`
- `__tests__/api/tvshows.test.ts`
- `__tests__/integrity/ghost-actions.test.ts`

## Setup necessario

### 1. Instalar dependencias de teste

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom
```

### 2. Configurar Vitest

Criar `vitest.config.ts` na raiz:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./__tests__/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
```

### 3. Setup file

Criar `__tests__/setup.ts`:

```typescript
import '@testing-library/jest-dom/vitest';
```

### 4. Script no package.json

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

## Testes por arquivo

### A. Ghost Actions Test (`ghost-actions.test.ts`)

**O que detecta:** botoes/links sem onClick, handlers que nao fazem nada, imports nao usados.

```typescript
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// Detecta botoes sem onClick handler
describe('Ghost Actions - Botoes sem handler', () => {
  const componentFiles = [
    'components/tvshows/tvshows-page.tsx',
    'components/tvshows/tvshow-thumbnail.tsx',
    'components/tvshows/tvshow-form.tsx',
    'components/layout/hero-banner.tsx',
    'components/layout/carousel-row.tsx',
  ];

  componentFiles.forEach(file => {
    it(`${file} — todo <button> tem onClick ou type="submit"`, () => {
      const content = fs.readFileSync(path.resolve(file), 'utf-8');
      const buttonMatches = content.match(/<button[\s\S]*?>/g) || [];

      buttonMatches.forEach((btn, i) => {
        const hasOnClick = btn.includes('onClick');
        const hasSubmitType = btn.includes('type="submit"');
        const hasAriaLabel = btn.includes('aria-label');
        expect(
          hasOnClick || hasSubmitType,
          `Botao #${i + 1} em ${file} nao tem onClick nem type="submit": ${btn.slice(0, 80)}...`
        ).toBe(true);
      });
    });
  });
});

// Detecta imports nao usados
describe('Ghost Imports - Imports nao usados', () => {
  const files = [
    'components/tvshows/tvshows-page.tsx',
    'components/tvshows/tvshow-form.tsx',
    'lib/hooks/use-tvshows.ts',
  ];

  files.forEach(file => {
    it(`${file} — todos os imports sao usados no corpo`, () => {
      const content = fs.readFileSync(path.resolve(file), 'utf-8');
      const importLines = content.match(/import\s+{([^}]+)}/g) || [];

      importLines.forEach(importLine => {
        const names = importLine
          .replace(/import\s+{/, '')
          .replace(/}/, '')
          .split(',')
          .map(n => n.trim().split(' as ').pop()!.trim())
          .filter(Boolean);

        const bodyStartIndex = content.indexOf(importLine) + importLine.length;
        const body = content.slice(bodyStartIndex);

        names.forEach(name => {
          expect(
            body.includes(name),
            `Import "${name}" em ${file} parece nao ser usado`
          ).toBe(true);
        });
      });
    });
  });
});
```

### B. Form Test (`tvshow-form.test.tsx`)

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TvShowForm } from '@/components/tvshows/tvshow-form';

describe('TvShowForm', () => {
  const mockSubmit = vi.fn();
  const mockCancel = vi.fn();

  it('renderiza todos os campos obrigatorios', () => {
    render(<TvShowForm onSubmit={mockSubmit} onCancel={mockCancel} />);
    expect(screen.getByLabelText(/titulo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descri/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/classifica/i)).toBeInTheDocument();
  });

  it('mostra erros ao submeter vazio', async () => {
    render(<TvShowForm onSubmit={mockSubmit} onCancel={mockCancel} />);
    fireEvent.click(screen.getByText(/create|criar/i));
    // Deve mostrar mensagens de validacao
    expect(await screen.findByText(/obrigat/i)).toBeInTheDocument();
  });

  it('desabilita titulo em modo edicao', () => {
    render(
      <TvShowForm
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        isEdit
        defaultValues={{ title: 'Test' }}
      />
    );
    expect(screen.getByLabelText(/titulo/i)).toBeDisabled();
  });

  it('botao cancelar chama onCancel', () => {
    render(<TvShowForm onSubmit={mockSubmit} onCancel={mockCancel} />);
    fireEvent.click(screen.getByText(/cancel/i));
    expect(mockCancel).toHaveBeenCalled();
  });
});
```

### C. API Test (`tvshows.test.ts`)

```typescript
import { describe, it, expect } from 'vitest';

const API_BASE = 'http://localhost:3001/api';

describe('TV Shows API — Validacao', () => {
  it('GET /tvshows retorna lista', async () => {
    const res = await fetch(`${API_BASE}/tvshows?limit=5`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.result).toBeDefined();
    expect(Array.isArray(data.result)).toBe(true);
  });

  it('POST /tvshows rejeita titulo vazio', async () => {
    const res = await fetch(`${API_BASE}/tvshows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '', description: 'Test desc long enough', recommendedAge: 12 }),
    });
    expect(res.status).toBe(400);
  });

  it('POST /tvshows rejeita descricao curta', async () => {
    const res = await fetch(`${API_BASE}/tvshows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test Unique Title', description: 'abc', recommendedAge: 12 }),
    });
    expect(res.status).toBe(400);
  });

  it('POST /tvshows rejeita idade > 18', async () => {
    const res = await fetch(`${API_BASE}/tvshows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test Age', description: 'Description long enough', recommendedAge: 25 }),
    });
    expect(res.status).toBe(400);
  });

  it('POST /tvshows rejeita titulo duplicado', async () => {
    // Primeiro, buscar um titulo existente
    const listRes = await fetch(`${API_BASE}/tvshows?limit=1`);
    const listData = await listRes.json();
    if (listData.result.length === 0) return;

    const existingTitle = listData.result[0].title;
    const res = await fetch(`${API_BASE}/tvshows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: existingTitle,
        description: 'Tentando duplicar um show existente',
        recommendedAge: 12,
      }),
    });
    expect(res.status).toBe(409);
  });
});
```

### D. Thumbnail Test (`tvshow-thumbnail.test.tsx`)

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TvShowThumbnail } from '@/components/tvshows/tvshow-thumbnail';

const mockShow = {
  '@key': 'test-key',
  '@assetType': 'tvShows',
  '@lastUpdated': '2026-01-01T00:00:00Z',
  title: 'Test Show',
  description: 'A test show description',
  recommendedAge: 14,
};

describe('TvShowThumbnail', () => {
  it('renderiza titulo do show', () => {
    render(
      <TvShowThumbnail show={mockShow} onEdit={vi.fn()} onDelete={vi.fn()} />
    );
    // Titulo aparece 2x: na imagem e no hover panel
    const titles = screen.getAllByText('Test Show');
    expect(titles.length).toBeGreaterThanOrEqual(1);
  });

  it('botao edit chama onEdit com o show', () => {
    const onEdit = vi.fn();
    render(
      <TvShowThumbnail show={mockShow} onEdit={onEdit} onDelete={vi.fn()} />
    );
    fireEvent.click(screen.getByLabelText('Edit show'));
    expect(onEdit).toHaveBeenCalledWith(mockShow);
  });

  it('botao delete chama onDelete com o show', () => {
    const onDelete = vi.fn();
    render(
      <TvShowThumbnail show={mockShow} onEdit={vi.fn()} onDelete={onDelete} />
    );
    fireEvent.click(screen.getByLabelText('Delete show'));
    expect(onDelete).toHaveBeenCalledWith(mockShow);
  });

  it('mostra badge de idade', () => {
    render(
      <TvShowThumbnail show={mockShow} onEdit={vi.fn()} onDelete={vi.fn()} />
    );
    expect(screen.getByText('14+')).toBeInTheDocument();
  });
});
```

## Como executar

```bash
# Rodar todos os testes
pnpm test

# Rodar em modo watch
pnpm test:watch

# Rodar apenas ghost actions
pnpm test -- ghost-actions

# Rodar apenas testes de API (requer backend rodando)
pnpm test -- api/tvshows
```

## Criterio de pronto

- [ ] Vitest configurado e rodando
- [ ] Ghost actions test: nenhum botao fantasma detectado
- [ ] Ghost imports test: nenhum import morto
- [ ] Form test: renderiza, valida, desabilita titulo em edit
- [ ] Thumbnail test: renderiza, botoes chamam handlers
- [ ] API test: rejeita dados invalidos e duplicatas
- [ ] `pnpm test` passa sem erros
