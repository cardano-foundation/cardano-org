import { test } from 'node:test';
import assert from 'node:assert/strict';
import { COMMUNITIES, LANGUAGE_NAMES, getByGroup, getLocalGroups } from '../src/data/communities.mjs';
import { LEGACY_ANCHORS, resolveLegacyAnchor } from '../src/utils/community/legacyAnchors.mjs';
import { isSnapshotFresh, floorToThousand } from '../src/utils/community/forumSnapshot.mjs';

const PLATFORMS = ['forum', 'discord', 'telegram', 'reddit', 'stackexchange', 'facebook'];
const GROUPS = ['channel', 'local', 'support'];
const SECTION_IDS = ['channels', 'events', 'telegram', 'discord', 'local', 'add'];

// Every external link of the retired docs/communities.md that the hub keeps.
// Meetup and Luma are linked from /events. Dropped on purpose: the IOG
// Discord, the Line entry (a single forum post from 2019) and the regional
// groups North America, India & Sri Lanka and Australia (fewer than 100
// members each in November 2026).
const LEGACY_URLS = [
  'https://www.reddit.com/r/cardano/',
  'https://forum.cardano.org',
  'https://cardano.stackexchange.com',
  'https://www.facebook.com/groups/CardanoCommunity/',
  'https://t.me/Cardano',
  'https://t.me/CardanoDevelopersOfficial',
  'https://t.me/cardanoreporttoadmin',
  'https://discord.gg/MmeqpAzKbp',
  'https://discord.com/invite/2nPUa5d7DE',
  'https://t.me/CardanoVNCommunity',
  'https://t.me/CardanoJapanOfficial',
  'https://t.me/CardanoJapanTrading',
  'https://t.me/CardanoKoreaOfficial',
  'https://t.me/CardanoKoreaTrading',
  'https://t.me/CardanoChinaOfficial',
  'https://t.me/CardanoDutchOfficial',
  'https://t.me/CardanoGermanOfficial',
  'https://t.me/cardanotradinggerman',
  'https://t.me/CardanoSpanishOfficial',
  'https://t.me/CardanoPortugueseOfficial',
  'https://t.me/CardanoIndonesiaOfficial',
  'https://t.me/CardanoIT',
  'https://t.me/cardano_rus',
  'https://t.me/CardanoRussianMain',
  'https://t.me/CardanoEsp',
  'https://t.me/CardanoTurk',
  'https://t.me/CardanoUK',
];

test('every URL of the old page is present', () => {
  const urls = new Set(COMMUNITIES.map((c) => c.url));
  for (const url of LEGACY_URLS) assert.ok(urls.has(url), `missing ${url}`);
});

test('entries are well formed', () => {
  const ids = new Set();
  const urls = new Set();
  for (const c of COMMUNITIES) {
    assert.match(c.id, /^[a-z0-9-]+$/);
    assert.ok(!ids.has(c.id), `duplicate id ${c.id}`);
    ids.add(c.id);
    assert.ok(!urls.has(c.url), `duplicate url ${c.url}`);
    urls.add(c.url);
    assert.ok(c.name && c.url.startsWith('https://'), c.id);
    assert.ok(PLATFORMS.includes(c.platform) && GROUPS.includes(c.group), c.id);
    if (c.group === 'local') {
      assert.ok(Boolean(c.language) !== Boolean(c.region), `${c.id} needs language or region`);
      if (c.language) assert.ok(LANGUAGE_NAMES[c.language], `${c.id} unknown language`);
    } else {
      assert.ok(!c.language && !c.region, `${c.id} is not a local group`);
    }
  }
});

test('channel cards carry exactly the planned links', () => {
  assert.deepEqual(getByGroup('channel', 'telegram').map((c) => c.id), ['telegram-main', 'telegram-developers']);
  assert.deepEqual(getByGroup('channel', 'discord').map((c) => c.id), ['discord-foundation', 'discord-community']);
  assert.deepEqual(getByGroup('support').map((c) => c.url), ['https://t.me/cardanoreporttoadmin']);
});

test('getLocalGroups puts the page language first', () => {
  assert.deepEqual(getLocalGroups('de').own.map((c) => c.language), ['de', 'de']);
  assert.equal(getLocalGroups('ja').own.length, 2);
  assert.equal(getLocalGroups('en').own.length, 0);
  const all = COMMUNITIES.filter((c) => c.group === 'local').length;
  for (const loc of ['en', 'de', 'ja', 'es', 'vi']) {
    const g = getLocalGroups(loc);
    assert.equal(g.own.length + g.others.length, all);
  }
});

test('resolveLegacyAnchor maps old anchors of all locales', () => {
  assert.equal(resolveLegacyAnchor('cardano-on-discord'), 'discord');
  assert.equal(resolveLegacyAnchor('cardano-auf-discord'), 'discord');
  assert.equal(resolveLegacyAnchor('cardano-en-telegram'), 'telegram');
  assert.equal(resolveLegacyAnchor('forums'), 'channels');
  assert.equal(resolveLegacyAnchor('フォーラム'), 'channels');
  assert.equal(resolveLegacyAnchor('events-and-local-gatherings'), 'events');
  assert.equal(resolveLegacyAnchor('sprachspezifische-kanäle'), 'local');
  assert.equal(resolveLegacyAnchor('añade-tu-comunidad'), 'add');
});

test('resolveLegacyAnchor normalizes NFD and ignores unknown or new ids', () => {
  assert.equal(resolveLegacyAnchor('diễn-đàn'.normalize('NFD')), 'channels');
  assert.equal(resolveLegacyAnchor('discord'), null);
  assert.equal(resolveLegacyAnchor('nope'), null);
  assert.equal(resolveLegacyAnchor('constructor'), null);
  assert.equal(resolveLegacyAnchor(null), null);
});

test('the legacy map covers 28 slugs and only points at section ids', () => {
  const slugs = Object.keys(LEGACY_ANCHORS);
  assert.equal(slugs.length, 28);
  for (const slug of slugs) {
    assert.equal(slug, slug.normalize('NFC'));
    assert.ok(SECTION_IDS.includes(LEGACY_ANCHORS[slug]), slug);
    // A new section id must never double as an old anchor, or the page
    // would rewrite its own hash.
    assert.ok(!SECTION_IDS.includes(slug), slug);
  }
});

test('isSnapshotFresh uses a 45 day limit', () => {
  const now = Date.parse('2026-11-16T00:00:00Z');
  assert.equal(isSnapshotFresh('2026-11-01T06:00:00Z', now), true);
  assert.equal(isSnapshotFresh('2026-10-02T00:00:00Z', now), true); // exactly 45 days
  assert.equal(isSnapshotFresh('2026-10-01T23:59:59Z', now), false);
  assert.equal(isSnapshotFresh('not a date', now), false);
  assert.equal(isSnapshotFresh(undefined, now), false);
});

test('floorToThousand', () => {
  assert.equal(floorToThousand(30063), 30000);
  assert.equal(floorToThousand(370278), 370000);
  assert.equal(floorToThousand(999), null);
  assert.equal(floorToThousand(undefined), null);
});
