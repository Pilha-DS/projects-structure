/**
 * API pública do package `network`.
 *
 * Configure aqui o cliente HTTP e os interceptors usados pelos apps.
 * Cada app cria a instância com a sua baseUrl (ver INSTALL.md).
 */

export class HttpClient {
  /**
   * @param {object} options
   * @param {string} options.baseUrl - URL base da API (ex.: VITE_API_URL)
   * @param {() => Record<string, string>} [options.getHeaders] - headers por request
   */
  constructor({ baseUrl, getHeaders } = {}) {
    if (!baseUrl) {
      throw new Error('HttpClient: baseUrl é obrigatória');
    }
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.getHeaders = getHeaders ?? (() => ({}));
  }

  /**
   * @param {string} path
   * @param {RequestInit} [init]
   * @returns {Promise<unknown>}
   */
  async request(path, init = {}) {
    const url = `${this.baseUrl}${path}`;

    const response = await fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...this.getHeaders(),
        ...init.headers,
      },
    });

    if (!response.ok) {
      throw new HttpError(response.status, await parseBody(response));
    }

    return parseBody(response);
  }

  get(path, init) {
    return this.request(path, { ...init, method: 'GET' });
  }

  post(path, body, init) {
    return this.request(path, {
      ...init,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
}

export class HttpError extends Error {
  constructor(status, body) {
    super(`HTTP ${status}`);
    this.name = 'HttpError';
    this.status = status;
    this.body = body;
  }
}

async function parseBody(response) {
  if (response.status === 204) return null;

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}
