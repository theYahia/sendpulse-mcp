const BASE_URL = "https://api.sendpulse.com";
const TIMEOUT = 15_000;
const MAX_RETRIES = 3;

let cachedToken: string | null = null;
let tokenExpiry = 0;

function getCredentials(): { id: string; secret: string } {
  const id = process.env.SENDPULSE_ID;
  const secret = process.env.SENDPULSE_SECRET;
  if (!id || !secret) {
    throw new Error("Переменные окружения SENDPULSE_ID и SENDPULSE_SECRET не заданы");
  }
  return { id, secret };
}

async function fetchWithRetry(url: string, options: RequestInit = {}, retries = MAX_RETRIES): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);

      if (response.ok) return response;

      if (response.status >= 500 && attempt < retries) {
        const delay = Math.min(1000 * 2 ** (attempt - 1), 8000);
        console.error(`[sendpulse-mcp] ${response.status} от ${url}, повтор через ${delay}мс (${attempt}/${retries})`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      const body = await response.text().catch(() => "");
      throw new Error(`HTTP ${response.status}: ${response.statusText}. ${body}`);
    } catch (error) {
      clearTimeout(timer);
      if (attempt === retries) throw error;
      if (error instanceof DOMException && error.name === "AbortError") {
        console.error(`[sendpulse-mcp] Таймаут ${url}, повтор (${attempt}/${retries})`);
        continue;
      }
      throw error;
    }
  }
  throw new Error("Все попытки исчерпаны");
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const { id, secret } = getCredentials();
  const response = await fetchWithRetry(`${BASE_URL}/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: id,
      client_secret: secret,
    }),
  });

  const data = await response.json() as { access_token: string; expires_in: number };
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken;
}

export async function apiGet(path: string): Promise<unknown> {
  const token = await getAccessToken();
  const response = await fetchWithRetry(`${BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export async function apiPost(path: string, body: Record<string, unknown>): Promise<unknown> {
  const token = await getAccessToken();
  const response = await fetchWithRetry(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return response.json();
}
