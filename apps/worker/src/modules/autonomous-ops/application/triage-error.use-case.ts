import { classifyError, type ErrorSignal, type TriageDecision } from '../domain/triage.entity';

/** Classifies an inbound error signal into a severity band and runbook. */
export const triageError = (signal: ErrorSignal): TriageDecision => classifyError(signal);
