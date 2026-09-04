import { UNKNOWN } from './status.mjs';

export const STATION_KEYS = ['wallet', 'phrase', 'connect', 'ada', 'delegate'];

// Combine two three-state flags: both confirmed is true, any confirmed
// missing is false, everything else stays unknown.
function both(a, b) {
  if (a === true && b === true) return true;
  if (a === false || b === false) return false;
  return UNKNOWN;
}

export function computeStations({ local, account, status }) {
  const connected = !!account;
  const walletConfirmed = connected && account.ownership === 'wallet-confirmed';
  return [
    { key: 'wallet', done: !!local.walletInstalled || walletConfirmed },
    { key: 'phrase', done: !!local.phrasePracticePassed },
    { key: 'connect', done: connected },
    { key: 'ada', done: connected ? status.ada : false },
    { key: 'delegate', done: connected ? both(status.stake, status.vote) : false },
  ];
}

export function firstOpenIndex(stations) {
  const i = stations.findIndex((s) => s.done !== true);
  return i === -1 ? null : i;
}

export function allDone(stations) {
  return stations.every((s) => s.done === true);
}

export function doneCount(stations) {
  return stations.filter((s) => s.done === true).length;
}
