import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'oxlint';

// JS plugins crash on Linux arm64 in Oxlint 1.94.0; rule waivers are listed in AGENTS.md.

const importShapePatterns = [
  {
    group: ['./*', '../*', '../**', './**'],
    message: 'Use # package imports (see tsconfig paths), not relative paths.',
  },
  {
    group: ['#*.js', '#*/*.js', '#*/*/*.js', '#*/*/*/*.js'],
    message: 'Omit the file extension; # specifiers resolve like a bundler.',
  },
];

// A directory containing index.ts is a package. Its other modules are private
// outside that package; utils is deliberately exempt from this boundary rule.
const sourceRoot = fileURLToPath(new URL('./src', import.meta.url));
const packageRoots = readdirSync(sourceRoot, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name === 'index.ts')
  .map((entry) => path.relative(sourceRoot, entry.parentPath).split(path.sep).join('/'))
  .filter((root) => root.length > 0 && root !== 'utils' && !root.startsWith('utils/'))
  .sort();

const allPackagePrivatePatterns = packageRoots.map((root) => ({
  group: [`#${root}/*`],
  message: 'Import from the package root only; sibling modules are private outside the package.',
}));

/** Build import restrictions, optionally allowing one package's own siblings. */
const restrictedImports = (privatePatterns = allPackagePrivatePatterns) =>
  ['error', { patterns: [...importShapePatterns, ...privatePatterns] }] as const;

const packageBoundaryOverrides = packageRoots.map((root) => ({
  files: [`src/${root}/**/*.ts`],
  rules: {
    'no-restricted-imports': restrictedImports(
      allPackagePrivatePatterns.filter((pattern) => pattern.group[0] !== `#${root}/*`)
    ),
  },
}));

export default defineConfig({
  plugins: ['typescript'],
  categories: {
    correctness: 'off',
    suspicious: 'off',
    pedantic: 'off',
    perf: 'off',
    style: 'off',
    restriction: 'off',
  },
  options: {
    typeAware: true,
  },
  env: {
    builtin: true,
  },
  rules: {
    eqeqeq: ['error', 'always'],
    'func-style': ['error', 'expression'],
    'no-bitwise': 'off',
    complexity: ['error', 15],
    'no-restricted-imports': restrictedImports(),
    'typescript/no-explicit-any': 'error',
    'typescript/ban-ts-comment': 'error',
    'typescript/ban-types': 'error',
    'typescript/no-floating-promises': 'error',
    'typescript/await-thenable': 'error',
    'typescript/no-misused-promises': 'error',
    'typescript/require-await': 'error',
    'typescript/no-unnecessary-type-assertion': 'error',
    'typescript/no-unsafe-assignment': 'error',
    'typescript/no-unsafe-member-access': 'error',
    'typescript/no-unsafe-call': 'error',
    'typescript/no-unsafe-return': 'error',
    'typescript/no-unsafe-argument': 'error',
  },
  overrides: [
    ...packageBoundaryOverrides,
    {
      files: ['src/**/*.test.ts', 'testing/**/*.ts'],
      rules: {
        'no-restricted-imports': restrictedImports([]),
        'typescript/no-floating-promises': 'off',
        complexity: 'off',
      },
      plugins: ['typescript'],
    },
  ],
});
