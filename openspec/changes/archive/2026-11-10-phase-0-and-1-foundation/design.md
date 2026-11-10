# Design: LaunchPilot & SaaS Pass Edge Architecture

## Context
See `proposal.md` for motivation and background. We target Cloudflare Workers serverless edge runtime with localized Cloudflare D1 SQL storage, KV caching, and Vectorize doc retrieval.

## Goals / Non-Goals
**Goals:**
- Provide zero-cold-start, sub-50ms p95 global request execution via V8 isolates.
- Eliminate SQL injection by construct via mandatory D1 parameterized prepared statements.
- Enable immediate Day 1 public build logging via file-backed MDX blog with embedded interactive React widgets.
- Implement an automated SaaS Pass entitlement gateway with 70% developer pool distribution.

**Non-Goals:**
- Heavy containerized microservices or centralized Docker/Kubernetes hosting.
- Arbitrary Node.js runtime compatibility layers that increase bundle size beyond edge limits.

## Decisions
1. **Cloudflare Workers over Node/Docker Servers**:
   - *Rationale*: Instant scale-to-zero, zero cold start penalties, and global deployment across 300+ edge locations.
   - *Alternative Considered*: AWS Lambda / ECS (rejected due to cold start latencies and high idle costs for solo founders).
2. **File-Backed MDX with Whitelisted React Components**:
   - *Rationale*: Authors write natural prose while embedding verified widgets (`<WtpCalculator />`, `<RoadmapTimeline />`, `<TelemetryChart />`) with zero arbitrary code execution risk.
   - *Alternative Considered*: Headless CMS / Ghost (rejected due to operational overhead and lack of git-native versioning).
3. **OpenSpec Specification-Driven Agent Orchestration**:
   - *Rationale*: Google AI Studio authors strict formal specs (`spec.md`), while OpenHands executes implementation against deterministic contracts, eliminating prompt drift.

## Risks / Trade-offs
- [Edge Isolate Memory Limit (128MB)] → Mitigation: Avoid heavy AST transformers at runtime; pre-compile MDX to static HTML on Cloudflare Pages.
- [D1 Distributed Replication Consistency] → Mitigation: Route write-heavy ledger events to primary D1 instances while leveraging localized read caches in KV.
