# Spec Delta: saas-pass-entitlements

## Purpose
Specifies the unified 3-tier SaaS Pass subscription gateway, creator revenue pool distribution, and automated Acquire.com exit packaging.

## ADDED Requirements

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
- **THEN** a signed ZIP archive with verified revenue certificates and D1 schema migrations is generated
