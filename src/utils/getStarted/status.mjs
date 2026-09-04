import { parseLovelace } from '../cardano/lovelace.mjs';

// Every chain-derived flag has three states. `unknown` means "no usable
// answer yet", which must never be rendered as "not done".
export const UNKNOWN = 'unknown';

export function emptyStatus() {
  return {
    ada: UNKNOWN,
    stake: UNKNOWN,
    vote: UNKNOWN,
    stakeRegistered: UNKNOWN,
    balanceLovelace: null,
    poolId: null,
    drepId: null,
    drepKind: null,
  };
}

export function drepKind(id) {
  if (!id) return null;
  if (id.startsWith('drep_always_abstain')) return 'abstain';
  if (id.startsWith('drep_always_no_confidence')) return 'noConfidence';
  return 'drep';
}

// row is account_info[0] from Koios, or undefined when the array was empty.
export function deriveStatus(row) {
  if (!row || typeof row !== 'object') return emptyStatus();
  const status = emptyStatus();
  const balance = parseLovelace(row.total_balance);
  if (balance !== null) {
    status.balanceLovelace = balance.toString();
    status.ada = balance > 0n;
  }
  if ('delegated_pool' in row) {
    status.poolId = row.delegated_pool || null;
    status.stake = !!row.delegated_pool;
  }
  if ('delegated_drep' in row) {
    status.drepId = row.delegated_drep || null;
    status.vote = !!row.delegated_drep;
    status.drepKind = drepKind(row.delegated_drep);
  }
  if (typeof row.status === 'string') {
    status.stakeRegistered = row.status === 'registered';
  }
  return status;
}

// CIP-30 getBalance() covers the whole wallet, so it may fill an unknown
// balance but never overrides a value the chain query already confirmed.
export function withWalletBalance(status, lovelace) {
  if (status.ada !== UNKNOWN) return status;
  const balance = parseLovelace(lovelace);
  if (balance === null) return status;
  return { ...status, balanceLovelace: balance.toString(), ada: balance > 0n };
}
