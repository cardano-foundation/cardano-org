/**
 * Documentation guard for shared components. Every component in
 * src/components/Layout/ and every feature widget listed below needs:
 *   - a JSDoc block, with `@param ... props.name` tags for its props
 *   - a doc page under docs/get-involved/components/
 *   - the same prop names in the JSDoc and in the doc page's props tables
 *
 * Page-specific components are not checked. See
 * docs/get-involved/component-guidelines.md for the rules.
 *
 * Reports problems as warnings and exits 0, as annotations when it runs in
 * GitHub Actions. Pass --strict to exit 1 on any problem.
 */
const { readFileSync, readdirSync, existsSync, statSync } = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const COMPONENTS = path.join(ROOT, 'src/components');
const DOCS = path.join(ROOT, 'docs/get-involved/components');
const STRICT = process.argv.includes('--strict');

// Feature widgets outside Layout/ that are reused across pages.
const WIDGETS = [
  'AppGrid',
  'AppIcon',
  'AppList',
  'AppRow',
  'AppTile',
  'AppTileCarousel',
  'FAQSection',
  'FundingPrograms',
  'Layer2Card',
  'Quiz',
  'QuizCard',
  'QuizModal',
  'QuizShare',
  'TermExplainer',
  'TreasurySections',
  'WalletDelegation',
];

// Doc pages whose file name does not follow the component name.
const DOC_PAGE = {
  AppTileCarousel: 'app-tile.md',
  FAQSection: '../faq-component.md',
  Layer2Card: 'layer-2-card.md',
};

// Components that need no doc page of their own.
const EXCEPTIONS = new Set([
  'OuroborosLogo', // internal part of SiteHero, described on the Site Hero page
]);

// Components whose props are not compared with the doc page.
const PROPS_NOT_COMPARED = new Set([
  'TreasurySections', // the sections take no props, ClientOnly and TreasuryChart are internal helpers
]);

function kebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

function sourceFiles(dir) {
  return readdirSync(dir)
    .filter((f) => /\.(js|jsx|ts|tsx)$/.test(f))
    .map((f) => path.join(dir, f));
}

// Top-level prop names from `@param {type} props.name` and `[props.name=...]`.
// The greedy type match backtracks to the brace before `props.`, so nested
// object types such as `{Array<{...}>}` work.
function paramNames(block) {
  return [...block.matchAll(/@param\s+\{.*\}\s+\[?props\.(\w+)(?=[\s=\]])/g)].map((m) => m[1]);
}

function jsdocProps(files) {
  const props = new Set();
  let hasBlock = false;
  for (const file of files) {
    const src = readFileSync(file, 'utf8');
    for (const block of src.match(/\/\*\*[\s\S]*?\*\//g) || []) {
      hasBlock = true;
      for (const name of paramNames(block)) props.add(name);
    }
  }
  return { hasBlock, props };
}

// Prop names from the first column of every table whose header starts with "Prop".
function docProps(file) {
  const props = new Set();
  let hasTable = false;
  let inTable = false;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    if (/^\|\s*Prop\s*\|/i.test(line)) {
      inTable = true;
      hasTable = true;
      continue;
    }
    if (!inTable) continue;
    if (!line.startsWith('|')) {
      inTable = false;
      continue;
    }
    const m = line.match(/^\|\s*`([A-Za-z0-9_]+)`/);
    if (m) props.add(m[1]);
  }
  return { hasTable, props };
}

const targets = [
  ...readdirSync(path.join(COMPONENTS, 'Layout'))
    .filter((d) => statSync(path.join(COMPONENTS, 'Layout', d)).isDirectory())
    .map((name) => ({ name, dir: path.join(COMPONENTS, 'Layout', name) })),
  ...WIDGETS.map((name) => ({ name, dir: path.join(COMPONENTS, name) })),
];

const problems = [];
// Components that share a doc page are compared together.
const pages = new Map();
for (const { name, dir } of targets) {
  const add = (msg) => problems.push(`${name}: ${msg}`);
  if (!existsSync(dir)) {
    add(`listed in WIDGETS but ${path.relative(ROOT, dir)} does not exist`);
    continue;
  }
  const jsdoc = jsdocProps(sourceFiles(dir));
  if (!jsdoc.hasBlock) add('no JSDoc block');

  if (EXCEPTIONS.has(name)) continue;
  const docFile = path.join(DOCS, DOC_PAGE[name] || `${kebab(name)}.md`);
  if (!existsSync(docFile)) {
    add(`no doc page, expected ${path.relative(ROOT, docFile)}`);
    continue;
  }
  if (PROPS_NOT_COMPARED.has(name)) continue;
  const page = pages.get(docFile) || { names: [], props: new Set() };
  page.names.push(name);
  jsdoc.props.forEach((p) => page.props.add(p));
  pages.set(docFile, page);
}

for (const [docFile, page] of pages) {
  const add = (msg) => problems.push(`${page.names.join(', ')}: ${msg}`);
  const doc = docProps(docFile);
  if (page.props.size > 0 && !doc.hasTable) {
    add(`${path.relative(ROOT, docFile)} has no props table`);
    continue;
  }
  const notInDoc = [...page.props].filter((p) => !doc.props.has(p));
  const notInJsdoc = [...doc.props].filter((p) => !page.props.has(p));
  if (notInDoc.length) add(`props missing in the doc page: ${notInDoc.join(', ')}`);
  if (notInJsdoc.length) add(`props in the doc page but not in JSDoc: ${notInJsdoc.join(', ')}`);
}

if (problems.length === 0) {
  console.log(`check-component-docs: ok (${targets.length} components)`);
  process.exit(0);
}

const label = STRICT ? 'error' : 'warning';
// In GitHub Actions each problem becomes an annotation on the pull request's checks.
const prefix = process.env.GITHUB_ACTIONS === 'true' ? `::${label} title=Component docs::` : `${label}: `;
for (const p of problems) console.log(`${prefix}${p}`);
console.log(
  `check-component-docs: ${problems.length} ${label}(s) in ${targets.length} components. ` +
    'See docs/get-involved/component-guidelines.md.'
);
process.exit(STRICT ? 1 : 0);
