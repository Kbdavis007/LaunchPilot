import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../../../core/env';
import { packageForAcquisition } from '../application/package-exit.use-case';
import { authorizePassRequest } from '../application/verify-entitlement.use-case';
import { splitRevenue } from '../domain/entitlement.entity';
import { createEntitlementGateway } from '../infrastructure/kv-entitlement.gateway';

const exitSchema = z.object({
  generatedAt: z.string().min(1),
  monthlyRecurringRevenueUsd: z.number().min(0),
  monthlyChurnRate: z.number().min(0).max(1),
  activeSubscribers: z.number().int().min(0),
  schemaMigrations: z.number().int().min(0),
});

const revenueSchema = z.object({ netRevenueUsd: z.number().min(0) });

export const createPassRouter = (): Hono<AppEnv> => {
  const router = new Hono<AppEnv>();

  router.get('/pass/entitlement', async (c) => {
    const token = c.req.header('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
    const gateway = createEntitlementGateway(c.env.CACHE_KV, c.env.DB);
    const entitlement = token.length > 0 ? await gateway.lookup(token) : null;
    const decision = authorizePassRequest(entitlement);
    return c.json(decision, decision.entitled ? 200 : 402);
  });

  router.post('/pass/revenue-split', async (c) => {
    const parsed = revenueSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) {
      return c.json({ error: 'invalid_revenue_payload' }, 400);
    }
    return c.json(splitRevenue(parsed.data.netRevenueUsd));
  });

  router.post('/pass/exit-package', async (c) => {
    const parsed = exitSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) {
      return c.json({ error: 'invalid_exit_payload' }, 400);
    }
    return c.json(packageForAcquisition(parsed.data));
  });

  return router;
};
