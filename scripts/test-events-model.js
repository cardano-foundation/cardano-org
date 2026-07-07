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
    collapseRecurringSeries,
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

  check('normalizeLumaEvent maps an official list-events entry (offline, geo, tags)', () => {
    const out = normalizeLumaEvent({
      name: 'Rare Dev & Governance Day 2025',
      description: 'desc',
      start_at: '2025-08-07T16:00:00.000Z',
      end_at: '2025-08-08T00:00:00.000Z',
      location_type: 'offline',
      url: 'https://luma.com/52rggq6i',
      cover_url: 'https://images.lumacdn.com/x.png',
      geo_address_json: { address: 'Topgolf', city: 'Las Vegas', region: 'Nevada', country: 'US' },
      tags: [{ id: 't1', name: '\u{1F1FA}\u{1F1F8} USA' }],
    });
    assert.strictEqual(out.title, 'Rare Dev & Governance Day 2025');
    assert.strictEqual(out.online, false);
    assert.strictEqual(out.location.label, 'Las Vegas, US');
    assert.strictEqual(out.url, 'https://luma.com/52rggq6i'); // full url as-is
    assert.strictEqual(out.image, 'https://images.lumacdn.com/x.png');
    assert.strictEqual(out.description, 'desc');
    assert.strictEqual(out.organizer, null);
    assert.deepStrictEqual(out.tags, ['\u{1F1FA}\u{1F1F8} USA']);
    assert.strictEqual(out.source, 'luma');
  });

  check('normalizeLumaEvent treats meet/discord as online with no location label', () => {
    const out = normalizeLumaEvent({
      name: 'Hard Fork Working Group',
      start_at: '2026-07-02T14:00:00.000Z',
      location_type: 'meet',
      url: 'https://luma.com/75xxkmq6',
      tags: [{ name: 'Developers' }, { name: 'Intersect' }],
    });
    assert.strictEqual(out.online, true);
    assert.strictEqual(out.location.label, null);
    assert.deepStrictEqual(out.tags, ['Developers', 'Intersect']);
    assert.strictEqual(out.category, 'Developers'); // derived from tags
  });

  check('event category is derived (curated by title, luma by tags)', () => {
    const conf = normalizeCuratedEvent({ title: 'Point Zero Forum', startDate: '2026-06-23' });
    assert.strictEqual(conf.category, 'Conference');
    const hack = normalizeCuratedEvent({ title: 'Berlin Hackathon 2025', startDate: '2025-06-13' });
    assert.strictEqual(hack.category, 'Hackathon');
    const explicit = normalizeCuratedEvent({ title: 'Some Summit', startDate: '2026-01-01', category: 'Workshop' });
    assert.strictEqual(explicit.category, 'Workshop'); // explicit wins
    const gov = normalizeLumaEvent({ name: 'Intersect Connect', start_at: '2026-07-02T14:00:00.000Z', location_type: 'meet', url: 'https://luma.com/x', tags: [{ name: 'Intersect' }] });
    assert.strictEqual(gov.category, 'Governance');
    const community = normalizeLumaEvent({ name: 'SPO Call', start_at: '2026-07-02T15:00:00.000Z', location_type: 'meet', url: 'https://luma.com/y', tags: [{ name: '\u{1F310} Virtual' }] });
    assert.strictEqual(community.category, 'Community');
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

  check('isPlaceholderEvent flags the guidelines pin by title, keeps real future events', () => {
    assert.strictEqual(
      isPlaceholderEvent({ title: 'Event Submission Guidelines', startDate: '2027-01-01' }),
      true,
    );
    // Recurring working groups legitimately run into future years.
    assert.strictEqual(
      isPlaceholderEvent({ title: 'DB-Sync TWG Open Session', startDate: '2027-04-22' }),
      false,
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
      { name: 'Shared Event', start_at: '2026-05-01T09:00:00.000Z', url: 'https://luma.com/x', location_type: 'meet' },
      { name: 'Event Submission Guidelines', start_at: '2027-01-01T00:00:00.000Z', url: 'https://luma.com/g', location_type: 'offline' },
    ];
    const merged = mergeEvents(curated, luma);
    assert.strictEqual(merged.length, 2); // placeholder dropped, shared deduped
    assert.strictEqual(merged[0].title, 'Older'); // chronological
    const shared = merged.find((e) => e.title === 'Shared Event');
    assert.strictEqual(shared.source, 'luma'); // Luma wins
    assert.strictEqual(shared.url, 'https://luma.com/x');
  });

  check('collapseRecurringSeries keeps next occurrence per title, flags it, leaves singles', () => {
    const now = Date.UTC(2026, 6, 7); // 2026-07-07
    const events = [
      { title: 'Weekly Call', startDate: '2026-06-30', source: 'luma' }, // past
      { title: 'Weekly Call', startDate: '2026-07-07', source: 'luma' }, // next
      { title: 'Weekly Call', startDate: '2026-07-14', source: 'luma' }, // later
      { title: 'One Off', startDate: '2026-08-01', source: 'curated' },
    ];
    const out = collapseRecurringSeries(events, now);
    assert.strictEqual(out.length, 2); // series collapsed to one + the single
    const call = out.find((e) => e.title === 'Weekly Call');
    assert.strictEqual(call.startDate, '2026-07-07'); // next from now, not the past one
    assert.strictEqual(call.recurring, true);
    assert.strictEqual(call.occurrences, 3);
    const single = out.find((e) => e.title === 'One Off');
    assert.strictEqual(single.recurring, undefined); // singles untouched
  });

  check('collapseRecurringSeries falls back to the latest past occurrence when all are over', () => {
    const now = Date.UTC(2026, 6, 7);
    const events = [
      { title: 'Old Series', startDate: '2026-05-01' },
      { title: 'Old Series', startDate: '2026-05-08' },
    ];
    const out = collapseRecurringSeries(events, now);
    assert.strictEqual(out.length, 1);
    assert.strictEqual(out[0].startDate, '2026-05-08'); // most recent past
    assert.strictEqual(out[0].recurring, true);
  });

  console.log(`\n${passed} checks passed`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
