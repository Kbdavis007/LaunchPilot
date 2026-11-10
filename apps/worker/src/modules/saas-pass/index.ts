export type { PassEntitlement, PassTier, EntitlementDecision } from './domain/entitlement.entity';
export { verifyEntitlement, splitRevenue, DEVELOPER_REVENUE_SHARE } from './domain/entitlement.entity';
export type { ExitPackageInput, ExitPackageManifest } from './domain/exit-package';
export { buildExitPackageManifest } from './domain/exit-package';
export { authorizePassRequest } from './application/verify-entitlement.use-case';
export { packageForAcquisition } from './application/package-exit.use-case';
export { createEntitlementGateway } from './infrastructure/kv-entitlement.gateway';
