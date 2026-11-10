import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../../../core/env';
import { generateScaffold } from '../application/generate-scaffold.use-case';
import type { SliceName } from '../domain/scaffold-plan';

const sliceSchema = z.enum([
  'signal-engine',
  'scaffold-generator',
  'plg-funnel',
  'autonomous-ops',
  'saas-pass',
  'mdx-blog',
]);

const scaffoldSchema = z.object({
  projectName: z.string().min(1).max(64),
  slices: z.array(sliceSchema).min(1),
  compatibilityDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const createScaffoldRouter = (): Hono<AppEnv> => {
  const router = new Hono<AppEnv>();

  router.post('/scaffold', async (c) => {
    const parsed = scaffoldSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) {
      return c.json({ error: 'invalid_scaffold_payload' }, 400);
    }
    const plan = generateScaffold({
      projectName: parsed.data.projectName,
      slices: parsed.data.slices as readonly SliceName[],
      compatibilityDate: parsed.data.compatibilityDate,
    });
    return c.json(plan, 201);
  });

  return router;
};
