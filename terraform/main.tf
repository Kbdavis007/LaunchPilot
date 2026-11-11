terraform {
  # 1.10 is the first release with S3 native state locking (`use_lockfile`),
  # which R2 needs because it has no DynamoDB.
  required_version = ">= 1.10.0"

  # Backend blocks cannot read variables, so the account-specific endpoint is
  # supplied out of band: `-backend-config=backend.hcl` locally, or generated
  # from the CLOUDFLARE_ACCOUNT_ID secret in CI. See backend.hcl.example.
  backend "s3" {
    bucket = "launchpilot-tfstate"
    key    = "production/terraform.tfstate"
    region = "auto"
    endpoints = {
      s3 = "https://REPLACE_WITH_ACCOUNT_ID.r2.cloudflarestorage.com"
    }
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_metadata_api_check     = true
    use_path_style              = true
    use_lockfile                = true
  }

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
