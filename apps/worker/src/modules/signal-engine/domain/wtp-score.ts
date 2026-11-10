/**
 * WTP scoring — OpenSpec Module A signal-engine domain invariant.
 * Formula: min(100, round((pain*3.5 + friction*2.5 + log10(budget)*12.0) / 0.75))
 */

export interface WtpInputs {
  /** Pain severity index, 1-10. */
  readonly pain: number;
  /** DIY replacement friction, 1-10. */
  readonly friction: number;
  /** Target monthly tooling budget in USD. */
  readonly monthlyBudgetUsd: number;
}

export type WtpBand = 'weak' | 'moderate' | 'strong';

export interface WtpScore {
  readonly score: number;
  readonly band: WtpBand;
}

export const clampIndex = (value: number): number => Math.min(10, Math.max(1, value));

export const computeWtpScore = ({ pain, friction, monthlyBudgetUsd }: WtpInputs): number => {
  const budget = Math.max(10, monthlyBudgetUsd);
  const raw = (clampIndex(pain) * 3.5 + clampIndex(friction) * 2.5 + Math.log10(budget) * 12.0) / 0.75;
  return Math.min(100, Math.round(raw));
};

export const bandForScore = (score: number): WtpBand =>
  score >= 70 ? 'strong' : score >= 50 ? 'moderate' : 'weak';

export const scoreSignal = (inputs: WtpInputs): WtpScore => {
  const score = computeWtpScore(inputs);
  return { score, band: bandForScore(score) };
};
