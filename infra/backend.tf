# Remote state on Cloudflare R2 (S3-compatible). Bucket + credentials are
# created once by the bootstrap stack in ./bootstrap. Partial configuration:
# supply the bucket via `-backend-config=backend.hcl` (see backend.hcl.example)
# or the matching TF_VAR/backend env vars in CI.
terraform {
  backend "s3" {
    key = "launchpilot/terraform.tfstate"
  }
}
