// Network-free helpers for scripts/fetch-pool-logos.js, covered by
// scripts/test-pool-logos.js.
//
// Two extended metadata formats exist side by side. CIP-6 defines
// `extDataUrl` in the on-chain metadata file and `pool.media_assets` in the
// extended file. The older adapools format, which is what nearly every pool
// actually publishes, uses `extended` and an `info` block with
// `url_png_icon_64x64` / `url_png_logo`. Both are read, the CIP-6 fields win.
const net = require('net');

// Only an absolute http(s) URL with a host survives. Everything else (data:
// URIs, relative paths, other schemes) is dropped, the script never follows it.
function safeHttpUrl(value) {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value.trim());
    return (url.protocol === 'https:' || url.protocol === 'http:') && url.hostname ? url.href : null;
  } catch (e) {
    return null;
  }
}

function extendedUrlFromMeta(meta) {
  if (!meta || typeof meta !== 'object') return null;
  return safeHttpUrl(meta.extDataUrl) || safeHttpUrl(meta.extended);
}

function iconUrlFromExtended(ext) {
  if (!ext || typeof ext !== 'object') return null;
  const assets = ext.pool && typeof ext.pool === 'object' && ext.pool.media_assets && typeof ext.pool.media_assets === 'object'
    ? ext.pool.media_assets : {};
  const info = ext.info && typeof ext.info === 'object' ? ext.info : {};
  return (
    safeHttpUrl(assets.icon_png_64x64) || safeHttpUrl(assets.logo_png) ||
    safeHttpUrl(info.url_png_icon_64x64) || safeHttpUrl(info.url_png_logo)
  );
}

// Operators control every URL the script follows, so a resolved address is
// only acceptable when it is a public unicast address. Anything local,
// private or special is refused before a connection is opened.
function isPublicIPv4(ip) {
  const parts = ip.split('.').map(Number);
  const [a, b] = parts;
  if (a === 0 || a === 10 || a === 127) return false;
  if (a === 100 && b >= 64 && b <= 127) return false; // CGNAT
  if (a === 169 && b === 254) return false;
  if (a === 172 && b >= 16 && b <= 31) return false;
  if (a === 192 && b === 168) return false;
  if (a === 192 && b === 0 && parts[2] === 2) return false; // TEST-NET-1
  if (a === 198 && (b === 18 || b === 19)) return false; // benchmarking
  if (a === 198 && b === 51 && parts[2] === 100) return false; // TEST-NET-2
  if (a === 203 && b === 0 && parts[2] === 113) return false; // TEST-NET-3
  if (a >= 224) return false; // multicast, reserved, broadcast
  return true;
}

function isPublicAddress(ip) {
  if (typeof ip !== 'string') return false;
  if (net.isIPv4(ip)) return isPublicIPv4(ip);
  if (!net.isIPv6(ip)) return false;
  const lower = ip.toLowerCase();
  const mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isPublicIPv4(mapped[1]);
  if (lower === '::' || lower === '::1') return false;
  const first = parseInt(lower.split(':')[0] || '0', 16);
  if ((first & 0xfe00) === 0xfc00) return false; // fc00::/7 unique local
  if ((first & 0xffc0) === 0xfe80) return false; // fe80::/10 link local
  if ((first & 0xff00) === 0xff00) return false; // multicast
  if (first === 0x2001 && lower.startsWith('2001:db8')) return false; // documentation
  if (lower.startsWith('::')) return false; // any other IPv4-compatible form
  return true;
}

// A Koios page must be an array of rows with a pool id. Anything else means
// the index is incomplete and the run must stop before it touches files.
function parseIndexPage(data) {
  if (!Array.isArray(data)) throw new Error('pool_list page is not an array');
  for (const row of data) {
    if (!row || typeof row !== 'object' || typeof row.pool_id_bech32 !== 'string') {
      throw new Error('pool_list row without pool_id_bech32');
    }
  }
  return data;
}

// Every registered id is the base for pruning. Candidates for a download are
// the pools whose metadata Koios resolved (ticker present), with an http(s)
// metadata URL and no retirement announced.
function splitPools(rows) {
  const registeredIds = new Set();
  const candidates = [];
  for (const row of rows) {
    registeredIds.add(row.pool_id_bech32);
    const metaUrl = safeHttpUrl(row.meta_url);
    if (row.ticker && metaUrl && row.retiring_epoch == null) {
      candidates.push({ poolId: row.pool_id_bech32, ticker: row.ticker, metaUrl });
    }
  }
  return { registeredIds, candidates };
}

module.exports = { safeHttpUrl, extendedUrlFromMeta, iconUrlFromExtended, isPublicAddress, parseIndexPage, splitPools };
