/** OpenSpec Module B — lean edge stack scaffold domain model. */

export type SliceName =
  | 'signal-engine'
  | 'scaffold-generator'
  | 'plg-funnel'
  | 'autonomous-ops'
  | 'saas-pass'
  | 'mdx-blog';

export interface ScaffoldRequest {
  /** Project identifier, used as the generated worker name. */
  readonly projectName: string;
  /** DDD slices to synthesize. */
  readonly slices: readonly SliceName[];
  /** Worker compatibility date. */
  readonly compatibilityDate: string;
}

export interface ScaffoldFile {
  readonly path: string;
  readonly contents: string;
}

export interface ScaffoldPlan {
  readonly projectName: string;
  readonly files: readonly ScaffoldFile[];
}

const LAYERS = ['domain', 'application', 'infrastructure', 'presentation'] as const;

const sliceFile = (slice: SliceName, layer: (typeof LAYERS)[number]): ScaffoldFile => ({
  path: `src/modules/${slice}/${layer}/.gitkeep`,
  contents: '',
});

export const buildScaffoldPlan = (request: ScaffoldRequest): ScaffoldPlan => {
  const files: ScaffoldFile[] = [
    {
      path: 'wrangler.jsonc',
      contents: `{\n  "name": "${request.projectName}",\n  "main": "src/index.ts",\n  "compatibility_date": "${request.compatibilityDate}",\n  "compatibility_flags": ["nodejs_compat_v2"]\n}\n`,
    },
    {
      path: 'src/index.ts',
      contents:
        "export default {\n  async fetch(request: Request): Promise<Response> {\n    return new Response(`OK ${new URL(request.url).pathname}`);\n  },\n} satisfies ExportedHandler;\n",
    },
  ];

  for (const slice of request.slices) {
    for (const layer of LAYERS) {
      files.push(sliceFile(slice, layer));
    }
  }

  return { projectName: request.projectName, files };
};
