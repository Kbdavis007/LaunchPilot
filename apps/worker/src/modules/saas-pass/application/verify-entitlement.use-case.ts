import { verifyEntitlement, type EntitlementDecision, type PassEntitlement } from '../domain/entitlement.entity';

/** Verifies an inbound SaaS Pass entitlement, failing closed on unknown tokens. */
export const authorizePassRequest = (entitlement: PassEntitlement | null): EntitlementDecision =>
  verifyEntitlement(entitlement);
