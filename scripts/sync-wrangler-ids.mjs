#!/usr/bin/env node
// Patch resource ids in wrangler.jsonc from Terraform outputs, so wrangler
// commands (d1 migrations, local dev) address the resources Terraform created.
//
// Usage:
//   node scripts/sync-wrangler-ids.mjs <terraform-output.json>
// where the file is produced by:  terraform -chdir=infra output -json
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputsPath = process.argv[2];
if (!outputsPath) {
  console.error('usage: sync-wrangler-ids.mjs <terraform-output.json>');
  process.exit(1);
}

const outputs = JSON.parse(readFileSync(outputsPath, 'utf8'));
const d1Id = outputs.d1_database_id?.value;
const kvId = outputs.kv_namespace_id?.value;
if (!d1Id || !kvId) {
  console.error('terraform outputs must include d1_database_id and kv_namespace_id');
  process.exit(1);
}

const configPath = resolve(root, 'wrangler.jsonc');
const config = JSON.parse(readFileSync(configPath, 'utf8'));

for (const db of config.d1_databases ?? []) {
  db.database_id = d1Id;
}
for (const kv of config.kv_namespaces ?? []) {
  kv.id = kvId;
}

writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
console.log(`patched wrangler.jsonc: d1=${d1Id} kv=${kvId}`);
