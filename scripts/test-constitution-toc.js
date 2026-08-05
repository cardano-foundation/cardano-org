// Tests for scripts/lib/constitution-toc.js (TOC + slug logic for the
// constitution page). Plain-node assertions, mirroring test-sitemap-hreflang.
const assert = require('assert');
const { slugify, createSlugger, extractToc } = require('./lib/constitution-toc.js');

let passed = 0;
const check = (name, fn) => { fn(); passed++; console.log('ok -', name); };

check('slugify lowercases and hyphenates', () => {
  assert.strictEqual(slugify('Guiding Tenets'), 'guiding-tenets');
});
check('slugify strips bold markers', () => {
  assert.strictEqual(slugify('**PREAMBLE**'), 'preamble');
});
check('slugify drops punctuation incl. quotes and dots', () => {
  assert.strictEqual(slugify('Section 7 "Treasury Withdrawals" Action Standards'), 'section-7-treasury-withdrawals-action-standards');
  assert.strictEqual(slugify('2.1. Critical Protocol Parameters'), '2-1-critical-protocol-parameters');
});
check('createSlugger dedups repeats', () => {
  const s = createSlugger();
  assert.strictEqual(s('Introduction'), 'introduction');
  assert.strictEqual(s('Introduction'), 'introduction-2');
  assert.strictEqual(s('Introduction'), 'introduction-3');
});
check('extractToc reads Setext h1/h2 and ATX h3 in order, with bold stripped', () => {
  const md = [
    '**TITLE**',
    '=========',
    '',
    '**PREAMBLE**',
    '------------',
    '',
    'body text',
    '',
    '### **Section 1 Guiding Tenets**',
    '',
    '### **Section 1 Guiding Tenets**',
    '',
  ].join('\n');
  const toc = extractToc(md);
  assert.deepStrictEqual(toc, [
    { level: 1, text: 'TITLE', slug: 'title' },
    { level: 2, text: 'PREAMBLE', slug: 'preamble' },
    { level: 3, text: 'Section 1 Guiding Tenets', slug: 'section-1-guiding-tenets' },
    { level: 3, text: 'Section 1 Guiding Tenets', slug: 'section-1-guiding-tenets-2' },
  ]);
});
check('extractToc ignores headings inside fenced code blocks', () => {
  const md = ['```', '### not a heading', '```', '', '### **Real**'].join('\n');
  const toc = extractToc(md);
  assert.deepStrictEqual(toc, [{ level: 3, text: 'Real', slug: 'real' }]);
});
check('extractToc does not treat a hr (--- after blank) as Setext', () => {
  const md = ['para', '', '---', '', '### **Real**'].join('\n');
  const toc = extractToc(md);
  assert.deepStrictEqual(toc, [{ level: 3, text: 'Real', slug: 'real' }]);
});

console.log(`\n${passed} checks passed`);
