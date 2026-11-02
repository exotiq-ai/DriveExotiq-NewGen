import { execFileSync } from 'node:child_process';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

export const PRODUCTION_BRANCH = 'production-astra';
export const PRODUCTION_SITE_ID = 'a9dc6785-ca82-407f-8899-edc4ebf23fd0';
export const PRODUCTION_URL = 'https://driveexotiq.com';
const previewContexts = new Set(['deploy-preview', 'branch-deploy', 'preview-server', 'dev', 'astra-review']);

/** Deployment identity is separate from NODE_ENV: local production-mode QA is allowed. */
export function validateDeploymentContext(env, checkoutBranch) {
  const context = env.CONTEXT;
  if (env.NETLIFY === 'true' && (!context || (context !== 'production' && !previewContexts.has(context)))) {
    throw new Error('Netlify requires an explicit recognized deployment context.');
  }
  if (context !== 'production') {
    if (env.NETLIFY === 'true' && env.NEXT_PUBLIC_SITE_MODE !== 'preview') {
      throw new Error('Non-production Netlify contexts must retain preview mode.');
    }
    return;
  }

  const siteId = env.SITE_ID || env.NETLIFY_SITE_ID;
  if (env.SITE_ID && env.NETLIFY_SITE_ID && env.SITE_ID !== env.NETLIFY_SITE_ID) {
    throw new Error('Refusing conflicting Netlify site identities.');
  }
  if (siteId !== PRODUCTION_SITE_ID) throw new Error(`Production builds require the production site ${PRODUCTION_SITE_ID}.`);
  if (env.BRANCH !== PRODUCTION_BRANCH) throw new Error(`Production builds require BRANCH=${PRODUCTION_BRANCH}.`);
  // Netlify/GitHub can check out a detached commit. An attached checkout must agree.
  if (checkoutBranch && checkoutBranch !== PRODUCTION_BRANCH) {
    throw new Error(`The checkout branch must be ${PRODUCTION_BRANCH} for a production build.`);
  }
  if (env.NEXT_PUBLIC_SITE_MODE !== 'production') throw new Error('Production site mode must be production.');
  if (env.NEXT_PUBLIC_SITE_URL !== PRODUCTION_URL) throw new Error(`Production canonical URL must be ${PRODUCTION_URL}.`);
  if (env.NEXT_PUBLIC_FORM_MODE !== 'live') throw new Error('Production form mode must be live.');
}

async function resolveSource(base) {
  for (const candidate of [base, ...['.tsx', '.ts', '.jsx', '.js'].map(extension => `${base}${extension}`), ...['.tsx', '.ts', '.jsx', '.js'].map(extension => path.join(base, `index${extension}`))]) {
    try { if ((await stat(candidate)).isFile()) return candidate; } catch { /* Try the next source extension. */ }
  }
  return null;
}

function hasIdentity(element) {
  if (element.tagName.getText() !== 'main') return false;
  return element.attributes.properties.some(attribute => {
    if (!ts.isJsxAttribute(attribute) || attribute.name.getText() !== 'data-site-experience') return false;
    const value = attribute.initializer;
    return (value && ts.isStringLiteral(value) && value.text === 'astra') ||
      (value && ts.isJsxExpression(value) && value.expression && ts.isStringLiteral(value.expression) && value.expression.text === 'astra');
  });
}

function declarationNamed(source, name) {
  for (const statement of source.statements) {
    if ((ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement)) && statement.name?.text === name) return statement;
    if (ts.isVariableStatement(statement)) {
      const declaration = statement.declarationList.declarations.find(item => ts.isIdentifier(item.name) && item.name.text === name);
      if (declaration) return declaration.initializer;
    }
  }
  return null;
}

function exportedComponent(source, name) {
  for (const statement of source.statements) {
    const modifiers = ts.canHaveModifiers(statement) ? ts.getModifiers(statement) || [] : [];
    if (name === 'default' && ts.isExportAssignment(statement) && !statement.isExportEquals) return statement.expression;
    if (name === 'default' && modifiers.some(modifier => modifier.kind === ts.SyntaxKind.DefaultKeyword)) return statement;
    if (modifiers.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
      if ((ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement)) && statement.name?.text === name) return statement;
      if (ts.isVariableStatement(statement)) {
        const declaration = statement.declarationList.declarations.find(item => ts.isIdentifier(item.name) && item.name.text === name);
        if (declaration) return declaration.initializer;
      }
    }
    if (ts.isExportDeclaration(statement) && !statement.moduleSpecifier && statement.exportClause && ts.isNamedExports(statement.exportClause)) {
      const binding = statement.exportClause.elements.find(item => item.name.text === name);
      if (binding) return declarationNamed(source, binding.propertyName?.text || binding.name.text);
    }
  }
  return null;
}

/** Inspect the rendered export chain; unrelated declarations cannot certify it. */
export async function verifyAstraSource(rootDirectory) {
  const root = path.resolve(rootDirectory);
  const entry = await resolveSource(path.join(root, 'app/page'));
  if (!entry) throw new Error('The Next.js homepage entry is missing.');
  const pending = [{ filename: entry, exportName: 'default' }];
  const visited = new Set();
  while (pending.length && visited.size < 100) {
    const { filename, exportName, localName } = pending.shift();
    const key = `${filename}:${localName ? `local:${localName}` : `export:${exportName}`}`;
    if (visited.has(key)) continue;
    visited.add(key);
    const source = ts.createSourceFile(filename, await readFile(filename, 'utf8'), ts.ScriptTarget.Latest, true);
    const component = localName ? declarationNamed(source, localName) : exportedComponent(source, exportName);
    if (!component) continue;
    if (ts.isIdentifier(component)) {
      pending.push({ filename, localName: component.text });
      continue;
    }
    const rendered = new Set();
    let identity = false;
    const inspect = node => {
      // A helper declaration inside the rendered function is not itself rendered.
      if (node !== component && (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node) || ts.isVariableStatement(node))) return;
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        if (hasIdentity(node)) identity = true;
        rendered.add(node.tagName.getText());
      }
      ts.forEachChild(node, inspect);
    };
    inspect(component);
    if (identity) return path.relative(root, filename);
    const imports = new Map();
    for (const statement of source.statements) {
      if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
      const clause = statement.importClause;
      const specifier = statement.moduleSpecifier.text;
      if (clause?.name) imports.set(clause.name.text, { specifier, exportName: 'default' });
      if (clause?.namedBindings) {
        if (ts.isNamespaceImport(clause.namedBindings)) imports.set(clause.namedBindings.name.text, { specifier, exportName: '*' });
        else for (const binding of clause.namedBindings.elements) imports.set(binding.name.text, { specifier, exportName: binding.propertyName?.text || binding.name.text });
      }
    }
    for (const tag of rendered) {
      const [name, member] = tag.split('.');
      const imported = imports.get(name);
      if (!imported) {
        if (declarationNamed(source, name)) pending.push({ filename, localName: name });
        continue;
      }
      const { specifier } = imported;
      const base = specifier.startsWith('@/') ? path.join(root, specifier.slice(2)) : specifier.startsWith('.') ? path.resolve(path.dirname(filename), specifier) : null;
      if (!base || path.relative(root, base).startsWith('..')) continue;
      const resolved = await resolveSource(base);
      if (resolved) pending.push({ filename: resolved, exportName: imported.exportName === '*' ? member : imported.exportName });
    }
  }
  throw new Error('Astra source identity is missing from the rendered homepage. Refusing to build another experience.');
}

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  let branch = null;
  try { branch = execFileSync('git', ['symbolic-ref', '--quiet', '--short', 'HEAD'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { /* Detached build checkouts use the provider BRANCH. */ }
  validateDeploymentContext(process.env, branch);
  const source = await verifyAstraSource(root);
  console.log(`Deployment source verified: Astra (${source}); context=${process.env.CONTEXT || 'local verification'}.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(`Deployment source rejected: ${error.message}`); process.exitCode = 1; });
}
