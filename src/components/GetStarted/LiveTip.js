import React, { useEffect, useState } from 'react';
import Translate from '@docusaurus/Translate';
import { makeApiClient } from '@site/src/utils/insights/api';
import styles from './styles.module.css';

const REFRESH_MS = 30000;

// The hero line: latest block number and its age. Fetches /tip every 30
// seconds while the tab is visible, ticks the age locally every second.
// Not a live region: the ticking number is aria-hidden and screen readers
// get the age as it was when the block was fetched.
export default function LiveTip({ apiUrl, locale }) {
  const [tip, setTip] = useState(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!apiUrl) return undefined;
    const api = makeApiClient(apiUrl);
    let timer = null;
    let cancelled = false;

    async function load() {
      try {
        const res = await api.get('/tip');
        const row = res.data?.[0];
        if (!cancelled && row?.block_no && row?.block_time) {
          setTip({ blockNo: row.block_no, blockTime: row.block_time, fetchedAt: Date.now() });
        }
      } catch (e) {
        // The line simply stays hidden while the tip is unavailable.
      }
    }
    function start() {
      if (timer) return;
      load();
      timer = setInterval(load, REFRESH_MS);
    }
    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
    }
    const onVisibility = () => (document.visibilityState === 'visible' ? start() : stop());
    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelled = true;
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [apiUrl]);

  useEffect(() => {
    if (!tip) return undefined;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [tip]);

  if (!tip) return null;
  const seconds = Math.max(0, Math.floor(now / 1000 - tip.blockTime));
  const secondsAtFetch = Math.max(0, Math.floor(tip.fetchedAt / 1000 - tip.blockTime));
  return (
    <p className={styles.liveTip}>
      <Translate
        id="getStarted.hero.liveTip"
        description="Live line under the hero, {block} is the block number, {seconds} the block age"
        values={{
          block: <strong>{new Intl.NumberFormat(locale).format(tip.blockNo)}</strong>,
          seconds: (
            <>
              <span aria-hidden="true">{seconds}</span>
              <span className={styles.srOnly}>{secondsAtFetch}</span>
            </>
          ),
        }}
      >
        {'Block {block} was produced {seconds} seconds ago.'}
      </Translate>
    </p>
  );
}
