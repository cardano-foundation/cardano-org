// Tests for scripts/lib/news-feed.js, the homepage feed selection used by
// scripts/generate-recent-news.js. Run with `node --test`.
const test = require('node:test');
const assert = require('node:assert/strict');
const { selectFeed } = require('./lib/news-feed.js');

const post = (id, ...tags) => ({ id, tags });
const ids = (posts) => posts.map((p) => p.id);

test('caps development at one slot and fills the rest by date', () => {
  const posts = [
    post('dev1', 'development'),
    post('comm1', 'community'),
    post('eco1', 'ecosystem'),
    post('dev2', 'development'),
    post('edu1', 'education', 'development'),
    post('dev3', 'development'),
    post('gov1', 'governance'),
    post('res1', 'research'),
  ];
  assert.deepEqual(ids(selectFeed(posts)), ['dev1', 'comm1', 'eco1', 'edu1', 'gov1', 'res1']);
});

test('pulls preferred categories ahead of newer governance and research posts', () => {
  const posts = [
    post('gov1', 'governance'),
    post('res1', 'research'),
    post('gov2', 'governance'),
    post('ev1', 'events'),
    post('comm1', 'community'),
    post('eco1', 'ecosystem'),
    post('edu1', 'education'),
    post('gov3', 'governance'),
  ];
  // Three preferred posts are reserved, the remaining three slots go to the
  // newest other posts. Output keeps date order.
  assert.deepEqual(ids(selectFeed(posts)), ['gov1', 'res1', 'gov2', 'comm1', 'eco1', 'edu1']);
});

test('keeps searching older posts when the newest are mostly development', () => {
  const posts = Array.from({ length: 50 }, (_, i) => post(`dev${i}`, 'development'));
  posts.push(post('old-comm', 'community'), post('old-gov', 'governance'));
  assert.deepEqual(ids(selectFeed(posts)), ['dev0', 'old-comm', 'old-gov']);
});

test('returns fewer than six cards only when the rules cannot be met', () => {
  assert.deepEqual(ids(selectFeed([post('a', 'development'), post('b', 'development')])), ['a']);
  assert.deepEqual(ids(selectFeed([])), []);
});

test('only the primary tag decides the category', () => {
  const posts = [post('dev1', 'development', 'education'), post('dev2', 'development', 'community')];
  assert.deepEqual(ids(selectFeed(posts)), ['dev1']);
});
