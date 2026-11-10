import { Hono } from 'hono';
import type { AppEnv } from './core/env';
import { readTargetLatencyP95Ms } from './core/env';
import { EDGE_LATENCY_HEADER, elapsedMs } from './core/latency';
import { createLogger } from './core/logger';
import { createOpsRouter } from './modules/autonomous-ops/presentation/triage.routes';
import { createBlogRouter } from './modules/mdx-blog/presentation/blog.routes';
import { createQuotaRouter } from './modules/plg-funnel/presentation/quota.routes';
import { createPassRouter } from './modules/saas-pass/presentation/pass.routes';
import { createScaffoldRouter } from './modules/scaffold-generator/presentation/scaffold.routes';
import { createSignalRouter } from './modules/signal-engine/presentation/signal.routes';

const app = new Hono<AppEnv>();
const logger = createLogger();

app.use('*', async (c, next) => {
  const startedAt = Date.now();
  c.set('requestId', crypto.randomUUID());
  c.set('startedAt', startedAt);
  await next();
  c.header(EDGE_LATENCY_HEADER, String(elapsedMs(startedAt)));
});

app.get('/', (c) =>
  c.json({
    service: 'launchpilot-edge-worker',
    environment: c.env.ENVIRONMENT,
    targetLatencyP95Ms: readTargetLatencyP95Ms(c.env),
  })
);

app.get('/health', (c) => c.json({ status: 'ok', requestId: c.get('requestId') }));

const api = new Hono<AppEnv>();
api.route('/', createSignalRouter());
api.route('/', createScaffoldRouter());
api.route('/', createQuotaRouter());
api.route('/', createOpsRouter());
api.route('/', createPassRouter());
api.route('/', createBlogRouter());
app.route('/api/v1', api);

app.notFound((c) => c.json({ error: 'not_found' }, 404));

app.onError((error, c) => {
  logger.error('unhandled_request_error', { message: error.message, path: c.req.path });
  return c.json({ error: 'internal_error', requestId: c.get('requestId') }, 500);
});

export default app;
