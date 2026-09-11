/**
 * JS asset guard. Every bundle Docusaurus emits must be parsable: a single
 * invalid token kills a whole chunk, the browser then only reports "Invalid or
 * unexpected token", React never hydrates (dead menu, dead hero animation) and
 * the locale ships broken while the build stays green. Not hypothetical - the
 * German bundles of 2026-09 were invalid: webpack's RealContentHashPlugin
 * replaced the string `fe25bf46` (a chunk *name*, which happens to equal
 * another asset's old content hash) with the real hash `4003635d`, in a place
 * where Terser had already unquoted that name, so only `de` broke and only that
 * one object key. webpack#14058 / webpack#19110.
 *
 * Exits non-zero on any violation so CI blocks it. Run with `node`, no framework.
 */
const { existsSync, readFileSync, readdirSync } = require('node:fs');
const { join, relative, resolve } = require('node:path');
const { Script } = require('node:vm');

const root = resolve(process.argv.slice(2).find((arg) => !arg.startsWith('-')) ?? 'build');
if (!existsSync(root)) {
  console.error(`check-js-assets: ${root} does not exist - run the build first.`);
  process.exit(1);
}

const findJsFiles = (dir) =>
  readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.js'))
    .map((entry) => join(entry.parentPath ?? entry.path, entry.name));

const parseError = (file) => {
  try {
    new Script(readFileSync(file, 'utf8'), { filename: file });
    return null;
  } catch (error) {
    return error instanceof SyntaxError ? error.message : String(error);
  }
};

const files = findJsFiles(root);
const broken = files
  .map((file) => [relative(root, file), parseError(file)])
  .filter(([, message]) => message);

if (broken.length > 0) {
  console.error(`check-js-assets: ${broken.length} of ${files.length} JS assets do not parse:\n`);
  for (const [file, message] of broken) console.error(`  ${file}\n    ${message}\n`);
  console.error('A bundle that does not parse is dead: React never hydrates.');
  process.exit(1);
}

console.log(`check-js-assets: ${files.length} JS assets parsed successfully.`);
