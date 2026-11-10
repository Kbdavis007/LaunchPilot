/** OpenSpec Module C — product-led growth metering and tier gating. */

export type TierId = 'starter' | 'pro' | 'unlimited';

export interface Tier {
  readonly id: TierId;
  readonly monthlyPriceUsd: number;
  /** Monthly system tokens; `null` means unlimited. */
  readonly monthlyTokens: number | null;
}

export const TIERS: Readonly<Record<TierId, Tier>> = {
  starter: { id: 'starter', monthlyPriceUsd: 19, monthlyTokens: 100 },
  pro: { id: 'pro', monthlyPriceUsd: 49, monthlyTokens: 500 },
  unlimited: { id: 'unlimited', monthlyPriceUsd: 99, monthlyTokens: null },
};

export interface UsageWindow {
  readonly tierId: TierId;
  readonly tokensUsed: number;
}

export interface QuotaDecision {
  readonly allowed: boolean;
  /** Remaining tokens, or `null` when the tier is unlimited. */
  readonly remaining: number | null;
  readonly paywallTriggered: boolean;
}

export const evaluateQuota = ({ tierId, tokensUsed }: UsageWindow): QuotaDecision => {
  const tier = TIERS[tierId];
  if (tier.monthlyTokens === null) {
    return { allowed: true, remaining: null, paywallTriggered: false };
  }
  const remaining = Math.max(0, tier.monthlyTokens - tokensUsed);
  const allowed = remaining > 0;
  return { allowed, remaining, paywallTriggered: !allowed };
};
