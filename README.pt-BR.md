# GoLedger Challenge - Catalogo de TV Shows

> [Read in English](README.md)

Interface web inspirada na Netflix para catalogar TV Shows, Temporadas, Episodios e Watchlists, utilizando a API REST blockchain da GoLedger.

Construido com **Next.js 16**, **React 19**, **Fastify 5** (BFF), **TailwindCSS 4** e **React Query**.

## Funcionalidades

- CRUD completo para **TV Shows**, **Temporadas**, **Episodios** e **Watchlists**
- UI estilo Netflix com carroseis, hero banner e cards com hover
- Backend-for-Frontend (BFF) com Fastify intermediando requisicoes para a API GoLedger
- Validacao de formularios com React Hook Form + Zod
- Enriquecimento de imagens via TMDB (posters e backdrops)
- Notificacoes toast e confetti nas acoes
- Design responsivo (mobile + desktop)
- Suite de testes completa (44 testes)

## Pre-requisitos

- **Node.js** 20+ (LTS recomendado)
- **pnpm** 10+ (`npm install -g pnpm`)
- Credenciais da API GoLedger (Basic Auth)

## Como Executar

### 1. Clonar o repositorio

```bash
git clone https://github.com/imdouglasoliveira/goledger-challenge-web.git
cd goledger-challenge-web
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variaveis de ambiente

Copie o arquivo de exemplo e preencha suas credenciais:

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais da API GoLedger:

```env
GOLEDGER_BASE_URL=http://ec2-50-19-36-138.compute-1.amazonaws.com
GOLEDGER_USERNAME=seu-usuario
GOLEDGER_PASSWORD=sua-senha
```

Opcionalmente, adicione um token TMDB para imagens de poster/backdrop:

```env
TMDB_ACCESS_TOKEN=seu-token-tmdb
```

### 4. Rodar o servidor de desenvolvimento

```bash
pnpm dev
```

Isso inicia tanto o **frontend Next.js** (porta 3000) quanto o **BFF Fastify** (porta 3001) simultaneamente.

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### 5. Build para producao

```bash
pnpm build
pnpm start
```

### 6. Rodar testes

```bash
pnpm test
```

## Estrutura do Projeto

```
app/               Paginas Next.js App Router
  ├── page.tsx         TV Shows (home)
  ├── seasons/         Pagina de Temporadas
  ├── episodes/        Pagina de Episodios
  └── watchlist/       Pagina de Watchlist
components/        Componentes React organizados por feature
  ├── layout/          Header, HeroBanner, CarouselRow
  ├── tvshows/         TvShowThumbnail, TvShowForm, TvShowsPage
  ├── seasons/         SeasonCard, SeasonForm, SeasonsPage
  ├── episodes/        EpisodeCard, EpisodeForm, EpisodesPage
  ├── watchlist/       WatchlistCard, WatchlistForm, WatchlistPage
  ├── states/          Loading, Empty, Error states
  └── ui/              Button, Card, Input, Modal, Badge
lib/               Utilitarios compartilhados, cliente API, hooks
src/               Servidor BFF Fastify
  ├── clients/         Cliente blockchain GoLedger
  ├── routes/          Endpoints da API (tvshows, seasons, episodes, watchlist)
  ├── schemas/         Schemas de validacao Zod
  ├── services/        Cache de imagens, filtragem de dados
  └── plugins/         Seguranca (CORS, Helmet, Rate Limiting), Swagger
__tests__/         Testes de componentes e integracao
```

## Arquitetura da API

O frontend **nao** chama a API GoLedger diretamente. Um servidor BFF Fastify gerencia a autenticacao e intermedia as requisicoes:

```
Navegador → Next.js (porta 3000) → /api/* rewrites → BFF Fastify (porta 3001) → API GoLedger
```

Isso mantem as credenciais no servidor e oferece rate limiting, filtragem de dados e enriquecimento de imagens.

## Seguranca

- Credenciais da API **nunca sao expostas** ao frontend
- Todas as mutacoes possuem rate limiting no BFF
- Variaveis de ambiente sao validadas na inicializacao
