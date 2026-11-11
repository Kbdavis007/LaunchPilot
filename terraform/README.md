# terraform/

Cloudflare infrastructure for LaunchPilot & SaaS Pass, applied by
`.github/workflows/deploy.yml`. The full runbook is in
[`../docs/deployment.md`](../docs/deployment.md).

| File | Contents |
| --- | --- |
| `main.tf` | Provider + R2 (S3) remote state backend |
| `variables.tf` | Inputs (account, token, names, optional domain) |
| `d1.tf` | D1 database (`DB`) |
| `kv.tf` | KV namespace (`CACHE_KV`) |
| `vectorize.tf` | Vectorize index via REST (`DOC_INDEX`) |
| `worker.tf` | Worker script + bindings + workers.dev route |
| `pages.tf` | Pages project + optional custom domain |
| `dns.tf` | Optional proxied CNAME to Pages |
| `outputs.tf` | Ids/URLs consumed by the pipeline |
| `bootstrap/` | One-time R2 state bucket + deploy token |

The worker script is uploaded from `apps/worker/dist/index.js`, so build it
before planning or applying:

```sh
npm run build:worker
```

## Vectorize

The Cloudflare provider (v5.x) has no Vectorize index resource, so
`scripts/ensure-vectorize-index.sh` reconciles it through the REST API and the
worker `depends_on` it so the binding resolves at deploy time.
