# Tasks

## 1. Phase 0 Edge Guardrails & OpenSpec Linter Setup
- [x] 1.1 Configure `openspec/config.yaml` with edge runtime limits and banned Node.js built-ins; verify with `openspec validate`
- [x] 1.2 Author `openhands-instructions.md` with DDD slice anatomy and wrangler bindings; verify file contents
- [x] 1.3 Configure Cloudflare D1 parameterized SQL query rules; verify zero raw string concatenations

## 2. Phase 1 MDX Engineering Blog & Interactive Widgets
- [x] 2.1 Implement `<WtpCalculator />` React widget with persona presets and real-time WTP scoring formula; verify slider interactions
- [x] 2.2 Implement `<RoadmapTimeline />` React widget with Phase 0 through Phase 7 milestones; verify phase drill-down
- [x] 2.3 Implement `<TelemetryChart />` React widget with sub-50ms latency probers and Acquire.com exit valuation simulator; verify live ticker
- [x] 2.4 Author Day 1 dispatches in `content/posts/*.mdx` (01 Paradigm Shift, 02 Master Roadmap, 03 Expected Metrics); verify rendering

## 3. Verification & Archive
- [x] 3.1 Run OpenSpec validation suite `openspec validate --all`; verify 0 errors
- [x] 3.2 Verify TypeScript compilation and ESLint pass with zero errors
