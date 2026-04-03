# TASK-02 — Executar Script e Revisar Matches

- Status: done
- Prioridade: P1
- Plano: `docs/plans/06-tmdb-image-enrichment.md`
- Depende de: T051

## Por que fazer

O script da T051 gera o `data/images.json` automaticamente, mas a revisao humana e necessaria para o seed inicial. Imagens erradas prejudicam a experiencia — um poster de "Dark Shadows" no lugar de "Dark" seria pior que um gradiente. A revisao so e necessaria neste momento — shows novos criados pela UI serao enriquecidos automaticamente (T053).

## O que fazer

1. Obter TMDB API key
2. Executar o script de enriquecimento
3. Revisar cada match na tabela do console
4. Corrigir manualmente se necessario
5. Commitar `data/images.json`

## Pre-requisitos

- Backend rodando (`pnpm dev:api`)
- TMDB API key obtida em https://www.themoviedb.org/settings/api
- Script T051 criado (`scripts/enrich-images.ts`)

## Passo a passo

### 1. Obter TMDB API key

1. Criar conta em https://www.themoviedb.org/signup
2. Ir em https://www.themoviedb.org/settings/api
3. Solicitar API key (tipo: Developer, uso pessoal)
4. Copiar o **Access Token (v4 auth)** — nao a API Key v3

### 2. Executar o script

```bash
# Garantir backend rodando
pnpm dev:api

# Executar
TMDB_ACCESS_TOKEN=eyJhbGciOiJIUz... npx tsx scripts/enrich-images.ts
```

### 3. Revisar tabela do console

O script imprime uma tabela como:

```
| # | Titulo Local | Nome TMDB | Confidence | Poster | Backdrop |
|---|-------------|-----------|------------|--------|----------|
| 1 | Breaking Bad | Breaking Bad | 1.00 | SIM | SIM |
| 2 | Dark | Dark | 1.00 | SIM | SIM |
| 3 | The Office | The Office | 1.00 | SIM | SIM |
```

**O que verificar:**
- Todo show com confidence 1.0 e seguro — titulo exato
- Shows com confidence < 1.0 e >= 0.6: **abrir o JSON e conferir o `tmdbName`**
- Shows com confidence < 0.6: rejeitados automaticamente (sem imagem)

### 4. Verificar visualmente (opcional mas recomendado)

Para shows com confidence < 1.0, abrir a URL do poster no browser:

```
https://image.tmdb.org/t/p/w500/{posterPath do JSON}
```

Confirmar que a imagem corresponde ao show correto.

### 5. Corrigir manualmente se necessario

Se algum match estiver errado, editar `data/images.json`:

```json
{
  "title": "Dark",
  "tmdbId": 70523,
  "tmdbName": "Dark",
  "posterPath": "/caminho-correto.jpg",
  "backdropPath": "/caminho-correto.jpg",
  "confidence": 1.0
}
```

Para forcar rejeicao (usar gradiente): setar `posterPath: null` e `backdropPath: null`.

### 6. Adicionar TMDB_ACCESS_TOKEN ao .env

```bash
# Adicionar ao .env (na raiz do projeto)
echo 'TMDB_ACCESS_TOKEN=seu_token_aqui' >> .env
```

**Importante:** o `.env` ja esta no `.gitignore`. O token e necessario para o auto-fetch funcionar em runtime (T053).

### 7. Commitar o JSON

```bash
git add data/images.json
git commit -m "feat: add TMDB image cache for TV shows"
```

## Validacao

```bash
# Verificar que o JSON existe e tem conteudo
cat data/images.json | jq '.shows | length'
# Esperado: ~18

# Verificar que todos os shows conhecidos tem poster
cat data/images.json | jq '.shows[] | select(.posterPath != null) | .title'

# Verificar que nenhum show tem confidence < 0.6 com posterPath
cat data/images.json | jq '.shows[] | select(.confidence < 0.6 and .posterPath != null)'
# Esperado: nenhum resultado
```

## Criterio de pronto

- [ ] Script executou sem erros
- [ ] `data/images.json` existe com ~18 entries
- [ ] Shows principais tem confidence 1.0 (Breaking Bad, Friends, etc.)
- [ ] Nenhum show com confidence < 0.6 tem posterPath preenchido
- [ ] Shows com confidence < 1.0 foram revisados manualmente
- [ ] TMDB_ACCESS_TOKEN adicionado ao `.env`
- [ ] `data/images.json` commitado no git
- [ ] URLs de poster abrem corretamente no browser (amostra de 3-5)

## Fechamento da Task

- Task: T052 — Executar Script e Revisar Matches
- O que foi validado: `data/images.json` gerado com 24 entries e `tmdbImageBaseUrl` preenchido
- Revisao manual concluida: matches com confidence `< 1.0` foram revisados e mantidos como corretos (`Tom And Jerry`, `Como vender drogas online rapido`, `Peaky Blinders`)
- Fallback confirmado: `dewd`, `Uma vez Flamengo` e `New Item` permanecem sem poster por nao terem match confiavel
- Evidencia de validacao: nenhum item com `confidence < 0.6` possui `posterPath` preenchido
- Status: done
