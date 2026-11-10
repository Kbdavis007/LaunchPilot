/** OpenSpec Module D — autonomous support triage classification. */

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorSignal {
  readonly code: string;
  readonly message: string;
  /** Number of distinct users affected in the observation window. */
  readonly affectedUsers: number;
  /** Fraction of traffic failing, 0-1. */
  readonly failureRate: number;
}

export interface TriageDecision {
  readonly severity: ErrorSeverity;
  /** Whether the ops runbook can mitigate without a human. */
  readonly autoMitigate: boolean;
  readonly runbook: string;
}

export const classifyError = (signal: ErrorSignal): TriageDecision => {
  const critical = signal.failureRate >= 0.25 || signal.affectedUsers >= 500;
  const high = signal.failureRate >= 0.1 || signal.affectedUsers >= 100;

  if (critical) {
    return { severity: 'critical', autoMitigate: false, runbook: 'runbooks/incident-escalation.md' };
  }
  if (high) {
    return { severity: 'high', autoMitigate: true, runbook: 'runbooks/edge-throttle-recovery.md' };
  }
  if (signal.failureRate >= 0.02 || signal.affectedUsers >= 10) {
    return { severity: 'medium', autoMitigate: true, runbook: 'runbooks/retry-backoff.md' };
  }
  return { severity: 'low', autoMitigate: true, runbook: 'runbooks/log-and-observe.md' };
};
