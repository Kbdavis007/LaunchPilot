import { buildExitPackageManifest, type ExitPackageInput, type ExitPackageManifest } from '../domain/exit-package';

/** Assembles the audited Acquire.com packaging manifest. */
export const packageForAcquisition = (input: ExitPackageInput): ExitPackageManifest =>
  buildExitPackageManifest(input);
