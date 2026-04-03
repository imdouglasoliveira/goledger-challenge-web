# 05 - TMDB Image Enrichment — Indice de Tasks

- Plano: `docs/plans/06-tmdb-image-enrichment.md`
- Publico: dev junior
- Total: 8 tasks

## Tasks

| # | ID | Arquivo | Titulo | Status |
|---|-----|---------|--------|--------|
| 1 | T051 | `TASK-01-script-enrich-images.md` | Script de enriquecimento TMDB | done |
| 2 | T052 | `TASK-02-executar-e-revisar.md` | Executar script e revisar matches | done |
| 3 | T053 | `TASK-03-image-cache-service.md` | Servico de cache com auto-fetch | done |
| 4 | T054 | `TASK-04-backend-merge-layer.md` | Merge layer nas rotas + trigger POST | done |
| 5 | T055 | `TASK-05-frontend-interface-update.md` | Atualizar interface TvShow | done |
| 6 | T056 | `TASK-06-thumbnail-com-imagens.md` | Thumbnail com poster real | done |
| 7 | T057 | `TASK-07-hero-banner-com-imagens.md` | Hero banner com backdrop real | done |
| 8 | T058 | `TASK-08-validacao-final.md` | Checklist de validacao E2E | done |

## Ordem obrigatoria

```
T051 -> T052 -> T053 -> T054 -> T055 -> T056 -+-> T058
                                       T057 -+
```

## Resumo por fase

- **Fase 1 (T051-T052):** Seed inicial — criar script TMDB, executar, revisar matches
- **Fase 2 (T053-T054):** Backend — servico de cache com auto-fetch + merge layer nas rotas
- **Fase 3 (T055-T057):** Frontend — interface, thumbnails com poster, hero com backdrop
- **Fase 4 (T058):** Qualidade — validacao E2E de tudo incluindo auto-enriquecimento
