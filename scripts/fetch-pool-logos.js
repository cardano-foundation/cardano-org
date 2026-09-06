//
// Snapshots stake pool logos for /stake-pool-delegation.
//
// Walks every registered pool whose metadata Koios could resolve, reads the
// pool's own metadata file (Koios drops the pointer to the extended file, so
// the raw file is needed), follows it to the CIP-6 extended file, takes the
// icon or logo from there, and writes a normalized 128x128 WebP to
// static/img/pools/{poolId}.webp plus a manifest the component reads at build
// time. Production CSP blocks the operators' image hosts, so the component
// renders self-hosted images (or the Initials fallback) only.
//
// Every URL after the Koios index is operator-controlled. Fetches only go to
// public addresses (custom DNS lookup), redirects are followed by hand with
// the same check, sizes and timeouts are capped per stage, and images are
// always re-encoded.
//
// Run manually before a release: `yarn fetch-pool-logos`.
//

const fs = require('fs');
const path = require('path');
const dns = require('dns');
const axios = require('axios');
const sharp = require('sharp');
const {
  safeHttpUrl, extendedUrlFromMeta, iconUrlFromExtended, isPublicAddress, parseIndexPage, splitPools, logoIdsToKeep,
} = require('./lib/pool-logos.js');

const API_URL = process.env.CARDANO_ORG_API_URL || 'https://data.cardano.org/k/api/v1';
const OUT_DIR = path.join(__dirname, '../static/img/pools');
// Manifest lives under src/data so the component imports it at build time.
const MANIFEST_PATH = path.join(__dirname, '../src/data/pool-logos.json');

// Small pages, the proxy resets Node on larger responses (see fetch-drep-avatars).
const PAGE_SIZE = 300;
const LOGO_SIZE = 128;
const WEBP_QUALITY = 80;
const JSON_TIMEOUT_MS = 8_000;
const IMAGE_TIMEOUT_MS = 15_000;
const META_MAX_BYTES = 64 * 1024;
const EXTENDED_MAX_BYTES = 256 * 1024;
const IMAGE_MAX_BYTES = 2 * 1024 * 1024;
const MAX_REDIRECTS = 3;
const CONCURRENCY = 8;
const USER_AGENT = 'cardano.org pool logo snapshot';

// Koios client, deliberately configured and not subject to the public-address
// guard (the proxy host is ours).
const api = axios.create({
  baseURL: API_URL,
  timeout: 20_000,
  validateStatus: (s) => s >= 200 && s < 300,
  // Same proxy quirk as fetch-drep-avatars: ask for identity encoding so Node
  // never inflates a truncated gzip cache entry.
  headers: { 'Accept-Encoding': 'identity' },
});

async function fetchRegisteredPools() {
  const rows = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const { data } = await api.get(
      `/pool_list?pool_status=eq.registered&select=pool_id_bech32,ticker,meta_url,retiring_epoch&limit=${PAGE_SIZE}&offset=${offset}`
    );
    const page = parseIndexPage(data);
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
  }
  return rows;
}

class BlockedAddressError extends Error {
  constructor(hostname) {
    super(`refused ${hostname}: resolves to a non-public address`);
    this.name = 'BlockedAddressError';
  }
}

// axios hands this to Node's http client. Every address the name resolves to
// must be public, otherwise no connection is attempted at all.
function publicLookup(hostname, options, callback) {
  dns.lookup(hostname, { all: true }, (err, addresses) => {
    if (err) return callback(err);
    if (!addresses.length || !addresses.every((a) => isPublicAddress(a.address))) {
      return callback(new BlockedAddressError(hostname));
    }
    const first = addresses[0];
    return callback(null, first.address, first.family);
  });
}

// GET with the public-address guard, manual redirects (each hop re-checked)
// and a hard size cap. `accept` is the Accept header, `responseType` 'text'
// or 'arraybuffer'.
async function fetchExternal(startUrl, { accept, responseType, timeout, maxBytes }) {
  let url = startUrl;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    const res = await axios.get(url, {
      responseType,
      timeout,
      maxContentLength: maxBytes,
      maxBodyLength: maxBytes,
      maxRedirects: 0,
      lookup: publicLookup,
      validateStatus: (s) => (s >= 200 && s < 300) || (s >= 300 && s < 400),
      headers: { Accept: accept, 'User-Agent': USER_AGENT },
      transformResponse: [(d) => d],
    });
    if (res.status < 300) return res.data;
    const next = safeHttpUrl(new URL(res.headers.location || '', url).href);
    if (!next) throw new Error(`redirect to an unsupported location from ${url}`);
    url = next;
  }
  throw new Error(`more than ${MAX_REDIRECTS} redirects from ${startUrl}`);
}

async function fetchJson(url, maxBytes) {
  const text = await fetchExternal(url, {
    accept: 'application/json, text/plain, */*', responseType: 'text', timeout: JSON_TIMEOUT_MS, maxBytes,
  });
  return JSON.parse(text);
}

async function fetchImage(url) {
  const data = await fetchExternal(url, {
    accept: 'image/*', responseType: 'arraybuffer', timeout: IMAGE_TIMEOUT_MS, maxBytes: IMAGE_MAX_BYTES,
  });
  return Buffer.from(data);
}

// Multi-pool operators point all their pools at one extended file and one
// icon, so both are fetched (and the icon encoded) once per distinct URL.
const extendedByUrl = new Map();
function extendedJson(url) {
  if (!extendedByUrl.has(url)) extendedByUrl.set(url, fetchJson(url, EXTENDED_MAX_BYTES));
  return extendedByUrl.get(url);
}

const encodedByUrl = new Map();
function encodedLogo(url) {
  if (!encodedByUrl.has(url)) {
    encodedByUrl.set(url, (async () => {
      const raw = await fetchImage(url);
      return sharp(raw, { failOn: 'error' })
        .rotate()
        .resize(LOGO_SIZE, LOGO_SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer();
    })());
  }
  return encodedByUrl.get(url);
}

// Outcome per pool: 'saved' (file written), 'none' (metadata read fine and it
// points to no icon, so an old snapshot may be pruned), 'failed' (some fetch,
// parse or decode failed, an old snapshot survives).
async function processOne({ poolId, metaUrl }) {
  let stage = 'metadata';
  try {
    const meta = await fetchJson(metaUrl, META_MAX_BYTES);
    const extendedUrl = extendedUrlFromMeta(meta);
    if (!extendedUrl) return { poolId, outcome: 'none' };
    stage = 'extended';
    const extended = await extendedJson(extendedUrl);
    const iconUrl = iconUrlFromExtended(extended);
    if (!iconUrl) return { poolId, outcome: 'none' };
    stage = 'image';
    const out = await encodedLogo(iconUrl);
    fs.writeFileSync(path.join(OUT_DIR, `${poolId}.webp`), out);
    return { poolId, outcome: 'saved', bytes: out.length };
  } catch (err) {
    return {
      poolId, outcome: 'failed', blocked: err?.name === 'BlockedAddressError',
      reason: `${stage}: ${err?.message || err}`,
    };
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

function listLogoIds() {
  return fs.readdirSync(OUT_DIR).filter((n) => n.endsWith('.webp')).map((n) => n.slice(0, -5));
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`Fetching registered pools from ${API_URL}…`);
  // Any malformed page throws here, before files or the manifest are touched.
  const rows = await fetchRegisteredPools();
  if (!rows.length) throw new Error('No pools returned by /pool_list');
  const { registeredIds, candidates } = splitPools(rows);
  console.log(`  ${registeredIds.size} registered pools, ${candidates.length} with resolvable metadata`);

  console.log(`Reading metadata, extended metadata and icons (${CONCURRENCY} at a time)…`);
  const results = await runWithConcurrency(candidates, CONCURRENCY);

  const saved = results.filter((r) => r.outcome === 'saved');
  const none = results.filter((r) => r.outcome === 'none');
  const failed = results.filter((r) => r.outcome === 'failed');
  const blocked = failed.filter((r) => r.blocked);
  const totalBytes = saved.reduce((sum, r) => sum + r.bytes, 0);

  const keep = logoIdsToKeep({
    existingIds: listLogoIds(),
    savedIds: saved.map((r) => r.poolId),
    noneIds: new Set(none.map((r) => r.poolId)),
    registeredIds,
  });
  let removed = 0;
  for (const id of listLogoIds()) {
    if (keep.has(id)) continue;
    fs.unlinkSync(path.join(OUT_DIR, `${id}.webp`));
    removed++;
  }

  const manifest = { generated: new Date().toISOString(), apiUrl: API_URL, ids: [...keep].sort() };
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');

  console.log(
    `\nDone: ${saved.length} saved (${(totalBytes / 1024).toFixed(0)} KB total), ` +
    `${none.length} without icon, ${failed.length} failed (${blocked.length} refused as non-public), ` +
    `${removed} stale files removed, ${manifest.ids.length} logos in the manifest.`
  );
  if (failed.length) {
    console.log('\nFailures (first 10):');
    for (const f of failed.slice(0, 10)) console.log(`  ${f.poolId}: ${f.reason}`);
  }
}

main().catch((err) => {
  console.error('fetch-pool-logos failed:', err?.message || err);
  process.exit(1);
});
