// Query windows and paging for the Luma calendar feed. Pure module (no React,
// no @site alias) so it runs under the plain node test.

import { DAY_MS } from './eventModel.js';

const LUMA_PAGE_SIZE = 50;
// Upper bound on pages per query, so a feed that keeps reporting more pages
// cannot loop forever. 90 past days are about two pages today.
const LUMA_MAX_PAGES = 4;
// The live query reaches back a few days, so a multi-day event that has
// already started still loads and can show as running. The feed filters by
// start date only, so an event that started earlier than this and is still
// running appears once the past window loads.
const LUMA_LOOKBACK_DAYS = 7;
// How far back the "Past" view reaches for community events.
const LUMA_PAST_WINDOW_DAYS = 90;

// `access=view` is the documented flag that includes events listed on the
// calendar but hosted elsewhere (the working groups etc.), not just
// self-managed events.
const BASE_PARAMS = { access: 'view', pagination_limit: LUMA_PAGE_SIZE };

function isoDaysBefore(todayMs, days) {
  return new Date(todayMs - days * DAY_MS).toISOString();
}

// Running and upcoming events. `todayMs` is the start of the current UTC day.
export function upcomingQuery(todayMs) {
  return { ...BASE_PARAMS, after: isoDaysBefore(todayMs, LUMA_LOOKBACK_DAYS) };
}

// Finished events, directly before the window of upcomingQuery. Newest first,
// so the page cap would drop the oldest entries.
export function pastQuery(todayMs) {
  return {
    ...BASE_PARAMS,
    after: isoDaysBefore(todayMs, LUMA_PAST_WINDOW_DAYS),
    before: isoDaysBefore(todayMs, LUMA_LOOKBACK_DAYS),
    sort_direction: 'desc',
  };
}

// Collects the entries of every page of one query. `fetchPage(params)` resolves
// to the feed envelope `{ entries, has_more, next_cursor }`.
export async function fetchAllPages(fetchPage, params, maxPages = LUMA_MAX_PAGES) {
  const entries = [];
  let cursor = null;
  for (let page = 0; page < maxPages; page += 1) {
    const data = await fetchPage(cursor ? { ...params, pagination_cursor: cursor } : params);
    if (data && Array.isArray(data.entries)) entries.push(...data.entries);
    if (!data || !data.has_more || !data.next_cursor) break;
    cursor = data.next_cursor;
  }
  return entries;
}
