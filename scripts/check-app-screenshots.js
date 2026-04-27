//
// Fail-fast size guard for src/data/app-screenshots/.
// Runs in the build chain to keep the repo from bloating with multi-megabyte previews.
// Anyone hitting this should re-export their screenshot at a smaller resolution or convert
// PNG → JPEG/WebP. macOS one-liner:
//   sips -Z 1280 -s formatOptions 65 -s format jpeg in.png --out out.jpg
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
    '\nResize/convert before committing. Example:\n  sips -Z 1280 -s formatOptions 80 -s format jpeg in.png --out out.jpg'
  );
  process.exit(1);
}

console.log('✅ All app screenshots within size limit (500 KB).');
