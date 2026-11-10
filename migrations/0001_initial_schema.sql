-- LaunchPilot & SaaS Pass — D1 schema (Module A/E/F foundation).
-- Every worker query binds parameters against these tables; raw interpolation is banned (EDGE-002).

CREATE TABLE IF NOT EXISTS pain_signals (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  pain INTEGER NOT NULL,
  friction INTEGER NOT NULL,
  monthly_budget_usd REAL NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pain_signals_pain ON pain_signals (pain);

CREATE TABLE IF NOT EXISTS usage_meter (
  account_id TEXT PRIMARY KEY,
  tier_id TEXT NOT NULL DEFAULT 'starter',
  tokens_used INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS pass_entitlements (
  token TEXT PRIMARY KEY,
  tier TEXT NOT NULL,
  monthly_quota INTEGER,
  tokens_consumed INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS blog_posts (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  published_at TEXT NOT NULL,
  phase TEXT NOT NULL,
  target_outcomes TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  author_handle TEXT NOT NULL,
  summary TEXT NOT NULL,
  tags TEXT NOT NULL,
  reading_time_minutes INTEGER NOT NULL,
  published INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts (published_at DESC);
