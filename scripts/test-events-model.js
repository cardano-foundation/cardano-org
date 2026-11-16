/**
 * Tests for src/utils/events/eventModel.js, the pure normalization and
 * merge logic that backs the /events page. Run with `node`, no framework.
 */
const assert = require('node:assert');

// eventModel.js is ESM; load it through a tiny dynamic import shim so this
// CommonJS script can require it.
async function main() {
  // The checks run in order and some are async, so every check is awaited.
  const {
    normalizeLumaEvent,
    normalizeCuratedEvent,
    isPlaceholderEvent,
    mergeEvents,
    collapseRecurringSeries,
    isUpcomingEvent,
    eventBadge,
    selectFeatured,
    selectRecaps,
    matchesEventQuery,
  } = await import('../src/utils/events/eventModel.js');
  const { fetchAllPages, upcomingQuery, pastQuery } = await import(
    '../src/utils/events/lumaQuery.js'
  );

  let passed = 0;
  const check = async (name, fn) => {
    try {
      await fn();
    } catch (err) {
      err.message = `FAIL: ${name}\n${err.message}`;
      throw err;
    }
    passed += 1;
    console.log(`  ok - ${name}`);
  };

  await check('normalizeLumaEvent maps an official list-events entry (offline, geo, tags)', () => {
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

  await check('normalizeLumaEvent treats meet/discord as online with no location label', () => {
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

  await check('event category is derived (curated by title, luma by tags)', () => {
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

  await check('normalizeCuratedEvent maps existing events.json shape', () => {
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

  await check('isPlaceholderEvent flags the guidelines pin by title, keeps real future events', () => {
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

  await check('mergeEvents dedups by title+day with Luma winning, drops placeholders, sorts', () => {
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

  await check('collapseRecurringSeries keeps next occurrence per title, flags it, leaves singles', () => {
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

  await check('collapseRecurringSeries falls back to the latest past occurrence when all are over', () => {
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

  await check('isUpcomingEvent keeps a multi-day event upcoming through its last day', () => {
    const conf = { title: 'Conf', startDate: '2026-11-17', endDate: '2026-11-19' };
    assert.strictEqual(isUpcomingEvent(conf, Date.UTC(2026, 10, 16)), true); // before
    assert.strictEqual(isUpcomingEvent(conf, Date.UTC(2026, 10, 18)), true); // day two
    assert.strictEqual(isUpcomingEvent(conf, Date.UTC(2026, 10, 19)), true); // last day
    assert.strictEqual(isUpcomingEvent(conf, Date.UTC(2026, 10, 20)), false); // over
  });

  await check('isUpcomingEvent falls back to the start date when the end is empty or missing', () => {
    const single = { title: 'One Day', startDate: '2026-11-17', endDate: '' };
    assert.strictEqual(isUpcomingEvent(single, Date.UTC(2026, 10, 17)), true);
    assert.strictEqual(isUpcomingEvent(single, Date.UTC(2026, 10, 18)), false);
    // A timed call stays listed for the rest of its day.
    const call = { title: 'Call', startDate: '2026-11-18T14:30:00.000Z', endDate: '2026-11-18T15:30:00.000Z' };
    assert.strictEqual(isUpcomingEvent(call, Date.UTC(2026, 10, 18)), true);
    assert.strictEqual(isUpcomingEvent(call, Date.UTC(2026, 10, 19)), false);
    assert.strictEqual(isUpcomingEvent({ title: 'No Date' }, Date.UTC(2026, 10, 18)), false);
  });

  await check('eventBadge reads live while an event runs, thisWeek before it, online otherwise', () => {
    const conf = { title: 'Conf', startDate: '2026-11-17', endDate: '2026-11-19' };
    assert.strictEqual(eventBadge(conf, Date.UTC(2026, 10, 16, 12)), 'thisWeek');
    assert.strictEqual(eventBadge(conf, Date.UTC(2026, 10, 17, 0)), 'live'); // start day
    assert.strictEqual(eventBadge(conf, Date.UTC(2026, 10, 19, 23)), 'live'); // last day
    assert.strictEqual(eventBadge(conf, Date.UTC(2026, 10, 20, 1)), null); // over
    assert.strictEqual(eventBadge(conf, Date.UTC(2026, 10, 1)), null); // too far out
    const webinar = { title: 'Webinar', startDate: '2026-12-20', online: true };
    assert.strictEqual(eventBadge(webinar, Date.UTC(2026, 10, 1)), 'online');
  });

  await check('collapseRecurringSeries keeps an occurrence that is still running', () => {
    const now = Date.UTC(2026, 6, 7);
    const events = [
      { title: 'Camp', startDate: '2026-07-06', endDate: '2026-07-08' }, // running
      { title: 'Camp', startDate: '2026-08-06', endDate: '2026-08-08' },
    ];
    const out = collapseRecurringSeries(events, now);
    assert.strictEqual(out[0].startDate, '2026-07-06');
  });

  await check('selectFeatured lists running and upcoming curated events, soonest first', () => {
    const curated = [
      { title: 'Later', startDate: '2026-12-07', endDate: '2026-12-11' },
      { title: 'Running', startDate: '2026-11-17', endDate: '2026-11-19' },
      { title: 'Over', startDate: '2026-11-10', endDate: '2026-11-13' },
    ];
    const out = selectFeatured(curated, Date.UTC(2026, 10, 18), 10);
    assert.deepStrictEqual(out.map((e) => e.title), ['Running', 'Later']);
    assert.strictEqual(selectFeatured(curated, Date.UTC(2026, 10, 18), 1).length, 1);
  });

  await check('selectRecaps lists finished curated events with a video, newest first', () => {
    const curated = [
      { title: 'Old', startDate: '2025-08-06', endDate: '2025-08-07', recapVideo: 'a' },
      { title: 'Recent', startDate: '2026-07-28', endDate: '2026-07-31', recapVideo: 'b' },
      { title: 'No Video', startDate: '2026-04-14', endDate: '2026-04-16', recapVideo: '' },
      { title: 'Running', startDate: '2026-11-17', endDate: '2026-11-19', recapVideo: 'c' },
    ];
    const out = selectRecaps(curated, Date.UTC(2026, 10, 18));
    assert.deepStrictEqual(out.map((e) => e.title), ['Recent', 'Old']);
    assert.strictEqual(out[0].recapVideo, 'b');
  });

  await check('a same-title Luma entry does not hide a curated recap', () => {
    // The merged list lets Luma win and collapses by title, so the recap row
    // must read the curated data directly.
    const curated = [
      { title: 'Rare Dev Day', startDate: '2025-08-06', endDate: '2025-08-07', recapVideo: 'vid' },
    ];
    const luma = [
      { name: 'Rare Dev Day', start_at: '2025-08-07T16:00:00.000Z', url: 'https://luma.com/x', location_type: 'offline' },
    ];
    const now = Date.UTC(2026, 10, 18);
    const collapsed = collapseRecurringSeries(mergeEvents(curated, luma), now);
    assert.strictEqual(collapsed.length, 1);
    assert.strictEqual(collapsed[0].source, 'luma'); // why the merged list is not enough
    assert.strictEqual(selectRecaps(curated, now)[0].recapVideo, 'vid');
  });

  await check('matchesEventQuery finds events by tag, topic and description', () => {
    const townHall = normalizeLumaEvent({
      name: 'Town Hall #11',
      start_at: '2026-11-21T12:00:00.000Z',
      location_type: 'meet',
      url: 'https://luma.com/t',
      tags: [{ name: '\u{1F1EE}\u{1F1E9} Indonesia' }, { name: 'Intersect' }],
    });
    assert.strictEqual(matchesEventQuery(townHall, 'indonesia'), true); // tag
    assert.strictEqual(matchesEventQuery(townHall, 'Governance'), true); // topic
    assert.strictEqual(matchesEventQuery(townHall, 'nigeria'), false);
    const summit = normalizeCuratedEvent({
      title: 'Some Summit',
      description: 'Two days about stablecoins and real world assets.',
      startDate: '2026-09-16',
      location: 'Barcelona, Spain',
      organizer: 'EBC',
    });
    assert.strictEqual(matchesEventQuery(summit, 'stablecoins'), true); // description
    assert.strictEqual(matchesEventQuery(summit, 'conference'), true); // derived topic
    assert.strictEqual(matchesEventQuery(summit, 'barcelona'), true); // location still works
  });

  await check('matchesEventQuery needs every word and treats an empty query as a match', () => {
    const hack = normalizeCuratedEvent({ title: 'Berlin Hackathon 2025', startDate: '2025-06-13', location: 'Berlin' });
    assert.strictEqual(matchesEventQuery(hack, '  hackathon   berlin '), true);
    assert.strictEqual(matchesEventQuery(hack, 'hackathon tokyo'), false);
    assert.strictEqual(matchesEventQuery(hack, ''), true);
    assert.strictEqual(matchesEventQuery(hack, undefined), true);
  });

  await check('fetchAllPages follows the cursor until the feed has no more pages', async () => {
    const calls = [];
    const pages = {
      first: { entries: [{ id: 1 }, { id: 2 }], has_more: true, next_cursor: 'c2' },
      c2: { entries: [{ id: 3 }], has_more: false, next_cursor: null },
    };
    const fetchPage = async (params) => {
      calls.push(params);
      return pages[params.pagination_cursor || 'first'];
    };
    const out = await fetchAllPages(fetchPage, { access: 'view' }, 5);
    assert.deepStrictEqual(out.map((e) => e.id), [1, 2, 3]);
    assert.deepStrictEqual(calls, [{ access: 'view' }, { access: 'view', pagination_cursor: 'c2' }]);
  });

  await check('fetchAllPages stops at the page cap and tolerates a malformed page', async () => {
    let n = 0;
    const endless = async () => {
      n += 1;
      return { entries: [{ id: n }], has_more: true, next_cursor: `c${n}` };
    };
    assert.strictEqual((await fetchAllPages(endless, {}, 3)).length, 3);
    assert.deepStrictEqual(await fetchAllPages(async () => null, {}, 3), []);
  });

  await check('upcomingQuery and pastQuery cover adjacent windows around today', () => {
    const today = Date.UTC(2026, 10, 16);
    const up = upcomingQuery(today);
    const past = pastQuery(today);
    // The live query reaches back a few days so running multi-day events load.
    assert.strictEqual(up.after, '2026-11-09T00:00:00.000Z');
    assert.strictEqual(up.before, undefined);
    assert.strictEqual(past.before, up.after); // no gap, no overlap
    assert.strictEqual(past.after, '2026-08-18T00:00:00.000Z'); // 90 days back
    assert.strictEqual(past.sort_direction, 'desc'); // newest first if capped
    assert.strictEqual(up.access, 'view');
    assert.strictEqual(past.access, 'view');
  });

  console.log(`\n${passed} checks passed`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
