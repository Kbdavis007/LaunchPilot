import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../../../core/env';
import { triageError } from '../application/triage-error.use-case';

const errorSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1).max(4000),
  affectedUsers: z.number().int().min(0),
  failureRate: z.number().min(0).max(1),
});

export const createOpsRouter = (): Hono<AppEnv> => {
  const router = new Hono<AppEnv>();

  router.post('/ops/triage', async (c) => {
    const parsed = errorSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) {
      return c.json({ error: 'invalid_error_payload' }, 400);
    }
    return c.json(triageError(parsed.data));
  });

  return router;
};
