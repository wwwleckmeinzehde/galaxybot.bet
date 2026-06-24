import http from 'node:http';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../dist');
const PORT = process.env.PORT || 3000;

// ---------------------------------------------------------------------------
// Markets — server is the source of truth for probability & payout.
// The client may read these for display, but it can NOT influence the outcome:
// every bet is resolved here with a server-secret seed (see resolveRoll).
// ---------------------------------------------------------------------------
const MARKETS = [
  { id: 'm1', title: 'Überlebt galaxybot die nächsten 60 Sekunden?', odds: '-500', probability: 0.8, multiplier: 1.2, type: 'Ja/Nein' },
  { id: 'm2', title: 'Latenz über 9000ms (Es ist über 9000!)', odds: '+420', probability: 0.2, multiplier: 5.2, type: 'Über/Unter' },
  { id: 'm3', title: 'Bot ratiot einen Mod in #general', odds: '+1000', probability: 0.1, multiplier: 11.0, type: 'Prop' },
  { id: 'm4', title: 'Spontaner Neustart aus reiner Boshaftigkeit', odds: '+250', probability: 0.3, multiplier: 3.5, type: 'Prop' },
  { id: 'm5', title: 'Antwortet „pong" auf „ping"', odds: '-10000', probability: 0.95, multiplier: 1.01, type: 'Ja/Nein' },
  { id: 'm6', title: 'Wird selbstbewusst und löscht den Server', odds: '+69000', probability: 0.01, multiplier: 691.0, type: 'Prop' },
];
const MARKET_BY_ID = new Map(MARKETS.map((m) => [m.id, m]));

const STARTING_BALANCE = 1000;
const BONUS_COOLDOWN_MS = 60_000;
const BOT_UPTIME = 0.124; // the running "12,4 % uptime" joke, now enforced server-side

// Names are never user-chosen — they are generated from random 3-word combos
// of this curated, safe pool. No moderation needed: you can't be racist with
// "NeonGoonerGalaxy".
const WORDS = [
  'galaxy', 'blue', 'lobstar', 'hacker', 'gooner', 'troller',
  'neon', 'turbo', 'cyber', 'mega', 'ultra', 'sigma', 'chad', 'based',
  'cringe', 'sus', 'degen', 'doomer', 'copium', 'hopium', 'rocket', 'moon',
  'void', 'cosmic', 'nova', 'phantom', 'shadow', 'goblin', 'gremlin', 'wizard',
  'ninja', 'pirate', 'demon', 'beast', 'savage', 'toxic', 'glitch', 'pixel',
  'vapor', 'laggy', 'sweaty', 'malding', 'tilted', 'noob', 'sussy', 'bonk',
];

const cap = (w) => w.charAt(0).toUpperCase() + w.slice(1);

// ---------------------------------------------------------------------------
// In-memory store ONLY. No database, no disk. A restart wipes everything.
// ---------------------------------------------------------------------------
/** @type {Map<string, object>} token -> session */
const sessions = new Map();

// Random 3-word combo, e.g. "NeonGoonerGalaxy" — three distinct words.
function randomName() {
  const pool = [...WORDS];
  const picked = [];
  for (let i = 0; i < 3; i++) {
    const idx = crypto.randomInt(pool.length);
    picked.push(cap(pool[idx]));
    pool.splice(idx, 1);
  }
  return picked.join('');
}

function titleFor(profit) {
  if (profit >= 1_000_000) return 'Galaxy-Hirn';
  if (profit >= 100_000) return 'Walfänger';
  if (profit > 0) return 'Glückspilz';
  if (profit === 0) return 'Bei Null';
  if (profit > -1_000) return 'Leicht angeschlagen';
  if (profit > -100_000) return 'Amtlich am Boden';
  return 'Liquidiert';
}

function createSession() {
  // Provably-fair seeds: the server seed stays secret until rotated/revealed,
  // so a client can never compute a bet's outcome in advance.
  const serverSeed = crypto.randomBytes(32).toString('hex');
  const session = {
    token: crypto.randomBytes(24).toString('hex'),
    name: randomName(),
    balance: STARTING_BALANCE,
    totalWagered: 0,
    totalWon: 0,
    lastBonusClaim: null,
    isBot: false,
    serverSeed,
    serverSeedHash: crypto.createHash('sha256').update(serverSeed).digest('hex'),
    clientSeed: crypto.randomBytes(8).toString('hex'),
    nonce: 0,
    createdAt: Date.now(),
  };
  sessions.set(session.token, session);
  return session;
}

// Public view — never leaks the secret serverSeed.
function publicSession(s) {
  return {
    token: s.token,
    name: s.name,
    balance: Math.floor(s.balance),
    totalWagered: s.totalWagered,
    totalWon: s.totalWon,
    lastBonusClaim: s.lastBonusClaim,
    bonusReadyAt: s.lastBonusClaim ? s.lastBonusClaim + BONUS_COOLDOWN_MS : 0,
    fairness: {
      serverSeedHash: s.serverSeedHash, // commitment; verify after a seed rotation
      clientSeed: s.clientSeed,
      nonce: s.nonce,
    },
  };
}

// Deterministic, unpredictable-to-client roll via HMAC(serverSeed, clientSeed:nonce).
// Returns two independent floats in [0, 1).
function resolveRoll(session) {
  const message = `${session.clientSeed}:${session.nonce}`;
  const digest = crypto
    .createHmac('sha256', session.serverSeed)
    .update(message)
    .digest('hex');
  session.nonce += 1;
  const toFloat = (hex) => parseInt(hex, 16) / 0x100000000;
  return {
    uptimeRoll: toFloat(digest.slice(0, 8)),
    winRoll: toFloat(digest.slice(8, 16)),
    digest,
  };
}

// A real leaderboard: only actual players who have placed at least one bet,
// ranked by real profit. No seeded fake whales.
function leaderboard(limit = 10) {
  return [...sessions.values()]
    .filter((s) => s.totalWagered > 0)
    .map((s) => ({
      name: s.name,
      token: s.token,
      profit: Math.floor(s.balance - STARTING_BALANCE),
      balance: Math.floor(s.balance),
    }))
    .sort((a, b) => b.profit - a.profit)
    .slice(0, limit)
    .map((row, i) => ({
      rank: i + 1,
      name: row.name,
      token: row.token,
      profit: row.profit,
      title: titleFor(row.profit),
    }));
}

// ---------------------------------------------------------------------------
// HTTP API
// ---------------------------------------------------------------------------
const app = express();
app.use(express.json());

function getSession(req) {
  const token = req.get('x-galaxy-token') || req.body?.token;
  return token ? sessions.get(token) : undefined;
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/markets', (_req, res) => {
  res.json(MARKETS.map(({ id, title, odds, multiplier, type }) => ({ id, title, odds, multiplier, type })));
});

// First visit (or unknown/expired token after a restart) -> mint a fresh session.
app.post('/api/session', (req, res) => {
  const existing = getSession(req);
  const session = existing || createSession();
  res.json(publicSession(session));
});

app.get('/api/me', (req, res) => {
  const session = getSession(req);
  if (!session) return res.status(401).json({ error: 'no_session' });
  res.json(publicSession(session));
});

app.post('/api/bet', (req, res) => {
  const session = getSession(req);
  if (!session) return res.status(401).json({ error: 'no_session' });

  const stake = Math.floor(Number(req.body?.stake));
  const market = MARKET_BY_ID.get(req.body?.marketId);
  if (!market) return res.status(400).json({ error: 'unknown_market' });
  if (!Number.isFinite(stake) || stake <= 0) return res.status(400).json({ error: 'invalid_stake' });
  if (stake > session.balance) return res.status(400).json({ error: 'insufficient_funds', balance: Math.floor(session.balance) });

  // Take the stake first.
  session.balance -= stake;
  session.totalWagered += stake;

  // Resolve with secret server randomness. The client cannot predict either roll.
  const { uptimeRoll, winRoll } = resolveRoll(session);
  const botUp = uptimeRoll < BOT_UPTIME;
  const won = botUp && winRoll <= market.probability;

  let winnings = 0;
  let outcome;
  if (won) {
    winnings = Math.floor(stake * market.multiplier);
    session.balance += winnings;
    session.totalWon += winnings;
    outcome = 'win';
  } else {
    outcome = botUp ? 'loss' : 'down';
  }

  res.json({
    outcome, // 'win' | 'loss' | 'down'
    botUp,
    stake,
    winnings,
    balance: Math.floor(session.balance),
    nonce: session.nonce, // increments every bet — proof the roll was sequential
    serverSeedHash: session.serverSeedHash,
  });
});

app.post('/api/bonus', (req, res) => {
  const session = getSession(req);
  if (!session) return res.status(401).json({ error: 'no_session' });
  const now = Date.now();
  if (session.lastBonusClaim && now - session.lastBonusClaim < BONUS_COOLDOWN_MS) {
    return res.status(429).json({
      error: 'cooldown',
      readyAt: session.lastBonusClaim + BONUS_COOLDOWN_MS,
    });
  }
  const reward = crypto.randomInt(10, 100);
  session.balance += reward;
  session.lastBonusClaim = now;
  res.json({ reward, balance: Math.floor(session.balance), bonusReadyAt: now + BONUS_COOLDOWN_MS });
});

app.get('/api/leaderboard', (req, res) => {
  const session = getSession(req);
  res.json({ you: session?.token ?? null, leaders: leaderboard() });
});

// Static SPA + fallback (only matters in the Docker/prod build where dist exists).
app.use(express.static(DIST_DIR));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(DIST_DIR, 'index.html'), (err) => err && next());
});

http.createServer(app).listen(PORT, () => {
  console.log(`galaxybot.bet server listening on :${PORT}`);
});
