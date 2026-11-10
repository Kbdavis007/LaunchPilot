/**
 * Sub-50ms latency accounting (PERF-001).
 * Every response records X-Edge-Latency-Ms so the p95 SLA is externally observable.
 */

export const EDGE_LATENCY_HEADER = 'X-Edge-Latency-Ms';

export const elapsedMs = (startedAt: number, now: number = Date.now()): number =>
  Math.max(0, Math.round(now - startedAt));

export const withinBudget = (elapsed: number, budgetMs: number): boolean => elapsed < budgetMs;
