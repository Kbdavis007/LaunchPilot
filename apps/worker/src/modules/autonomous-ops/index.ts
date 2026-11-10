export type { ErrorSeverity, ErrorSignal, TriageDecision } from './domain/triage.entity';
export { classifyError } from './domain/triage.entity';
export { triageError } from './application/triage-error.use-case';
export type { DocMatch, DocRepository } from './infrastructure/vectorize-doc.repository';
export { createVectorizeDocRepository } from './infrastructure/vectorize-doc.repository';
