import { useEffect, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { makeApiClient } from '@site/src/utils/insights/api';

// Official Luma calendar API, proxied by data.cardano.org (the proxy injects the
// paid calendar key). `access=view` is the documented flag that includes events
// listed on the calendar but hosted elsewhere (the working groups etc.), not
// just self-managed events. `after` limits the result to upcoming events so the
// whole set fits in one page.
const LUMA_EVENTS_PATH = '/calendars/events/list';
const LUMA_PAGE_SIZE = 50;

function upcomingAfterIso() {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  ).toISOString();
}

// Fetches the Cardano Luma calendar feed through the data.cardano.org proxy.
// Returns raw entries plus a status; failures degrade silently so the page can
// fall back to the curated list.
export default function useLumaEvents() {
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();
  const lumaUrl = customFields.CARDANO_ORG_LUMA_API_URL;

  // Create the client once via a lazy initializer instead of writing a ref
  // during render.
  const [client] = useState(() => (lumaUrl ? makeApiClient(lumaUrl) : null));
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (!client) {
      // Missing config: one-shot error, not a render loop.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus('error');
      return undefined;
    }

    let cancelled = false;
    client
      .get(LUMA_EVENTS_PATH, {
        params: {
          access: 'view',
          after: upcomingAfterIso(),
          pagination_limit: LUMA_PAGE_SIZE,
        },
      })
      .then((res) => {
        if (cancelled) return;
        const data = res && res.data && res.data.entries;
        setEntries(Array.isArray(data) ? data : []);
        setStatus('success');
      })
      .catch(() => {
        if (cancelled) return;
        setEntries([]);
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [client]);

  return { entries, status };
}
