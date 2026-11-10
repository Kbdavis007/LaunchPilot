/** OpenSpec Module E — automated Acquire.com exit packaging. */

export interface ExitPackageInput {
  readonly generatedAt: string;
  readonly monthlyRecurringRevenueUsd: number;
  readonly monthlyChurnRate: number;
  readonly activeSubscribers: number;
  readonly schemaMigrations: number;
}

export interface ExitPackageManifest {
  readonly archiveName: string;
  readonly valuationUsd: number;
  readonly annualRunRateUsd: number;
  readonly readinessScore: number;
  readonly components: readonly string[];
  readonly estimatedPackagingSeconds: number;
}

const TARGET_PACKAGING_SECONDS = 120;
const ARR_MULTIPLE = 4;

export const buildExitPackageManifest = (input: ExitPackageInput): ExitPackageManifest => {
  const annualRunRateUsd = input.monthlyRecurringRevenueUsd * 12;
  const valuationUsd = annualRunRateUsd * ARR_MULTIPLE;
  const churnPenalty = Math.min(30, Math.round(input.monthlyChurnRate * 100));
  const readinessScore = Math.max(0, Math.min(100, 80 - churnPenalty + Math.min(20, input.activeSubscribers / 5)));

  return {
    archiveName: `acquire-export-${input.generatedAt}.zip`,
    valuationUsd,
    annualRunRateUsd,
    readinessScore,
    components: [
      'sanitized-repository',
      'd1-schema-migrations',
      'openspec-blueprints',
      'stripe-mrr-certificate',
      'acquire-listing-brief.md',
    ],
    estimatedPackagingSeconds: Math.min(TARGET_PACKAGING_SECONDS, 30 + input.schemaMigrations),
  };
};
