/** OpenSpec Module E — SaaS Pass entitlements and the 70% developer revenue split. */

export type PassTier = 'starter' | 'pro' | 'unlimited';

export interface PassEntitlement {
  readonly token: string;
  readonly tier: PassTier;
  /** Monthly token quota; `null` for unlimited. */
  readonly monthlyQuota: number | null;
  readonly tokensConsumed: number;
}

export interface EntitlementDecision {
  readonly entitled: boolean;
  readonly reason: 'ok' | 'quota_exhausted' | 'unknown_token';
}

export const verifyEntitlement = (entitlement: PassEntitlement | null): EntitlementDecision => {
  if (entitlement === null) {
    return { entitled: false, reason: 'unknown_token' };
  }
  if (entitlement.monthlyQuota === null) {
    return { entitled: true, reason: 'ok' };
  }
  return entitlement.tokensConsumed < entitlement.monthlyQuota
    ? { entitled: true, reason: 'ok' }
    : { entitled: false, reason: 'quota_exhausted' };
};

export const DEVELOPER_REVENUE_SHARE = 0.7;

/** Splits net subscription revenue into developer pool and platform retention. */
export const splitRevenue = (netRevenueUsd: number): { developerPoolUsd: number; platformUsd: number } => {
  const developerPoolUsd = Math.round(netRevenueUsd * DEVELOPER_REVENUE_SHARE * 100) / 100;
  const platformUsd = Math.round((netRevenueUsd - developerPoolUsd) * 100) / 100;
  return { developerPoolUsd, platformUsd };
};
