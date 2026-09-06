// The random selection behind the stake pool delegation tool as a small
// state machine without React or network code. Candidates come in already
// shuffled, pool_info is loaded one pool at a time with a few requests in
// flight, every answer fills the display or a spare pool that serves the next
// shuffle instantly. scripts/test-pool-loading.mjs drives it with fakes.
import { DISPLAY_COUNT, eligibleFromInfo, toPoolModel } from './stakePools.mjs';

export const MAX_IN_FLIGHT = 8;
export const SPARE_TARGET = DISPLAY_COUNT;
// Consecutive failed requests after which drawing stops. A general outage
// then costs one wave of requests instead of walking the whole index.
export const MAX_CONSECUTIVE_FAILURES = 8;

export function createPoolSampler({
  candidates, fetchOne, onChange,
  displayCount = DISPLAY_COUNT, spareTarget = SPARE_TARGET,
  maxInFlight = MAX_IN_FLIGHT, maxFailures = MAX_CONSECUTIVE_FAILURES,
}) {
  const queue = [...candidates];
  let shown = [];
  let spare = [];
  let inFlight = 0;
  let failures = 0;
  let lastError = null;
  let stopped = false;

  function status() {
    if (shown.length >= displayCount) return 'ready';
    if (inFlight > 0 || (queue.length && failures < maxFailures)) return 'loading';
    if (!shown.length && failures >= maxFailures) return 'error';
    return 'ready';
  }

  function snapshot() {
    const s = status();
    return { status: s, pools: shown.slice(), spare: spare.length, inFlight, error: s === 'error' ? lastError : null };
  }

  function emit() {
    if (!stopped) onChange(snapshot());
  }

  function fillFromSpare() {
    while (shown.length < displayCount && spare.length) shown.push(spare.shift());
  }

  function need() {
    return (displayCount - shown.length) + (spareTarget - spare.length) - inFlight;
  }

  function pump() {
    while (!stopped && inFlight < maxInFlight && need() > 0 && queue.length && failures < maxFailures) {
      const row = queue.shift();
      inFlight += 1;
      // Start the request synchronously so the wave goes out at once. A
      // throwing fetchOne counts like a rejected one.
      let request;
      try {
        request = Promise.resolve(fetchOne(row.pool_id_bech32));
      } catch (error) {
        request = Promise.reject(error);
      }
      request
        .then(
          (info) => {
            inFlight -= 1;
            if (stopped) return;
            failures = 0;
            const model = info && eligibleFromInfo(info) ? toPoolModel(row, info) : null;
            if (model) (shown.length < displayCount ? shown : spare).push(model);
            pump();
            emit();
          },
          (error) => {
            inFlight -= 1;
            if (stopped) return;
            failures += 1;
            lastError = error;
            pump();
            emit();
          }
        );
    }
  }

  return {
    start() {
      fillFromSpare();
      pump();
      emit();
    },
    shuffle() {
      shown = [];
      failures = 0;
      fillFromSpare();
      pump();
      emit();
    },
    stop() {
      stopped = true;
    },
    snapshot,
  };
}
