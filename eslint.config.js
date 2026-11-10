import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const BANNED_NODE_BUILTINS = [
  'node:*',
  'fs',
  'fs/promises',
  'path',
  'child_process',
  'net',
  'os',
  'cluster',
  'dns',
  'tls',
  'http',
  'https',
  'crypto',
  'stream',
];

export default tseslint.config(
  { ignores: ['**/dist/**', '**/node_modules/**', '**/*.d.ts', '**/.wrangler/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.worker },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      // EDGE-002 — parameterized D1 statements only, no template-literal SQL.
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.property.name='prepare'] > TemplateLiteral",
          message:
            'EDGE-002: use parameterized env.DB.prepare("... ?").bind(value); raw SQL template interpolation is banned.',
        },
      ],
    },
  },
  {
    files: ['apps/worker/src/**/*.ts'],
    rules: {
      // EDGE-001 — no Node.js core modules inside edge worker handlers.
      'no-restricted-imports': [
        'error',
        {
          paths: BANNED_NODE_BUILTINS.map((name) => ({
            name,
            message: 'EDGE-001: Node.js core modules are banned in the edge worker runtime.',
          })),
          patterns: [
            {
              group: BANNED_NODE_BUILTINS,
              message: 'EDGE-001: Node.js core modules are banned in the edge worker runtime.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/vite.config.ts', '**/*.config.ts'],
    rules: {
      'no-restricted-imports': 'off',
      'no-restricted-syntax': 'off',
    },
  }
);
