# mdx-engineering-blog Specification

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
- **THEN** /feed.xml and /atom.xml are emitted with RFC 822 publication dates and item summaries
