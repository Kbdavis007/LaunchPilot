export type { WtpInputs, WtpScore, WtpBand } from './domain/wtp-score';
export { computeWtpScore, scoreSignal, bandForScore, clampIndex } from './domain/wtp-score';
export type { PainSignal, ScoredPainSignal, SignalSource } from './domain/pain-signal.entity';
export { scorePainSignal } from './application/score-pain-signal.use-case';
export type { SignalRepository } from './infrastructure/d1-signal.repository';
export { createD1SignalRepository } from './infrastructure/d1-signal.repository';
