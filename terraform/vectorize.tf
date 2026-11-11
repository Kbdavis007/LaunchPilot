# The Cloudflare provider (v5.x) exposes a Vectorize *binding* but no index
# *resource*, so the index is reconciled idempotently through the REST API.
# `terraform_data` records the desired config and re-runs the script on change;
# the worker depends on it so the binding resolves at deploy time.
resource "terraform_data" "vectorize_index" {
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
