const API_BASE = 'http://localhost:3001/api';

// NOTE: Titles MUST match exactly what exists in the database (case-sensitive).
// Use getExistingShows() to resolve case mismatches at runtime.
const SEASONS = {
  'Game of Thrones': [
    { number: 1, year: 2011 },
    { number: 2, year: 2012 },
  ],
  'The Crown': [
    { number: 1, year: 2016 },
    { number: 2, year: 2017 },
  ],
  'The Office': [
    { number: 1, year: 2005 },
    { number: 2, year: 2005 },
  ],
  'Invencível': [
    { number: 1, year: 2021 },
    { number: 2, year: 2023 },
  ],
  'Fleabag': [
    { number: 1, year: 2016 },
    { number: 2, year: 2019 },
  ],
  'Demolidor': [
    { number: 1, year: 2015 },
    { number: 2, year: 2016 },
  ],
  'The Flash': [
    { number: 1, year: 2014 },
    { number: 2, year: 2015 },
  ],
  'Hannibal': [
    { number: 1, year: 2013 },
    { number: 2, year: 2014 },
  ],
  'The Boys': [
    { number: 1, year: 2019 },
    { number: 2, year: 2020 },
  ],
  'Vikings': [
    { number: 1, year: 2013 },
    { number: 2, year: 2014 },
  ],
  'Dexter': [
    { number: 1, year: 2006 },
    { number: 2, year: 2007 },
  ],
  'The Wire': [
    { number: 1, year: 2002 },
    { number: 2, year: 2003 },
  ],
  'Jujutsu Kaisen': [
    { number: 1, year: 2020 },
    { number: 2, year: 2023 },
  ],
  'Outlander': [
    { number: 1, year: 2014 },
    { number: 2, year: 2016 },
  ],
  'Watchmen': [
    { number: 1, year: 2019 },
  ],
};

const EPISODES = {
  'Game of Thrones': {
    1: [
      { ep: 1, title: 'Winter Is Coming', date: '2011-04-17', rating: 9.0, desc: 'Eddard Stark e convocado para servir ao rei apos uma morte inesperada.' },
      { ep: 2, title: 'The Kingsroad', date: '2011-04-24', rating: 8.7, desc: 'Os Stark partem para Porto Real enquanto Jon ruma para a Muralha.' },
      { ep: 3, title: 'Lord Snow', date: '2011-05-01', rating: 8.5, desc: 'Jon Snow chega a Muralha e Ned Stark comeca a desvendar segredos em Porto Real.' },
    ],
  },
  'The Crown': {
    1: [
      { ep: 1, title: 'Wolferton Splash', date: '2016-11-04', rating: 8.5, desc: 'Em 1947, a princesa Elizabeth se casa com Philip Mountbatten enquanto a saude do rei deteriora.' },
      { ep: 2, title: 'Hyde Park Corner', date: '2016-11-04', rating: 8.7, desc: 'A morte do Rei George VI transforma Elizabeth em rainha da noite para o dia.' },
      { ep: 3, title: 'Windsor', date: '2016-11-04', rating: 8.3, desc: 'Elizabeth enfrenta seu primeiro desafio como rainha ao lidar com a crise do smog em Londres.' },
    ],
  },
  'The Office': {
    1: [
      { ep: 1, title: 'Pilot', date: '2005-03-24', rating: 7.6, desc: 'Um documentario acompanha o dia a dia de um escritorio em Scranton liderado pelo excentrico Michael Scott.' },
      { ep: 2, title: 'Diversity Day', date: '2005-03-29', rating: 8.3, desc: 'Michael conduz um treinamento de diversidade que sai completamente do controle.' },
      { ep: 3, title: 'Health Care', date: '2005-04-05', rating: 7.9, desc: 'Dwight recebe a tarefa de escolher o plano de saude do escritorio, gerando caos.' },
    ],
  },
  'Invencível': {
    1: [
      { ep: 1, title: "It's About Time", date: '2021-03-26', rating: 8.9, desc: 'Mark Grayson descobre seus poderes e comeca a treinar com seu pai, o heroi mais poderoso do mundo.' },
      { ep: 2, title: 'Here Goes Nothing', date: '2021-03-26', rating: 8.5, desc: 'Mark tenta equilibrar a vida de heroi com a escola enquanto uma ameaca global surge.' },
      { ep: 3, title: 'Who You Calling Ugly?', date: '2021-04-02', rating: 8.7, desc: 'Uma missao leva Mark a enfrentar um vilao alienigena e questionar seus limites.' },
    ],
  },
  'Fleabag': {
    1: [
      { ep: 1, title: 'Episode 1', date: '2016-07-21', rating: 8.4, desc: 'Uma mulher jovem em Londres navega o luto, relacoes complicadas e um cafe falindo.' },
      { ep: 2, title: 'Episode 2', date: '2016-07-21', rating: 8.3, desc: 'Flashbacks revelam a amizade que moldou Fleabag enquanto ela tenta seguir em frente.' },
      { ep: 3, title: 'Episode 3', date: '2016-07-21', rating: 8.5, desc: 'Um encontro desastroso e uma reuniao familiar expoe feridas antigas.' },
    ],
  },
  'Demolidor': {
    1: [
      { ep: 1, title: 'Into the Ring', date: '2015-04-10', rating: 8.6, desc: 'Matt Murdock abre um escritorio de advocacia e comeca a combater o crime nas ruas de Hell\'s Kitchen.' },
      { ep: 2, title: 'Cut Man', date: '2015-04-10', rating: 9.0, desc: 'Gravemente ferido, Matt e encontrado por uma enfermeira enquanto flashbacks revelam seu passado.' },
      { ep: 3, title: 'Rabbit in a Snowstorm', date: '2015-04-10', rating: 8.5, desc: 'Um caso misterioso leva Matt e Foggy a cruzarem o caminho de Wilson Fisk.' },
    ],
  },
  'The Flash': {
    1: [
      { ep: 1, title: 'Pilot', date: '2014-10-07', rating: 8.5, desc: 'Barry Allen e atingido por um raio e acorda com supervelocidade, decidindo proteger Central City.' },
      { ep: 2, title: 'Fastest Man Alive', date: '2014-10-14', rating: 8.1, desc: 'Barry tenta provar que pode ser heroi sozinho enquanto enfrenta um meta-humano que se multiplica.' },
      { ep: 3, title: 'Things You Can\'t Outrun', date: '2014-10-21', rating: 8.2, desc: 'A equipe cria uma prisao para meta-humanos enquanto Barry enfrenta um vilao feito de gas toxico.' },
    ],
  },
  'Hannibal': {
    1: [
      { ep: 1, title: 'Aperitif', date: '2013-04-04', rating: 8.7, desc: 'Will Graham e recrutado pelo FBI para cazar assassinos em serie com ajuda do Dr. Hannibal Lecter.' },
      { ep: 2, title: 'Amuse-Bouche', date: '2013-04-11', rating: 8.5, desc: 'Will investiga um assassino que cultiva cogumelos em corpos humanos vivos.' },
      { ep: 3, title: 'Potage', date: '2013-04-18', rating: 8.6, desc: 'Abigail Hobbs acorda do coma e Will e Hannibal disputam influencia sobre ela.' },
    ],
  },
  'The Boys': {
    1: [
      { ep: 1, title: 'The Name of the Game', date: '2019-07-26', rating: 9.0, desc: 'Hughie descobre a verdade sobre os super-herois quando sua namorada e morta por A-Train.' },
      { ep: 2, title: 'Cherry', date: '2019-07-26', rating: 8.7, desc: 'Billy Butcher recruta Hughie para se infiltrar na Vought e expor os Sete.' },
      { ep: 3, title: 'Get Some', date: '2019-07-26', rating: 8.8, desc: 'Os Boys investigam o Translucido enquanto Starlight enfrenta o lado sombrio dos Sete.' },
    ],
  },
  'Vikings': {
    1: [
      { ep: 1, title: 'Rites of Passage', date: '2013-03-03', rating: 8.6, desc: 'Ragnar Lothbrok sonha em explorar o oeste enquanto seu chefe insiste em atacar o leste.' },
      { ep: 2, title: 'Wrath of the Northmen', date: '2013-03-10', rating: 8.5, desc: 'Ragnar e seu bando partem para a primeira viagem rumo a Inglaterra.' },
      { ep: 3, title: 'Dispossessed', date: '2013-03-17', rating: 8.7, desc: 'Os vikings chegam a Northumbria e realizam seu primeiro saque em um mosteiro.' },
    ],
  },
  'Dexter': {
    1: [
      { ep: 1, title: 'Dexter', date: '2006-10-01', rating: 8.8, desc: 'Dexter Morgan e um analista forense de dia e assassino em serie de criminosos a noite.' },
      { ep: 2, title: 'Crocodile', date: '2006-10-08', rating: 8.4, desc: 'Dexter investiga um caso enquanto o Ice Truck Killer continua provocando a policia.' },
      { ep: 3, title: 'Popping Cherry', date: '2006-10-15', rating: 8.3, desc: 'Flashbacks revelam a primeira vitima de Dexter enquanto ele caca um novo alvo.' },
    ],
  },
  'The Wire': {
    1: [
      { ep: 1, title: 'The Target', date: '2002-06-02', rating: 8.5, desc: 'O detetive McNulty convence um juiz a investigar a organizacao de Avon Barksdale.' },
      { ep: 2, title: 'The Detail', date: '2002-06-09', rating: 8.3, desc: 'A equipe de investigacao e montada e comeca a vasculhar os projetos habitacionais.' },
      { ep: 3, title: 'The Buys', date: '2002-06-16', rating: 8.4, desc: 'A equipe faz as primeiras compras de drogas enquanto Avon percebe a presenca policial.' },
    ],
  },
  'Jujutsu Kaisen': {
    1: [
      { ep: 1, title: 'Ryomen Sukuna', date: '2020-10-03', rating: 8.7, desc: 'Yuji Itadori engole um dedo amaldicoado e se torna o hospedeiro do Rei das Maldicoes.' },
      { ep: 2, title: 'For Myself', date: '2020-10-10', rating: 8.5, desc: 'Yuji e sentenciado a morte mas Gojo propoe mante-lo vivo para consumir todos os dedos de Sukuna.' },
      { ep: 3, title: 'Girl of Steel', date: '2020-10-17', rating: 8.6, desc: 'Yuji comeca seu treinamento na Escola de Feiticaria e conhece seus novos colegas.' },
    ],
  },
  'Outlander': {
    1: [
      { ep: 1, title: 'Sassenach', date: '2014-08-09', rating: 8.4, desc: 'Claire Randall e transportada de 1945 para a Escocia de 1743 atraves de pedras misteriosas.' },
      { ep: 2, title: 'Castle Leoch', date: '2014-08-16', rating: 8.3, desc: 'Claire tenta sobreviver no castelo dos MacKenzie enquanto busca um caminho de volta.' },
      { ep: 3, title: 'The Way Out', date: '2014-08-23', rating: 8.5, desc: 'Claire usa seus conhecimentos medicos para ganhar confianca enquanto explora as pedras.' },
    ],
  },
  'Watchmen': {
    1: [
      { ep: 1, title: "It's Summer and We're Running Out of Ice", date: '2019-10-20', rating: 8.6, desc: 'Em Tulsa, a detetive Angela Abar investiga o ressurgimento de um grupo supremacista.' },
      { ep: 2, title: 'Martial Feats of Comanche Horsemanship', date: '2019-10-27', rating: 8.4, desc: 'Angela segue pistas sobre o ataque enquanto segredos do passado comecam a emergir.' },
      { ep: 3, title: 'She Was Killed by Space Junk', date: '2019-11-03', rating: 8.7, desc: 'Laurie Blake chega a Tulsa para investigar e sua presenca complica tudo.' },
    ],
  },
};

const WATCHLISTS = [
  {
    title: 'Favoritos',
    description: 'Os melhores shows para maratonar quando bater vontade.',
    shows: ['Game of Thrones', 'The Boys', 'Demolidor', 'The Wire'],
  },
  {
    title: 'Para Assistir',
    description: 'Series que ainda quero terminar nas proximas semanas.',
    shows: ['Vikings', 'Outlander', 'The Crown', 'Hannibal'],
  },
  {
    title: 'Acao e Super-herois',
    description: 'Pancadaria, poderes e muita adrenalina.',
    shows: ['Invencível', 'The Flash', 'Demolidor', 'The Boys', 'Jujutsu Kaisen'],
  },
  {
    title: 'Drama e Suspense',
    description: 'Narrativas intensas que prendem do inicio ao fim.',
    shows: ['Dexter', 'Hannibal', 'Fleabag', 'The Wire', 'Watchmen'],
  },
];

async function delay(ms = 300) {
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

async function post(path, body, retries = 3) {
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

  if (res.status === 429 && retries > 0) {
    const retryMatch = (await res.text()).match(/retry in (\d+)/);
    const waitSec = retryMatch ? parseInt(retryMatch[1], 10) + 2 : 30;
    console.log(`  [WAIT] Rate limited, aguardando ${waitSec}s...`);
    await delay(waitSec * 1000);
    return post(path, body, retries - 1);
  }

  return { status: 'error', error: await res.text().catch(() => ''), code: res.status };
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

      await delay(300);
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

        await delay(300);
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

    await delay(300);
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
