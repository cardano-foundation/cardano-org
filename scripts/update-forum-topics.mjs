//
// Snapshots the most popular forum topics of the month for /community.
//
// forum.cardano.org sends no CORS header, so the page cannot ask the forum
// itself. This script reads the public Discourse JSON, keeps topics from a
// fixed set of categories and writes src/data/forum-topics.json, which is
// committed like the other network snapshots.
//
// Run with `yarn update-forum-topics` and read the titles before committing.
// A topic that should not appear on cardano.org goes into EXCLUDED_TOPIC_IDS.
// Any failed request or unexpected response aborts before writing, and the
// file is replaced atomically, so a bad run never changes the snapshot.
//
import { writeFile, rename } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { FORUM_URL } from '../src/data/communities.mjs';

const OUT_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/data/forum-topics.json');

// English categories that carry announcements, learning material and events:
// News 13, Education 17, Research 222, Meetups 36, Governance Events 214.
const ALLOWED_CATEGORY_IDS = new Set([13, 17, 222, 36, 214]);
// Developers counts with everything below it.
const DEVELOPERS_ROOT_ID = 29;
// Topic ids that passed the filters but should stay off the page.
const EXCLUDED_TOPIC_IDS = [];

const TOPIC_LIMIT = 5;
const MIN_TOPICS = 3;
const MAX_PAGES = 3;
const MAX_TITLE_LENGTH = 110;
const SERIES_PREFIX_LENGTH = 30;

// Emoji shortcodes such as ":es:" stand alone between spaces. A clock time
// like 10:30:45 has no space around its colons and stays.
const SHORTCODE = /(^|\s):[a-z][a-z0-9_+-]*:(?=\s|$)/gi;
const TYPOGRAPHIC_DASH = /[\u2013\u2014\u2015]/g;

export function cleanTitle(raw) {
  const text = String(raw).replace(SHORTCODE, '$1').replace(TYPOGRAPHIC_DASH, '-').replace(/\s+/g, ' ').trim();
  if (text.length <= MAX_TITLE_LENGTH) return text;
  const head = text.slice(0, MAX_TITLE_LENGTH - 1);
  const cut = head.lastIndexOf(' ');
  // A cut right after a separator would leave "Papers |" before the ellipsis.
  const kept = (cut > 0 ? head.slice(0, cut) : head).replace(/[\s|,:/-]+$/, '');
  return `${kept}\u2026`;
}

// True when the category or one of its ancestors is on the allow list. The
// seen set stops a broken parent chain from looping.
function isAllowedCategory(id, byId) {
  if (ALLOWED_CATEGORY_IDS.has(id)) return true;
  const seen = new Set();
  let current = id;
  while (byId.has(current) && !seen.has(current)) {
    if (current === DEVELOPERS_ROOT_ID) return true;
    seen.add(current);
    current = byId.get(current).parent_category_id;
  }
  return false;
}

export function selectTopics(topics, categories, { excluded = EXCLUDED_TOPIC_IDS } = {}) {
  const byId = new Map(categories.map((c) => [c.id, c]));
  const skip = new Set(excluded);
  const seenSeries = new Set();
  const picked = [];
  for (const t of topics) {
    if (picked.length >= TOPIC_LIMIT) break;
    if (t.visible === false || t.archived || t.pinned_globally || t.archetype !== 'regular') continue;
    if (skip.has(t.id) || !isAllowedCategory(t.category_id, byId)) continue;
    const title = cleanTitle(t.title);
    // Weekly series flood the list with near-identical titles, one is enough.
    const series = title.slice(0, SERIES_PREFIX_LENGTH).toLowerCase();
    if (!title || seenSeries.has(series)) continue;
    seenSeries.add(series);
    picked.push({ id: t.id, title, url: `${FORUM_URL}/t/${t.slug}/${t.id}`, category: byId.get(t.category_id).name });
  }
  return picked;
}

const isText = (v) => typeof v === 'string' && v.trim() !== '';

function assertCategories(categories) {
  if (!Array.isArray(categories) || categories.length === 0) {
    throw new Error('unexpected forum response: site.json has no categories');
  }
  for (const c of categories) {
    if (!Number.isInteger(c?.id) || !isText(c.name)) {
      throw new Error(`unexpected forum response: category ${JSON.stringify(c?.id)} lacks id or name`);
    }
  }
}

function assertTopics(list, page) {
  if (!Array.isArray(list?.topics)) {
    throw new Error(`unexpected forum response: top.json page ${page} has no topic list`);
  }
  for (const t of list.topics) {
    if (!Number.isInteger(t?.id) || !isText(t.title) || !isText(t.slug) || !Number.isInteger(t.category_id)) {
      throw new Error(`unexpected forum response: topic ${JSON.stringify(t?.id)} lacks id, title, slug or category_id`);
    }
  }
}

// The totals are a nice extra. Without usable numbers the page hides the
// line, so a changed about.json does not block the topic update.
function readStats(about) {
  const members = about?.about?.stats?.users_count;
  const posts = about?.about?.stats?.posts_count;
  const usable = (n) => Number.isInteger(n) && n > 0;
  return usable(members) && usable(posts) ? { members, posts } : null;
}

export async function runUpdate({ getJson, writeSnapshot, now = () => new Date() }) {
  const site = await getJson('/site.json');
  assertCategories(site?.categories);

  // Selection runs over all pages read so far, so the series check also
  // works across page borders.
  const collected = [];
  let topics = [];
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const list = (await getJson(`/top.json?period=monthly&page=${page}`))?.topic_list;
    assertTopics(list, page);
    collected.push(...list.topics);
    topics = selectTopics(collected, site.categories);
    if (topics.length >= TOPIC_LIMIT || !list.more_topics_url) break;
  }
  if (topics.length < MIN_TOPICS) throw new Error(`fewer than ${MIN_TOPICS} topics after filtering`);

  const stats = readStats(await getJson('/about.json'));
  const snapshot = { fetchedAt: now().toISOString(), stats, topics };
  await writeSnapshot(snapshot);
  return snapshot;
}

// Write next to the target, then rename, so a failed write never leaves a
// truncated snapshot behind.
async function writeSnapshotFile(next) {
  const tmp = `${OUT_PATH}.tmp`;
  await writeFile(tmp, `${JSON.stringify(next, null, 2)}\n`);
  await rename(tmp, OUT_PATH);
}

async function getForumJson(pathname) {
  const res = await fetch(`${FORUM_URL}${pathname}`, {
    headers: { Accept: 'application/json', 'User-Agent': 'cardano-org-forum-snapshot' },
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`${pathname} answered ${res.status}`);
  return res.json();
}

async function main() {
  const snapshot = await runUpdate({ getJson: getForumJson, writeSnapshot: writeSnapshotFile });
  console.log(`Wrote ${snapshot.topics.length} topics:`);
  for (const t of snapshot.topics) console.log(`  ${t.id}  [${t.category}] ${t.title}`);
  if (!snapshot.stats) console.log('No usable totals in about.json, stats is null.');
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(`Aborted, snapshot unchanged: ${err.message}`);
    process.exit(1);
  });
}
