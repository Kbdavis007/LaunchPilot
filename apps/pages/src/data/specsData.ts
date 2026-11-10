export interface SpecFile {
  id: string;
  filename: string;
  path: string;
  category: 'Living Spec' | 'Active Change' | 'Architecture Config' | 'Agent Directives';
  phase: string;
  description: string;
  content: string;
  language: 'yaml' | 'markdown' | 'json';
  requirementsCount?: number;
}

export const SPEC_FILES: SpecFile[] = [
  {
    id: 'spec-edge-guardrails',
    filename: 'edge-runtime-guardrails/spec.md',
    path: 'openspec/specs/edge-runtime-guardrails/spec.md',
    category: 'Living Spec',
    phase: 'Phase 0 & 1',
    requirementsCount: 3,
    description: 'Enforces isolated serverless edge execution boundaries, Web Standard APIs, zero Node built-ins, and D1 SQL access',
    language: 'markdown',
    content: `# edge-runtime-guardrails Specification

## Purpose
Enforces isolated serverless edge execution boundaries, Web Standard APIs, zero Node.js built-ins, and parameterized Cloudflare D1 SQL access.

## Requirements

### Requirement: Edge V8 Isolate Compliance
The edge worker runtime SHALL operate purely within V8 isolates using Web Standard APIs and MUST reject any Node.js core modules.

#### Scenario: Banned Node.js import detected in worker handler
- **WHEN** static analysis detects imports from node:fs, node:path, or node:child_process
- **THEN** the linter and build pipeline abort with an EDGE-001 violation error

### Requirement: Parameterized D1 Database Bindings
All database queries executed against Cloudflare D1 SHALL use parameterized prepared statements to prevent SQL injection.

#### Scenario: SQL statement execution
- **WHEN** a worker queries the Cloudflare D1 database instance
- **THEN** the query is prepared via env.DB.prepare and arguments bound with bind(?), rejecting string concatenation

### Requirement: Sub-50ms Global Request SLA
The edge request handling pipeline SHALL process inbound requests within a 50 millisecond p95 latency budget globally.

#### Scenario: Request round-trip execution
- **WHEN** an edge request is routed through a Cloudflare Worker handler
- **THEN** response headers return with X-Edge-Latency-Ms recording less than 50 milliseconds at p95`,
  },
  {
    id: 'spec-mdx-blog',
    filename: 'mdx-engineering-blog/spec.md',
    path: 'openspec/specs/mdx-engineering-blog/spec.md',
    category: 'Living Spec',
    phase: 'Phase 1',
    requirementsCount: 3,
    description: 'Specifies the file-backed MDX engineering blog, YAML frontmatter schemas, interactive React widgets, and RSS compilation',
    language: 'markdown',
    content: `# mdx-engineering-blog Specification

## Purpose
Specifies the file-backed MDX engineering blog, YAML frontmatter schemas, interactive React widget boundaries, and RSS feed compilation.

## Requirements

### Requirement: File-Backed MDX Schema Validation
Every engineering blog dispatch SHALL reside in content/posts/*.mdx with a valid YAML frontmatter header conforming to Zod validation.

#### Scenario: Post compilation
- **WHEN** the static site generator processes an MDX file in content/posts/
- **THEN** the frontmatter fields title, date, phase, target_outcomes, and author are validated against schema

### Requirement: Interactive React Widget Embedding
The MDX compiler SHALL support safe embedding of interactive React widgets directly inside prose without hydration failure.

#### Scenario: Inlined widget tag processing
- **WHEN** MDX content contains WtpCalculator, RoadmapTimeline, or TelemetryChart component tags
- **THEN** the compiler hydrates the active React component with typed props within safe isolation boundaries

### Requirement: Automated RSS and Atom Feed Generation
The build system SHALL generate valid RSS 2.0 and Atom XML syndication feeds upon every successful build.

#### Scenario: Feed endpoint generation
- **WHEN** the static site is compiled for Cloudflare Pages deployment
- **THEN** /feed.xml and /atom.xml are emitted with RFC 822 publication dates and item summaries`,
  },
  {
    id: 'spec-saas-pass',
    filename: 'saas-pass-entitlements/spec.md',
    path: 'openspec/specs/saas-pass-entitlements/spec.md',
    category: 'Living Spec',
    phase: 'Phase 6',
    requirementsCount: 3,
    description: 'Specifies the unified 3-tier SaaS Pass subscription gateway, creator revenue pool distribution, and automated Acquire.com exit packaging',
    language: 'markdown',
    content: `# saas-pass-entitlements Specification

## Purpose
Specifies the unified 3-tier SaaS Pass subscription gateway, creator revenue pool distribution, and automated Acquire.com exit packaging.

## Requirements

### Requirement: 3-Tier Subscription Entitlement Verification
The SaaS Pass gateway SHALL verify incoming API tokens against Starter, Pro, and Unlimited tiers using KV caching for sub-15ms lookups.

#### Scenario: Inbound request token verification
- **WHEN** an authenticated developer issues a request bearing a SaaS Pass bearer token
- **THEN** the edge worker queries the KV cache and checks available monthly token quota before permitting execution

### Requirement: 70 Percent Developer Revenue Allocation
The entitlement settlement system SHALL compute and record a 70 percent revenue share allocated directly to active participating developers.

#### Scenario: Monthly subscription revenue reconciliation
- **WHEN** monthly Stripe subscription webhooks are processed
- **THEN** 70 percent of net pool revenue is credited to developer accounts in Cloudflare D1 ledgers

### Requirement: Automated Acquire.com Exit Packaging
The packaging engine SHALL assemble a sanitized repository archive, audited MRR ledger, and acquisition listing brief in under 120 seconds.

#### Scenario: Acquisition export execution
- **WHEN** an export command is dispatched from the admin terminal
- **THEN** a signed ZIP archive with verified revenue certificates and D1 schema migrations is generated`,
  },
  {
    id: 'change-p2-proposal',
    filename: 'phase-2-pain-signal-engine/proposal.md',
    path: 'openspec/changes/phase-2-pain-signal-engine/proposal.md',
    category: 'Active Change',
    phase: 'Phase 2 (In-Flight)',
    description: 'OpenSpec change proposal for automated pain point harvesting across Reddit and GitHub',
    language: 'markdown',
    content: `# Proposal: Module A Pain Signal Mining Engine (Phase 2)

## Why
Solo founders frequently build products without empirical willingness-to-pay validation. Module A automates pain point harvesting across developer forums and scores buyer intent between 0 and 100 before code execution begins.

## What Changes
- Implement automated Reddit and GitHub issue signal ingestion pipelines.
- Deploy NLP intent classification rules detecting pricing sensitivity and replacement friction.
- Store indexed market signals in Cloudflare D1 with sub-50ms edge query latency.

## Capabilities

### New Capabilities
- pain-signal-engine: Automated developer pain signal harvesting, NLP intent scoring, and Cloudflare D1 signal indexing.

### Modified Capabilities
<!-- None -->

## Impact
- Ingestion endpoints: Webhook listeners running on Cloudflare Workers edge.
- Storage: Cloudflare D1 pain_signals relational table with indexed queries.`,
  },
  {
    id: 'change-p2-spec-delta',
    filename: 'phase-2-pain-signal-engine/specs/pain-signal-engine/spec.md',
    path: 'openspec/changes/phase-2-pain-signal-engine/specs/pain-signal-engine/spec.md',
    category: 'Active Change',
    phase: 'Phase 2 (In-Flight)',
    requirementsCount: 3,
    description: 'Spec delta declaring requirements for community signal ingestion, WTP scoring, and D1 indexing',
    language: 'markdown',
    content: `# Spec Delta: pain-signal-engine

## Purpose
Automates the harvesting, NLP categorization, and willingness-to-pay (WTP) scoring of developer friction points across external community ecosystems.

## ADDED Requirements

### Requirement: Community Signal Ingestion
The signal mining engine SHALL ingest pain signals from Reddit and GitHub issues via webhooks and RSS polling within 35 milliseconds.

#### Scenario: Inbound issue webhook received
- **WHEN** a webhook payload from GitHub or Reddit arrives at the ingestion edge worker
- **THEN** the payload is parsed and enqueued for intent classification within 35 milliseconds

### Requirement: Mathematical WTP Intent Scoring
The scoring pipeline SHALL calculate a deterministic WTP score between 0 and 100 based on pain severity, friction, and declared tooling budget.

#### Scenario: Signal scoring execution
- **WHEN** raw signal parameters pain, friction, and budget are supplied
- **THEN** the system applies the logarithmic WTP formula and outputs an integer score bounded between 0 and 100

### Requirement: Cloudflare D1 Signal Indexing
The persistence layer SHALL store validated signals in Cloudflare D1 tables using parameterized prepared queries.

#### Scenario: High-intent signal persistence
- **WHEN** a signal scores a WTP value of 70 or higher
- **THEN** the record is inserted into the pain_signals table with indexed tags and timestamp`,
  },
  {
    id: 'openspec-config',
    filename: 'config.yaml',
    path: 'openspec/config.yaml',
    category: 'Architecture Config',
    phase: 'Phase 0',
    description: 'System engine configuration, edge runtime isolation flags, D1 bindings, and linter rules',
    language: 'yaml',
    content: `# ==============================================================================
# OpenSpec System Engine Configuration
# Target: LaunchPilot & SaaS Pass Edge Architecture
# Runtime: Cloudflare Workers (V8 Edge Isolate), Cloudflare D1, KV, Vectorize
# ==============================================================================

version: "1.0.0"
project:
  name: "launchpilot-saas-pass"
  system_engine: "Google AI Studio"
  execution_agent: "OpenHands"
  architecture_pattern: "Domain-Driven Design (DDD) Vertical Slices"

runtime_environment:
  platform: "cloudflare-workers"
  compatibility_date: "2026-03-01"
  compatibility_flags:
    - "nodejs_compat_v2" # Strict isolation: only explicit web standard polyfills
  constraints:
    isolated_environment: true
    memory_limit_mb: 128
    cpu_time_limit_ms: 50
    strict_web_standards_only: true
    banned_node_builtins:
      - "fs"
      - "path"
      - "child_process"
      - "net"
      - "os"
      - "cluster"
      - "dns"
      - "tls"
      - "http"
      - "https"
    allowed_web_apis:
      - "fetch"
      - "Request"
      - "Response"
      - "Headers"
      - "ReadableStream"
      - "WritableStream"
      - "TransformStream"
      - "crypto.subtle"
      - "TextEncoder"
      - "TextDecoder"
      - "URL"
      - "URLSearchParams"

data_bindings:
  database:
    driver: "cloudflare-d1"
    binding_name: "DB"
    enforce_parameterized_queries: true
  cache:
    driver: "cloudflare-kv"
    binding_name: "CACHE_KV"

linter_specs:
  rules:
    - id: "EDGE-001"
      description: "Disallow Node.js built-in module imports inside worker handlers"
      severity: "error"
    - id: "EDGE-002"
      description: "Require parameterized D1 SQL bindings; forbid raw SQL concatenation"
      severity: "error"
    - id: "PERF-001"
      description: "Worker execution time must remain strictly sub-50ms at p95"
      severity: "error"`,
  },
  {
    id: 'openhands-directives',
    filename: 'openhands-instructions.md',
    path: 'openhands-instructions.md',
    category: 'Agent Directives',
    phase: 'Phase 0',
    description: 'Detailed prompt directives for OpenHands agent on spec consumption, wrangler bindings, and DDD slices',
    language: 'markdown',
    content: `# OpenHands Autonomous Execution Directives
## System Target: LaunchPilot & SaaS Pass Edge Platform

> **Role & Authority**: You are **OpenHands**, the autonomous execution agent paired with Google AI Studio (the Principal Software Architect and OpenSpec System Engine). 
> You operate inside our repository to consume OpenSpec blueprints, configure edge infrastructure, author production-grade code, enforce DDD vertical slice boundaries, and run automated verification suites.

### 1. First-Principles Execution Rules
1. Spec-First Invariant: Never generate or modify business logic without reading the corresponding specification in /openspec/ first.
2. Strict Serverless Edge Runtime: The execution target is Cloudflare Workers. You must never import Node.js core modules.
3. Database Guardrails: All SQL statements executed against Cloudflare D1 must be parameterized prepared statements.
4. DDD Vertical Slice Isolation: Slices interact only through explicit public interfaces (index.ts) or event envelopes.`,
  },
];
