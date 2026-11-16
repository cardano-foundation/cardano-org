import { useEffect, useMemo, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { makeApiClient } from '@site/src/utils/insights/api';
import { utcDayStartMs } from '@site/src/utils/events/eventModel';
import { fetchAllPages, pastQuery, upcomingQuery } from '@site/src/utils/events/lumaQuery';

// Official Luma calendar API, proxied by data.cardano.org (the proxy injects the
// paid calendar key). The query windows live in lumaQuery.js.
const LUMA_EVENTS_PATH = '/calendars/events/list';
const NO_ENTRIES = [];

// One promise per query for the lifetime of the page, so toggling views or
// navigating back to /events never repeats a request. The query carries the
// date, so a new day starts fresh. A failed request is dropped from the cache
// and retried the next time it is needed.
const responses = new Map();

function loadEntries(client, params) {
  const key = JSON.stringify(params);
  if (!responses.has(key)) {
    const fetchPage = (pageParams) =>
      client.get(LUMA_EVENTS_PATH, { params: pageParams }).then((res) => res && res.data);
    const request = fetchAllPages(fetchPage, params).catch((err) => {
      responses.delete(key);
      throw err;
    });
    responses.set(key, request);
  }
  return responses.get(key);
}

// Entries of one query window once `enabled` turns true. Entries stay after
// `enabled` turns false again. Failures leave the list empty, so the page falls
// back to the curated events.
function useLumaWindow(client, enabled, makeQuery) {
  const [entries, setEntries] = useState(NO_ENTRIES);
  useEffect(() => {
    if (!client || !enabled) return undefined;
    let active = true;
    loadEntries(client, makeQuery(utcDayStartMs())).then(
      (list) => active && setEntries(list),
      () => {},
    );
    return () => {
      active = false;
    };
  }, [client, enabled, makeQuery]);
  return entries;
}

// Fetches the Cardano Luma calendar feed through the data.cardano.org proxy.
// Running and upcoming events load on mount. Finished events load the first
// time `includePast` is true, so the default view costs one query.
export default function useLumaEvents({ includePast = false } = {}) {
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();
  const lumaUrl = customFields.CARDANO_ORG_LUMA_API_URL;

  // Create the client once via a lazy initializer instead of writing a ref
  // during render.
  const [client] = useState(() => (lumaUrl ? makeApiClient(lumaUrl) : null));
  const upcoming = useLumaWindow(client, true, upcomingQuery);
  const past = useLumaWindow(client, includePast, pastQuery);

  // Stable identity between fetches, so consumers can memoize on it.
  const entries = useMemo(() => [...past, ...upcoming], [past, upcoming]);

  return { entries };
}
