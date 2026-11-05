// ═══════════════════════════════════════════════════════════
// SPOTIFY AUTH — PKCE flow (official Spotify Accounts API)
//
// Only OAuth2 session tokens. No audio.
// ═══════════════════════════════════════════════════════════

export interface SpotifyAuthState {
  accessToken: string | null;
  accessTokenExpiresAt: number | null;
  refreshToken: string | null;
  scope: string | null;
  scopeGrantedAt: number | null;
}

export interface SpotifyAuthProviderOptions {
  clientId: string;
  redirectUri: string;
  authorizationCode: string;
  codeVerifier: string;
  scopes: string[];
  state: string;
}

export interface SpotifyAuthConfig {
  clientId: string;
  redirectUri: string;
  authorizationCode: string;
  codeVerifier: string;
  scopes: string[];
  state: string;
}

export interface SpotifyAuthProviderType {
  getStoredAuth(): SpotifyAuthState;
  clearAuth(): void;
  isConnected(): boolean;
  generateCodeVerifier(): Promise<string>;
  generateCodeChallenge(verifier: string): Promise<string>;
  buildLoginUrl(options: SpotifyAuthProviderOptions): string;
  exchangeCode(options: SpotifyAuthProviderOptions): Promise<{ ok: true; accessToken: string; refreshToken: string; expiresIn: number; scope: string } | { ok: false; error: { kind: 'network' | 'server' | 'missing-config'; message: string } }>;
  refreshTokenExchange(options: { clientId: string; redirectUri: string; refreshToken: string }): Promise<{ ok: true; accessToken: string; expiresIn: number; scope: string } | { ok: false; error: { kind: 'network' | 'server' | 'missing-config'; message: string } }>;
}

const AUTH_KEY = 'mc_spotify_auth';
const EXPIRY_LEEWAY_MS = 60_000;

function readStore(): SpotifyAuthState {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return emptyStore();
    return JSON.parse(raw) as SpotifyAuthState;
  } catch {
    return emptyStore();
  }
}

function emptyStore(): SpotifyAuthState {
  return {
    accessToken: null,
    accessTokenExpiresAt: null,
    refreshToken: null,
    scope: null,
    scopeGrantedAt: null,
  };
}

function writeStore(s: SpotifyAuthState): void {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

function isAccessTokenValid(store: SpotifyAuthState): boolean {
  if (!store.accessToken || !store.accessTokenExpiresAt) return false;
  return Date.now() < store.accessTokenExpiresAt - EXPIRY_LEEWAY_MS;
}

export function getStoredAuth(): SpotifyAuthState {
  return readStore();
}

export function clearAuth(): void {
  writeStore(emptyStore());
}

export function isConnected(): boolean {
  const store = getStoredAuth();
  return !!store.accessToken && !!store.accessTokenExpiresAt;
}

export function generateCodeVerifier(): Promise<string> {
  return generateCodeVerifierFromRandom();
}

async function generateCodeVerifierFromRandom(): Promise<string> {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return base64url(bytes);
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const hash = await sha256(verifier);
  return base64url(new Uint8Array(hash));
}

function randomState(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return base64url(bytes);
}

const SPOTIFY_AUTHORIZE_BASE =
  'https://accounts.spotify.com/authorize';

export function buildLoginUrl(options: SpotifyAuthProviderOptions): string {
  const scope = options.scopes.join(' ');
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: options.clientId,
    redirect_uri: options.redirectUri,
    scope,
    state: options.state,
    code_challenge_method: 'S256',
    code_challenge: options.codeVerifier,
  });
  return `${SPOTIFY_AUTHORIZE_BASE}?${params.toString()}`;
}

const SPOTIFY_TOKEN_BASE = 'https://accounts.spotify.com/api/token';

export type TokenExchangeError =
  | { kind: 'network'; message: string }
  | { kind: 'server'; message: string }
  | { kind: 'missing-config'; message: string };

export async function exchangeCode(
  options: { clientId: string; redirectUri: string; code: string; codeVerifier: string },
): Promise<
  | { ok: true; accessToken: string; refreshToken: string; expiresIn: number; scope: string }
  | { ok: false; error: TokenExchangeError }
> {
  const { clientId, redirectUri, code, codeVerifier } = options;
  if (!clientId || !redirectUri) {
    return { ok: false, error: { kind: 'missing-config', message: 'Spotify client config is missing.' } };
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier,
  });

  try {
    const res = await fetch(SPOTIFY_TOKEN_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!res.ok) {
      let detail = `Token exchange failed (${res.status}).`;
      try {
        const json = (await res.json()) as { error_description?: string; error?: string };
        detail = json.error_description || json.error || detail;
      } catch {
        /* keep fallback */
      }
      return { ok: false, error: { kind: 'server', message: detail } };
    }

    const data = (await res.json()) as {
      access_token: string;
      refresh_token?: string;
      expires_in: number;
      scope: string;
    };

    return {
      ok: true,
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? '',
      expiresIn: data.expires_in,
      scope: data.scope,
    };
  } catch (err) {
    return { ok: false, error: { kind: 'network', message: 'Could not reach Spotify token endpoint.' } };
  }
}

export async function refreshTokenExchange(
  options: { clientId: string; redirectUri: string; refreshToken: string },
): Promise<
  | { ok: true; accessToken: string; expiresIn: number; scope: string }
  | { ok: false; error: TokenExchangeError }
> {
  const { clientId, redirectUri, refreshToken } = options;
  if (!clientId || !redirectUri || !refreshToken) {
    return { ok: false, error: { kind: 'missing-config', message: 'Spotify refresh config is incomplete.' } };
  }

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
  });

  try {
    const res = await fetch(SPOTIFY_TOKEN_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!res.ok) {
      let detail = `Token refresh failed (${res.status}).`;
      try {
        const json = (await res.json()) as { error_description?: string };
        detail = json.error_description || detail;
      } catch {
        /* keep fallback */
      }
      return { ok: false, error: { kind: 'server', message: detail } };
    }

    const data = (await res.json()) as { access_token: string; expires_in: number; scope: string };
    return { ok: true, accessToken: data.access_token, expiresIn: data.expires_in, scope: data.scope };
  } catch {
    return { ok: false, error: { kind: 'network', message: 'Could not reach Spotify token endpoint.' } };
  }
}

export function storeTokens(options: {
  accessToken: string;
  expiresIn: number;
  refreshToken?: string;
  scope: string;
}): void {
  const now = Date.now();
  writeStore({
    accessToken: options.accessToken,
    accessTokenExpiresAt: now + options.expiresIn * 1000,
    refreshToken: options.refreshToken ?? readStore().refreshToken ?? null,
    scope: options.scope,
    scopeGrantedAt: now,
  });
}

// ─── crypto helpers ───────────────────────────────────

async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest('SHA-256', data);
}

function base64url(bytes: Uint8Array): string {
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
