variable "cloudflare_api_token" {
  description = "Cloudflare API token with Workers Scripts, D1, Workers KV, Pages, and Vectorize edit permissions."
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account identifier that owns every resource in this stack."
  type        = string
}

variable "environment" {
  description = "Deployment environment name, surfaced to the worker as the ENVIRONMENT var."
  type        = string
  default     = "production"

  validation {
    condition     = contains(["production", "staging"], var.environment)
    error_message = "environment must be either \"production\" or \"staging\"."
  }
}

variable "worker_name" {
  description = "Name of the deployed edge worker script."
  type        = string
  default     = "launchpilot-edge-worker"
}

variable "compatibility_date" {
  description = "Workers runtime compatibility date (must match wrangler.jsonc)."
  type        = string
  default     = "2026-03-01"
}

variable "compatibility_flags" {
  description = "Workers runtime compatibility flags (must match wrangler.jsonc)."
  type        = list(string)
  default     = ["nodejs_compat_v2"]
}

variable "d1_database_name" {
  description = "Name of the D1 SQL database bound to the worker as DB."
  type        = string
  default     = "launchpilot-production"
}

variable "kv_namespace_title" {
  description = "Title of the KV namespace bound to the worker as CACHE_KV."
  type        = string
  default     = "launchpilot_cache_kv"
}

variable "vectorize_index_name" {
  description = "Name of the Vectorize index bound to the worker as DOC_INDEX."
  type        = string
  default     = "launchpilot-docs-vector"
}

variable "vectorize_dimensions" {
  description = "Embedding dimensions for the Vectorize index (OpenSpec config.yaml pins 1536)."
  type        = number
  default     = 1536
}

variable "vectorize_metric" {
  description = "Distance metric for the Vectorize index."
  type        = string
  default     = "cosine"
}

variable "target_latency_p95_ms" {
  description = "p95 latency budget in milliseconds, surfaced to the worker as TARGET_LATENCY_P95_MS."
  type        = string
  default     = "50"
}

variable "pages_project_name" {
  description = "Name of the Cloudflare Pages project hosting the MDX blog."
  type        = string
  default     = "launchpilot-saas-pass"
}

variable "pages_production_branch" {
  description = "Git branch Pages treats as production."
  type        = string
  default     = "main"
}

variable "worker_bundle_path" {
  description = "Path to the wrangler-built worker bundle (a single ESM file) uploaded as the script content."
  type        = string
}

variable "worker_bundle_sha256" {
  description = "SHA-256 hex digest of the worker bundle; forces a re-upload when the code changes."
  type        = string
}

variable "worker_bindings" {
  description = "Extra plain_text vars injected into the worker runtime."
  type        = map(string)
  default     = {}
}

variable "manage_vectorize_index" {
  description = "Create the Vectorize index through the Cloudflare API (no native Terraform resource exists)."
  type        = bool
  default     = true
}

variable "workers_dev_subdomain" {
  description = "Expose the worker on its workers.dev subdomain."
  type        = bool
  default     = true
}
