//
// Fail-fast size guard for src/data/app-screenshots/.
// Runs in the build chain to keep the repo from bloating with multi-megabyte previews.
// Target: 2048×1440 source (1024×720 displayed @ 2x), WebP quality 80, ≤500 KB.
// Convert with cwebp:
//   cwebp -q 80 -m 6 in.png -o out.webp
//

const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/data/app-screenshots');
const MAX_BYTES = 500 * 1024; // 500 KB

if (!fs.existsSync(dir)) {
  console.error(`Missing directory: ${dir}`);
  process.exit(1);
}

const offenders = fs
  .readdirSync(dir)
  .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
  .map((f) => ({ name: f, size: fs.statSync(path.join(dir, f)).size }))
  .filter((entry) => entry.size > MAX_BYTES);

if (offenders.length > 0) {
  const fmt = (n) => `${(n / 1024).toFixed(0)} KB`;
  console.error(
    `❌ ${offenders.length} screenshot${offenders.length === 1 ? '' : 's'} exceed${
      offenders.length === 1 ? 's' : ''
    } the 500 KB limit:`
  );
  for (const o of offenders) {
    console.error(`  - ${o.name} (${fmt(o.size)})`);
  }
  console.error(
    '\nResize/convert before committing. Example:\n  cwebp -q 80 -m 6 in.png -o out.webp'
  );
  process.exit(1);
}

console.log('✅ All app screenshots within size limit (500 KB).');
