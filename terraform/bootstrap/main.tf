# One-time bootstrap: creates the R2 bucket that holds the main configuration's
# remote state, and mints the API token the pipeline uses. It keeps its own
# local state and is not part of the CI apply.
#
#   cd terraform/bootstrap
#   terraform init
#   TF_VAR_cloudflare_account_id=<id> CLOUDFLARE_API_TOKEN=<token> terraform apply

terraform {
  required_version = ">= 1.10.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
}

variable "cloudflare_account_id" {
  type        = string
  description = "Cloudflare account that owns the resources."
}

variable "state_bucket_name" {
  type        = string
  default     = "launchpilot-tfstate"
  description = "R2 bucket that stores the main configuration's state."
}

provider "cloudflare" {}

resource "cloudflare_r2_bucket" "tfstate" {
  account_id = var.cloudflare_account_id
  name       = var.state_bucket_name
}

output "r2_endpoint" {
  value       = "https://${var.cloudflare_account_id}.r2.cloudflarestorage.com"
  description = "S3 endpoint for the Terraform backend."
}
