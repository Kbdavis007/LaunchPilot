import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../../../core/env';
import { scorePainSignal } from '../application/score-pain-signal.use-case';
import type { SignalSource } from '../domain/pain-signal.entity';
import { createD1SignalRepository } from '../infrastructure/d1-signal.repository';

const signalSchema = z.object({
  id: z.string().min(1),
  source: z.enum(['reddit', 'github', 'forum']),
  excerpt: z.string().min(1).max(2000),
  pain: z.number().int().min(1).max(10),
  friction: z.number().int().min(1).max(10),
  monthlyBudgetUsd: z.number().min(10).max(100000),
  createdAt: z.string().min(1),
});

export const createSignalRouter = (): Hono<AppEnv> => {
  const router = new Hono<AppEnv>();

  router.post('/signals', async (c) => {
    const parsed = signalSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) {
      return c.json({ error: 'invalid_signal_payload' }, 400);
    }

    const repository = createD1SignalRepository(c.env.DB);
    await repository.save(parsed.data);
    return c.json(scorePainSignal(parsed.data), 201);
  });

  router.get('/signals', async (c) => {
    const minPain = Number(c.req.query('minPain') ?? '0');
    const repository = createD1SignalRepository(c.env.DB);
    const signals = await repository.listByMinPain(Number.isFinite(minPain) ? minPain : 0);
    return c.json({ signals: signals.map(scorePainSignal) });
  });

  return router;
};

export const SIGNAL_SOURCES: readonly SignalSource[] = ['reddit', 'github', 'forum'];
