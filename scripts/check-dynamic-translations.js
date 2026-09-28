#!/usr/bin/env node
// Checks translate() ids that are built at runtime (template literals or ids
// read from data) against i18n/en/code.json. `docusaurus write-translations`
// only extracts literal ids, so these keys have to be maintained by hand, and
// en/code.json overrides the `message` fallback even in English.
//
// Reports, and with --write fixes:
//   missing  ids the site renders that en/code.json lacks (never reach Crowdin)
//   stale    ids whose en/code.json message differs from the source text
//   dead     keys in the dynamic namespaces that nothing renders anymore
// The same applies to the mobile drawer labels in the theme's navbar.json.
//
// Each source below mirrors the id template of its component. The template
// string is asserted to still exist in the component, so a changed template
// fails this check instead of drifting silently.
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const ROOT = path.join(__dirname, '..');
const CODE_JSON = path.join(ROOT, 'i18n/en/code.json');
const NAVBAR_JSON = path.join(ROOT, 'i18n/en/docusaurus-theme-classic/navbar.json');
const WRITE = process.argv.includes('--write');

const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

// Read a top-level `const NAME = ...` as plain data. Strings, numbers,
// booleans, arrays and objects are kept, anything else (JSX icons, calls) is
// dropped, so only the text fields the ids are built from need to be literal.
function literalValue(node) {
  switch (node.type) {
    case 'StringLiteral':
    case 'NumericLiteral':
    case 'BooleanLiteral':
      return node.value;
    case 'TemplateLiteral':
      return node.expressions.length ? undefined : node.quasis[0].value.cooked;
    case 'ArrayExpression':
      return node.elements.map((e) => (e ? literalValue(e) : undefined));
    case 'ObjectExpression': {
      const obj = {};
      for (const prop of node.properties) {
        if (prop.type !== 'ObjectProperty') continue;
        const key = prop.key.type === 'Identifier' ? prop.key.name : prop.key.value;
        const value = literalValue(prop.value);
        if (value !== undefined) obj[key] = value;
      }
      return obj;
    }
    default:
      return undefined;
  }
}

function readConst(rel, name) {
  const ast = parser.parse(read(rel), { sourceType: 'module', plugins: ['jsx'] });
  let value;
  traverse(ast, {
    VariableDeclarator(p) {
      if (p.node.id.name !== name) return;
      value = literalValue(p.node.init);
      p.stop();
    },
  });
  if (value === undefined) throw new Error(`${rel}: const ${name} not found or not a literal`);
  return value;
}

function assertTemplates(rel, templates) {
  const source = read(rel);
  for (const t of templates) {
    if (!source.includes(t)) throw new Error(`${rel} no longer contains ${t}, update this check`);
  }
}

function megaMenu() {
  const rel = 'src/theme/NavbarItem/DropdownNavbarItem/index.js';
  assertTemplates(rel, [
    '`navbar.mega.featured.title.${featured.title}`',
    '`navbar.mega.featured.description.${featured.title}`',
    '`navbar.mega.featured.cta.${featured.title}`',
    '`navbar.mega.column.${column.title}`',
    '`navbar.mega.label.${item.label}`',
    '`navbar.mega.description.${item.label}`',
  ]);
  const getNavbarItems = require(path.join(ROOT, 'src/data/navbar.js'));
  const out = [];
  for (const menu of getNavbarItems()) {
    if (!menu.mega) continue;
    const { featured, columns } = menu.customProps;
    if (featured) {
      out.push([`navbar.mega.featured.title.${featured.title}`, featured.title]);
      out.push([`navbar.mega.featured.description.${featured.title}`, featured.description]);
      out.push([`navbar.mega.featured.cta.${featured.title}`, featured.cta]);
    }
    for (const column of columns) {
      out.push([`navbar.mega.column.${column.title}`, column.title]);
      for (const item of column.items) {
        out.push([`navbar.mega.label.${item.label}`, item.label]);
        if (item.description) out.push([`navbar.mega.description.${item.label}`, item.description]);
      }
    }
  }
  return out;
}

function glossary() {
  assertTemplates('src/pages/glossary.js', [
    '`glossary.category.${term.category}`',
    '`glossary.category.${slug}`',
    '`glossary.path.${p.id}.title`',
    '`glossary.path.${p.id}.desc`',
    '`glossary.path.${p.id}.audience`',
  ]);
  assertTemplates('src/components/GlossaryTerm/index.js', ['`glossary.category.${term.category}`']);
  const rel = 'src/data/glossaryCategories.js';
  const categories = readConst(rel, 'CATEGORIES');
  const paths = readConst(rel, 'LEARNING_PATHS');
  const out = Object.entries(categories).map(([slug, c]) => [`glossary.category.${slug}`, c.label]);
  for (const p of paths) {
    out.push([`glossary.path.${p.id}.title`, p.title]);
    out.push([`glossary.path.${p.id}.desc`, p.description]);
    out.push([`glossary.path.${p.id}.audience`, p.audience]);
  }
  return out;
}

function governanceMilestones() {
  const rel = 'src/pages/governance.js';
  assertTemplates(rel, ['translate({id: m.titleId, message: m.title})', 'translate({id: m.textId, message: m.text})', 'translate({id: m.categoryId, message: m.category})']);
  return readConst(rel, 'milestones').flatMap((m) => [
    [m.titleId, m.title],
    [m.textId, m.text],
    [m.categoryId, m.category],
  ]);
}

function ambassadors() {
  const roles = 'src/components/Ambassadors/AmbassadorsContributions/index.js';
  const overview = 'src/components/Ambassadors/AmbassadorsImpactOverview/index.js';
  const stories = 'src/components/Ambassadors/AmbassadorsImpactStories/index.js';
  const milestones = 'src/components/Ambassadors/AmbassadorsMilestones/index.js';
  assertTemplates(roles, ['id: role.titleId, message: role.titleDefault', 'id: role.descId, message: role.descDefault']);
  assertTemplates(overview, ['`ambassadors.impact.${category.key}.label`', '`ambassadors.impact.${category.key}.caption`']);
  assertTemplates(stories, ['`ambassadors.story.${story.id}.tag`', '`ambassadors.story.${story.id}.title`', '`ambassadors.story.${story.id}.excerpt`']);
  assertTemplates(milestones, ['`ambassadors.milestone.${m.id}.title`', '`ambassadors.milestone.${m.id}.body`', '`ambassadors.milestone.${m.id}.credit`']);

  const out = [];
  for (const r of readConst(roles, 'ROLES')) {
    out.push([r.titleId, r.titleDefault], [r.descId, r.descDefault]);
  }
  for (const c of readConst(overview, 'CATEGORIES')) {
    out.push([`ambassadors.impact.${c.key}.label`, c.labelDefault], [`ambassadors.impact.${c.key}.caption`, c.captionDefault]);
  }
  for (const s of JSON.parse(read('src/data/ambassadorsImpact.json')).stories) {
    if (s.tagDefault) out.push([`ambassadors.story.${s.id}.tag`, s.tagDefault]);
    out.push([`ambassadors.story.${s.id}.title`, s.titleDefault], [`ambassadors.story.${s.id}.excerpt`, s.excerptDefault]);
  }
  for (const m of JSON.parse(read('src/data/ambassadorsAchievements.json'))) {
    out.push([`ambassadors.milestone.${m.id}.title`, m.achievement]);
    if (m.bodyDefault) out.push([`ambassadors.milestone.${m.id}.body`, m.bodyDefault]);
    if (m.ambassadorsInvolved) out.push([`ambassadors.milestone.${m.id}.credit`, m.ambassadorsInvolved]);
  }
  return out;
}

// Namespaces owned entirely by the sources above, so unknown keys are dead.
const DYNAMIC_PREFIXES = [
  'navbar.mega.',
  'glossary.category.',
  'glossary.path.',
  'governance.impact.',
  'ambassadors.story.',
  'ambassadors.milestone.',
  'ambassadors.impact.',
  'ambassadors.roles.',
];
// Every literal translate id in src. Literal keys can share a namespace with
// the dynamic ones (ambassadors.impact.title, glossary.path.meta) and must
// never count as dead.
function literalIds() {
  const ids = new Set();
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      const file = path.join(dir, name);
      if (fs.statSync(file).isDirectory()) walk(file);
      else if (/\.(js|jsx|mjs)$/.test(name)) {
        const ast = parser.parse(fs.readFileSync(file, 'utf8'), { sourceType: 'module', plugins: ['jsx'] });
        traverse(ast, {
          ObjectProperty(p) {
            const key = p.node.key.type === 'Identifier' ? p.node.key.name : p.node.key.value;
            if (key === 'id' && p.node.value.type === 'StringLiteral') ids.add(p.node.value.value);
          },
          JSXAttribute(p) {
            if (p.node.name.name === 'id' && p.node.value?.type === 'StringLiteral') ids.add(p.node.value.value);
          },
          StringLiteral(p) {
            // Ids kept in data tables before they reach translate(), e.g. titleId.
            if (/^[a-zA-Z]+\.[\w.-]+$/.test(p.node.value)) ids.add(p.node.value);
          },
        });
      }
    }
  };
  walk(path.join(ROOT, 'src'));
  return ids;
}
const LITERAL_IDS = literalIds();

// The mobile drawer translates navbar labels through the theme's navbar.json
// (item.label.<label>), which write-translations only fills on a full run.
function navbarLabels() {
  const getNavbarItems = require(path.join(ROOT, 'src/data/navbar.js'));
  const labels = new Set();
  for (const item of getNavbarItems()) {
    labels.add(item.label);
    for (const child of item.items || []) labels.add(child.label);
  }
  return [...labels].map((label) => [`item.label.${label}`, label]);
}

function collect(entries) {
  const map = new Map();
  for (const [id, message] of entries) {
    if (typeof message !== 'string' || !message) throw new Error(`${id}: empty message`);
    if (map.has(id) && map.get(id) !== message) throw new Error(`${id}: two different messages`);
    map.set(id, message);
  }
  return map;
}

// Both files mix one-line and multi-line entries, so edits are made per
// entry on the raw text instead of re-serializing the whole file.
function writeEntries(file, { expected, missing, stale, dead, describe }) {
  const raw = fs.readFileSync(file, 'utf8');
  const starts = [...raw.matchAll(/^ {2}"((?:[^"\\]|\\.)*)": \{/gm)].map((m) => ({ id: JSON.parse(`"${m[1]}"`), index: m.index }));
  const end = raw.lastIndexOf('\n}');
  const entries = starts.map((s, i) => ({ id: s.id, text: raw.slice(s.index, i + 1 < starts.length ? starts[i + 1].index : end).replace(/,?\s*$/, '') }));
  const deadSet = new Set(dead);
  const staleMap = new Map(stale);
  const kept = entries.filter((e) => !deadSet.has(e.id)).map((e) => {
    if (!staleMap.has(e.id)) return e.text;
    const replaced = e.text.replace(/"message": "(?:[^"\\]|\\.)*"/, () => `"message": ${JSON.stringify(staleMap.get(e.id))}`);
    if (replaced === e.text) throw new Error(`${e.id}: could not rewrite message`);
    return replaced;
  });
  for (const [id, message] of missing) {
    const description = describe ? `,\n    "description": ${JSON.stringify(describe(message))}` : '';
    kept.push(`  ${JSON.stringify(id)}: {\n    "message": ${JSON.stringify(message)}${description}\n  }`);
  }
  const out = `${raw.slice(0, starts[0].index)}${kept.join(',\n')}\n}\n`;
  const parsed = JSON.parse(out);
  for (const [id, message] of expected) if (parsed[id]?.message !== message) throw new Error(`${id}: write check failed`);
  fs.writeFileSync(file, out);
}

function check(label, file, expected, isOwned, describe) {
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  const missing = [...expected].filter(([id]) => !json[id]);
  const stale = [...expected].filter(([id, message]) => json[id] && json[id].message !== message);
  const dead = Object.keys(json).filter((id) => isOwned(id) && !expected.has(id) && !LITERAL_IDS.has(id));
  for (const [name, list] of [['missing', missing.map(([id]) => id)], ['stale', stale.map(([id]) => id)], ['dead', dead]]) {
    if (list.length) console.log(`${label} ${name} (${list.length}):\n  ${list.join('\n  ')}`);
  }
  const problems = missing.length + stale.length + dead.length;
  if (WRITE && problems) {
    writeEntries(file, { expected, missing, stale, dead, describe });
    console.log(`${label}: wrote ${missing.length} added, ${stale.length} updated, ${dead.length} removed`);
    return 0;
  }
  return problems;
}

const codeIds = collect([...megaMenu(), ...glossary(), ...governanceMilestones(), ...ambassadors()]);
const navbarIds = collect(navbarLabels());
const problems =
  check('i18n/en/code.json', CODE_JSON, codeIds, (id) => DYNAMIC_PREFIXES.some((p) => id.startsWith(p))) +
  check('navbar.json', NAVBAR_JSON, navbarIds, (id) => id.startsWith('item.label.'), (label) => `Navbar item with label ${label}`);

if (problems) {
  console.error('check-dynamic-translations: run `node scripts/check-dynamic-translations.js --write` to fix');
  process.exit(1);
}
if (!WRITE) console.log(`check-dynamic-translations: ${codeIds.size} dynamic ids and ${navbarIds.size} navbar labels OK`);
