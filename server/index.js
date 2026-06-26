import http from 'node:http';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import express from 'express';

const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../dist');
const DB_PATH = path.resolve(__dirname, '../storage.sqlite3');
const PORT = process.env.PORT || 3000;

// ---------------------------------------------------------------------------
// SQLite setup
// ---------------------------------------------------------------------------
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    token       TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    balance     REAL NOT NULL DEFAULT 1000,
    total_wagered REAL NOT NULL DEFAULT 0,
    total_won   REAL NOT NULL DEFAULT 0,
    last_bonus  INTEGER,
    server_seed TEXT NOT NULL,
    server_seed_hash TEXT NOT NULL,
    client_seed TEXT NOT NULL,
    nonce       INTEGER NOT NULL DEFAULT 0,
    created_at  INTEGER NOT NULL,
    last_seen   INTEGER NOT NULL
  );
`);

// ---------------------------------------------------------------------------
// Markets
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
const BOT_UPTIME = 0.124;
const INACTIVE_DAYS = 30;
const INACTIVE_MS = INACTIVE_DAYS * 24 * 60 * 60 * 1000;

const WORDS = [
  'galaxy', 'blue', 'lobster', 'hacker', 'gooner', 'troller',
  'neon', 'turbo', 'cyber', 'mega', 'ultra', 'sigma', 'chad', 'based',
  'cringe', 'sus', 'degen', 'doomer', 'copium', 'hopium', 'rocket', 'moon',
  'void', 'cosmic', 'nova', 'phantom', 'shadow', 'goblin', 'gremlin', 'wizard',
  'ninja', 'pirate', 'demon', 'beast', 'savage', 'toxic', 'glitch', 'pixel',
  'vapor', 'laggy', 'sweaty', 'malding', 'tilted', 'noob', 'sussy', 'bonk',
  'brain', 'rot', 'gig', 'chad', 'schizo', 'yap', 'npc', 'core',
  'rizz', 'unrizz', 'low', 'high', 'fr', 'ngl', 'idc',
  'touch', 'grass', 'ratio', 'mid', 'peak', 'aura', 'farm',
  'ski', 'bidi', 'toil', 'grim', 'ohio', 'delu', 'buss',
  'based', 'crack', 'lock', 'grind', 'doom', 'scroll',
  'cope', 'hope', 'mal', 'seethe', 'post',
  'disc', 'terminal', 'online', 'speed', 'min', 'max',
  'loot', 'skin', 'walker', 'glitch', 'void', 'pilled',
  'sigma', 'alpha', 'beta', 'omega', 'chat', 'ai', 'emote',
  'clown', 'salt', 'tilt', 'larp'
];

const cap = (w) => w.charAt(0).toUpperCase() + w.slice(1);

// ---------------------------------------------------------------------------
// Prepared statements
// ---------------------------------------------------------------------------
const stmtGetSession    = db.prepare('SELECT * FROM sessions WHERE token = ?');
const stmtInsertSession = db.prepare(`
  INSERT INTO sessions (token, name, balance, total_wagered, total_won,
    last_bonus, server_seed, server_seed_hash, client_seed, nonce, created_at, last_seen)
  VALUES (@token, @name, @balance, @total_wagered, @total_won,
    @last_bonus, @server_seed, @server_seed_hash, @client_seed, @nonce, @created_at, @last_seen)
`);
const stmtUpdateSession = db.prepare(`
  UPDATE sessions SET balance=@balance, total_wagered=@total_wagered, total_won=@total_won,
    last_bonus=@last_bonus, nonce=@nonce, last_seen=@last_seen
  WHERE token=@token
`);
const stmtTouchSession  = db.prepare('UPDATE sessions SET last_seen=? WHERE token=?');
const stmtDeleteInactive = db.prepare('DELETE FROM sessions WHERE last_seen < ?');
const stmtLeaderboard   = db.prepare(`
  SELECT token, name, balance FROM sessions WHERE total_wagered > 0
  ORDER BY (balance - 1000) DESC LIMIT 10
`);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
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
  if (profit >= 100_000)   return 'Walfänger';
  if (profit > 0)          return 'Glückspilz';
  if (profit === 0)        return 'Bei Null';
  if (profit > -1_000)     return 'Leicht angeschlagen';
  if (profit > -100_000)   return 'Amtlich am Boden';
  return 'Liquidiert';
}

function createSession() {
  const serverSeed = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const session = {
    token:            crypto.randomBytes(24).toString('hex'),
    name:             randomName(),
    balance:          STARTING_BALANCE,
    total_wagered:    0,
    total_won:        0,
    last_bonus:       null,
    server_seed:      serverSeed,
    server_seed_hash: crypto.createHash('sha256').update(serverSeed).digest('hex'),
    client_seed:      crypto.randomBytes(8).toString('hex'),
    nonce:            0,
    created_at:       now,
    last_seen:        now,
  };
  stmtInsertSession.run(session);
  return session;
}

function publicSession(s) {
  return {
    token:          s.token,
    name:           s.name,
    balance:        Math.floor(s.balance),
    totalWagered:   s.total_wagered,
    totalWon:       s.total_won,
    lastBonusClaim: s.last_bonus,
    bonusReadyAt:   s.last_bonus ? s.last_bonus + BONUS_COOLDOWN_MS : 0,
    fairness: {
      serverSeedHash: s.server_seed_hash,
      clientSeed:     s.client_seed,
      nonce:          s.nonce,
    },
  };
}

function resolveRoll(session) {
  const message = `${session.client_seed}:${session.nonce}`;
  const digest = crypto
    .createHmac('sha256', session.server_seed)
    .update(message)
    .digest('hex');
  session.nonce += 1;
  const toFloat = (hex) => parseInt(hex, 16) / 0x100000000;
  return {
    uptimeRoll: toFloat(digest.slice(0, 8)),
    winRoll:    toFloat(digest.slice(8, 16)),
    digest,
  };
}

function leaderboard() {
  return stmtLeaderboard.all().map((row, i) => ({
    rank:   i + 1,
    name:   row.name,
    token:  row.token,
    profit: Math.floor(row.balance - STARTING_BALANCE),
    title:  titleFor(Math.floor(row.balance - STARTING_BALANCE)),
  }));
}

// ---------------------------------------------------------------------------
// Cleanup: delete sessions inactive for 30 days (runs every 6 hours)
// ---------------------------------------------------------------------------
function runCleanup() {
  const cutoff = Date.now() - INACTIVE_MS;
  const result = stmtDeleteInactive.run(cutoff);
  if (result.changes > 0) {
    console.log(`[cleanup] Deleted ${result.changes} inactive session(s) (>${INACTIVE_DAYS} days)`);
  }
}
runCleanup();
setInterval(runCleanup, 6 * 60 * 60 * 1000);

// ---------------------------------------------------------------------------
// HTTP API
// ---------------------------------------------------------------------------
const app = express();
app.use(express.json());

function getSession(req) {
  const token = req.get('x-galaxy-token') || req.body?.token;
  if (!token) return undefined;
  const session = stmtGetSession.get(token);
  if (session) stmtTouchSession.run(Date.now(), token);
  return session || undefined;
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/markets', (_req, res) => {
  res.json(MARKETS.map(({ id, title, odds, multiplier, type }) => ({ id, title, odds, multiplier, type })));
});

app.post('/api/session', (req, res) => {
  const existing = getSession(req);
  if (existing) return res.json(publicSession(existing));

  const session = createSession();
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

  const stake  = Math.floor(Number(req.body?.stake));
  const market = MARKET_BY_ID.get(req.body?.marketId);
  if (!market)                                       return res.status(400).json({ error: 'unknown_market' });
  if (!Number.isFinite(stake) || stake <= 0)         return res.status(400).json({ error: 'invalid_stake' });
  if (stake > session.balance)                       return res.status(400).json({ error: 'insufficient_funds', balance: Math.floor(session.balance) });

  session.balance       -= stake;
  session.total_wagered += stake;

  const { uptimeRoll, winRoll } = resolveRoll(session);
  const botUp = uptimeRoll < BOT_UPTIME;
  const won   = botUp && winRoll <= market.probability;

  let winnings = 0;
  let outcome;
  if (won) {
    winnings         = Math.floor(stake * market.multiplier);
    session.balance += winnings;
    session.total_won += winnings;
    outcome = 'win';
  } else {
    outcome = botUp ? 'loss' : 'down';
  }

  stmtUpdateSession.run({
    balance:       session.balance,
    total_wagered: session.total_wagered,
    total_won:     session.total_won,
    last_bonus:    session.last_bonus,
    nonce:         session.nonce,
    last_seen:     Date.now(),
    token:         session.token,
  });

  res.json({
    outcome,
    botUp,
    stake,
    winnings,
    balance:        Math.floor(session.balance),
    nonce:          session.nonce,
    serverSeedHash: session.server_seed_hash,
  });
});

app.post('/api/bonus', (req, res) => {
  const session = getSession(req);
  if (!session) return res.status(401).json({ error: 'no_session' });

  const now = Date.now();
  if (session.last_bonus && now - session.last_bonus < BONUS_COOLDOWN_MS) {
    return res.status(429).json({
      error:   'cooldown',
      readyAt: session.last_bonus + BONUS_COOLDOWN_MS,
    });
  }

  const reward       = crypto.randomInt(10, 100);
  session.balance   += reward;
  session.last_bonus = now;

  stmtUpdateSession.run({
    balance:       session.balance,
    total_wagered: session.total_wagered,
    total_won:     session.total_won,
    last_bonus:    session.last_bonus,
    nonce:         session.nonce,
    last_seen:     now,
    token:         session.token,
  });

  res.json({ reward, balance: Math.floor(session.balance), bonusReadyAt: now + BONUS_COOLDOWN_MS });
});

app.get('/api/leaderboard', (req, res) => {
  const session = getSession(req);
  res.json({ you: session?.token ?? null, leaders: leaderboard() });
});

// Static SPA + fallback
app.use(express.static(DIST_DIR));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(DIST_DIR, 'index.html'), (err) => err && next());
});

http.createServer(app).listen(PORT, () => {
  console.log(`galaxybot.bet server listening on :${PORT} | DB: ${DB_PATH}`);
});
