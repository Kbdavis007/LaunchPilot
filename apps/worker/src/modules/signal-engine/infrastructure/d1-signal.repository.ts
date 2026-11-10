import type { PainSignal, SignalSource } from '../domain/pain-signal.entity';

interface PainSignalRow {
  readonly id: string;
  readonly source: SignalSource;
  readonly excerpt: string;
  readonly pain: number;
  readonly friction: number;
  readonly monthly_budget_usd: number;
  readonly created_at: string;
}

export interface SignalRepository {
  save(signal: PainSignal): Promise<void>;
  listByMinPain(minPain: number): Promise<PainSignal[]>;
}

/** D1 adapter. Every statement is parameterized via `prepare(...).bind(...)` (EDGE-002). */
export const createD1SignalRepository = (db: D1Database): SignalRepository => ({
  async save(signal: PainSignal): Promise<void> {
    await db
      .prepare(
        'INSERT INTO pain_signals (id, source, excerpt, pain, friction, monthly_budget_usd, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
      )
      .bind(
        signal.id,
        signal.source,
        signal.excerpt,
        signal.pain,
        signal.friction,
        signal.monthlyBudgetUsd,
        signal.createdAt
      )
      .run();
  },

  async listByMinPain(minPain: number): Promise<PainSignal[]> {
    const { results } = await db
      .prepare(
        'SELECT id, source, excerpt, pain, friction, monthly_budget_usd, created_at FROM pain_signals WHERE pain >= ? ORDER BY created_at DESC LIMIT 100'
      )
      .bind(minPain)
      .all<PainSignalRow>();

    return results.map((row) => ({
      id: row.id,
      source: row.source,
      excerpt: row.excerpt,
      pain: row.pain,
      friction: row.friction,
      monthlyBudgetUsd: row.monthly_budget_usd,
      createdAt: row.created_at,
    }));
  },
});
