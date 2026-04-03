# GoLedger Challenge - TV Show Catalog

> [Leia em Portugues](README.pt-BR.md)

A Netflix-inspired web interface for cataloging TV Shows, Seasons, Episodes and Watchlists, powered by GoLedger's blockchain REST API.

Built with **Next.js 16**, **React 19**, **Fastify 5** (BFF), **TailwindCSS 4**, and **React Query**.

## Features

- Full CRUD for **TV Shows**, **Seasons**, **Episodes**, and **Watchlists**
- Netflix-style UI with carousel rows, hero banner, and hover cards
- Backend-for-Frontend (BFF) with Fastify proxying requests to GoLedger API
- Form validation with React Hook Form + Zod
- TMDB image enrichment (posters and backdrops)
- Toast notifications and confetti celebrations
- Responsive design (mobile + desktop)
- Comprehensive test suite (44 tests)

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **pnpm** 10+ (`npm install -g pnpm`)
- GoLedger API credentials (Basic Auth)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-user>/goledger-challenge-web.git
cd goledger-challenge-web
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your GoLedger API credentials:

```env
GOLEDGER_BASE_URL=http://ec2-50-19-36-138.compute-1.amazonaws.com
GOLEDGER_USERNAME=your-username
GOLEDGER_PASSWORD=your-password
```

Optionally, add a TMDB token for poster/backdrop images:

```env
TMDB_ACCESS_TOKEN=your-tmdb-access-token
```

### 4. Run the development server

```bash
pnpm dev
```

This starts both the **Next.js frontend** (port 3000) and the **Fastify BFF** (port 3001) concurrently.

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production

```bash
pnpm build
pnpm start
```

### 6. Run tests

```bash
pnpm test
```

## Project Structure

```
app/               Next.js App Router pages
  ├── page.tsx         TV Shows (home)
  ├── seasons/         Seasons page
  ├── episodes/        Episodes page
  └── watchlist/       Watchlist page
components/        React components organized by feature
  ├── layout/          Header, HeroBanner, CarouselRow
  ├── tvshows/         TvShowThumbnail, TvShowForm, TvShowsPage
  ├── seasons/         SeasonCard, SeasonForm, SeasonsPage
  ├── episodes/        EpisodeCard, EpisodeForm, EpisodesPage
  ├── watchlist/       WatchlistCard, WatchlistForm, WatchlistPage
  ├── states/          Loading, Empty, Error states
  └── ui/              Button, Card, Input, Modal, Badge
lib/               Shared utilities, API client, hooks
src/               Fastify BFF server
  ├── clients/         GoLedger blockchain client
  ├── routes/          API endpoints (tvshows, seasons, episodes, watchlist)
  ├── schemas/         Zod validation schemas
  ├── services/        Image cache, data filtering
  └── plugins/         Security (CORS, Helmet, Rate Limiting), Swagger
__tests__/         Component and integration tests
```

## API Architecture

The frontend does **not** call the GoLedger API directly. Instead, a Fastify BFF server handles authentication and proxies requests:

```
Browser → Next.js (port 3000) → /api/* rewrites → Fastify BFF (port 3001) → GoLedger API
```

This keeps credentials server-side and provides rate limiting, data filtering, and image enrichment.

## Security

- API credentials are **never exposed** to the frontend
- All mutations are rate-limited on the BFF
- Environment variables are validated at startup
