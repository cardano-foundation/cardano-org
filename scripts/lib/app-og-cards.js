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

// Bump to re-render every card after a change to the template or the render settings.
const TEMPLATE_VERSION = 2;

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
  hash.update(`v${TEMPLATE_VERSION}\0${app.title}\0${app.tagline || ''}\0`);
  hash.update(template);
  hash.update(fs.readFileSync(iconFile));
  hash.update(fs.readFileSync(screenshotFile));
  return hash.digest('hex').slice(0, 8);
}

// Icons drawn in white on a transparent background would vanish on the default white tile,
// so they get a dark tile instead.
async function iconBackground(iconFile) {
  try {
    const { data, info } = await sharp(iconFile).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    let weight = 0;
    let luminance = 0;
    for (let i = 0; i < data.length; i += info.channels) {
      const alpha = data[i + 3] / 255;
      weight += alpha;
      luminance += alpha * (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]);
    }
    const transparentShare = 1 - weight / (data.length / info.channels);
    return transparentShare > 0.2 && luminance / weight > 200 ? '#0b1d4d' : '#fff';
  } catch {
    // Formats sharp cannot read (.ico) keep the default.
    return '#fff';
  }
}

async function renderCard(chrome, job, workDir) {
  const { app, iconFile, screenshotFile, fileName } = job;
  const vars = {
    FONT: `file://${fontPath}`,
    LOGO: `file://${logoPath}`,
    ICON_BG: await iconBackground(iconFile),
    ICON: `file://${iconFile}`,
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
