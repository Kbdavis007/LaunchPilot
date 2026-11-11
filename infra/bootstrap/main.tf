# One-time bootstrap: creates the R2 bucket that holds Terraform state.
# State for this stack stays local (run it by hand, once, per account).
#
#   cd infra/bootstrap
#   terraform init
#   TF_VAR_cloudflare_account_id=<id> TF_VAR_cloudflare_api_token=<token> terraform apply

terraform {
  required_version = ">= 1.10.0, < 2.0.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
}

variable "cloudflare_api_token" {
  type      = string
  sensitive = true
}

variable "cloudflare_account_id" {
  type = string
}

variable "state_bucket_name" {
  type    = string
  default = "launchpilot-tfstate"
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_r2_bucket" "tfstate" {
  account_id = var.cloudflare_account_id
  name       = var.state_bucket_name
  location   = "ENAM"
}

output "state_bucket_name" {
  value = cloudflare_r2_bucket.tfstate.name
}

output "s3_endpoint" {
  value = "https://${var.cloudflare_account_id}.r2.cloudflarestorage.com"
}
