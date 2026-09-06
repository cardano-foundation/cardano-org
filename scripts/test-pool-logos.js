// Tests for scripts/lib/pool-logos.js, the network-free part of
// scripts/fetch-pool-logos.js: CIP-6 lookups, the public-address guard and
// the index handling. Run with `node --test`.
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  safeHttpUrl, extendedUrlFromMeta, iconUrlFromExtended, isPublicAddress, parseIndexPage, splitPools,
} = require('./lib/pool-logos.js');

test('safeHttpUrl accepts absolute http and https urls only', () => {
  assert.equal(safeHttpUrl('https://pool.example/logo.png'), 'https://pool.example/logo.png');
  assert.equal(safeHttpUrl('  http://pool.example/logo.png  '), 'http://pool.example/logo.png');
  assert.equal(safeHttpUrl('data:image/png;base64,AAAA'), null);
  assert.equal(safeHttpUrl('ftp://pool.example/logo.png'), null);
  assert.equal(safeHttpUrl('/logo.png'), null);
  assert.equal(safeHttpUrl('logo.png'), null);
  assert.equal(safeHttpUrl(''), null);
  assert.equal(safeHttpUrl(null), null);
  assert.equal(safeHttpUrl(42), null);
});

test('extendedUrlFromMeta prefers the CIP-6 extDataUrl over the adapools extended field', () => {
  assert.equal(extendedUrlFromMeta({ extDataUrl: 'https://p.example/ext.json' }), 'https://p.example/ext.json');
  assert.equal(extendedUrlFromMeta({ extended: 'https://p.example/extended.json' }), 'https://p.example/extended.json');
  assert.equal(
    extendedUrlFromMeta({ extDataUrl: 'https://p.example/spec.json', extended: 'https://p.example/legacy.json' }),
    'https://p.example/spec.json'
  );
  assert.equal(extendedUrlFromMeta({ extDataUrl: 'not a url', extended: 'https://p.example/legacy.json' }), 'https://p.example/legacy.json');
  assert.equal(extendedUrlFromMeta({ name: 'X', ticker: 'X' }), null);
  assert.equal(extendedUrlFromMeta({ extended: 'data:text/plain,hi' }), null);
  assert.equal(extendedUrlFromMeta(null), null);
  assert.equal(extendedUrlFromMeta('string'), null);
});

test('iconUrlFromExtended reads both the CIP-6 media_assets and the adapools info block', () => {
  const spec = { pool: { media_assets: { icon_png_64x64: 'https://p.example/i.png', logo_png: 'https://p.example/l.png' } } };
  assert.equal(iconUrlFromExtended(spec), 'https://p.example/i.png');
  assert.equal(iconUrlFromExtended({ pool: { media_assets: { logo_png: 'https://p.example/l.png', logo_svg: 'https://p.example/l.svg' } } }), 'https://p.example/l.png');
  assert.equal(iconUrlFromExtended({ pool: { media_assets: { logo_svg: 'https://p.example/l.svg' } } }), null);
  const legacy = { info: { url_png_icon_64x64: 'https://p.example/icon.png', url_png_logo: 'https://p.example/logo.png' } };
  assert.equal(iconUrlFromExtended(legacy), 'https://p.example/icon.png');
  assert.equal(iconUrlFromExtended({ info: { url_png_logo: 'https://p.example/logo.png' } }), 'https://p.example/logo.png');
  assert.equal(iconUrlFromExtended({ info: { url_png_icon_64x64: 'data:image/png;base64,AAAA', url_png_logo: 'https://p.example/logo.png' } }), 'https://p.example/logo.png');
  assert.equal(iconUrlFromExtended({ ...spec, ...legacy }), 'https://p.example/i.png');
  assert.equal(iconUrlFromExtended({ info: {} }), null);
  assert.equal(iconUrlFromExtended({}), null);
  assert.equal(iconUrlFromExtended(null), null);
});

test('isPublicAddress rejects loopback, private, link-local and special ranges', () => {
  for (const ip of ['93.184.216.34', '2606:2800:220:1:248:1893:25c8:1946', '8.8.8.8', '1.1.1.1']) {
    assert.equal(isPublicAddress(ip), true, ip);
  }
  for (const ip of [
    '127.0.0.1', '127.8.8.8', '10.0.0.1', '172.16.0.1', '172.31.255.255', '192.168.1.1', '169.254.1.1',
    '0.0.0.0', '100.64.0.1', '192.0.2.1', '198.51.100.1', '203.0.113.1', '224.0.0.1', '255.255.255.255',
    '::1', '::', 'fc00::1', 'fd12::1', 'fe80::1', 'ff02::1', '::ffff:127.0.0.1', '::ffff:10.0.0.1', '::ffff:192.168.0.1',
    '2001:db8::1', 'localhost', 'not an ip', '',
  ]) {
    assert.equal(isPublicAddress(ip), false, ip);
  }
  assert.equal(isPublicAddress('172.32.0.1'), true);
});

const ID_A = 'pool1pu5jlj4q9w9jlxeu370a3c9myx47md5j5m2str0naunn2q3lkdy';
const ID_B = 'pool1a7h89sr6ymj9g2a9tm6e6dddghl64tp39pj78f6cah5ewgd4px0';
const ID_C = 'pool1z5uqdk7dzdxaae5633fqfcu2eqzy3a3rgtuvy087fdld7yws0xt';

test('parseIndexPage accepts arrays of pool rows and rejects anything else', () => {
  const rows = parseIndexPage([{ pool_id_bech32: ID_A, ticker: 'A', meta_url: 'https://a.example/m.json', retiring_epoch: null }]);
  assert.equal(rows.length, 1);
  assert.deepEqual(parseIndexPage([]), []);
  assert.throws(() => parseIndexPage({ error: 'upstream failure' }), /not an array/);
  assert.throws(() => parseIndexPage('[]'), /not an array/);
  assert.throws(() => parseIndexPage([{ ticker: 'A' }]), /pool_id_bech32/);
  assert.throws(() => parseIndexPage([null]), /pool_id_bech32/);
});

test('splitPools keeps every registered id and picks only resolvable, non-retiring candidates', () => {
  const { registeredIds, candidates } = splitPools([
    { pool_id_bech32: ID_A, ticker: 'A', meta_url: 'https://a.example/m.json', retiring_epoch: null },
    { pool_id_bech32: ID_B, ticker: null, meta_url: 'https://b.example/m.json', retiring_epoch: null },
    { pool_id_bech32: ID_C, ticker: 'C', meta_url: 'https://c.example/m.json', retiring_epoch: 700 },
    { pool_id_bech32: 'pool1noturl', ticker: 'D', meta_url: 'ipfs://x', retiring_epoch: null },
    { pool_id_bech32: 'pool1nometa', ticker: 'E', meta_url: null, retiring_epoch: null },
  ]);
  assert.deepEqual([...registeredIds].sort(), [ID_A, ID_B, ID_C, 'pool1nometa', 'pool1noturl'].sort());
  assert.deepEqual(candidates, [{ poolId: ID_A, ticker: 'A', metaUrl: 'https://a.example/m.json' }]);
});
