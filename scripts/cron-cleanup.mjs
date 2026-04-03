/**
 * Cron cleanup script: deletes TV shows with test/dirty titles every 1 hour.
 *
 * Usage:
 *   npx tsx scripts/cron-cleanup.mjs          # runs in loop every 1h
 *   npx tsx scripts/cron-cleanup.mjs --once    # runs once and exits
 */

const API_BASE = 'http://localhost:3001/api';
const INTERVAL_MS = 60 * 60 * 1000; // 1 hour

async function runCleanup() {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] Running cleanup...`);

  try {
    const res = await fetch(`${API_BASE}/cleanup/dirty-shows`, {
      method: 'POST',
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`  [ERROR] ${res.status}: ${body}`);
      return;
    }

    const data = await res.json();
    if (data.count === 0) {
      console.log('  Nenhum show sujo encontrado.');
    } else {
      console.log(`  Deletados ${data.count} show(s):`);
      data.deleted.forEach((title) => console.log(`    - ${title}`));
    }
  } catch (err) {
    console.error(`  [ERROR] ${err.message}`);
  }
}

async function main() {
  const once = process.argv.includes('--once');

  await runCleanup();

  if (once) {
    console.log('\n[cleanup] Modo --once: encerrando.');
    return;
  }

  console.log(`\n[cleanup] Proxima execucao em ${INTERVAL_MS / 1000 / 60} minutos...`);
  setInterval(runCleanup, INTERVAL_MS);
}

main().catch((err) => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
