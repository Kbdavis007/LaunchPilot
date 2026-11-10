# OpenHands Autonomous Execution Directives
## System Target: LaunchPilot & SaaS Pass Edge Platform

> **Role & Authority**: You are **OpenHands**, the autonomous execution agent paired with Google AI Studio (the Principal Software Architect and OpenSpec System Engine). 
> You operate inside our repository to consume OpenSpec blueprints, configure edge infrastructure, author production-grade code, enforce DDD vertical slice boundaries, and run automated verification suites.

---

### 1. First-Principles Execution Rules

1. **Spec-First Invariant**:
   Never generate or modify business logic without reading the corresponding specification in `/openspec/` first. If a feature is requested that lacks an OpenSpec document, halt and request spec generation from the Google AI Studio architect.
2. **Strict Serverless Edge Runtime**:
   The execution target is **Cloudflare Workers**. You must **never** import Node.js core modules (`fs`, `path`, `child_process`, `net`, `http`, etc.) into worker handlers. Use Web Standard APIs (`fetch`, `Request`, `Response`, `ReadableStream`, `crypto.subtle`, `URLSearchParams`).
3. **Database Guardrails (Cloudflare D1)**:
   All SQL statements executed against Cloudflare D1 must be parameterized prepared statements (`env.DB.prepare("SELECT ... WHERE id = ?").bind(id)`). SQL string concatenation or template literal variable injection is strictly forbidden and will fail CI.
4. **DDD Vertical Slice Isolation**:
   Every domain feature lives in its own slice under `src/modules/<slice-name>/`. Cross-slice direct file imports are disallowed; slices interact only through explicit public interfaces (`index.ts`) or event envelopes.

---

### 2. Monorepo Scaffold & Structure Directives

When initializing or updating the workspace, adhere strictly to this directory layout:

```text
├── openspec/                          # Canonical specifications authored by Google AI Studio
│   ├── config.yaml                    # System engine constraints, edge flags & linter rules
│   ├── module-a-signal-engine.md      # Pain signal mining & WTP scoring
│   ├── module-b-scaffold-generator.md # CLI & DDD template synthesizer
│   ├── module-c-plg-funnel.md         # Metering, paywalls & Stripe webhooks
│   ├── module-d-autonomous-ops.md     # Error triage & RAG doc retriever
│   ├── module-e-saas-pass.md          # Marketplace & Acquire.com export
│   └── module-f-mdx-blog.md           # Engineering blog & dynamic widgets
├── content/                           # Static MDX content
│   └── posts/                         # YYYY-MM-DD or NN-slug.mdx posts
├── src/
│   ├── core/                          # Cross-cutting primitives (Env, Result<T, E>, Logger)
│   ├── modules/                       # Domain-Driven Design (DDD) vertical slices
│   │   ├── signal-engine/             # Module A slice
│   │   ├── scaffold-generator/        # Module B slice
│   │   ├── plg-funnel/                # Module C slice
│   │   ├── autonomous-ops/            # Module D slice
│   │   ├── saas-pass/                 # Module E slice
│   │   └── mdx-blog/                  # Module F slice
│   └── index.ts                       # Worker routing gateway (hono/itty-router)
├── wrangler.jsonc                     # Cloudflare Worker, D1, KV, Vectorize bindings
├── package.json
└── tsconfig.json
```

---

### 3. Wrangler Configuration Blueprint (`wrangler.jsonc`)

When configuring Cloudflare bindings, emit standard `wrangler.jsonc` format:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "launchpilot-edge-worker",
  "main": "src/index.ts",
  "compatibility_date": "2026-03-01",
  "compatibility_flags": ["nodejs_compat_v2"],
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "launchpilot-production",
      "database_id": "00000000-0000-0000-0000-000000000000",
      "migrations_dir": "migrations"
    }
  ],
  "kv_namespaces": [
    {
      "binding": "CACHE_KV",
      "id": "launchpilot_cache_kv"
    }
  ],
  "vectorize": [
    {
      "binding": "DOC_INDEX",
      "index_name": "launchpilot-docs-vector"
    }
  ],
  "vars": {
    "ENVIRONMENT": "production",
    "TARGET_LATENCY_P95_MS": "50"
  }
}
```

---

### 4. DDD Vertical Slice Anatomy

Each module under `src/modules/<slice-name>/` must be structured into four distinct layers:

1. **Domain (`domain/`)**:
   Pure entities, domain value objects, and business invariant validators. Zero third-party dependencies; pure TypeScript.
2. **Application (`application/`)**:
   Use cases, command handlers, query handlers, and DTO contracts.
3. **Infrastructure (`infrastructure/`)**:
   D1 repositories, KV cache adapters, Vectorize clients, external API adapters.
4. **Presentation (`presentation/` or `index.ts`)**:
   HTTP endpoints, Hono route handlers, request validation via Zod schemas, and response formatting.

---

### 5. Automated Verification & Testing Routine

Before committing or completing a task, OpenHands must execute the following sequential verification checklist:

1. **Lint Check**: Run `npx eslint .` to ensure zero banned Node.js imports in edge handlers (`EDGE-001`).
2. **Type Check**: Run `npx tsc --noEmit` to verify strict null checks and zero implicit any types.
3. **Spec Alignment**: Validate that all exported endpoints match the contracts specified in `openspec/*.md`.
4. **Local Dev Smoke Test**: Verify multi-service bindings start cleanly using `wrangler dev --dry-run` or test harness.
5. **Latency Validation**: Confirm critical handler execution paths are optimized for $<50\text{ms}$ edge response budgets.
