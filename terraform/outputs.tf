output "d1_database_id" {
  value       = cloudflare_d1_database.primary.id
  description = "Cloudflare D1 database id (bound to the worker as DB)."
}

output "d1_database_name" {
  value       = cloudflare_d1_database.primary.name
  description = "D1 database name used by `wrangler d1 migrations apply`."
}

output "kv_namespace_id" {
  value       = cloudflare_workers_kv_namespace.cache.id
  description = "KV namespace id (bound to the worker as CACHE_KV)."
}

output "vectorize_index_name" {
  value       = var.vectorize_index_name
  description = "Vectorize index name (bound to the worker as DOC_INDEX)."
}

output "worker_name" {
  value       = cloudflare_workers_script.edge.script_name
  description = "Deployed worker script name."
}

output "worker_url" {
  value       = "https://${cloudflare_workers_script.edge.script_name}.${var.workers_dev_subdomain}.workers.dev"
  description = "Deployed worker URL on the workers.dev subdomain."
}

output "pages_project_name" {
  value       = cloudflare_pages_project.blog.name
  description = "Cloudflare Pages project hosting the MDX blog."
}

output "pages_url" {
  value       = "https://${cloudflare_pages_project.blog.subdomain}"
  description = "Default Pages URL (before any custom domain)."
}

output "site_url" {
  value       = var.custom_domain != "" ? "https://${var.custom_domain}" : "https://${cloudflare_pages_project.blog.subdomain}"
  description = "Live public URL of the blog."
}
