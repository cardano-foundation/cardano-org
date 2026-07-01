import { useEffect, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { makeApiClient } from '@site/src/utils/insights/api';

// Aggregated CardanoEvents feed (all featured working groups etc.), proxied by
// data.cardano.org. The proxy pins the calendar id, so the client only passes
// the time window and page size.
const LUMA_EVENTS_PATH = '/calendar/get-items';
const LUMA_QUERY = { period: 'future', pagination_limit: 100 };

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
      .get(LUMA_EVENTS_PATH, { params: LUMA_QUERY })
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
