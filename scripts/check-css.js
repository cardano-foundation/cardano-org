/**
 * CSS drift guard. Catches the specific regressions the design-consistency
 * work fixed, without failing on the pre-migration brownfield:
 *   1. Project-namespaced CSS custom properties used via var() WITHOUT a
 *      fallback that are never defined (the --site-color-* bug class).
 *      Docusaurus/DocSearch vars are external and skipped. Infima vars are
 *      checked against Infima's and the theme's own stylesheets when they are
 *      installed, so a typo like --ifm-color-base is caught. Vars set from JS
 *      (style objects / setProperty) count as defined.
 *   2. Known breakpoint typos that must never come back (966px for 996px).
 *
 * Exits non-zero on any violation so CI blocks it. Run with `node`, no framework.
 */
const { readFileSync } = require('node:fs');
const { execFileSync } = require('node:child_process');

const find = (args) => {
  try {
    return execFileSync('find', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
      .trim()
      .split('\n')
      .filter(Boolean);
  } catch {
    // A missing directory (for example no node_modules) yields no files
    return [];
  }
};

const cssFiles = find(['src', '-name', '*.css']);
const jsFiles = find(['src', '(', '-name', '*.js', '-o', '-name', '*.jsx', ')']);

// --- 1. undefined project vars ----------------------------------------------
const defined = new Set();
for (const f of cssFiles)
  for (const m of readFileSync(f, 'utf8').matchAll(/(--[a-z0-9-]+)\s*:/gi)) defined.add(m[1]);

// Any custom property token appearing in JS is treated as runtime-defined.
const jsSet = new Set();
for (const f of jsFiles)
  for (const m of readFileSync(f, 'utf8').matchAll(/(--[a-z0-9-]+)/gi)) jsSet.add(m[1]);

// Infima vars count as known when Infima or the Docusaurus theme defines them.
// Without node_modules (or after a layout change in those packages) every
// --ifm-* var is treated as external, as before.
const vendorCss = [
  ...find(['node_modules/infima/dist/css', '-name', '*.css']),
  ...find(['node_modules/@docusaurus/theme-classic/lib', '-name', '*.css']),
].filter((f) => !f.includes('.min.'));
const infimaVars = new Set();
for (const f of vendorCss)
  for (const m of readFileSync(f, 'utf8').matchAll(/(--ifm-[a-z0-9-]+)\s*:/gi)) infimaVars.add(m[1]);
const checkInfima = infimaVars.size > 0;

const isExternal = (v) =>
  /^--(docusaurus|docsearch)-/.test(v) || (/^--ifm-/.test(v) && (!checkInfima || infimaVars.has(v)));
const varViolations = [];
for (const f of cssFiles) {
  readFileSync(f, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      // var(--x) with no fallback (no comma before the closing paren)
      for (const m of line.matchAll(/var\(\s*(--[a-z0-9-]+)\s*\)/gi)) {
        const v = m[1];
        if (isExternal(v) || defined.has(v) || jsSet.has(v)) continue;
        varViolations.push(`${f}:${i + 1}  ${v} (used without fallback, never defined)`);
      }
    });
}

// --- 2. known breakpoint typos ----------------------------------------------
// 966 is a proven typo for 996 (navbar/sidebar collapse). Extend if new appear.
const BAD_BREAKPOINTS = [966];
const bpViolations = [];
for (const f of cssFiles) {
  readFileSync(f, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      for (const bp of BAD_BREAKPOINTS) {
        if (new RegExp(`(max|min)-width:\\s*${bp}px`).test(line))
          bpViolations.push(`${f}:${i + 1}  ${bp}px (breakpoint typo, use 996px)`);
      }
    });
}

const all = [...varViolations, ...bpViolations];
if (all.length) {
  console.error(`check-css: ${all.length} violation(s)\n` + all.map((v) => '  ' + v).join('\n'));
  process.exit(1);
}
console.log('check-css: ok (no undefined project vars, no breakpoint typos)');
