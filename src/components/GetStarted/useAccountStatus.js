import { useCallback, useEffect, useRef, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useLocalStorage from '@site/src/utils/useLocalStorage';
import { makeApiClient } from '@site/src/utils/insights/api';
import { loadEvolution } from '@site/src/utils/cardano/wallet';
import { isValidBaseAddress } from '@site/src/utils/cardano/bech32.mjs';
import { ACCOUNT_KEY, isValidAccount } from '@site/src/utils/getStarted/storage.mjs';
import { emptyStatus } from '@site/src/utils/getStarted/status.mjs';
import { createLatest, checkAccount, EMPTY_NAMES } from '@site/src/utils/getStarted/check.mjs';

// Throttles the visibility refresh. A deliberate Refresh click bypasses it,
// it is only guarded against starting a second request while one is running.
// There is no automatic account polling, the hero's chain tip line polls on
// its own.
const MIN_INTERVAL_MS = 10000;

// CIP-30 getBalance() returns a CBOR-encoded Value as hex. Only the coin
// part matters here, native assets are ignored.
async function readWalletBalance(walletApi) {
  try {
    const hex = await walletApi.getBalance();
    const { Value } = await loadEvolution();
    return Value.fromCBORHex(hex).coin.toString();
  } catch (e) {
    return null;
  }
}

export default function useAccountStatus() {
  const { siteConfig: { customFields } } = useDocusaurusContext();
  const apiUrl = customFields.CARDANO_ORG_API_URL;

  const [account, setAccountValue, resetAccount] = useLocalStorage(ACCOUNT_KEY, null, isValidAccount);
  // Bumped by setAccount, so connecting a wallet for an address that was
  // pasted before (same stake address) still starts a fresh check.
  const [revision, setRevision] = useState(0);
  const [status, setStatus] = useState(emptyStatus);
  const [names, setNames] = useState(EMPTY_NAMES);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  // Session-only wallet handle for the getBalance() fallback, never persisted.
  const walletApiRef = useRef(null);
  const latestRef = useRef(createLatest());
  const lastFetchRef = useRef(0);

  const stakeAddress = account?.stakeAddress || null;

  const runCheck = useCallback(async (force) => {
    if (!apiUrl || !stakeAddress) return;
    const now = Date.now();
    if (!force && now - lastFetchRef.current < MIN_INTERVAL_MS) return;
    lastFetchRef.current = now;

    const latest = latestRef.current;
    const id = latest.next();
    const isCurrent = () => latest.isCurrent(id);
    const walletApi = walletApiRef.current;
    setChecking(true);
    try {
      const out = await checkAccount({
        api: makeApiClient(apiUrl),
        stakeAddress,
        readWalletBalance: walletApi ? () => readWalletBalance(walletApi) : null,
        isCurrent,
      });
      if (!out) return; // superseded by a newer check or an address change
      setStatus(out.status);
      setNames(out.names);
      setLastResult(out.result);
      setError(false);
      setLastChecked(new Date());
    } catch (e) {
      if (!isCurrent()) return;
      // Keep the previous status and its lastChecked on screen, only flag the failure.
      setError(true);
      setLastResult('error');
    } finally {
      if (isCurrent()) setChecking(false);
    }
  }, [apiUrl, stakeAddress]);

  // A new address (including the one loaded from storage after mount) or a
  // new revision of the same address checks immediately.
  useEffect(() => {
    if (!stakeAddress) return undefined;
    lastFetchRef.current = 0;
    runCheck(true);
    return undefined;
  }, [stakeAddress, revision, runCheck]);

  // Unmount invalidates whatever is still in flight.
  useEffect(() => {
    const latest = latestRef.current;
    return () => latest.invalidate();
  }, []);

  // Returning from an exchange or wallet tab re-checks, throttled.
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const onVisible = () => {
      if (document.visibilityState === 'visible') runCheck(false);
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [runCheck]);

  const clearDerived = useCallback(() => {
    latestRef.current.invalidate();
    setStatus(emptyStatus());
    setNames(EMPTY_NAMES);
    setError(false);
    setLastResult(null);
    setLastChecked(null);
    setChecking(false);
  }, []);

  const setAccount = useCallback((entry, walletApi) => {
    clearDerived();
    walletApiRef.current = walletApi || null;
    setAccountValue({
      stakeAddress: entry.stakeAddress,
      // A wallet or a paste can hand back anything, and isValidAccount would
      // drop the whole entry on the next load over an invalid base address.
      baseAddress: isValidBaseAddress(entry.baseAddress) ? entry.baseAddress : null,
      ownership: entry.ownership,
      savedAt: new Date().toISOString(),
    });
    setRevision((r) => r + 1);
  }, [clearDerived, setAccountValue]);

  const forget = useCallback(() => {
    clearDerived();
    walletApiRef.current = null;
    resetAccount();
  }, [clearDerived, resetAccount]);

  // A click skips the throttle, but never starts a second parallel request.
  const refresh = useCallback(() => {
    if (checking) return;
    runCheck(true);
  }, [checking, runCheck]);

  return { account, setAccount, forget, status, names, checking, error, lastResult, lastChecked, refresh };
}
