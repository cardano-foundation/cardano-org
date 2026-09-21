// Homepage news feed composition, used by scripts/generate-recent-news.js.
// /news itself is unaffected, this only shapes the six cards on the homepage:
// development (the weekly reports) gets one slot at most, and at least
// PREFERRED_MIN slots go to categories that read well for first-time
// visitors. Everything else fills up by date.
const FEED_SIZE = 6;
const DEVELOPMENT_MAX = 1;
const PREFERRED_TAGS = ['ecosystem', 'education', 'community'];
const PREFERRED_MIN = 3;

// Posts store their tags in priority order, so tags[0] is the category.
function primaryTag(post) {
  return (post.tags || [])[0];
}

// Pick the feed from `posts` (newest first, each with a `tags` array).
// Returns the picked posts in their original order.
function selectFeed(posts) {
  const picked = new Set();
  // Reserve slots for the preferred categories first.
  for (const post of posts) {
    if (picked.size >= PREFERRED_MIN) break;
    if (PREFERRED_TAGS.includes(primaryTag(post))) picked.add(post);
  }
  // Fill the rest by date, capping development.
  let developmentCount = 0;
  for (const post of posts) {
    if (picked.size >= FEED_SIZE) break;
    if (picked.has(post)) continue;
    if (primaryTag(post) === 'development') {
      if (developmentCount >= DEVELOPMENT_MAX) continue;
      developmentCount += 1;
    }
    picked.add(post);
  }
  return posts.filter((post) => picked.has(post));
}

module.exports = { selectFeed, FEED_SIZE, DEVELOPMENT_MAX, PREFERRED_TAGS, PREFERRED_MIN };
