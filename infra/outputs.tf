output "worker_name" {
  description = "Deployed worker script name."
  value       = cloudflare_workers_script.edge.script_name
}

output "worker_url" {
  description = "workers.dev URL for the deployed edge worker (empty when disabled)."
  value       = var.workers_dev_subdomain ? "https://${var.worker_name}.${var.cloudflare_account_id}.workers.dev" : ""
}

output "d1_database_id" {
  description = "D1 database id bound to the worker as DB."
  value       = cloudflare_d1_database.primary.id
}

output "kv_namespace_id" {
  description = "KV namespace id bound to the worker as CACHE_KV."
  value       = cloudflare_workers_kv_namespace.cache.id
}

output "vectorize_index_name" {
  description = "Vectorize index name bound to the worker as DOC_INDEX."
  value       = var.vectorize_index_name
}

output "pages_project_name" {
  description = "Cloudflare Pages project hosting the MDX blog."
  value       = cloudflare_pages_project.blog.name
}

output "pages_project_subdomain" {
  description = "pages.dev subdomain for the blog project."
  value       = cloudflare_pages_project.blog.subdomain
}
