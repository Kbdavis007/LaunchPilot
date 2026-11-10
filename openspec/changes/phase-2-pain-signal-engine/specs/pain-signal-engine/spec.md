# Spec Delta: pain-signal-engine

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
- **THEN** the record is inserted into the pain_signals table with indexed tags and timestamp
