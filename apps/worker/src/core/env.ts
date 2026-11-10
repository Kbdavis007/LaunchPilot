/**
 * Cloudflare Worker runtime bindings.
 * Web Standards only — no Node.js core modules are permitted in this graph (EDGE-001).
 */

export interface Bindings {
  /** Cloudflare D1 SQL database (parameterized prepared statements only). */
  readonly DB: D1Database;
  /** Cloudflare KV cache for entitlements, blog metadata, and signal snapshots. */
  readonly CACHE_KV: KVNamespace;
  /** Cloudflare Vectorize index for documentation and error-triage retrieval. */
  readonly DOC_INDEX: VectorizeIndex;
  /** Deployment environment name. */
  readonly ENVIRONMENT: string;
  /** p95 latency budget in milliseconds (PERF-001). */
  readonly TARGET_LATENCY_P95_MS: string;
}

export interface RequestContext {
  /** Correlation identifier propagated across slices via the event envelope. */
  readonly requestId: string;
  /** Monotonic start timestamp used for the sub-50ms latency budget. */
  readonly startedAt: number;
}

export interface AppEnv {
  Bindings: Bindings;
  Variables: RequestContext;
}

export const DEFAULT_TARGET_LATENCY_P95_MS = 50;

export const readTargetLatencyP95Ms = (bindings: Bindings): number => {
  const parsed = Number(bindings.TARGET_LATENCY_P95_MS);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TARGET_LATENCY_P95_MS;
};
