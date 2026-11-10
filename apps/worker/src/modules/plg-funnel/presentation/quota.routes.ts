import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../../../core/env';
import { checkQuota } from '../application/check-quota.use-case';
import { TIERS } from '../domain/tier.entity';

const quotaSchema = z.object({
  tierId: z.enum(['starter', 'pro', 'unlimited']),
  tokensUsed: z.number().int().min(0),
});

export const createQuotaRouter = (): Hono<AppEnv> => {
  const router = new Hono<AppEnv>();

  router.get('/plg/tiers', (c) => c.json({ tiers: Object.values(TIERS) }));

  router.post('/plg/quota', async (c) => {
    const parsed = quotaSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) {
      return c.json({ error: 'invalid_quota_payload' }, 400);
    }
    return c.json(checkQuota(parsed.data));
  });

  return router;
};
