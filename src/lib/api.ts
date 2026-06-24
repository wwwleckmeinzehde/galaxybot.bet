// Tiny API client for the galaxybot.bet backend.
// The anonymous token is created on first visit and kept in localStorage; the
// server is authoritative for balance, bet outcomes and the leaderboard.

const TOKEN_KEY = 'galaxybot-token';

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function setToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* ignore (private mode etc.) */
  }
}

export interface ApiError extends Error {
  status: number;
  data: any;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'x-galaxy-token': token } : {}),
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.error || `HTTP ${res.status}`) as ApiError;
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data as T;
}

export interface Session {
  token: string;
  name: string;
  balance: number;
  totalWagered: number;
  totalWon: number;
  lastBonusClaim: number | null;
  bonusReadyAt: number;
  fairness: { serverSeedHash: string; clientSeed: string; nonce: number };
}

export interface Market {
  id: string;
  title: string;
  odds: string;
  multiplier: number;
  type: string;
}

export interface BetResult {
  outcome: 'win' | 'loss' | 'down';
  botUp: boolean;
  stake: number;
  winnings: number;
  balance: number;
  nonce: number;
  serverSeedHash: string;
}

export interface LeaderRow {
  rank: number;
  name: string;
  token: string;
  profit: number;
  title: string;
}

// Create (or restore) the anonymous session; persists the returned token.
export async function initSession(): Promise<Session> {
  const session = await request<Session>('/session', { method: 'POST' });
  setToken(session.token);
  return session;
}

export const getMarkets = () => request<Market[]>('/markets');

export const placeBet = (marketId: string, stake: number) =>
request<BetResult>('/bet', {
  method: 'POST',
  body: JSON.stringify({ marketId, stake })
});

export const claimBonus = () =>
request<{reward: number;balance: number;bonusReadyAt: number;}>('/bonus', {
  method: 'POST'
});

export const getLeaderboard = () =>
request<{you: string | null;leaders: LeaderRow[];}>('/leaderboard');
