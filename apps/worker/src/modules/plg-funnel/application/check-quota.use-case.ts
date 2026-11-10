import { evaluateQuota, type QuotaDecision, type UsageWindow } from '../domain/tier.entity';

/** Applies the metering invariant to an inbound usage event. */
export const checkQuota = (window: UsageWindow): QuotaDecision => evaluateQuota(window);
