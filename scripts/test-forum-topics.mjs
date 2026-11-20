import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cleanTitle, selectTopics, runUpdate } from './update-forum-topics.mjs';

const CATEGORIES = [
  { id: 133, name: 'English' },
  { id: 13, name: 'News and Announcements', parent_category_id: 133 },
  { id: 17, name: 'Education', parent_category_id: 133 },
  { id: 29, name: 'Developers' },
  { id: 151, name: 'Cardano Projects', parent_category_id: 29 },
  { id: 300, name: 'Showcase', parent_category_id: 151 },
  { id: 140, name: 'Governance' },
  { id: 217, name: 'General Governance Conversation', parent_category_id: 140 },
  { id: 207, name: 'Translations' },
];

const topic = (id, title, category_id, extra = {}) => ({
  id, title, category_id, slug: `t${id}`, visible: true, archived: false, pinned_globally: false, archetype: 'regular', ...extra,
});

const MORE = '/top?page=1&period=monthly';
const PAGE0 = { topics: [topic(1, 'Digest', 13), topic(2, 'Vote No on everything', 217), topic(3, 'A project', 151)], more_topics_url: MORE };
const PAGE1 = { topics: [topic(4, 'Lesson', 17), topic(5, 'Tooling', 29), topic(6, 'Report', 13), topic(7, 'Paper', 17)] };
const TWO_ALLOWED_NO_MORE = { topics: [topic(1, 'Digest', 13), topic(3, 'A project', 151)] };
const EMPTY_WITH_MORE = { topics: [], more_topics_url: MORE };
const ABOUT = { about: { stats: { users_count: 30063, posts_count: 370278 } } };

// Answers the three forum endpoints from fixtures and records every path.
function fakeForum({ pages, categories = CATEGORIES, about = ABOUT, failOnPage = null }) {
  const calls = [];
  const getJson = async (pathname) => {
    calls.push(pathname);
    if (pathname === '/site.json') return { categories };
    if (pathname === '/about.json') return about;
    const page = Number(new URL(pathname, 'https://forum.invalid').searchParams.get('page'));
    if (page === failOnPage) throw new Error('ETIMEDOUT');
    return { topic_list: pages[page] };
  };
  getJson.calls = calls;
  return getJson;
}

function fakeFile() {
  const file = { writes: 0, last: null };
  file.write = async (snapshot) => { file.writes += 1; file.last = snapshot; };
  return file;
}

const now = () => new Date('2026-11-16T06:00:00Z');

test('cleanTitle strips shortcodes, dashes and overlength', () => {
  assert.equal(cleanTitle(':es: SPANISH  DUBBING'), 'SPANISH DUBBING');
  assert.equal(cleanTitle('Launch :tada: today'), 'Launch today');
  assert.equal(cleanTitle('Call at 10:30:45 UTC'), 'Call at 10:30:45 UTC');
  assert.equal(cleanTitle('Nov 16\u201322 \u2014 update'), 'Nov 16-22 - update');
  assert.equal(cleanTitle('<b>Bold</b> & co'), '<b>Bold</b> & co');
  const long = cleanTitle('word '.repeat(40));
  assert.ok(long.length <= 110 && long.endsWith('\u2026') && !long.includes('  '));
  assert.equal(cleanTitle('x'.repeat(200)).length, 110);
  assert.equal(cleanTitle(`${'Digest of the week '.repeat(5)}Papers | ${'y'.repeat(30)}`), `${'Digest of the week '.repeat(5)}Papers\u2026`);
});

test('selectTopics keeps allowed categories and Developers subcategories', () => {
  const picked = selectTopics([
    topic(1, 'Digest', 13), topic(2, 'Vote No on everything', 217),
    topic(3, 'A project', 151), topic(4, 'Swahili digest', 207),
  ], CATEGORIES);
  assert.deepEqual(picked.map((t) => t.id), [1, 3]);
  assert.deepEqual(picked[1], { id: 3, title: 'A project', url: 'https://forum.cardano.org/t/t3/3', category: 'Cardano Projects' });
});

test('selectTopics follows the parent chain below Developers and survives a cycle', () => {
  assert.deepEqual(selectTopics([topic(1, 'Deep', 300)], CATEGORIES).map((t) => t.id), [1]);
  const looped = [{ id: 1, name: 'A', parent_category_id: 2 }, { id: 2, name: 'B', parent_category_id: 1 }];
  assert.deepEqual(selectTopics([topic(1, 'Loop', 1)], looped), []);
  assert.deepEqual(selectTopics([topic(1, 'Unknown category', 999)], CATEGORIES), []);
});

test('selectTopics drops hidden, archived, pinned, non-regular and excluded topics', () => {
  const picked = selectTopics([
    topic(1, 'a', 13, { visible: false }), topic(2, 'b', 13, { archived: true }),
    topic(3, 'c', 13, { pinned_globally: true }), topic(4, 'd', 13, { archetype: 'banner' }),
    topic(5, 'e', 13), topic(6, 'f', 13),
  ], CATEGORIES, { excluded: [5] });
  assert.deepEqual(picked.map((t) => t.id), [6]);
});

test('selectTopics dedupes a series by the first 30 characters and stops at the limit', () => {
  const series = 'Cardano Research Exchange: The Effect';
  const picked = selectTopics([
    topic(1, `${series}, Part 1`, 13), topic(2, `${series}, Part 2`, 13),
    topic(3, 'x3', 13), topic(4, 'x4', 13), topic(5, 'x5', 13), topic(6, 'x6', 13), topic(7, 'x7', 13),
  ], CATEGORIES);
  assert.deepEqual(picked.map((t) => t.id), [1, 3, 4, 5, 6]);
});

test('runUpdate follows more_topics_url until five topics are found', async () => {
  const file = fakeFile();
  const forum = fakeForum({ pages: [PAGE0, PAGE1] });
  const result = await runUpdate({ getJson: forum, writeSnapshot: file.write, now });
  assert.deepEqual(result.topics.map((t) => t.id), [1, 3, 4, 5, 6]);
  assert.equal(result.fetchedAt, '2026-11-16T06:00:00.000Z');
  assert.deepEqual(result.stats, { members: 30063, posts: 370278 });
  assert.equal(file.writes, 1);
  assert.deepEqual(file.last, result);
  assert.equal(forum.calls.filter((p) => p.startsWith('/top.json')).length, 2);
});

test('runUpdate aborts without writing when a request fails', async () => {
  const file = fakeFile();
  await assert.rejects(runUpdate({ getJson: async () => { throw new Error('ECONNRESET'); }, writeSnapshot: file.write, now }), /ECONNRESET/);
  assert.equal(file.writes, 0);
});

test('runUpdate aborts without writing when a later page fails', async () => {
  const file = fakeFile();
  await assert.rejects(runUpdate({ getJson: fakeForum({ pages: [PAGE0, PAGE1], failOnPage: 1 }), writeSnapshot: file.write, now }), /ETIMEDOUT/);
  assert.equal(file.writes, 0);
});

test('runUpdate aborts without writing when fewer than three topics remain', async () => {
  const file = fakeFile();
  await assert.rejects(runUpdate({ getJson: fakeForum({ pages: [TWO_ALLOWED_NO_MORE] }), writeSnapshot: file.write, now }), /fewer than 3/);
  assert.equal(file.writes, 0);
});

test('runUpdate reads at most three pages', async () => {
  const file = fakeFile();
  const forum = fakeForum({ pages: [EMPTY_WITH_MORE, EMPTY_WITH_MORE, EMPTY_WITH_MORE, PAGE1] });
  await assert.rejects(runUpdate({ getJson: forum, writeSnapshot: file.write, now }), /fewer than 3/);
  assert.equal(forum.calls.filter((p) => p.startsWith('/top.json')).length, 3);
  assert.equal(file.writes, 0);
});

test('runUpdate aborts without writing when the response shape changed', async () => {
  const three = (extra) => ({ topics: [topic(1, 'a1', 13, extra), topic(2, 'b2', 13), topic(3, 'c3', 13)] });
  const broken = [
    fakeForum({ pages: [three({ slug: undefined })] }),
    fakeForum({ pages: [three({ slug: '' })] }),
    fakeForum({ pages: [three({ title: 42 })] }),
    fakeForum({ pages: [three({ id: '1' })] }),
    fakeForum({ pages: [three({ category_id: null })] }),
    fakeForum({ pages: [{ topics: 'none' }] }),
    fakeForum({ pages: [undefined] }),
    fakeForum({ pages: [three()], categories: null }),
    fakeForum({ pages: [three()], categories: [{ id: 13 }] }),
  ];
  for (const forum of broken) {
    const file = fakeFile();
    await assert.rejects(runUpdate({ getJson: forum, writeSnapshot: file.write, now }), /unexpected forum response/);
    assert.equal(file.writes, 0);
  }
});

test('runUpdate writes stats null when the totals are missing or not positive integers', async () => {
  const pages = [{ topics: [topic(1, 'a1', 13), topic(2, 'b2', 13), topic(3, 'c3', 13)] }];
  for (const about of [{}, { about: { stats: { users_count: 0, posts_count: 5 } } }, { about: { stats: { users_count: '30063', posts_count: 5 } } }]) {
    const file = fakeFile();
    const result = await runUpdate({ getJson: fakeForum({ pages, about }), writeSnapshot: file.write, now });
    assert.equal(result.stats, null);
    assert.equal(result.topics.length, 3);
    assert.equal(file.writes, 1);
  }
});
