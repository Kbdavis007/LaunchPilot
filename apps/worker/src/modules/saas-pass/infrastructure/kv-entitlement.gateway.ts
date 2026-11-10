import type { PassEntitlement } from '../domain/entitlement.entity';

const ENTITLEMENT_TTL_SECONDS = 60;

interface EntitlementRow {
  readonly token: string;
  readonly tier: PassEntitlement['tier'];
  readonly monthly_quota: number | null;
  readonly tokens_consumed: number;
}

/** KV-first entitlement cache: sub-15ms lookups on the hot path, D1 as the source of truth. */
export const createEntitlementGateway = (kv: KVNamespace, db: D1Database) => ({
  async lookup(token: string): Promise<PassEntitlement | null> {
    const cached = await kv.get<PassEntitlement>(`entitlement:${token}`, 'json');
    if (cached !== null) return cached;

    const row = await db
      .prepare('SELECT token, tier, monthly_quota, tokens_consumed FROM pass_entitlements WHERE token = ?')
      .bind(token)
      .first<EntitlementRow>();
    if (row === null) return null;

    const entitlement: PassEntitlement = {
      token: row.token,
      tier: row.tier,
      monthlyQuota: row.monthly_quota,
      tokensConsumed: row.tokens_consumed,
    };
    await kv.put(`entitlement:${token}`, JSON.stringify(entitlement), {
      expirationTtl: ENTITLEMENT_TTL_SECONDS,
    });
    return entitlement;
  },
});
