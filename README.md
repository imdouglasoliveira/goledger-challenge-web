# GoLedger Challenge — TV Show Catalog

> [Leia em Português](README.pt-BR.md)

Web app for managing TV Shows, Seasons, Episodes, and Watchlists through GoLedger's blockchain REST API. The UI follows a Netflix-style dark theme with hero banners, carousels, and hover cards.

**Stack:** Next.js 16 · React 19 · Fastify 5 (BFF) · TailwindCSS 4 · React Query 5 · React Hook Form + Zod · Vitest

## Screenshots

### Home

The main page shows a hero banner with TMDB backdrop images and horizontal carousel rows for browsing shows.

![Home - TV Shows](public/images/01-home.png)

### Show details

Clicking a show opens a detail modal with edit/delete actions, seasons, and episodes.

| Seasons | Episodes |
|:---:|:---:|
| ![Seasons in modal](public/images/01-home-mais-info-watchlist.png) | ![Episodes in modal](public/images/01-home-mais-info-episodes.png) |

### Seasons

Each show's seasons get their own page with hero banner and CRUD actions.

![Seasons page](public/images/02-seasons.png)

### Watchlist

Users create lists, add shows to them, and browse by collection.

| All lists | Inside a list |
|:---:|:---:|
| ![Watchlist](public/images/03-watchlist.png) | ![Watchlist detail](public/images/03-watchlist-detalhes.png) |

## What it does

- CRUD for four entities: TV Shows, Seasons, Episodes, Watchlists
- BFF layer (Fastify) sits between the browser and GoLedger — credentials never reach the client
- TMDB integration fetches poster and backdrop images automatically
- Form validation with Zod schemas on both client and server
- Toast notifications (Sonner) and confetti on creation
- Mobile-first responsive layout
- 44 tests (Vitest + React Testing Library)

## Setup

### 1. Clone and install

```bash
git clone https://github.com/imdouglasoliveira/goledger-challenge-web.git
cd goledger-challenge-web
pnpm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

Fill in your GoLedger credentials:

```env
GOLEDGER_BASE_URL=http://ec2-50-19-36-138.compute-1.amazonaws.com
GOLEDGER_USERNAME=your-username
GOLEDGER_PASSWORD=your-password
```

For poster/backdrop images, add a TMDB token (optional):

```env
TMDB_ACCESS_TOKEN=your-tmdb-access-token
```

### 3. Run

```bash
pnpm dev
```

Starts both the Next.js frontend (port 3000) and the Fastify BFF (port 3001). Open [http://localhost:3000](http://localhost:3000).

### 4. Build and test

```bash
pnpm build && pnpm start   # production build
pnpm test                   # run test suite
```

## Project structure

```
app/               Next.js App Router pages
  ├── page.tsx         TV Shows (home)
  ├── seasons/         Seasons page
  ├── episodes/        Episodes page
  └── watchlist/       Watchlist page
components/        React components by feature
  ├── layout/          Header, HeroBanner, CarouselRow
  ├── tvshows/         TvShowThumbnail, TvShowForm, TvShowsPage
  ├── seasons/         SeasonCard, SeasonForm, SeasonsPage
  ├── episodes/        EpisodeCard, EpisodeForm, EpisodesPage
  ├── watchlist/       WatchlistCard, WatchlistForm, WatchlistPage
  ├── states/          Loading, Empty, Error states
  └── ui/              Button, Card, Input, Modal, Badge
lib/               API client, hooks, utilities
src/               Fastify BFF server
  ├── clients/         GoLedger API client
  ├── routes/          REST endpoints
  ├── schemas/         Zod validation schemas
  ├── services/        Image cache, data filtering
  └── plugins/         CORS, Helmet, Rate Limiting, Swagger
__tests__/         Component and API tests
```

## Architecture

The frontend never talks to GoLedger directly. A Fastify BFF handles auth, rate limiting, and image enrichment:

```
Browser → Next.js (:3000) → /api/* rewrite → Fastify BFF (:3001) → GoLedger API
```

## Security

- API credentials stay server-side — the browser only talks to the BFF
- Rate limits on mutations: 30/min for create/update, 10/min for delete
- Environment variables are validated at startup (missing vars = process exits)
