//
// Generates static/apps.llms.txt — a plaintext catalog of all apps for LLM crawlers.
// Mirrors the data in src/data/apps.js. Built statically; no live activity data.
// Command: yarn run build-llms
//

const fs = require('fs');
const path = require('path');

const appsSource = path.join(__dirname, '../src/data/apps.js');
const outputPath = path.join(__dirname, '../static/apps.llms.txt');

const source = fs.readFileSync(appsSource, 'utf8');

const showcasesMatch = source.match(
  /export const Showcases = \[([\s\S]+?)\n\];/
);
if (!showcasesMatch) {
  console.error('Could not locate Showcases array in apps.js');
  process.exit(1);
}
const showcasesBlock = showcasesMatch[1];

const entryRegex = /\{\s*\n\s*title:\s*"((?:[^"\\]|\\.)+)",[\s\S]*?(?:description:\s*(?:\n\s*)?"((?:[^"\\]|\\.)*)"[\s\S]*?)?website:\s*"([^"]+)"[\s\S]*?source:\s*(null|"[^"]+"),[\s\S]*?category:\s*"([^"]+)",[\s\S]*?properties:\s*\[([^\]]*)\],[\s\S]*?maintainerPick:\s*(true|false),[\s\S]*?\n\s*\},?/g;

const apps = [];
let m;
while ((m = entryRegex.exec(showcasesBlock)) !== null) {
  const title = m[1].replace(/\\"/g, '"').replace(/\\n/g, ' ').trim();
  const description = (m[2] || '')
    .replace(/\\"/g, '"')
    .replace(/\\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const website = m[3];
  const source = m[4] === 'null' ? null : m[4].replace(/^"|"$/g, '');
  const category = m[5];
  const properties = m[6]
    .split(',')
    .map((t) => t.trim().replace(/^"|"$/g, ''))
    .filter(Boolean);
  const maintainerPick = m[7] === 'true';
  apps.push({ title, description, website, source, category, properties, maintainerPick });
}

const titleCount = (showcasesBlock.match(/^\s*title:\s*"/gm) || []).length;
if (apps.length < titleCount) {
  console.error(
    `Parsed ${apps.length} apps but found ${titleCount} title: lines — regex missed entries.`
  );
  process.exit(1);
}

const lines = [
  '# Cardano apps catalog',
  '',
  'A curated list of applications running on Cardano mainnet.',
  'Canonical source: https://cardano.org/apps',
  `Generated: ${new Date().toISOString().slice(0, 10)}`,
  `App count: ${apps.length}`,
  '',
  '## Apps',
  '',
];

for (const app of apps) {
  lines.push(`### ${app.title}${app.maintainerPick ? ' (Maintainer pick)' : ''}`);
  lines.push(`URL: ${app.website}`);
  if (app.source) lines.push(`Source: ${app.source}`);
  lines.push(`Category: ${app.category}`);
  if (app.properties.length) lines.push(`Properties: ${app.properties.join(', ')}`);
  if (app.description) lines.push(app.description);
  lines.push('');
}

fs.writeFileSync(outputPath, lines.join('\n'));
console.log(`✅ Generated apps.llms.txt with ${apps.length} apps`);
