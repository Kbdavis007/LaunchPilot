import type { PainSignal, ScoredPainSignal } from '../domain/pain-signal.entity';
import { scoreSignal } from '../domain/wtp-score';

/** Attaches a deterministic WTP score to a harvested pain signal. */
export const scorePainSignal = (signal: PainSignal): ScoredPainSignal => ({
  ...signal,
  wtp: scoreSignal({
    pain: signal.pain,
    friction: signal.friction,
    monthlyBudgetUsd: signal.monthlyBudgetUsd,
  }),
});
