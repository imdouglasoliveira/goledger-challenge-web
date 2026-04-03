import Fastify, { type FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { tvShowsRoutes } from '@/src/routes/tvshows';
import {
  createAsset,
  deleteAsset,
  readAsset,
  search,
  updateAsset,
} from '@/src/clients/goledger.js';
import {
  fetchAndCacheImage,
  getShowImages,
  loadImageCache,
} from '@/src/services/image-cache.js';

vi.mock('@/src/clients/goledger.js', () => ({
  search: vi.fn(),
  readAsset: vi.fn(),
  createAsset: vi.fn(),
  updateAsset: vi.fn(),
  deleteAsset: vi.fn(),
}));

vi.mock('@/src/services/image-cache.js', () => ({
  loadImageCache: vi.fn(),
  getShowImages: vi.fn(),
  fetchAndCacheImage: vi.fn(),
}));

const sampleShow = {
  '@key': 'tvShows:test-key',
  '@assetType': 'tvShows',
  '@lastUpdated': '2026-03-31T00:00:00Z',
  title: 'Breaking Bad',
  description: 'Descricao longa o bastante para passar na validacao.',
  recommendedAge: 16,
};

describe('TV Shows API — Validacao', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    vi.clearAllMocks();
    app = Fastify();
    await app.register(tvShowsRoutes);
    vi.mocked(fetchAndCacheImage).mockResolvedValue(true);
    vi.mocked(getShowImages).mockReturnValue({
      posterUrl: 'https://image.tmdb.org/t/p/w500/poster.jpg',
      backdropUrl: 'https://image.tmdb.org/t/p/w1280/backdrop.jpg',
    });
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /tvshows retorna lista', async () => {
    vi.mocked(search).mockResolvedValue({
      metadata: { bookmark: '', fetched_records_count: 1 },
      result: [sampleShow],
    });

    const res = await app.inject({
      method: 'GET',
      url: '/tvshows?limit=5',
    });

    expect(res.statusCode).toBe(200);
    expect(loadImageCache).toHaveBeenCalledTimes(1);
    expect(res.json()).toEqual({
      metadata: { bookmark: '', fetched_records_count: 1 },
      result: [
        {
          ...sampleShow,
          posterUrl: 'https://image.tmdb.org/t/p/w500/poster.jpg',
          backdropUrl: 'https://image.tmdb.org/t/p/w1280/backdrop.jpg',
        },
      ],
    });
  });

  it('GET /tvshows faz lazy fetch quando o show nao esta no cache', async () => {
    vi.mocked(search).mockResolvedValue({
      metadata: { bookmark: '', fetched_records_count: 1 },
      result: [sampleShow],
    });
    vi.mocked(getShowImages).mockReturnValue(null);

    const res = await app.inject({
      method: 'GET',
      url: '/tvshows?limit=5',
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({
      metadata: { bookmark: '', fetched_records_count: 1 },
      result: [
        {
          ...sampleShow,
          posterUrl: null,
          backdropUrl: null,
        },
      ],
    });
    expect(fetchAndCacheImage).toHaveBeenCalledWith(sampleShow.title);
  });

  it('GET /tvshows/:key retorna show enriquecido', async () => {
    vi.mocked(readAsset).mockResolvedValue(sampleShow);

    const res = await app.inject({
      method: 'GET',
      url: `/tvshows/${encodeURIComponent(sampleShow['@key'])}`,
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({
      ...sampleShow,
      posterUrl: 'https://image.tmdb.org/t/p/w500/poster.jpg',
      backdropUrl: 'https://image.tmdb.org/t/p/w1280/backdrop.jpg',
    });
  });

  it('POST /tvshows rejeita titulo vazio', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/tvshows',
      payload: {
        title: '',
        description: 'Test desc long enough',
        recommendedAge: 12,
      },
    });

    expect(res.statusCode).toBe(400);
    expect(createAsset).not.toHaveBeenCalled();
  });

  it('POST /tvshows rejeita descricao curta', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/tvshows',
      payload: {
        title: 'Test Unique Title',
        description: 'abc',
        recommendedAge: 12,
      },
    });

    expect(res.statusCode).toBe(400);
    expect(createAsset).not.toHaveBeenCalled();
  });

  it('POST /tvshows rejeita idade > 18', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/tvshows',
      payload: {
        title: 'Test Age',
        description: 'Description long enough',
        recommendedAge: 25,
      },
    });

    expect(res.statusCode).toBe(400);
    expect(createAsset).not.toHaveBeenCalled();
  });

  it('POST /tvshows rejeita titulo duplicado', async () => {
    vi.mocked(search).mockResolvedValue({
      metadata: { bookmark: '', fetched_records_count: 1 },
      result: [sampleShow],
    });

    const res = await app.inject({
      method: 'POST',
      url: '/tvshows',
      payload: {
        title: sampleShow.title,
        description: 'Tentando duplicar um show existente',
        recommendedAge: 12,
      },
    });

    expect(res.statusCode).toBe(409);
    expect(res.json()).toEqual({
      error: `TV Show "${sampleShow.title}" já existe`,
      statusCode: 409,
    });
    expect(createAsset).not.toHaveBeenCalled();
  });

  it('POST /tvshows dispara auto-fetch da imagem apos criar', async () => {
    vi.mocked(search).mockResolvedValue({
      metadata: { bookmark: '', fetched_records_count: 0 },
      result: [],
    });
    vi.mocked(createAsset).mockResolvedValue(sampleShow);

    const payload = {
      title: 'Dark',
      description: 'Serie sobre viagem no tempo em uma pequena cidade alema.',
      recommendedAge: 16,
    };

    const res = await app.inject({
      method: 'POST',
      url: '/tvshows',
      payload,
    });

    expect(res.statusCode).toBe(200);
    expect(fetchAndCacheImage).toHaveBeenCalledWith(payload.title);
  });

  it('POST /tvshows rejeita titulo com apenas espacos', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/tvshows',
      payload: {
        title: '   ',
        description: 'Descricao longa o suficiente para passar no schema bruto.',
        recommendedAge: 12,
      },
    });

    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual({
      error: 'Titulo deve ter entre 2 e 200 caracteres',
      statusCode: 400,
    });
    expect(createAsset).not.toHaveBeenCalled();
  });

  it('PUT /tvshows rejeita idade > 18', async () => {
    const res = await app.inject({
      method: 'PUT',
      url: '/tvshows',
      payload: {
        title: sampleShow.title,
        recommendedAge: 21,
      },
    });

    expect(res.statusCode).toBe(400);
    expect(updateAsset).not.toHaveBeenCalled();
  });

  it('DELETE /tvshows encaminha o titulo correto', async () => {
    vi.mocked(deleteAsset).mockResolvedValue(sampleShow);

    const res = await app.inject({
      method: 'DELETE',
      url: '/tvshows',
      payload: { title: sampleShow.title },
    });

    expect(res.statusCode).toBe(200);
    expect(deleteAsset).toHaveBeenCalledWith({
      '@assetType': 'tvShows',
      title: sampleShow.title,
    });
  });
});
