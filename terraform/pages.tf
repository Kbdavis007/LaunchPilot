resource "cloudflare_pages_project" "blog" {
  account_id        = var.cloudflare_account_id
  name              = var.pages_project_name
  production_branch = "main"
}

# Attach the custom domain when one is configured. Without this a CNAME alone
# points at a Pages project that does not answer for the host (522).
resource "cloudflare_pages_domain" "blog" {
  count = var.custom_domain != "" ? 1 : 0

  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.blog.name
  name         = var.custom_domain
}
