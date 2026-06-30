/**
 * Tests for src/utils/events/eventModel.js, the pure normalization and
 * merge logic that backs the /events page. Run with `node`, no framework.
 */
const assert = require('node:assert');

// eventModel.js is ESM; load it through a tiny dynamic import shim so this
// CommonJS script can require it.
async function main() {
  const {
    normalizeLumaEvent,
    normalizeCuratedEvent,
    isPlaceholderEvent,
    mergeEvents,
  } = await import('../src/utils/events/eventModel.js');

  let passed = 0;
  const check = (name, fn) => {
    try {
      fn();
    } catch (err) {
      err.message = `FAIL: ${name}\n${err.message}`;
      throw err;
    }
    passed += 1;
    console.log(`  ok - ${name}`);
  };

  check('normalizeLumaEvent maps an offline event', () => {
    const out = normalizeLumaEvent({
      name: 'Cardano Summit',
      description: 'desc',
      start_at: '2026-09-01T10:00:00.000Z',
      end_at: '2026-09-02T18:00:00.000Z',
      location_type: 'offline',
      geo_address_json: { city: 'Berlin', country: 'DE', city_state: 'Berlin, Berlin' },
      cover_url: 'https://images.lumacdn.com/x.png',
      url: 'https://luma.com/abc',
      tags: [{ name: 'Cardano Summit' }],
    });
    assert.strictEqual(out.title, 'Cardano Summit');
    assert.strictEqual(out.online, false);
    assert.strictEqual(out.location.label, 'Berlin, Berlin');
    assert.strictEqual(out.image, 'https://images.lumacdn.com/x.png');
    assert.strictEqual(out.source, 'luma');
    assert.deepStrictEqual(out.tags, ['Cardano Summit']);
  });

  check('normalizeLumaEvent treats zoom as online with no location label', () => {
    const out = normalizeLumaEvent({
      name: 'CAP Demo Day',
      start_at: '2026-06-09T16:00:00.000Z',
      location_type: 'zoom',
    });
    assert.strictEqual(out.online, true);
    assert.strictEqual(out.location.label, null);
  });

  check('normalizeCuratedEvent maps existing events.json shape', () => {
    const out = normalizeCuratedEvent({
      title: 'Rare Dev Day',
      description: 'd',
      startDate: '2025-08-06',
      endDate: '2025-08-07',
      location: 'Las Vegas',
      link: 'https://rareevo.io/dev-day',
      image: 'raredev-2025.avif',
      organizer: 'Rare Network',
      recapVideo: 'vbWal8A6_lQ',
    });
    assert.strictEqual(out.title, 'Rare Dev Day');
    assert.strictEqual(out.online, false);
    assert.strictEqual(out.location.label, 'Las Vegas');
    assert.strictEqual(out.url, 'https://rareevo.io/dev-day');
    assert.strictEqual(out.image, 'raredev-2025.avif');
    assert.strictEqual(out.source, 'curated');
    assert.strictEqual(out.recapVideo, 'vbWal8A6_lQ');
  });

  check('isPlaceholderEvent flags the guidelines pin and far-future dates', () => {
    assert.strictEqual(
      isPlaceholderEvent({ title: 'Event Submission Guidelines', startDate: '2027-01-01' }),
      true,
    );
    assert.strictEqual(
      isPlaceholderEvent({ title: 'Real Event', startDate: '2027-05-01' }),
      true,
    );
    assert.strictEqual(
      isPlaceholderEvent({ title: 'Real Event', startDate: '2026-05-01' }),
      false,
    );
  });

  check('mergeEvents dedups by title+day with Luma winning, drops placeholders, sorts', () => {
    const curated = [
      { title: 'Shared Event', startDate: '2026-05-01', link: 'https://curated' },
      { title: 'Older', startDate: '2025-01-01' },
    ];
    const luma = [
      { name: 'Shared Event', start_at: '2026-05-01T09:00:00.000Z', url: 'https://luma', location_type: 'offline' },
      { name: 'Event Submission Guidelines', start_at: '2027-01-01T00:00:00.000Z', location_type: 'offline' },
    ];
    const merged = mergeEvents(curated, luma);
    assert.strictEqual(merged.length, 2); // placeholder dropped, shared deduped
    assert.strictEqual(merged[0].title, 'Older'); // chronological
    const shared = merged.find((e) => e.title === 'Shared Event');
    assert.strictEqual(shared.source, 'luma'); // Luma wins
    assert.strictEqual(shared.url, 'https://luma');
  });

  console.log(`\n${passed} checks passed`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
