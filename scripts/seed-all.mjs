const API_BASE = 'http://localhost:3001/api';

const SEASONS = {
  'Breaking Bad': [
    { number: 1, year: 2008 },
    { number: 2, year: 2009 },
    { number: 3, year: 2010 },
  ],
  'Dark': [
    { number: 1, year: 2017 },
    { number: 2, year: 2019 },
    { number: 3, year: 2020 },
  ],
  'Game of Thrones': [
    { number: 1, year: 2011 },
    { number: 2, year: 2012 },
  ],
  'Stranger Things': [
    { number: 1, year: 2016 },
    { number: 2, year: 2017 },
  ],
  'The Sopranos': [
    { number: 1, year: 1999 },
    { number: 2, year: 2000 },
  ],
};

const EPISODES = {
  'Breaking Bad': {
    1: [
      { ep: 1, title: 'Pilot', date: '2008-01-20', rating: 9.0, desc: 'Walter White recebe um diagnostico de cancer e decide fabricar metanfetamina.' },
      { ep: 2, title: "Cat's in the Bag...", date: '2008-01-27', rating: 8.6, desc: 'Walt e Jesse tentam lidar com as consequencias do primeiro cozimento.' },
      { ep: 3, title: "...And the Bag's in the River", date: '2008-02-10', rating: 8.7, desc: 'Walt enfrenta um dilema moral enquanto tenta expandir o negocio.' },
    ],
    2: [
      { ep: 1, title: 'Seven Thirty-Seven', date: '2009-03-08', rating: 8.8, desc: 'Walt e Jesse percebem que Tuco e perigoso demais para confiar.' },
      { ep: 2, title: 'Grilled', date: '2009-03-15', rating: 9.2, desc: 'Walt e Jesse ficam presos em um esconderijo no deserto.' },
    ],
  },
  Dark: {
    1: [
      { ep: 1, title: 'Secrets', date: '2017-12-01', rating: 8.6, desc: 'O desaparecimento de criancas em Winden revela segredos entre quatro familias.' },
      { ep: 2, title: 'Lies', date: '2017-12-01', rating: 8.4, desc: 'As buscas continuam enquanto mais detalhes obscuros vem a tona.' },
      { ep: 3, title: 'Past and Present', date: '2017-12-01', rating: 8.8, desc: 'Ulrich descobre uma conexao perturbadora entre presente e passado.' },
    ],
  },
  'Game of Thrones': {
    1: [
      { ep: 1, title: 'Winter Is Coming', date: '2011-04-17', rating: 9.0, desc: 'Eddard Stark e convocado para servir ao rei apos uma morte inesperada.' },
      { ep: 2, title: 'The Kingsroad', date: '2011-04-24', rating: 8.7, desc: 'Os Stark partem para Porto Real enquanto Jon ruma para a Muralha.' },
    ],
  },
};

const WATCHLISTS = [
  {
    title: 'Favoritos',
    description: 'Shows para revisitar quando bater vontade de maratonar.',
    shows: ['Breaking Bad', 'Dark', 'The Sopranos'],
  },
  {
    title: 'Para Assistir',
    description: 'Series que ainda quero terminar nas proximas semanas.',
    shows: ['Game of Thrones', 'Stranger Things'],
  },
  {
    title: 'Sci-Fi e Misterio',
    description: 'Narrativas com misterio, viagem no tempo e clima sombrio.',
    shows: ['Dark', 'Black Mirror', 'Stranger Things'],
  },
];

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getJson(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`GET ${path} failed: ${res.status} ${errorText}`);
  }
  return res.json();
}

async function post(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (res.ok) {
    return { status: 'created', body: await res.json() };
  }

  if (res.status === 409) {
    return { status: 'skipped' };
  }

  return { status: 'error', error: await res.text(), code: res.status };
}

async function getExistingShows() {
  const payload = await getJson('/tvshows?limit=100');
  const shows = payload.result ?? [];
  const titles = new Set(shows.map((show) => show.title));
  return { shows, titles };
}

async function seedSeasons(showTitles) {
  console.log('\n--- Creating Seasons ---');
  for (const [showTitle, seasonEntries] of Object.entries(SEASONS)) {
    if (!showTitles.has(showTitle)) {
      console.log(`  [SKIP] ${showTitle} (show nao encontrado)`);
      continue;
    }

    for (const season of seasonEntries) {
      const result = await post('/seasons', {
        number: season.number,
        tvShow: { '@assetType': 'tvShows', title: showTitle },
        year: season.year,
      });

      if (result.status === 'created') {
        console.log(`  [NEW] ${showTitle} S${season.number} (${season.year})`);
      } else if (result.status === 'skipped') {
        console.log(`  [SKIP] ${showTitle} S${season.number} (ja existe)`);
      } else {
        console.log(`  [ERR] ${showTitle} S${season.number}: ${result.code} ${result.error}`);
      }

      await delay(100);
    }
  }
}

async function seedEpisodes(showTitles) {
  console.log('\n--- Creating Episodes ---');
  for (const [showTitle, seasons] of Object.entries(EPISODES)) {
    if (!showTitles.has(showTitle)) {
      console.log(`  [SKIP] ${showTitle} episodes (show nao encontrado)`);
      continue;
    }

    for (const [seasonNumber, entries] of Object.entries(seasons)) {
      for (const episode of entries) {
        const result = await post('/episodes', {
          season: {
            '@assetType': 'seasons',
            number: Number(seasonNumber),
            tvShow: { '@assetType': 'tvShows', title: showTitle },
          },
          episodeNumber: episode.ep,
          title: episode.title,
          description: episode.desc,
          releaseDate: new Date(`${episode.date}T00:00:00Z`).toISOString(),
          ...(episode.rating != null ? { rating: episode.rating } : {}),
        });

        if (result.status === 'created') {
          console.log(`  [NEW] ${showTitle} S${seasonNumber}E${episode.ep}: ${episode.title}`);
        } else if (result.status === 'skipped') {
          console.log(`  [SKIP] ${showTitle} S${seasonNumber}E${episode.ep} (ja existe)`);
        } else {
          console.log(`  [ERR] ${showTitle} S${seasonNumber}E${episode.ep}: ${result.code} ${result.error}`);
        }

        await delay(100);
      }
    }
  }
}

async function seedWatchlists(showTitles) {
  console.log('\n--- Creating Watchlists ---');
  for (const watchlist of WATCHLISTS) {
    const validShows = watchlist.shows.filter((title) => showTitles.has(title));
    const missingShows = watchlist.shows.filter((title) => !showTitles.has(title));

    if (missingShows.length > 0) {
      console.log(`  [SKIP ITEMS] ${watchlist.title}: ${missingShows.join(', ')}`);
    }

    const result = await post('/watchlist', {
      title: watchlist.title,
      description: watchlist.description,
      tvShows: validShows.map((title) => ({ '@assetType': 'tvShows', title })),
    });

    if (result.status === 'created') {
      console.log(`  [NEW] ${watchlist.title} (${validShows.length} shows)`);
    } else if (result.status === 'skipped') {
      console.log(`  [SKIP] ${watchlist.title} (ja existe)`);
    } else {
      console.log(`  [ERR] ${watchlist.title}: ${result.code} ${result.error}`);
    }

    await delay(100);
  }
}

async function main() {
  console.log('=== Seed: Seasons, Episodes, Watchlists ===');
  const { shows, titles } = await getExistingShows();
  console.log(`TV Shows encontrados: ${shows.length}`);

  if (shows.length === 0) {
    console.error('Nenhum TV Show encontrado. Execute o seed base de shows primeiro.');
    process.exit(1);
  }

  await seedSeasons(titles);
  await seedEpisodes(titles);
  await seedWatchlists(titles);
  console.log('\n=== Seed completo ===');
}

main().catch((error) => {
  console.error('Erro ao executar seed-all:', error);
  process.exit(1);
});
