import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const API_PORT = process.env.PORT || 3001;
const API_HEALTH_URL = `http://localhost:${API_PORT}/api/health`;
const MAX_RETRIES = 30;
const RETRY_INTERVAL_MS = 1000;

function log(msg) {
  const ts = new Date().toLocaleTimeString();
  console.log(`\x1b[36m[dev]\x1b[0m ${ts} — ${msg}`);
}

// 1. Start API (BFF Fastify)
log(`Starting API on port ${API_PORT}...`);
const api = spawn('pnpm', ['dev:api'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: { ...process.env, PORT: String(API_PORT) },
});

api.on('error', (err) => {
  log(`API failed to start: ${err.message}`);
  process.exit(1);
});

// 2. Wait for API health check
let ready = false;
for (let i = 1; i <= MAX_RETRIES; i++) {
  await sleep(RETRY_INTERVAL_MS);
  try {
    const res = await fetch(API_HEALTH_URL);
    if (res.ok) {
      ready = true;
      log(`API ready (attempt ${i}/${MAX_RETRIES})`);
      break;
    }
  } catch {
    // API not up yet
    if (i % 5 === 0) log(`Waiting for API... (${i}/${MAX_RETRIES})`);
  }
}

if (!ready) {
  log(`API did not become ready after ${MAX_RETRIES}s. Aborting.`);
  api.kill();
  process.exit(1);
}

// 3. Start Frontend (Next.js)
log('Starting Next.js frontend on port 3000...');
const frontend = spawn('pnpm', ['dev:frontend'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

frontend.on('error', (err) => {
  log(`Frontend failed to start: ${err.message}`);
  api.kill();
  process.exit(1);
});

// Cleanup on exit
function cleanup() {
  log('Shutting down...');
  api.kill();
  frontend.kill();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
