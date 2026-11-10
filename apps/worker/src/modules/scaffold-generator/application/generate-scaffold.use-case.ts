import { buildScaffoldPlan, type ScaffoldPlan, type ScaffoldRequest } from '../domain/scaffold-plan';

/** Generates a complete, dependency-free scaffold plan for a new edge worker. */
export const generateScaffold = (request: ScaffoldRequest): ScaffoldPlan => buildScaffoldPlan(request);
