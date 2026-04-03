import { env } from '../config/env.js';

const TIMEOUT_MS = 10_000;

const authHeader = `Basic ${Buffer.from(`${env.GOLEDGER_USERNAME}:${env.GOLEDGER_PASSWORD}`).toString('base64')}`;

interface GoLedgerRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
}

interface GoLedgerError {
  status: number;
  message: string;
}

function isGoLedgerError(err: unknown): err is GoLedgerError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'status' in err &&
    'message' in err
  );
}

async function request<T = unknown>(
  path: string,
  options: GoLedgerRequestOptions = {},
): Promise<T> {
  const { method = 'GET', body } = options;
  const url = `${env.GOLEDGER_BASE_URL}${path}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (!res.ok) {
      let message = res.statusText;
      try {
        const errBody = await res.text();
        message = errBody || message;
      } catch {
        // keep statusText
      }

      const error: GoLedgerError = { status: res.status, message };
      throw error;
    }

    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      const error: GoLedgerError = {
        status: 408,
        message: `Request to GoLedger timed out after ${TIMEOUT_MS}ms`,
      };
      throw error;
    }
    if (isGoLedgerError(err)) throw err;

    const error: GoLedgerError = {
      status: 502,
      message: err instanceof Error ? err.message : 'Unknown GoLedger API error',
    };
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

// --- Query operations (read-only) ---

export function getSchema(): Promise<unknown> {
  return request('/api/query/getSchema');
}

export function getAssetSchema(assetType: string): Promise<unknown> {
  return request('/api/query/getSchema', {
    method: 'POST',
    body: { assetType },
  });
}

export function search(query: {
  selector: Record<string, unknown>;
  limit?: number;
  bookmark?: string;
}): Promise<unknown> {
  return request('/api/query/search', {
    method: 'POST',
    body: { query },
  });
}

export function readAsset(key: Record<string, unknown>): Promise<unknown> {
  return request('/api/query/readAsset', {
    method: 'POST',
    body: { key },
  });
}

// --- Invoke operations (mutations) ---

export function createAsset(
  asset: Array<Record<string, unknown>>,
): Promise<unknown> {
  return request('/api/invoke/createAsset', {
    method: 'POST',
    body: { asset },
  });
}

export function updateAsset(
  update: Record<string, unknown>,
): Promise<unknown> {
  return request('/api/invoke/updateAsset', {
    method: 'PUT',
    body: { update },
  });
}

export function deleteAsset(
  key: Record<string, unknown>,
): Promise<unknown> {
  return request('/api/invoke/deleteAsset', {
    method: 'DELETE',
    body: { key },
  });
}
