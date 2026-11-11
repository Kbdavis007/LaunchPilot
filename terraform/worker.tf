# The worker script is uploaded by Terraform from the wrangler-built bundle, so
# a worker change is an infrastructure change (the pipeline gates `infra` on
# apps/worker/**). Build it first: `npm run build:worker`.
resource "cloudflare_workers_script" "edge" {
  account_id  = var.cloudflare_account_id
  script_name = "launchpilot-edge-worker-${var.environment}"
  content     = file("${path.module}/../apps/worker/dist/index.js")
  main_module = "index.js"

  compatibility_date  = "2026-03-01"
  compatibility_flags = ["nodejs_compat_v2"]

  # The Vectorize binding requires the index to exist at deploy time.
  depends_on = [terraform_data.vectorize_index]

  bindings = [
    {
      type = "d1"
      name = "DB"
      id   = cloudflare_d1_database.primary.id
    },
    {
      type         = "kv_namespace"
      name         = "CACHE_KV"
      namespace_id = cloudflare_workers_kv_namespace.cache.id
    },
    {
      type       = "vectorize"
      name       = "DOC_INDEX"
      index_name = var.vectorize_index_name
    },
    {
      type = "plain_text"
      name = "ENVIRONMENT"
      text = var.environment
    },
    {
      type = "plain_text"
      name = "TARGET_LATENCY_P95_MS"
      text = var.target_latency_p95_ms
    },
  ]
}

# Publishing the worker on its workers.dev route. Without this the script exists
# but the route answers 1042 before the worker runs.
resource "cloudflare_workers_script_subdomain" "edge" {
  account_id  = var.cloudflare_account_id
  script_name = cloudflare_workers_script.edge.script_name
  enabled     = true
}
