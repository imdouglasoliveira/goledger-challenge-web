# TASK-06 (T096) — Seed de Dados para Demonstracao

- Status: todo
- Prioridade: P1
- Depende de: T095 (tudo funcionando)
- Agent/Skill: `a8z-master`
- Plano: `docs/plans/07-seasons-episodes-watchlist.md`

## O que fazer

1. Criar `scripts/seed-all.mjs` que popula seasons, episodes e watchlists

## Por que fazer

Sem dados de demonstracao, o avaliador vera paginas vazias. O seed cria dados realistas para mostrar que o CRUD funciona end-to-end.

## Arquivo a criar

- `scripts/seed-all.mjs`

## Como fazer

### `scripts/seed-all.mjs`

**Estrutura:** Script Node.js que chama a API do BFF sequencialmente.

```javascript
const API = 'http://localhost:3001/api';

async function post(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    console.warn(`  WARN ${path}: ${err}`);
    return null;
  }
  return res.json();
}

async function main() {
  console.log('=== Seed: Seasons, Episodes, Watchlists ===\n');

  // 1. Buscar shows existentes
  const showsRes = await fetch(`${API}/tvshows?limit=100`);
  const { result: shows } = await showsRes.json();
  console.log(`Found ${shows.length} TV Shows\n`);

  if (shows.length === 0) {
    console.error('ERROR: Nenhum TV Show encontrado. Execute o seed de shows primeiro.');
    process.exit(1);
  }

  // 2. Criar seasons
  console.log('--- Creating Seasons ---');
  const seasonsData = {
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
    'The Sopranos': [
      { number: 1, year: 1999 },
      { number: 2, year: 2000 },
    ],
    'Game of Thrones': [
      { number: 1, year: 2011 },
      { number: 2, year: 2012 },
    ],
    'Friends': [
      { number: 1, year: 1994 },
      { number: 2, year: 1995 },
    ],
  };

  for (const [showTitle, seasons] of Object.entries(seasonsData)) {
    const showExists = shows.find(s => s.title === showTitle);
    if (!showExists) {
      console.log(`  SKIP ${showTitle} (nao encontrado)`);
      continue;
    }
    for (const season of seasons) {
      await post('/seasons', {
        number: season.number,
        tvShow: { '@assetType': 'tvShows', title: showTitle },
        year: season.year,
      });
      console.log(`  + ${showTitle} S${season.number} (${season.year})`);
    }
  }

  // 3. Criar episodes (3 por season)
  console.log('\n--- Creating Episodes ---');
  const episodesData = {
    'Breaking Bad': {
      1: [
        { ep: 1, title: 'Pilot', desc: 'Walter White recebe um diagnostico de cancer e decide fabricar metanfetamina.', date: '2008-01-20', rating: 9.0 },
        { ep: 2, title: "Cat's in the Bag...", desc: 'Walt e Jesse lidam com as consequencias de seu primeiro cozimento.', date: '2008-01-27', rating: 8.5 },
        { ep: 3, title: '...And the Bag\'s in the River', desc: 'Walt enfrenta um dilema moral sobre o que fazer com Krazy-8.', date: '2008-02-10', rating: 8.7 },
      ],
      2: [
        { ep: 1, title: 'Seven Thirty-Seven', desc: 'Walt e Jesse percebem que Tuco e imprevisivel e perigoso.', date: '2009-03-08', rating: 8.8 },
        { ep: 2, title: 'Grilled', desc: 'Walt e Jesse sao mantidos refens por Tuco no deserto.', date: '2009-03-15', rating: 9.2 },
      ],
    },
    'Dark': {
      1: [
        { ep: 1, title: 'Secrets', desc: 'Apos o desaparecimento de duas criancas, quatro familias buscam respostas.', date: '2017-12-01', rating: 8.6 },
        { ep: 2, title: 'Lies', desc: 'As buscas pelas criancas desaparecidas revelam segredos obscuros.', date: '2017-12-01', rating: 8.4 },
        { ep: 3, title: 'Past and Present', desc: 'Ulrich descobre uma conexao chocante com o passado.', date: '2017-12-01', rating: 8.8 },
      ],
    },
  };

  for (const [showTitle, seasons] of Object.entries(episodesData)) {
    for (const [seasonNum, episodes] of Object.entries(seasons)) {
      for (const ep of episodes) {
        await post('/episodes', {
          season: {
            '@assetType': 'seasons',
            number: Number(seasonNum),
            tvShow: { '@assetType': 'tvShows', title: showTitle },
          },
          episodeNumber: ep.ep,
          title: ep.title,
          description: ep.desc,
          releaseDate: new Date(ep.date).toISOString(),
          ...(ep.rating != null ? { rating: ep.rating } : {}),
        });
        console.log(`  + ${showTitle} S${seasonNum}E${ep.ep}: ${ep.title}`);
      }
    }
  }

  // 4. Criar watchlists
  console.log('\n--- Creating Watchlists ---');
  const watchlistsData = [
    {
      title: 'Favoritos',
      description: 'Meus shows favoritos de todos os tempos.',
      shows: ['Breaking Bad', 'Dark', 'The Sopranos'],
    },
    {
      title: 'Para Assistir',
      description: 'Shows na fila para maratonar.',
      shows: ['Game of Thrones', 'Friends'],
    },
  ];

  for (const wl of watchlistsData) {
    const validShows = wl.shows.filter(t => shows.find(s => s.title === t));
    await post('/watchlist', {
      title: wl.title,
      description: wl.description,
      tvShows: validShows.map(title => ({ '@assetType': 'tvShows', title })),
    });
    console.log(`  + Watchlist "${wl.title}" (${validShows.length} shows)`);
  }

  console.log('\n=== Seed completo! ===');
}

main().catch(console.error);
```

**Adicionar script ao `package.json`:**
```json
"seed:all": "node scripts/seed-all.mjs"
```

## Como testar

```bash
# Terminal 1: BFF rodando
pnpm dev

# Terminal 2: executar seed
node scripts/seed-all.mjs

# Verificar no browser:
# /seasons → deve mostrar seasons criadas
# /episodes → deve mostrar episodes
# /watchlist → deve mostrar 2 watchlists
```

## Criterio de pronto

- [ ] Script executa sem erros
- [ ] Seasons aparecem na pagina `/seasons` com shows corretos
- [ ] Episodes aparecem em `/episodes` com seasons/shows corretos
- [ ] Watchlists aparecem em `/watchlist` com shows referenciados
- [ ] Relacoes estao consistentes (episode → season → show)
- [ ] Script lida com shows nao encontrados gracefully (SKIP)
