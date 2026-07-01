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

  check('normalizeLumaEvent maps a get-items meet entry (online, tags, host, slug url)', () => {
    const out = normalizeLumaEvent({
      start_at: '2026-07-02T14:00:00.000Z',
      tags: [{ name: 'Developers' }, { name: 'Intersect' }],
      hosts: [{ name: 'Bosko Majdanac' }],
      event: {
        name: 'Hard Fork Working Group',
        start_at: '2026-07-02T14:00:00.000Z',
        end_at: '2026-07-02T14:30:00.000Z',
        location_type: 'meet',
        url: '75xxkmq6',
        cover_url: 'https://images.lumacdn.com/x.jpg',
        geo_address_info: null,
      },
    });
    assert.strictEqual(out.title, 'Hard Fork Working Group');
    assert.strictEqual(out.online, true);
    assert.strictEqual(out.url, 'https://lu.ma/75xxkmq6'); // slug expanded
    assert.strictEqual(out.organizer, 'Bosko Majdanac');
    assert.deepStrictEqual(out.tags, ['Developers', 'Intersect']);
    assert.strictEqual(out.image, 'https://images.lumacdn.com/x.jpg');
    assert.strictEqual(out.source, 'luma');
  });

  check('normalizeLumaEvent: offline url-address skipped, external link and null type handled', () => {
    const off = normalizeLumaEvent({
      hosts: [],
      tags: [{ name: '\u{1F310} Virtual' }],
      event: {
        name: 'Intersect Connect',
        start_at: '2026-07-02T14:00:00.000Z',
        location_type: 'offline',
        url: '9jerw8tf',
        geo_address_info: { type: 'manual', address: 'https://members.intersectmbo.org/' },
      },
    });
    assert.strictEqual(off.online, false);
    assert.strictEqual(off.location.label, null); // a URL is not a place
    const ext = normalizeLumaEvent({
      event: {
        name: 'Developers Office Hours',
        start_at: '2026-07-03T08:00:00.000Z',
        location_type: null,
        url: 'https://www.addevent.com/event/abc',
        cover_url: null,
      },
    });
    assert.strictEqual(ext.online, true); // null location_type is online
    assert.strictEqual(ext.url, 'https://www.addevent.com/event/abc'); // full url as-is
    assert.strictEqual(ext.image, null);
  });

  check('normalizeLumaEvent shows city for a real offline location', () => {
    const out = normalizeLumaEvent({
      event: {
        name: 'Local Meetup',
        start_at: '2026-08-01T10:00:00.000Z',
        location_type: 'offline',
        url: 'abc',
        geo_address_info: { city: 'Berlin', country: 'DE', city_state: 'Berlin, Berlin' },
      },
    });
    assert.strictEqual(out.online, false);
    assert.strictEqual(out.location.label, 'Berlin, Berlin');
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
      { event: { name: 'Shared Event', start_at: '2026-05-01T09:00:00.000Z', url: 'lumaslug', location_type: 'meet' } },
      { event: { name: 'Event Submission Guidelines', start_at: '2027-01-01T00:00:00.000Z', url: 'x', location_type: 'offline' } },
    ];
    const merged = mergeEvents(curated, luma);
    assert.strictEqual(merged.length, 2); // placeholder dropped, shared deduped
    assert.strictEqual(merged[0].title, 'Older'); // chronological
    const shared = merged.find((e) => e.title === 'Shared Event');
    assert.strictEqual(shared.source, 'luma'); // Luma wins
    assert.strictEqual(shared.url, 'https://lu.ma/lumaslug');
  });

  console.log(`\n${passed} checks passed`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
