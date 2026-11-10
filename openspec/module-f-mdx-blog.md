# OpenSpec Module F: MDX Build-in-Public Blog & Day 1 Public Vision

```yaml
module: "module-f-mdx-blog"
version: "1.0.0"
domain: "build-in-public"
owner: "LaunchPilot Core Architecture"
runtime_target: "Cloudflare Pages & Workers Edge"
status: "active"
phase: "Phase 1"
```

---

## 1. Executive Summary & Objective

Module F implements an MDX-powered interactive engineering blog designed to provide complete public transparency, publish live interactive build logs, and demonstrate LaunchPilot's self-referential execution model starting on Day 1. 

Unlike traditional static markdown blogs, Module F integrates first-class interactive React widgets embedded directly inside prose to allow visitors and potential customers to calculate real-time willingness-to-pay (WTP) scores, inspect the phased master roadmap, and observe edge latency and cohort telemetry.

---

## 2. File-Backed MDX Schema (`content/posts/*.mdx`)

Posts are authored as file-backed `.mdx` files stored under `content/posts/`. Each file requires a strict YAML frontmatter envelope validated at build time.

### Frontmatter Schema Specification (TypeScript / Zod)

```typescript
export interface BlogPostFrontmatter {
  /** Post headline: must be concise, punchy, and under 90 characters */
  title: string;
  /** ISO 8601 publication date: YYYY-MM-DD */
  date: string;
  /** Phase association in the 7-phase roadmap */
  phase: "Phase 0" | "Phase 1" | "Phase 2" | "Phase 3" | "Phase 4" | "Phase 5" | "Phase 6" | "Phase 7";
  /** 2 to 4 tangible, measurable outcomes delivered in this milestone */
  target_outcomes: string[];
  /** Author descriptor including name, role, and platform handle */
  author: {
    name: string;
    role: string;
    avatar?: string;
    handle: string;
  };
  /** Brief summary for meta description and RSS item description (120-160 chars) */
  summary: string;
  /** Categorical tags for indexing */
  tags: string[];
  /** Estimated reading time in minutes */
  reading_time_minutes: number;
}
```

### Frontmatter Example

```yaml
---
title: "Why Code Execution Speed Is No Longer the Bottleneck"
date: "2026-11-09"
phase: "Phase 1"
target_outcomes:
  - "Establish self-referential live validation benchmark"
  - "Publish live WtpCalculator component for public signal auditing"
  - "Commit to sub-50ms edge processing standard"
author:
  name: "LaunchPilot Core Architecture Team"
  role: "Principal Systems Engineer"
  handle: "@launchpilot"
summary: "Introducing LaunchPilot, our self-referential live validation model, and why deterministic product validation surpasses rapid code generation."
tags:
  - "Architecture"
  - "Edge Computing"
  - "OpenSpec"
reading_time_minutes: 6
---
```

---

## 3. Safe MDX Component Safety Boundaries & Props Contracts

To prevent arbitrary script execution, hydration mismatches, and layout shifts, all interactive MDX elements are sandboxed through an explicit Component Registry whitelist. Unknown HTML or React tags are neutralized.

### 3.1. `<WtpCalculator />`
* **Purpose**: Interactive Willingness-to-Pay (WTP) scorecard widget allowing developers to evaluate pain severity, target audience budget, replacement friction, and projected monthly ARR.
* **Component Contract**:

```typescript
export interface WtpCalculatorProps {
  /** Initial developer target persona */
  defaultPersona?: "solo_hacker" | "serial_founder" | "dev_agency";
  /** Default pain severity score (1-10) */
  initialPainScore?: number;
  /** Estimated monthly price point in USD */
  defaultMonthlyPrice?: number;
  /** Read-only mode vs interactive simulator */
  interactive?: boolean;
  /** Optional container title override */
  headline?: string;
}
```

* **Mathematical Formula**:
$$\text{WTP Score} = \min\left(100, \; \text{round}\left( \frac{\text{Pain} \times 3.5 + \text{Friction} \times 2.5 + \log_{10}(\text{Budget}) \times 12.0}{0.75} \right)\right)$$

### 3.2. `<RoadmapTimeline />`
* **Purpose**: Dynamic phased execution timeline rendering Phase 0 through Phase 7 with active milestone indicators, target dates, and deliverables breakdown.
* **Component Contract**:

```typescript
export interface RoadmapTimelineProps {
  /** Highlights the currently active phase */
  activePhase?: string; // e.g. "Phase 1"
  /** Whether to allow users to toggle phase detail expansion */
  expandable?: boolean;
  /** Filter display to a single phase or show all */
  filterPhase?: string;
  /** Compact view for inline callouts vs full interactive breakdown */
  variant?: "compact" | "detailed";
}
```

### 3.3. `<TelemetryChart />`
* **Purpose**: Telemetry and metrics dashboard displaying real-time edge latencies (p50, p95, p99), SaaS Pass subscriber cohort progression (0 to 50 target), and Acquire.com asset valuation projections.
* **Component Contract**:

```typescript
export interface TelemetryChartProps {
  /** Metric mode to emphasize */
  primaryMetric?: "latency" | "saas_pass_subscribers" | "exit_valuation" | "all";
  /** Real-time refresh polling interval (seconds, 0 for static snapshot) */
  refreshIntervalSeconds?: number;
  /** Simulated vs live edge telemetry stream */
  telemetrySource?: "edge_benchmark" | "live_prober";
}
```

---

## 4. Static Site Compilation & Cloudflare Pages Integration

### Compilation Lifecycle
1. **Source Parsing**: MDX files are ingested from `content/posts/*.mdx`.
2. **Frontmatter Validation**: Zod schema verifies all mandatory keys. Invalid schemas throw compilation errors.
3. **AST Transformation**: MDX AST (MDAST/HAST) replaces JSX elements `<WtpCalculator />`, `<RoadmapTimeline />`, and `<TelemetryChart />` with verified client-side components.
4. **HTML & Meta Generation**: Each post compiles into an SEO-optimized static HTML payload with OpenGraph, Twitter cards, and structured JSON-LD schemas.
5. **Edge Asset Caching**: Static assets are deployed to Cloudflare Pages with `Cache-Control: public, max-age=31536000, immutable` for static assets and `max-age=3600, stale-while-revalidate=86400` for HTML.

---

## 5. RSS/Atom Feed Generation Specification

Every build step compiles both an RSS 2.0 XML feed (`/feed.xml`) and an Atom feed (`/atom.xml`):

* **Endpoint**: `/feed.xml` and `/atom.xml`
* **Header**: `Content-Type: application/xml; charset=utf-8`
* **Elements**:
  - `<channel>`: Title ("LaunchPilot & SaaS Pass Engineering Blog"), link, description, language ("en-US").
  - `<item>` for each post:
    - `<title>`: Frontmatter `title`
    - `<link>`: Canonical URL (`https://launchpilot.dev/blog/<slug>`)
    - `<pubDate>`: RFC 822 formatted date
    - `<dc:creator>`: Author name
    - `<description>`: Frontmatter `summary`
    - `<category>`: List of tags
