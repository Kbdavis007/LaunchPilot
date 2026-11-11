# LaunchPilot infrastructure (Terraform)

Provisions the Cloudflare edge stack and is applied by the `Deploy` workflow
(`.github/workflows/deploy.yml`).

## What it creates

| Resource | Terraform | Purpose |
|---|---|---|
| D1 database | `cloudflare_d1_database.primary` | bound to the worker as `DB` |
| KV namespace | `cloudflare_workers_kv_namespace.cache` | bound as `CACHE_KV` |
| Vectorize index | `terraform_data.vectorize_index` | bound as `DOC_INDEX` (see note) |
| Pages project | `cloudflare_pages_project.blog` | hosts the MDX blog |
| Worker script | `cloudflare_workers_script.edge` | edge API with all bindings |
| workers.dev route | `cloudflare_workers_script_subdomain.edge` | public URL |

> **Vectorize note.** The Cloudflare provider (v5.x) exposes a Vectorize
> *binding* but no index *resource*, so the index is reconciled by
> `scripts/ensure-vectorize-index.sh` through the REST API. Set
> `manage_vectorize_index = false` to skip it and create the index yourself.

## State backend (one-time)

State lives in an R2 bucket (S3-compatible). Bootstrap it once:

```bash
cd infra/bootstrap
terraform init
TF_VAR_cloudflare_api_token=... TF_VAR_cloudflare_account_id=... terraform apply
```

Then create `infra/backend.hcl` from `backend.hcl.example` (git-ignored) with the
bucket name and endpoint. The bootstrap stack keeps its state locally.

## Applying

Local:

```bash
export CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=...
export AWS_ACCESS_KEY_ID=<r2 key id> AWS_SECRET_ACCESS_KEY=<r2 secret>
./scripts/terraform-apply.sh        # bundles the worker, then terraform apply
```

CI does the same automatically; the bundle path and digest are passed as
`-var` values so a code change always re-uploads the script.

## Required GitHub secrets and variables

| Name | Kind | Used by |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | secret | Terraform apply, D1 migrations, Pages deploy |
| `CLOUDFLARE_ACCOUNT_ID` | secret | Terraform apply, wrangler commands, R2 endpoint |
| `R2_ACCESS_KEY_ID` | secret | Terraform state backend |
| `R2_SECRET_ACCESS_KEY` | secret | Terraform state backend |
| `TF_STATE_BUCKET` | variable | backend `bucket` name |

The API token needs **Workers Scripts: Edit**, **D1: Edit**, **Workers KV
Storage: Edit**, **Cloudflare Pages: Edit**, and **Vectorize: Edit** on the
target account.
