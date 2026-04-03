/**
 * Seed script: T041 (data cleanup) + T047 (seed new shows)
 *
 * Usage: npx tsx scripts/seed.mjs
 *
 * Steps:
 * 1. Delete dirty/test shows
 * 2. Fix shows with incorrect data
 * 3. Seed 10 new shows
 */

const API_BASE = 'http://localhost:3001/api';
const DIRTY_TITLE_PATTERNS = [/\btest\b/i, /\d{10,}/];

// --- Shows to DELETE (dirty/test data) ---
const showsToDelete = [
  'The Big Bang Theory 1774966262343',
  'The Big Bang Theory 1774966238272',
  'Stranger Things test',
];

// --- Shows to UPDATE (fix bad data) ---
const showsToUpdate = [
  {
    title: 'Breaking Bad',
    description: 'Um professor de química do ensino médio diagnosticado com câncer terminal decide fabricar metanfetamina para garantir o futuro financeiro de sua família. Sua descida ao submundo do crime é inevitável.',
    recommendedAge: 16,
  },
  {
    title: 'The Big Bang Theory',
    description: 'Quatro cientistas brilhantes mas socialmente desajeitados têm suas vidas transformadas quando uma vizinha atraente e extrovertida se muda para o apartamento ao lado.',
    recommendedAge: 12,
  },
  {
    title: 'Como vender drogas online rápido',
    matchTitles: ['Como vender drogas online rapido'],
    description: 'Um adolescente nerd cria uma loja online de drogas para reconquistar a ex-namorada, mas o negócio cresce além do esperado e atrai a atenção da polícia.',
    recommendedAge: 16,
  },
  {
    title: 'Dexter',
    description: 'Um perito em análise de sangue da polícia de Miami leva uma vida dupla como serial killer que só mata outros assassinos, seguindo um código rígido ensinado por seu pai adotivo.',
    recommendedAge: 18,
  },
  {
    title: 'Bates Motel',
    description: 'A história de Norma Bates e seu filho Norman antes dos eventos do filme Psicose de Alfred Hitchcock.',
    recommendedAge: 18,
  },
  {
    title: 'The Sopranos',
    description: 'O chefe da máfia de Nova Jersey, Tony Soprano, lida com questões pessoais e profissionais que afetam seu estado mental, levando-o a procurar aconselhamento psiquiátrico.',
    recommendedAge: 18,
  },
  {
    title: 'Dark',
    description: 'O desaparecimento de crianças em uma pequena cidade alemã revela segredos envolvendo viagem no tempo e conexões entre quatro famílias ao longo de várias gerações.',
    recommendedAge: 16,
  },
];

// --- Shows to CREATE (new seed) ---
const showsToCreate = [
  {
    title: 'Game of Thrones',
    description: 'Nove famílias nobres lutam pelo controle do continente de Westeros enquanto uma antiga ameaça desperta além da Muralha.',
    recommendedAge: 18,
  },
  {
    title: 'Friends',
    description: 'Seis amigos enfrentam os desafios da vida, amor e carreira em Nova York enquanto se apoiam mutuamente.',
    recommendedAge: 12,
  },
  {
    title: 'The Office',
    description: 'Um documentário fictício sobre o dia a dia dos funcionários da filial de Scranton da empresa Dunder Mifflin.',
    recommendedAge: 12,
  },
  {
    title: 'Black Mirror',
    description: 'Série antológica que explora as consequências sombrias da tecnologia na sociedade moderna.',
    recommendedAge: 16,
  },
  {
    title: 'The Crown',
    description: 'A história do reinado da Rainha Elizabeth II e os eventos que moldaram a segunda metade do século XX.',
    recommendedAge: 12,
  },
  {
    title: 'Rick and Morty',
    description: 'Um cientista louco e seu neto tímido vivem aventuras interdimensionais repletas de humor negro e ficção científica.',
    recommendedAge: 16,
  },
  {
    title: 'La Casa de Papel',
    description: 'Um grupo de ladrões executa elaborados assaltos à Casa da Moeda da Espanha e ao Banco da Espanha.',
    recommendedAge: 16,
  },
  {
    title: 'The Mandalorian',
    description: 'Um caça-recompensas solitário viaja pelos confins da galáxia após a queda do Império.',
    recommendedAge: 12,
  },
  {
    title: 'Arcane',
    description: 'Em meio à guerra entre as cidades de Piltover e Zaun, duas irmãs lutam em lados opostos de um conflito.',
    recommendedAge: 14,
  },
  {
    title: 'Peaky Blinders',
    description: 'Uma gangue de Birmingham liderada pelo ambicioso Thomas Shelby se expande no mundo do crime após a Primeira Guerra.',
    recommendedAge: 16,
  },
];

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function listShows(limit = 100) {
  const res = await fetch(`${API_BASE}/tvshows?limit=${limit}`);
  if (!res.ok) {
    throw new Error(`Falha ao listar shows: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.result ?? [];
}

async function apiDelete(title) {
  const res = await fetch(`${API_BASE}/tvshows`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (res.ok || res.status === 404) {
    console.log(`  [DEL] "${title}" → ${res.status}`);
    return true;
  }
  const body = await res.text();
  console.log(`  [DEL] "${title}" → ${res.status}: ${body}`);
  return false;
}

async function apiUpdate(show) {
  const res = await fetch(`${API_BASE}/tvshows`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(show),
  });
  if (res.ok) {
    console.log(`  [FIX] "${show.title}" → OK`);
    return true;
  }
  const body = await res.text();
  console.log(`  [FIX] "${show.title}" → ${res.status}: ${body}`);
  return false;
}

async function apiCreate(show) {
  const res = await fetch(`${API_BASE}/tvshows`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(show),
  });
  if (res.ok) {
    console.log(`  [NEW] "${show.title}" → OK`);
    return true;
  }
  if (res.status === 409) {
    console.log(`  [SKIP] "${show.title}" → ja existe`);
    return false;
  }
  const body = await res.text();
  console.log(`  [NEW] "${show.title}" → ${res.status}: ${body}`);
  return false;
}

async function main() {
  console.log('=== GoLedger TV Shows Seed Script ===\n');

  const currentShows = await listShows();
  const dynamicDirtyTitles = currentShows
    .map(show => show.title)
    .filter(title => DIRTY_TITLE_PATTERNS.some(pattern => pattern.test(title)));
  const titlesToDelete = [...new Set([...showsToDelete, ...dynamicDirtyTitles])];

  // Step 1: Delete dirty/test shows
  console.log('🗑️  Step 1: Deletando shows sujos/teste...');
  for (const title of titlesToDelete) {
    await apiDelete(title);
    await delay(200);
  }

  // Step 2: Fix existing shows
  console.log('\n🔧 Step 2: Corrigindo dados existentes...');
  const showsAfterCleanup = await listShows();
  for (const show of showsToUpdate) {
    const resolvedTitle = [show.title, ...(show.matchTitles ?? [])].find((candidate) =>
      showsAfterCleanup.some((existingShow) => existingShow.title === candidate),
    );
    const { matchTitles, ...payload } = show;

    await apiUpdate({
      ...payload,
      title: resolvedTitle ?? show.title,
    });
    await delay(200);
  }

  // Step 3: Seed new shows
  console.log('\n🌱 Step 3: Inserindo novos shows...');
  for (const show of showsToCreate) {
    await apiCreate(show);
    await delay(200);
  }

  // Step 4: Verify
  console.log('\n✅ Step 4: Verificando...');
  const res = await fetch(`${API_BASE}/tvshows?limit=100`);
  const data = await res.json();
  console.log(`   Total de shows: ${data.result?.length || 0}`);

  const dirtyTitles = (data.result ?? [])
    .map((show) => show.title)
    .filter((title) => DIRTY_TITLE_PATTERNS.some((pattern) => pattern.test(title)));

  if (dirtyTitles.length > 0) {
    console.log(`   Titulos sujos remanescentes: ${dirtyTitles.join(', ')}`);
  } else {
    console.log('   Nenhum titulo sujo encontrado.');
  }

  if (data.result) {
    data.result.forEach(s => {
      console.log(`   - ${s.title} (idade: ${s.recommendedAge})`);
    });
  }

  console.log('\n=== Seed completo! ===');
}

main().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
