import type { TierId } from '../domain/tier.entity';

export interface UsageRepository {
  increment(accountId: string, tokens: number): Promise<number>;
  read(accountId: string, tierId: TierId): Promise<number>;
}

interface UsageRow {
  readonly tokens_used: number;
}

/** D1 adapter for monthly token metering (parameterized statements only). */
export const createD1UsageRepository = (db: D1Database): UsageRepository => ({
  async increment(accountId: string, tokens: number): Promise<number> {
    const row = await db
      .prepare(
        'INSERT INTO usage_meter (account_id, tokens_used) VALUES (?, ?) ON CONFLICT(account_id) DO UPDATE SET tokens_used = tokens_used + ? RETURNING tokens_used'
      )
      .bind(accountId, tokens, tokens)
      .first<UsageRow>();
    return row?.tokens_used ?? tokens;
  },

  async read(accountId: string, tierId: TierId): Promise<number> {
    const row = await db
      .prepare('SELECT tokens_used FROM usage_meter WHERE account_id = ? AND tier_id = ?')
      .bind(accountId, tierId)
      .first<UsageRow>();
    return row?.tokens_used ?? 0;
  },
});
