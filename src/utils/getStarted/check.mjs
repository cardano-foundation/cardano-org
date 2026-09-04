import { UNKNOWN, deriveStatus, withWalletBalance } from './status.mjs';

export const EMPTY_NAMES = { poolName: null, poolTicker: null, drepName: null };

// Latest-wins token. Every check draws a new id, address changes, forget and
// unmount call invalidate(), so a late response can never fill a newer state.
export function createLatest() {
  let current = 0;
  return {
    next() { current += 1; return current; },
    isCurrent(id) { return id === current; },
    invalidate() { current += 1; },
  };
}

async function fetchPoolName(api, poolId) {
  if (!poolId) return { poolName: null, poolTicker: null };
  try {
    const res = await api.post('/pool_info', { _pool_bech32_ids: [poolId] });
    const meta = res.data?.[0]?.meta_json || {};
    return { poolName: meta.name || null, poolTicker: meta.ticker || null };
  } catch (e) {
    return { poolName: null, poolTicker: null };
  }
}

// CIP-119 givenName is a plain string in most files, an object with @value in some.
async function fetchDrepName(api, drepId, kind) {
  if (!drepId || kind !== 'drep') return { drepName: null };
  try {
    const res = await api.post('/drep_metadata', { _drep_ids: [drepId] });
    const given = res.data?.[0]?.meta_json?.body?.givenName;
    const name = typeof given === 'string' ? given : given?.['@value'];
    return { drepName: typeof name === 'string' && name.trim() ? name.trim() : null };
  } catch (e) {
    return { drepName: null };
  }
}

// One full check. Resolves to null as soon as isCurrent() reports that a
// newer check or an address change superseded this one. Rejects only when
// the account query itself fails, name lookups degrade to null.
export async function checkAccount({ api, stakeAddress, readWalletBalance = null, isCurrent }) {
  const res = await api.post('/account_info', { _stake_addresses: [stakeAddress] });
  if (!isCurrent()) return null;
  // A body that is not an array is a broken response, not an empty account.
  if (!Array.isArray(res.data)) throw new Error('account_info returned no array');
  const row = res.data[0];
  let status = deriveStatus(row);
  if (status.ada === UNKNOWN && readWalletBalance) {
    status = withWalletBalance(status, await readWalletBalance());
    if (!isCurrent()) return null;
  }
  const [pool, drep] = await Promise.all([
    fetchPoolName(api, status.poolId),
    fetchDrepName(api, status.drepId, status.drepKind),
  ]);
  if (!isCurrent()) return null;
  return { status, names: { ...pool, ...drep }, result: row ? 'ok' : 'empty' };
}
