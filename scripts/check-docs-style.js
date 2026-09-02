/**
 * Editorial guard for docs/ and blog/ content. Flags typographic style-guide
 * violations that are unambiguous and safe to enforce:
 *   - em dash (—) and horizontal bar (―) anywhere
 *   - en dash (–) EXCEPT between digits (numeric ranges like 60–70 are allowed)
 *   - arrow glyphs (→ ←) anywhere
 *   - the HTML entities that render to the above
 *
 * style-guide.md is excluded: it documents these characters by design.
 * IOHK/IOG are intentionally NOT enforced here (dated archive references and
 * proper names need editorial judgement, not a mechanical rule).
 *
 * Exits non-zero on any violation so CI blocks it.
 */
const { readFileSync } = require('node:fs');
const { execFileSync } = require('node:child_process');

const files = execFileSync(
  'find',
  ['docs', 'blog', '-name', '*.md', '-o', '-name', '*.mdx'],
  { encoding: 'utf8' }
)
  .trim()
  .split('\n')
  .filter(Boolean)
  .filter((f) => !f.endsWith('get-involved/style-guide.md'));

const ENTITIES = /&mdash;|&ndash;|&#8212;|&#8211;|&#x2014;|&#x2013;/;
const violations = [];

for (const f of files) {
  readFileSync(f, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      const hits = [];
      if (line.includes('—') || line.includes('―')) hits.push('em dash');
      if (line.includes('→') || line.includes('←')) hits.push('arrow');
      if (ENTITIES.test(line)) hits.push('dash entity');
      // en dash, but not a numeric range (digit – digit, optional spaces)
      if (/–/.test(line) && /(?<!\d\s?)–(?!\s?\d)/.test(line)) hits.push('en dash');
      if (hits.length) violations.push(`${f}:${i + 1}  ${hits.join(', ')}`);
    });
}

if (violations.length) {
  console.error(
    `check-docs-style: ${violations.length} violation(s)\n` +
      violations.map((v) => '  ' + v).join('\n')
  );
  process.exit(1);
}
console.log('check-docs-style: ok (no stray dashes or arrows in docs/blog)');
