/**
 * Editorial guard for content and code. Flags typographic style-guide
 * violations that are unambiguous and safe to enforce:
 *   - em dash (U+2014) and horizontal bar (U+2015) anywhere
 *   - en dash (U+2013) EXCEPT between digits (numeric ranges are allowed)
 *   - the HTML entities that render to the above
 *   - arrow glyphs (U+2190, U+2192), in docs/ and blog/ only
 *
 * Scope: docs/ and blog/ (md, mdx), plus src/, i18n/en/ and scripts/ (text
 * source files incl. comments). Other locales are not checked, they come from
 * Crowdin and would block its sync PRs.
 *
 * style-guide.md is excluded: it documents these characters by design. The
 * guards spell the glyphs as escapes so they pass their own check.
 * IOHK/IOG are intentionally NOT enforced here (dated archive references and
 * proper names need editorial judgement, not a mechanical rule).
 *
 * Exits non-zero on any violation so CI blocks it.
 */
const { readFileSync } = require('node:fs');
const { execFileSync } = require('node:child_process');

const CONTENT = { dirs: ['docs', 'blog'], ext: /\.mdx?$/, arrows: true };
const CODE = {
  dirs: ['src', 'i18n/en', 'scripts'],
  ext: /\.(js|jsx|ts|tsx|mjs|cjs|md|mdx|json|css|html)$/,
  arrows: false,
};
const EXCLUDED = new Set(['docs/get-involved/style-guide.md']);

// Tracked plus untracked-but-not-ignored, so new files are checked locally too.
const listFiles = ({ dirs, ext }) =>
  execFileSync(
    'git',
    ['ls-files', '--cached', '--others', '--exclude-standard', '--', ...dirs],
    { encoding: 'utf8' }
  )
    .split('\n')
    .filter((f) => ext.test(f) && !EXCLUDED.has(f));

const ENTITIES = /&(?:mdash|ndash|#8212|#8211|#x2014|#x2013);/;
const violations = [];

for (const scope of [CONTENT, CODE]) {
  for (const f of listFiles(scope)) {
    readFileSync(f, 'utf8')
      .split('\n')
      .forEach((line, i) => {
        const hits = [];
        if (/[\u2014\u2015]/.test(line)) hits.push('em dash');
        if (scope.arrows && /[\u2190\u2192]/.test(line)) hits.push('arrow');
        if (ENTITIES.test(line)) hits.push('dash entity');
        // en dash, but not a numeric range (digit, en dash, digit, optional spaces)
        if (/(?<!\d\s?)\u2013(?!\s?\d)/.test(line)) hits.push('en dash');
        if (hits.length) violations.push(`${f}:${i + 1}  ${hits.join(', ')}`);
      });
  }
}

if (violations.length) {
  console.error(
    `check-docs-style: ${violations.length} violation(s)\n` +
      violations.map((v) => '  ' + v).join('\n') +
      '\n\nReplace dashes with a comma, colon, period or parentheses. Plain hyphens (-)' +
      '\nand numeric ranges like 60\u201370 are fine. Arrows in docs/blog: use words instead.'
  );
  process.exit(1);
}
console.log(
  `check-docs-style: ok (no stray dashes in ${[...CONTENT.dirs, ...CODE.dirs].join(', ')})`
);
