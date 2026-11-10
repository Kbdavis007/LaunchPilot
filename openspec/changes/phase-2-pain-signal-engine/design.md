# Design: Module A Pain Signal Mining Engine

## Context
See `proposal.md` for motivation. We design an edge ingestion worker receiving webhooks and polling public developer RSS feeds.

## Goals / Non-Goals
**Goals:**
- Sub-50ms ingestion latency into Cloudflare D1.
- Mathematical WTP scoring without expensive large model latency on the critical path.
- Deduplication of pain signals via normalized text hashes.

**Non-Goals:**
- Scraping private or paywalled forums.
- Heavy sentiment analysis requiring multi-second transformer inference.

## Decisions
1. **Lightweight Regex & Heuristic Intent Classification**:
   - *Rationale*: Sub-10ms evaluation directly in Worker isolates without calling heavy external APIs.
2. **D1 Relational Indexing with KV Lookahead**:
   - *Rationale*: D1 provides robust relational querying while KV caches recent top-scoring signals for instant dashboard queries.

## Risks / Trade-offs
- [External Platform Rate Limiting] → Mitigation: Use distributed Cloudflare crons with exponential backoff on RSS fetchers.
