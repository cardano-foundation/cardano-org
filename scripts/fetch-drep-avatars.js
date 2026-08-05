//
// Snapshots DRep avatar images for /governance/delegate/.
//
// Mirrors the runtime fetch flow in src/components/DRepDelegate/index.js but writes the
// resulting images to static/img/dreps/{drepId}.jpg + a manifest the component reads at
// load time. Production CSP blocks the heterogeneous CIP-119 image hosts, so the
// component renders self-hosted images (or the Initials fallback) only.
//
// Run manually before a release: `yarn fetch-drep-avatars`.
//

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');

const API_URL = process.env.CARDANO_ORG_API_URL || 'https://data.cardano.org/k/api/v1';
const OUT_DIR = path.join(__dirname, '../static/img/dreps');
// Manifest lives under src/data so the component imports it at build time
// (no runtime fetch, no first-render flicker). JPEGs stay under static/.
const MANIFEST_PATH = path.join(__dirname, '../src/data/drep-avatars.json');

// Mirrors the runtime VP gates in src/components/DRepDelegate/index.js.
const VP_MIN_LOVELACE = 100_000_000_000; // 100k ada
const VP_MAX_LOVELACE = 50_000_000_000_000; // 50M ada
// Smaller pages than the runtime (component uses 600); the API proxy occasionally
// resets connections on larger paginated GETs.
const PAGE_SIZE = 300;
const BATCH_SIZE = 50;
const AVATAR_SIZE = 256;
const JPEG_QUALITY = 70;
const FETCH_TIMEOUT_MS = 15_000;
const FETCH_CONCURRENCY = 8;
const FETCH_MAX_BYTES = 8 * 1024 * 1024; // hard cap per source image

const api = axios.create({
  baseURL: API_URL,
  timeout: 20_000,
  validateStatus: (s) => s >= 200 && s < 300,
});

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function asString(v) {
  if (v == null) return null;
  if (typeof v === 'string') return v;
  if (typeof v === 'object' && typeof v['@value'] === 'string') return v['@value'];
  return null;
}

function safeImageUrl(url) {
  if (typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (/^https:\/\//i.test(trimmed)) return trimmed;
  if (/^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);/i.test(trimmed)) return trimmed;
  return null;
}

function extractImage(meta) {
  const img = meta?.body?.image || meta?.image;
  if (!img) return null;
  return safeImageUrl(asString(img)) || safeImageUrl(asString(img?.contentUrl));
}

function extractName(meta) {
  return (
    asString(meta?.body?.givenName) ||
    asString(meta?.body?.name) ||
    asString(meta?.name) ||
    null
  );
}

async function fetchAllDRepIds() {
  const ids = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const { data } = await api.get(
      `/drep_list?registered=eq.true&limit=${PAGE_SIZE}&offset=${offset}`
    );
    const rows = data || [];
    for (const r of rows) if (r.drep_id) ids.push(r.drep_id);
    if (rows.length < PAGE_SIZE) break;
  }
  return ids;
}

async function fetchInfo(ids) {
  const results = await Promise.all(
    chunk(ids, BATCH_SIZE).map((b) => api.post('/drep_info', { _drep_ids: b }))
  );
  return results.flatMap((r) => r.data || []);
}

async function fetchMetadata(ids) {
  const results = await Promise.all(
    chunk(ids, BATCH_SIZE).map((b) => api.post('/drep_metadata', { _drep_ids: b }))
  );
  const byId = new Map();
  for (const r of results) {
    for (const m of r.data || []) {
      if (m.meta_json) byId.set(m.drep_id, m.meta_json);
    }
  }
  return byId;
}

async function downloadImage(url) {
  if (url.startsWith('data:')) {
    const comma = url.indexOf(',');
    if (comma === -1) throw new Error('malformed data: URI');
    const meta = url.slice(5, comma);
    const payload = url.slice(comma + 1);
    return /;base64$/i.test(meta)
      ? Buffer.from(payload, 'base64')
      : Buffer.from(decodeURIComponent(payload), 'binary');
  }
  const res = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: FETCH_TIMEOUT_MS,
    maxContentLength: FETCH_MAX_BYTES,
    maxRedirects: 3,
    validateStatus: (s) => s >= 200 && s < 300,
  });
  return Buffer.from(res.data);
}

async function processOne({ drepId, url }) {
  try {
    const raw = await downloadImage(url);
    const out = await sharp(raw, { failOn: 'error' })
      .rotate()
      .resize(AVATAR_SIZE, AVATAR_SIZE, { fit: 'cover', position: 'attention' })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toBuffer();
    fs.writeFileSync(path.join(OUT_DIR, `${drepId}.jpg`), out);
    return { drepId, ok: true, bytes: out.length };
  } catch (err) {
    return { drepId, ok: false, reason: err?.message || String(err) };
  }
}

async function runWithConcurrency(tasks, limit) {
  const results = [];
  let cursor = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (cursor < tasks.length) {
      const idx = cursor++;
      results[idx] = await processOne(tasks[idx]);
    }
  });
  await Promise.all(workers);
  return results;
}

function pruneStaleFiles(keepIds) {
  const keep = new Set(keepIds.map((id) => `${id}.jpg`));
  let removed = 0;
  for (const name of fs.readdirSync(OUT_DIR)) {
    if (name === 'manifest.json' || !name.endsWith('.jpg')) continue;
    if (!keep.has(name)) {
      fs.unlinkSync(path.join(OUT_DIR, name));
      removed++;
    }
  }
  return removed;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`Fetching DRep IDs from ${API_URL}…`);
  const ids = await fetchAllDRepIds();
  if (!ids.length) throw new Error('No DReps returned by /drep_list');
  console.log(`  ${ids.length} registered DReps`);

  const infos = await fetchInfo(ids);
  const inRange = infos.filter((i) => {
    if (!i.active || !i.meta_url) return false;
    const vp = Number(i.amount || 0);
    return vp >= VP_MIN_LOVELACE && vp <= VP_MAX_LOVELACE;
  });
  console.log(`  ${inRange.length} active DReps in VP range`);

  const metaById = await fetchMetadata(inRange.map((i) => i.drep_id));

  const tasks = [];
  let skippedNoImage = 0;
  for (const info of inRange) {
    const meta = metaById.get(info.drep_id);
    if (!meta) continue;
    if (!extractName(meta)) continue;
    const url = extractImage(meta);
    if (!url) { skippedNoImage++; continue; }
    tasks.push({ drepId: info.drep_id, url });
  }
  console.log(`  ${tasks.length} DReps have an image URL (${skippedNoImage} without)`);

  console.log(`Downloading + normalizing to ${AVATAR_SIZE}×${AVATAR_SIZE} JPEG q${JPEG_QUALITY}…`);
  const results = await runWithConcurrency(tasks, FETCH_CONCURRENCY);

  const succeeded = results.filter((r) => r.ok);
  const failed = results.filter((r) => !r.ok);
  const totalBytes = succeeded.reduce((sum, r) => sum + r.bytes, 0);

  const removed = pruneStaleFiles(succeeded.map((r) => r.drepId));

  const manifest = {
    generated: new Date().toISOString(),
    apiUrl: API_URL,
    ids: succeeded.map((r) => r.drepId).sort(),
  };
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');

  console.log(
    `\nDone: ${succeeded.length} saved (${(totalBytes / 1024).toFixed(0)} KB total), ` +
    `${failed.length} failed, ${removed} stale files removed.`
  );
  if (failed.length) {
    console.log('\nFailures (first 10):');
    for (const f of failed.slice(0, 10)) {
      console.log(`  ${f.drepId}: ${f.reason}`);
    }
  }
}

main().catch((err) => {
  console.error('fetch-drep-avatars failed:', err?.message || err);
  process.exit(1);
});
