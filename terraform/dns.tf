# Custom-domain wiring is opt-in: set custom_domain + zone_name to create a
# proxied CNAME from the subdomain to the Pages project. Zone Read permission on
# the API token is required, otherwise the data source returns zero results.
data "cloudflare_zone" "domain" {
  count = var.custom_domain != "" ? 1 : 0

  filter = {
    name = var.zone_name
  }
}

resource "cloudflare_dns_record" "blog" {
  count = var.custom_domain != "" ? 1 : 0

  zone_id = data.cloudflare_zone.domain[0].zone_id
  name    = trimsuffix(var.custom_domain, ".${var.zone_name}")
  content = cloudflare_pages_project.blog.subdomain
  type    = "CNAME"
  ttl     = 1
  proxied = true
}
