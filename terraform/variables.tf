variable "cloudflare_account_id" {
  type        = string
  description = "Cloudflare account id that owns every resource in this stack."
}

variable "cloudflare_api_token" {
  type        = string
  description = "API token with Workers Scripts, D1, Workers KV, Pages and Vectorize edit permissions."
  sensitive   = true
}

variable "environment" {
  type        = string
  default     = "production"
  description = "Deployment environment name (production | staging)."

  validation {
    condition     = contains(["production", "staging"], var.environment)
    error_message = "environment must be either \"production\" or \"staging\"."
  }
}

variable "workers_dev_subdomain" {
  type        = string
  default     = "kbdavis0007"
  description = "Account workers.dev subdomain used to build the worker URL."
}

variable "d1_database_name" {
  type        = string
  default     = "launchpilot-production"
  description = "Name of the D1 database bound to the worker as DB."
}

variable "kv_namespace_title" {
  type        = string
  default     = "launchpilot_cache_kv"
  description = "Title of the KV namespace bound to the worker as CACHE_KV."
}

variable "vectorize_index_name" {
  type        = string
  default     = "launchpilot-docs-vector"
  description = "Name of the Vectorize index bound to the worker as DOC_INDEX."
}

variable "vectorize_dimensions" {
  type        = number
  default     = 1536
  description = "Embedding dimensions for the Vectorize index (pinned by openspec/config.yaml)."
}

variable "vectorize_metric" {
  type        = string
  default     = "cosine"
  description = "Distance metric for the Vectorize index."
}

variable "pages_project_name" {
  type        = string
  default     = "launchpilot-saas-pass"
  description = "Name of the Cloudflare Pages project hosting the MDX blog."
}

variable "custom_domain" {
  type        = string
  default     = ""
  description = "Optional custom hostname for the Pages site (e.g. blog.example.com). Empty disables DNS."
}

variable "zone_name" {
  type        = string
  default     = ""
  description = "Cloudflare zone that owns custom_domain (required when custom_domain is set)."
}

variable "target_latency_p95_ms" {
  type        = string
  default     = "50"
  description = "p95 latency budget surfaced to the worker as TARGET_LATENCY_P95_MS."
}
