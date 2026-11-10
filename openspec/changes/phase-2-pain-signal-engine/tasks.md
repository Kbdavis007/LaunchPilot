# Tasks

## 1. Signal Ingestion & Scoring
- [ ] 1.1 Implement Reddit and GitHub RSS parser handlers in `src/modules/signal-engine/` and verify unit test passes
- [ ] 1.2 Implement mathematical WTP scoring formula with logarithmic budget curve and verify boundary tests
- [ ] 1.3 Create Cloudflare D1 migration for `pain_signals` table and verify local migration run

## 2. Integration & Benchmark
- [ ] 2.1 Benchmark ingestion endpoint latency under synthetic load and confirm p95 is under 50 milliseconds
- [ ] 2.2 Wire Module A signals to `<WtpCalculator />` real-time feed in the engineering blog
