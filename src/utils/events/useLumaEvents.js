import { useEffect, useMemo, useRef, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { makeApiClient } from '@site/src/utils/insights/api';
import { utcDayStartMs } from '@site/src/utils/events/eventModel';
import { fetchAllPages, pastQuery, upcomingQuery } from '@site/src/utils/events/lumaQuery';

// Official Luma calendar API, proxied by data.cardano.org (the proxy injects the
// paid calendar key). The query windows live in lumaQuery.js.
const LUMA_EVENTS_PATH = '/calendars/events/list';

// One page of the feed, resolving to the envelope `{ entries, has_more, next_cursor }`.
function pageFetcher(client) {
  return (params) => client.get(LUMA_EVENTS_PATH, { params }).then((res) => res && res.data);
}

// Fetches the Cardano Luma calendar feed through the data.cardano.org proxy.
// Running and upcoming events load on mount. Finished events load once, the
// first time `includePast` is true, so the default view costs one query.
// Returns raw entries plus a status. Failures degrade silently so the page can
// fall back to the curated list.
export default function useLumaEvents({ includePast = false } = {}) {
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();
  const lumaUrl = customFields.CARDANO_ORG_LUMA_API_URL;

  // Create the client once via a lazy initializer instead of writing a ref
  // during render.
  const [client] = useState(() => (lumaUrl ? makeApiClient(lumaUrl) : null));
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [status, setStatus] = useState('loading');
  const pastLoaded = useRef(false);

  useEffect(() => {
    if (!client) {
      // Missing config: one-shot error, not a render loop.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus('error');
      return undefined;
    }

    let cancelled = false;
    fetchAllPages(pageFetcher(client), upcomingQuery(utcDayStartMs()))
      .then((entries) => {
        if (cancelled) return;
        setUpcoming(entries);
        setStatus('success');
      })
      .catch(() => {
        if (cancelled) return;
        setUpcoming([]);
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [client]);

  useEffect(() => {
    if (!client || !includePast || pastLoaded.current) return undefined;

    let cancelled = false;
    fetchAllPages(pageFetcher(client), pastQuery(utcDayStartMs()))
      .then((entries) => {
        if (cancelled) return;
        pastLoaded.current = true;
        setPast(entries);
      })
      // The past view then shows the curated entries only.
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [client, includePast]);

  // Stable identity between fetches, so consumers can memoize on it.
  const entries = useMemo(() => [...past, ...upcoming], [past, upcoming]);

  return { entries, status };
}
