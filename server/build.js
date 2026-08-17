// Bundles the server into a single runnable file.
//
// This exists because `tsc` alone cannot emit a runnable server here: it leaves
// off the `.js` extensions Node's ESM loader requires, it does not rewrite the
// `@/` path alias into real paths, and it cannot consume the `shared` package,
// which is published as raw TypeScript. esbuild handles all three, and inlines
// shared plus the dependencies into one file along the way.

import * as esbuild from 'esbuild'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))

await esbuild.build({
  entryPoints: [path.join(root, 'src/index.ts')],
  outfile: path.join(root, 'dist/index.js'),
  bundle: true,
  platform: 'node',
  target: 'node24',
  format: 'esm',
  sourcemap: true,
  // Resolves the same `@/` alias that tsconfig.json and vite.config.ts define.
  alias: {
    '@': path.join(root, 'src'),
  },
  // bcrypt is a native addon — a .node binary cannot be bundled into JS, so it
  // stays external and is supplied by the prod-deps stage of the Dockerfile.
  external: ['bcrypt'],
  // Several dependencies are CommonJS and reference `require` internally. In an
  // ESM output file that identifier does not exist, so recreate it.
  banner: {
    js: [
      "import { createRequire as __createRequire } from 'node:module'",
      'const require = __createRequire(import.meta.url)',
    ].join('\n'),
  },
  logLevel: 'info',
})
