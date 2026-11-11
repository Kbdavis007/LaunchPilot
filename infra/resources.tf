# ---------------------------------------------------------------------------
# LaunchPilot & SaaS Pass — Cloudflare edge resources
# Target: Workers (edge API) + Pages (MDX blog) + D1 + KV + Vectorize
# ---------------------------------------------------------------------------

resource "cloudflare_d1_database" "primary" {
  account_id = var.cloudflare_account_id
  name       = var.d1_database_name
}

resource "cloudflare_workers_kv_namespace" "cache" {
  account_id = var.cloudflare_account_id
  title      = var.kv_namespace_title
}

resource "cloudflare_pages_project" "blog" {
  account_id        = var.cloudflare_account_id
  name              = var.pages_project_name
  production_branch = var.pages_production_branch
}

# Vectorize has no native Terraform resource in the Cloudflare provider, so the
# index is reconciled through the REST API and pinned by name for the binding.
resource "terraform_data" "vectorize_index" {
  count = var.manage_vectorize_index ? 1 : 0

  input = {
    account_id = var.cloudflare_account_id
    name       = var.vectorize_index_name
    dimensions = var.vectorize_dimensions
    metric     = var.vectorize_metric
  }

  provisioner "local-exec" {
    interpreter = ["/bin/bash", "-c"]
    environment = {
      CF_ACCOUNT_ID = var.cloudflare_account_id
      CF_API_TOKEN  = var.cloudflare_api_token
      INDEX_NAME    = var.vectorize_index_name
      INDEX_DIMS    = tostring(var.vectorize_dimensions)
      INDEX_METRIC  = var.vectorize_metric
    }
    command = "${path.module}/scripts/ensure-vectorize-index.sh"
  }
}

resource "cloudflare_workers_script" "edge" {
  account_id          = var.cloudflare_account_id
  script_name         = var.worker_name
  main_module         = "index.js"
  content_file        = var.worker_bundle_path
  content_sha256      = var.worker_bundle_sha256
  compatibility_date  = var.compatibility_date
  compatibility_flags = var.compatibility_flags

  # The Vectorize binding requires the index to exist at deploy time.
  depends_on = [terraform_data.vectorize_index]

  bindings = concat(
    [
      {
        name = "DB"
        type = "d1"
        id   = cloudflare_d1_database.primary.id
      },
      {
        name         = "CACHE_KV"
        type         = "kv_namespace"
        namespace_id = cloudflare_workers_kv_namespace.cache.id
      },
      {
        name       = "DOC_INDEX"
        type       = "vectorize"
        index_name = var.vectorize_index_name
      },
      {
        name = "ENVIRONMENT"
        type = "plain_text"
        text = var.environment
      },
      {
        name = "TARGET_LATENCY_P95_MS"
        type = "plain_text"
        text = var.target_latency_p95_ms
      },
    ],
    [
      for name, value in var.worker_bindings : {
        name = name
        type = "plain_text"
        text = value
      }
    ]
  )
}

resource "cloudflare_workers_script_subdomain" "edge" {
  count = var.workers_dev_subdomain ? 1 : 0

  account_id  = var.cloudflare_account_id
  script_name = cloudflare_workers_script.edge.script_name
  enabled     = true
}
