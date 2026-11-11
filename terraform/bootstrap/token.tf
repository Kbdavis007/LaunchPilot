# Mints the API token the pipeline uses as CLOUDFLARE_API_TOKEN, so its
# permission set lives in code. Applied once with a token that has
# "API Tokens Write" (the dashboard's "Create Additional Tokens" template).
#
# Cloudflare will not let a token create a token that can manage tokens
# ("sub-token is not allowed to have permissions to manage other tokens"), and
# an account-owned token needs account-level API Tokens Write, so this mints a
# plain user token instead.
#
# Permission group ids are looked up by name rather than hardcoded, so the stack
# does not rot when Cloudflare adds or renumbers groups.

data "cloudflare_api_token_permission_groups_list" "all" {}

locals {
  # Account-scoped groups only; names are the API names, not dashboard labels.
  account_groups = [
    for group in data.cloudflare_api_token_permission_groups_list.all.result :
    group if contains(group.scopes, "com.cloudflare.api.account")
  ]

  ids_by_name = {
    for group in local.account_groups : group.name => group.id...
  }

  wanted = {
    workers_scripts = "Workers Scripts"
    d1              = "D1"
    workers_kv      = "Workers KV Storage"
    pages           = "Cloudflare Pages"
    vectorize       = "Vectorize"
  }

  permission_ids = {
    for key, name in local.wanted : key => local.ids_by_name[name][0]
  }

  account_scope = jsonencode({
    "com.cloudflare.api.account.${var.cloudflare_account_id}" = "*"
  })
}

resource "cloudflare_api_token" "deploy" {
  name = "LaunchPilot Terraform Deploy"

  policies = [
    {
      effect = "allow"
      permission_groups = [
        { id = local.permission_ids.workers_scripts },
        { id = local.permission_ids.d1 },
        { id = local.permission_ids.workers_kv },
        { id = local.permission_ids.pages },
        { id = local.permission_ids.vectorize },
      ]
      resources = local.account_scope
    },
  ]
}

output "deploy_token" {
  value       = cloudflare_api_token.deploy.value
  sensitive   = true
  description = "Value for the CLOUDFLARE_API_TOKEN repository secret."
}
