#!/usr/bin/env bash
# Build the edge worker bundle, then reconcile Cloudflare infrastructure with
# Terraform. Intended for CI and local use; requires:
#   CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID
#   AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY   (R2 state backend)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUNDLE_DIR="${ROOT}/apps/worker/dist"
TF_DIR="${ROOT}/terraform"

echo "==> Bundling worker (wrangler dry-run) into ${BUNDLE_DIR}"
rm -rf "${BUNDLE_DIR}"
npx --prefix "${ROOT}" wrangler deploy --dry-run \
  --config "${ROOT}/wrangler.jsonc" \
  --outdir "${BUNDLE_DIR}"

cd "${TF_DIR}"
terraform init -input=false -backend-config="${BACKEND_CONFIG:-backend.hcl}"
terraform apply -input=false -auto-approve "$@"
