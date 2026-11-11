#!/usr/bin/env bash
# Idempotently reconcile a Cloudflare Vectorize index.
# The Cloudflare Terraform provider (v5.x) exposes a Vectorize *binding* but no
# index resource, so the index is created here through the REST API.
#
# Required environment:
#   CF_ACCOUNT_ID  Cloudflare account id
#   CF_API_TOKEN   API token with Vectorize edit permission
#   INDEX_NAME     Vectorize index name
#   INDEX_DIMS     Embedding dimensions
#   INDEX_METRIC   Distance metric (cosine | euclidean | dot-product)
set -euo pipefail

: "${CF_ACCOUNT_ID:?CF_ACCOUNT_ID is required}"
: "${CF_API_TOKEN:?CF_API_TOKEN is required}"
: "${INDEX_NAME:?INDEX_NAME is required}"
: "${INDEX_DIMS:?INDEX_DIMS is required}"
: "${INDEX_METRIC:?INDEX_METRIC is required}"

api="https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/vectorize/v2/indexes"

status=$(curl -sS -o /tmp/vectorize_index.json -w '%{http_code}' \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  "${api}/${INDEX_NAME}")

if [ "${status}" = "200" ]; then
  echo "Vectorize index '${INDEX_NAME}' already exists; leaving it in place."
  exit 0
fi

if [ "${status}" != "404" ]; then
  echo "Unexpected status ${status} while reading Vectorize index '${INDEX_NAME}':" >&2
  cat /tmp/vectorize_index.json >&2
  exit 1
fi

echo "Creating Vectorize index '${INDEX_NAME}' (${INDEX_DIMS}d, ${INDEX_METRIC})."
create_status=$(curl -sS -o /tmp/vectorize_create.json -w '%{http_code}' \
  -X POST "${api}" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H 'Content-Type: application/json' \
  --data "$(printf '{"name":"%s","config":{"dimensions":%s,"metric":"%s"}}' \
    "${INDEX_NAME}" "${INDEX_DIMS}" "${INDEX_METRIC}")")

if [ "${create_status}" != "200" ] && [ "${create_status}" != "201" ]; then
  echo "Failed to create Vectorize index '${INDEX_NAME}' (status ${create_status}):" >&2
  cat /tmp/vectorize_create.json >&2
  exit 1
fi

echo "Vectorize index '${INDEX_NAME}' created."
