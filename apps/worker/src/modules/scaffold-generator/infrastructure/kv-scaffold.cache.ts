import type { ScaffoldPlan } from '../domain/scaffold-plan';

const CACHE_TTL_SECONDS = 3600;

/** KV adapter that memoizes generated scaffold plans to keep responses inside the edge budget. */
export const createScaffoldCache = (kv: KVNamespace) => ({
  async get(projectName: string): Promise<ScaffoldPlan | null> {
    return kv.get<ScaffoldPlan>(`scaffold:${projectName}`, 'json');
  },
  async put(plan: ScaffoldPlan): Promise<void> {
    await kv.put(`scaffold:${plan.projectName}`, JSON.stringify(plan), {
      expirationTtl: CACHE_TTL_SECONDS,
    });
  },
});
