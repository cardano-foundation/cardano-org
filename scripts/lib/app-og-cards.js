//
// Open Graph cards for the /apps/<slug> detail pages.
// Each card is static/img/og/apps/<slug>-<hash>.jpg, where the hash covers everything the
// card shows (title, tagline, icon, primary screenshot, template). Cards are committed to
// the repo. A card is only rendered when no file with the current hash exists, so a changed
// input gets a new file name, and share previews never show a stale cached card.
//
// Rendering needs a local Chrome. On CI and Netlify, or when no Chrome is found, missing
// cards are reported and skipped, and those pages keep the generic apps image.
//

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');
const sharp = require('sharp');

// Bump to re-render every card after a change to the template, the render settings or the
// icon classifier.
const TEMPLATE_VERSION = 3;

const siteDir = path.join(__dirname, '../..');
const cardsDir = path.join(siteDir, 'static/img/og/apps');
const cardsUrl = '/img/og/apps/';
const template = fs.readFileSync(path.join(siteDir, 'scripts/app-og-card/template.html'), 'utf8');
const fontPath = path.join(siteDir, 'static/fonts/Chivo-VariableFont_wght.ttf');
const logoPath = path.join(siteDir, 'static/img/cardano-logo-white.svg');

const CHROME_CANDIDATES = [
  process.env.OG_CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  'google-chrome',
  'chromium',
  'chromium-browser',
].filter(Boolean);

function findChrome() {
  for (const candidate of CHROME_CANDIDATES) {
    const result = spawnSync(candidate, ['--version'], { encoding: 'utf8' });
    if (result.status === 0) return candidate;
  }
  return null;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function cardHash(app, iconFile, screenshotFile) {
  const hash = crypto.createHash('sha256');
  hash.update(`v${TEMPLATE_VERSION}\0${app.title}\0${app.tagline || ''}\0${app.ogIconStyle || ''}\0`);
  hash.update(template);
  hash.update(fs.readFileSync(iconFile));
  hash.update(fs.readFileSync(screenshotFile));
  return hash.digest('hex').slice(0, 8);
}

// How the icon sits on the card. Decided from its corners and edges, apps.js can override it
// with `ogIconStyle` when the guess is wrong:
//   bare       a transparent shape that fills the icon, standing on its own with a drop shadow
//   tile-dark  a transparent, almost white mark, which would vanish on the white tile
//   circle     a round logo baked into a white square, cropped to the circle
//   tile       anything else, on a white rounded tile like an app icon
const ICON_STYLES = ['bare', 'tile-dark', 'circle', 'tile'];
const ANALYSIS_SIZE = 256;
// Background of the card behind the icon, see template.html.
const CARD_BLUE = [0, 51, 173];

// SVGs are rasterized at a density that keeps a cropped circle sharp.
const readIcon = (iconFile) => sharp(iconFile, { density: 300 });

async function iconStyle(iconFile) {
  const S = ANALYSIS_SIZE;
  const { data } = await readIcon(iconFile)
    .resize(S, S, { fit: 'fill' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  // Average of a 6x6 patch, so JPEG noise and anti-aliasing do not decide on their own.
  const patch = (x0, y0) => {
    const sum = [0, 0, 0, 0];
    for (let y = y0; y < y0 + 6; y++) {
      for (let x = x0; x < x0 + 6; x++) {
        const i = (Math.min(y, S - 1) * S + Math.min(x, S - 1)) * 4;
        for (let c = 0; c < 4; c++) sum[c] += data[i + c];
      }
    }
    return sum.map((v) => v / 36);
  };
  const transparent = ([, , , a]) => a < 40;
  const white = ([r, g, b, a]) => a > 200 && r > 235 && g > 235 && b > 235;
  const pixel = (x, y) => [...data.subarray((y * S + x) * 4, (y * S + x) * 4 + 4)];
  const corners = [patch(0, 0), patch(S - 6, 0), patch(0, S - 6), patch(S - 6, S - 6)];

  if (corners.filter(transparent).length >= 3) {
    // Only a shape that fills the icon, like a round or rounded-square logo, can stand on its
    // own, and only when its colors stand out from the card blue. A small mark keeps a tile.
    let x0 = S;
    let y0 = S;
    let x1 = -1;
    let y1 = -1;
    let opaque = 0;
    let distance = 0;
    let luminance = 0;
    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const i = (y * S + x) * 4;
        if (data[i + 3] < 128) continue;
        opaque++;
        x0 = Math.min(x0, x);
        y0 = Math.min(y0, y);
        x1 = Math.max(x1, x);
        y1 = Math.max(y1, y);
        const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
        distance += Math.hypot(r - CARD_BLUE[0], g - CARD_BLUE[1], b - CARD_BLUE[2]);
        luminance += 0.2126 * r + 0.7152 * g + 0.0722 * b;
      }
    }
    if (opaque === 0) return { style: 'tile' };
    const width = x1 - x0 + 1;
    const height = y1 - y0 + 1;
    const fillsIcon = Math.min(width, height) >= S * 0.9 && opaque / (width * height) >= 0.7;
    if (fillsIcon && distance / opaque >= 120) return { style: 'bare' };
    return { style: luminance / opaque > 200 ? 'tile-dark' : 'tile' };
  }

  if (corners.every(white)) {
    // Distance from each side to the first non-white pixel on the center lines.
    const mid = S >> 1;
    const scan = (step) => {
      for (let d = 0; d < mid; d++) if (!white(step(d))) return d;
      return mid;
    };
    const top = scan((d) => pixel(mid, d));
    const bottom = scan((d) => pixel(mid, S - 1 - d));
    const left = scan((d) => pixel(d, mid));
    const right = scan((d) => pixel(S - 1 - d, mid));
    const insets = [top, bottom, left, right];
    const tolerance = S * 0.03;
    const even = Math.max(...insets) - Math.min(...insets) <= tolerance;
    const size = S - left - right;
    if (even && size > S * 0.5) {
      // A circle fills its box just inside the diagonals and leaves the box corners white.
      const inside = Math.round(size * 0.2);
      const outside = Math.round(size * 0.04);
      const at = (fx, fy, d) => patch(left + fx(d) - 3, top + fy(d) - 3);
      const near = (d) => d;
      const far = (d) => size - 1 - d;
      const boxCorners = [[near, near], [far, near], [near, far], [far, far]];
      const filled = boxCorners.every(([fx, fy]) => !white(at(fx, fy, inside)));
      const cornersWhite = boxCorners.every(([fx, fy]) => white(at(fx, fy, outside)));
      if (filled && cornersWhite) return { style: 'circle', box: { left, top, size } };
    }
  }

  return { style: 'tile' };
}

// Writes the icon the card shows into workDir when it differs from the source file.
async function prepareIcon(iconFile, override, workDir, slug) {
  if (override && !ICON_STYLES.includes(override)) {
    throw new Error(`ogIconStyle "${override}" is not one of ${ICON_STYLES.join(', ')}`);
  }
  let detected;
  try {
    detected = await iconStyle(iconFile);
  } catch {
    // Formats sharp cannot read keep the white tile.
    return { style: override || 'tile', file: iconFile };
  }
  const style = override || detected.style;
  if (style !== 'circle' || !detected.box) return { style, file: iconFile };

  const image = readIcon(iconFile);
  const { width, height } = await image.metadata();
  const sx = width / ANALYSIS_SIZE;
  const sy = height / ANALYSIS_SIZE;
  const { left, top, size } = detected.box;
  const x = Math.round(left * sx);
  const y = Math.round(top * sy);
  const file = path.join(workDir, `${slug}-icon.png`);
  await image
    .extract({
      left: x,
      top: y,
      width: Math.min(Math.round(size * sx), width - x),
      height: Math.min(Math.round(size * sy), height - y),
    })
    .png()
    .toFile(file);
  return { style, file };
}

async function renderCard(chrome, job, workDir) {
  const { app, iconFile, screenshotFile, fileName } = job;
  const icon = await prepareIcon(iconFile, app.ogIconStyle, workDir, app.slug);
  const vars = {
    FONT: `file://${fontPath}`,
    LOGO: `file://${logoPath}`,
    ICON_CLASS: icon.style,
    ICON: `file://${icon.file}`,
    SHOT: `file://${screenshotFile}`,
    // Keeps hyphenated names like cardano-tools.io from breaking at the hyphen.
    TITLE: escapeHtml(app.title).replace(/\S*-\S*/g, '<span style="white-space: nowrap">$&</span>'),
    TAGLINE: escapeHtml(app.tagline || ''),
  };
  const htmlFile = path.join(workDir, `${app.slug}.html`);
  const pngFile = path.join(workDir, `${app.slug}.png`);
  fs.writeFileSync(htmlFile, template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key]));
  const result = spawnSync(
    chrome,
    [
      '--headless',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--window-size=1200,630',
      // Lets fonts, images and the text fitting script settle before the capture.
      '--virtual-time-budget=5000',
      `--user-data-dir=${path.join(workDir, 'profile')}`,
      `--screenshot=${pngFile}`,
      `file://${htmlFile}`,
    ],
    { encoding: 'utf8' }
  );
  if (result.status !== 0 || !fs.existsSync(pngFile)) {
    throw new Error(result.stderr || `Chrome exited with ${result.status}`);
  }
  return sharp(pngFile).jpeg({ quality: 85, mozjpeg: true }).toFile(path.join(cardsDir, fileName));
}

async function renderMissing(missing, cards) {
  if (missing.length === 0) return;
  const chrome = process.env.CI || process.env.NETLIFY ? null : findChrome();
  if (!chrome) {
    console.warn(
      `⚠️  ${missing.length} app OG card(s) missing, run yarn build-apps-meta locally with Chrome installed: ` +
        missing.map((job) => job.app.slug).join(', ')
    );
    return;
  }
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'app-og-'));
  try {
    for (const job of missing) {
      try {
        await renderCard(chrome, job, workDir);
        cards.set(job.app.slug, cardsUrl + job.fileName);
        console.log(`   Rendered OG card ${job.fileName}`);
      } catch (err) {
        console.warn(`⚠️  Could not render the OG card for ${job.app.slug}: ${err.message.trim()}`);
      }
    }
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true });
  }
}

/**
 * Makes sure every app with an icon and a screenshot has an up-to-date card.
 *
 * @param {Array<{slug: string, title: string, tagline: ?string, icon: ?string, previewUrl: ?string}>} apps
 *   Icon and screenshot as site paths of files under static/.
 * @returns {Promise<Map<string, string>>} Site path of the card per slug, only for cards that exist.
 */
async function ensureAppOgCards(apps) {
  fs.mkdirSync(cardsDir, { recursive: true });
  const cards = new Map();
  const missing = [];
  const expectedNames = new Set();

  for (const app of apps) {
    if (!app.icon || !app.previewUrl) continue;
    const iconFile = path.join(siteDir, 'static', app.icon);
    const screenshotFile = path.join(siteDir, 'static', app.previewUrl);
    if (!fs.existsSync(iconFile)) continue;
    const fileName = `${app.slug}-${cardHash(app, iconFile, screenshotFile)}.jpg`;
    expectedNames.add(fileName);
    if (fs.existsSync(path.join(cardsDir, fileName))) {
      cards.set(app.slug, cardsUrl + fileName);
    } else {
      missing.push({ app, iconFile, screenshotFile, fileName });
    }
  }

  await renderMissing(missing, cards);

  // Drop cards of removed apps and cards whose inputs changed.
  for (const name of fs.readdirSync(cardsDir)) {
    if (!expectedNames.has(name)) {
      fs.unlinkSync(path.join(cardsDir, name));
    }
  }

  return cards;
}

module.exports = { ensureAppOgCards };
