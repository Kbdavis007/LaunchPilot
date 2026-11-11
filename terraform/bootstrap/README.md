# Cloudflare bootstrap

Applied **once** with a token that can manage tokens. It creates the pieces the
main configuration and the pipeline depend on:

- `cloudflare_r2_bucket.tfstate` — the R2 bucket that holds the main stack's
  remote state. It is created here because the main stack cannot create the
  bucket that stores its own state.
- `cloudflare_api_token.deploy` — the pipeline's token, with **Workers Scripts,
  D1, Workers KV Storage, Cloudflare Pages and Vectorize Edit** at account
  scope. Permission ids are looked up by name from
  `cloudflare_api_token_permission_groups_list`, so nothing is hardcoded.

## Run it

```sh
cd terraform/bootstrap
terraform init
export TF_VAR_cloudflare_account_id=<ACCOUNT_ID>
export CLOUDFLARE_API_TOKEN=<token with API Tokens Write + Workers R2 Storage Write>
terraform apply
terraform output -raw deploy_token   # -> CLOUDFLARE_API_TOKEN repository secret
```

## Two Cloudflare limits worth knowing

- An API token cannot create another token that can manage tokens:
  `sub-token is not allowed to have permissions to manage other tokens`. The
  created token therefore has no `API Tokens Write`.
- The account-level `POST /accounts/{id}/tokens` endpoint rejects token auth
  (`Missing X-Auth-Email header`); only a Global API Key or an OAuth session can
  call it. This configuration mints a user-owned token
  (`cloudflare_api_token`) rather than an account-owned one.

## Keep this state

This directory tracks the state bucket and the token. If its state is lost the
bucket still exists and a re-apply fails with `409`; re-import it:

```sh
terraform import cloudflare_r2_bucket.tfstate launchpilot-tfstate
```

The token value is written to the gitignored local state. Copy it into the
secret, then drop the local copy:

```sh
terraform state rm cloudflare_api_token.deploy
rm -f terraform.tfstate terraform.tfstate.backup
```
