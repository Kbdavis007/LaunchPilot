# Spec Delta: edge-runtime-guardrails

## Purpose
Enforces isolated serverless edge execution boundaries, Web Standard APIs, zero Node.js built-ins, and parameterized Cloudflare D1 SQL access.

## ADDED Requirements

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
- **THEN** response headers return with X-Edge-Latency-Ms recording less than 50 milliseconds at p95
