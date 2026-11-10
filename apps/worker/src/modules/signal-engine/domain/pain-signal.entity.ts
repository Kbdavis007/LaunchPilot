import type { WtpScore } from './wtp-score';

export type SignalSource = 'reddit' | 'github' | 'forum';

export interface PainSignal {
  readonly id: string;
  readonly source: SignalSource;
  readonly excerpt: string;
  readonly pain: number;
  readonly friction: number;
  readonly monthlyBudgetUsd: number;
  readonly createdAt: string;
}

export interface ScoredPainSignal extends PainSignal {
  readonly wtp: WtpScore;
}
