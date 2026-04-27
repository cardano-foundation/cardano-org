//
// Generates static/apps.llms.txt — a plaintext catalog of all apps for LLM crawlers.
// Mirrors the data in src/data/apps.js. Built statically; no live activity data.
// Command: yarn run build-llms
//

const fs = require('fs');
const path = require('path');
const {
  parseShowcases,
  assertEntryCountMatches,
} = require('./lib/parse-apps.cjs');

const appsSource = path.join(__dirname, '../src/data/apps.js');
const outputPath = path.join(__dirname, '../static/apps.llms.txt');

const source = fs.readFileSync(appsSource, 'utf8');
const { apps, block } = parseShowcases(source);
assertEntryCountMatches(apps, block);

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
