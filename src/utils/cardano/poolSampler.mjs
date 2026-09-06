// The random selection behind the stake pool delegation tool as a small
// state machine without React or network code. Candidates come in already
// shuffled, pool_info is loaded one pool at a time with a few requests in
// flight, every answer fills the display or a spare pool that serves the next
// shuffle instantly. scripts/test-pool-loading.mjs drives it with fakes.
import { DISPLAY_COUNT, eligibleFromInfo, toPoolModel } from './stakePools.mjs';

const MAX_IN_FLIGHT = 8;
const SPARE_TARGET = DISPLAY_COUNT;
// Consecutive failed requests after which drawing stops. A general outage
// then costs one wave of requests instead of walking the whole index.
const MAX_CONSECUTIVE_FAILURES = 8;

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

  // Only status and the shown pools reach the UI, so answers that land in
  // the spare pool or get skipped do not trigger a render.
  let lastKey = null;
  function emit() {
    if (stopped) return;
    const s = status();
    const key = `${s}:${shown.map((p) => p.id).join(',')}`;
    if (key === lastKey) return;
    lastKey = key;
    onChange({ status: s, pools: shown.slice(), error: s === 'error' ? lastError : null });
  }

  function need() {
    return (displayCount - shown.length) + (spareTarget - spare.length) - inFlight;
  }

  // Runs after every answer, whether it succeeded or not.
  function settle(apply) {
    inFlight -= 1;
    if (stopped) return;
    apply();
    pump();
    emit();
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
      request.then(
        (info) => settle(() => {
          failures = 0;
          const model = info && eligibleFromInfo(info) ? toPoolModel(row, info) : null;
          if (model) (shown.length < displayCount ? shown : spare).push(model);
        }),
        (error) => settle(() => {
          failures += 1;
          lastError = error;
        })
      );
    }
  }

  // Fills the display from the spare pool first, then draws the rest.
  function kick() {
    while (shown.length < displayCount && spare.length) shown.push(spare.shift());
    pump();
    emit();
  }

  return {
    start: kick,
    shuffle() {
      shown = [];
      failures = 0;
      kick();
    },
    stop() {
      stopped = true;
    },
  };
}
