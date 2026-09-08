// Execute actual Next route modules without a running Next server. The loader
// reproduces Next's @ alias and server-only marker; provider code stays real.
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const root = new URL('../', import.meta.url);

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    return { url: new URL(`${specifier.slice(2)}.ts`, root).href, shortCircuit: true };
  }
  if (specifier === 'server-only') {
    return nextResolve('next/dist/compiled/server-only/empty.js', context);
  }
  if (specifier === 'next/server') return nextResolve('next/server.js', context);
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (/\.m?ts$/.test(url)) {
    const source = await readFile(new URL(url), 'utf8');
    return {
      format: 'module',
      source: ts.transpileModule(source, {
        fileName: fileURLToPath(url),
        compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
      }).outputText,
      shortCircuit: true,
    };
  }
  return nextLoad(url, context);
}
