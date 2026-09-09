// Execute actual Next route modules without a running Next server. The loader
// reproduces Next's @ alias and server-only marker; provider code stays real.
import { access, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const root = new URL('../', import.meta.url);

export async function resolve(specifier, context, nextResolve) {
  if (process.env.PREVIEW_TEST_PROVIDER_MOCK === '1' &&
      (specifier === '@/lib/supabase-admin' || specifier === '@/lib/email-send')) {
    return { url: new URL('./preview-provider-mocks.mjs', import.meta.url).href, shortCircuit: true };
  }
  if (specifier.startsWith('@/')) {
    for (const extension of ['.ts', '.tsx']) {
      const candidate = new URL(`${specifier.slice(2)}${extension}`, root);
      try {
        await access(candidate);
        return { url: candidate.href, shortCircuit: true };
      } catch {
        // Try the next TypeScript extension.
      }
    }
  }
  if (specifier === 'server-only') {
    return nextResolve('next/dist/compiled/server-only/empty.js', context);
  }
  if (specifier === 'next/server') return nextResolve('next/server.js', context);
  if (specifier === 'next/link') return nextResolve('next/link.js', context);
  if (specifier === 'next/navigation') return nextResolve('next/navigation.js', context);
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (/\.tsx?$/.test(url)) {
    const source = await readFile(new URL(url), 'utf8');
    return {
      format: 'module',
      source: ts.transpileModule(source, {
        fileName: fileURLToPath(url),
        compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
      }).outputText,
      shortCircuit: true,
    };
  }
  return nextLoad(url, context);
}
