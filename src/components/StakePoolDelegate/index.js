import React, { useCallback, useMemo, useRef, useState } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { translate } from "@docusaurus/Translate";
import { makeApiClient } from "@site/src/utils/insights/api";
import { fetchPoolInfoOne } from "@site/src/utils/cardano/koiosPools.mjs";
import { delegateStake, rewardAddressesBech32 } from "@site/src/utils/cardano/wallet";
import { EXPECTED_NETWORK_ID, classifyError, shortAddress, stringifyError } from "@site/src/utils/walletTx";
import { DISPLAY_COUNT, MAX_MARGIN, MIN_ACTIVE_STAKE, MIN_PLEDGE } from "@site/src/utils/cardano/stakePools.mjs";
import { formatAdaCompact, formatAdaWhole } from "@site/src/utils/cardano/lovelace.mjs";
import { NetworkWarning, SearchRow, TxBanner, WalletPicker } from "@site/src/components/WalletDelegation";
import {
  fetchAccounts, useAccounts, usePoolIndex, usePoolSearch, useProtocolParams, useRandomSample,
} from "./usePoolData";
import PoolCard from "./PoolCard";
import AccountStatus from "./AccountStatus";
import styles from "./styles.module.css";

function Retry({ onClick }) {
  return (
    <button type="button" className={`button button--sm button--outline button--primary ${styles.retryButton}`} onClick={onClick}>
      {translate({ id: "stakePoolDelegation.delegate.retry", message: "Retry" })}
    </button>
  );
}

function Skeleton() {
  return <div className={styles.skeleton} aria-hidden="true" />;
}

class PoolUnavailableError extends Error {
  constructor() {
    super("Pool is not registered or is retiring.");
    this.name = "PoolUnavailableError";
  }
}

// Thrown when the preflight itself (fetchPoolInfoOne or fetchAccounts) fails,
// for example a network or 5xx error, as opposed to a preflight that
// succeeds but finds the pool unavailable. Mapped to the same message as a
// wallet-side status check failure, since neither preflight result is known.
class PreflightError extends Error {
  constructor() {
    super("Could not verify the pool or the stake key before building the transaction.");
    this.name = "PreflightError";
  }
}

// Maps a thrown error to the translated banner message, or null when the
// user simply cancelled in the wallet.
function errorMessage(err) {
  if (err instanceof PoolUnavailableError) {
    return translate({ id: "stakePoolDelegation.delegate.error.poolUnavailable", message: "This pool is retiring or no longer registered. Pick another pool." });
  }
  if (err instanceof PreflightError) {
    return translate({ id: "stakePoolDelegation.delegate.error.statusUnknown", message: "Your stake key status could not be checked. Try again in a moment." });
  }
  switch (classifyError(err)) {
    case "userCancelled":
      return null;
    case "wrongNetwork":
      return translate({ id: "stakePoolDelegation.delegate.error.wrongNetwork", message: "Your wallet is on the wrong network. Switch to Mainnet and try again." });
    case "accountChanged":
    case "noRewardAddress":
      return translate({ id: "stakePoolDelegation.delegate.error.accountChanged", message: "The wallet account changed. Reconnect and try again." });
    case "statusUnknown":
      return translate({ id: "stakePoolDelegation.delegate.error.statusUnknown", message: "Your stake key status could not be checked. Try again in a moment." });
    case "stakeNotRegistered":
    case "stakeKeyAlreadyRegistered":
      return translate({ id: "stakePoolDelegation.delegate.error.statusChanged", message: "Your stake key status changed. Reconnect and try again." });
    case "insufficientFunds":
      return translate({ id: "stakePoolDelegation.delegate.error.insufficientFunds", message: "Not enough ada to cover the fee and the stake key deposit." });
    default:
      return translate(
        { id: "stakePoolDelegation.delegate.error.generic", message: "Delegation failed: {error}" },
        { error: stringifyError(err) }
      );
  }
}

export default function StakePoolDelegate() {
  const { siteConfig: { customFields }, i18n: { currentLocale } } = useDocusaurusContext();
  const API_URL = customFields.CARDANO_ORG_API_URL;
  const locale = currentLocale || "en";
  const [apiClient] = useState(() => (API_URL ? makeApiClient(API_URL) : null));

  // wallet: { instance, name, address, networkId, rewardAddresses, rewardAddressesError }
  const [wallet, setWallet] = useState(null);
  const [stakeAddress, setStakeAddress] = useState(null);
  const [query, setQuery] = useState("");
  const [tx, setTx] = useState({ status: "idle" });
  const [busyPoolId, setBusyPoolId] = useState(null);
  const [submittedPoolId, setSubmittedPoolId] = useState(null);
  // Operation id of the delegation attempt that may still write state.
  // Disconnect, account switch and a new attempt bump it, late results with
  // an old id are dropped. busyRef blocks a second click synchronously.
  const opRef = useRef(0);
  const busyRef = useRef(false);

  const index = usePoolIndex(apiClient);
  const indexRows = index.status === "ready" ? index.data : null;
  const sample = useRandomSample(apiClient, indexRows);
  const search = usePoolSearch(apiClient, indexRows, query, index.status);
  const params = useProtocolParams(apiClient);
  const stakeAddresses = useMemo(
    () => (wallet ? wallet.rewardAddresses.map((a) => a.bech32) : null),
    [wallet]
  );
  const accounts = useAccounts(apiClient, stakeAddresses);

  const account = accounts.status === "ready" && stakeAddress ? accounts.data[stakeAddress] || null : null;
  const registrationStatus = !wallet
    ? "loading"
    : wallet.rewardAddressesError
      ? "walletError"
      : wallet.rewardAddresses.length === 0
        ? "noStakeKey"
        : accounts.status === "ready"
          ? (account ? account.registration : "unknown")
          : accounts.status === "error"
            ? "unknown"
            : "loading";
  const wrongNetwork = !!wallet && wallet.networkId !== EXPECTED_NETWORK_ID;
  const txBusy = tx.status === "building";
  const canDelegate =
    !!wallet && !wrongNetwork && !txBusy &&
    (registrationStatus === "registered" || registrationStatus === "unregistered");
  const depositLabel = params.status === "ready" ? `${formatAdaWhole(params.data.keyDeposit, locale)} ada` : null;
  const minCostLabel = params.status === "ready" ? `${formatAdaWhole(params.data.minPoolCost, locale)} ada` : null;
  const currentPoolId = submittedPoolId || account?.delegatedPoolId || null;

  const invalidate = () => { opRef.current += 1; busyRef.current = false; };

  const handleConnect = useCallback(async (connected) => {
    invalidate();
    let rewardAddresses = [];
    let rewardAddressesError = false;
    try {
      rewardAddresses = await rewardAddressesBech32(connected.instance);
    } catch (err) {
      console.error("StakePoolDelegate: reward addresses failed", err);
      rewardAddressesError = true;
    }
    setWallet({ ...connected, rewardAddresses, rewardAddressesError });
    setStakeAddress(rewardAddresses[0]?.bech32 || null);
    setTx({ status: "idle" });
    setBusyPoolId(null);
    setSubmittedPoolId(null);
  }, []);

  const handleDisconnect = useCallback(() => {
    invalidate();
    setWallet(null);
    setStakeAddress(null);
    setTx({ status: "idle" });
    setBusyPoolId(null);
    setSubmittedPoolId(null);
  }, []);

  const handleSelectStakeAddress = useCallback((addr) => {
    invalidate();
    setStakeAddress(addr);
    setTx({ status: "idle" });
    setBusyPoolId(null);
    setSubmittedPoolId(null);
  }, []);

  const handleDelegate = useCallback(async (pool) => {
    if (!canDelegate || !apiClient || busyRef.current) return;
    busyRef.current = true;
    const op = ++opRef.current;
    const live = () => opRef.current === op;
    const ticker = pool.ticker || shortAddress(pool.id);
    setBusyPoolId(pool.id);
    setTx({
      status: "building",
      message: translate(
        { id: "stakePoolDelegation.delegate.tx.building", message: "Preparing delegation of {stake} to {pool}. Please confirm in your wallet…" },
        { stake: shortAddress(stakeAddress), pool: ticker }
      ),
    });
    try {
      // Preflight: fresh pool row (must be this exact pool, registered, not
      // retiring) and a fresh registration status for the chosen stake key.
      // The tx uses only these fresh values, never the rendered state. A
      // failure of the preflight calls themselves (network, 5xx) is a
      // PreflightError, distinct from a preflight that succeeds but finds
      // the pool gone (PoolUnavailableError below).
      let fresh, freshAccounts;
      try {
        [fresh, freshAccounts] = await Promise.all([
          fetchPoolInfoOne(apiClient, pool.id),
          fetchAccounts(apiClient, [stakeAddress]),
        ]);
      } catch {
        throw new PreflightError();
      }
      if (!live()) return;
      if (!fresh || fresh.pool_status !== "registered" || fresh.retiring_epoch != null) {
        throw new PoolUnavailableError();
      }
      const freshStatus = freshAccounts[stakeAddress]?.registration;
      const txHash = await delegateStake({
        api: wallet.instance,
        poolId: fresh.pool_id_bech32,
        stakeAddress,
        registrationStatus: freshStatus,
        koiosUrl: API_URL,
      });
      if (!live()) return;
      setSubmittedPoolId(pool.id);
      setTx({
        status: "success",
        txHash,
        message: translate(
          { id: "stakePoolDelegation.delegate.tx.success", message: "Delegation to {pool} submitted. It becomes active in the epoch after next." },
          { pool: ticker }
        ),
      });
    } catch (err) {
      if (!live()) return;
      const message = errorMessage(err);
      if (message === null) {
        setTx({ status: "idle" });
      } else {
        console.error("StakePoolDelegate: delegation failed", err);
        setTx({ status: "error", message });
      }
    } finally {
      if (live()) {
        busyRef.current = false;
        setBusyPoolId(null);
      }
    }
  }, [canDelegate, apiClient, stakeAddress, wallet, API_URL]);

  if (!API_URL) {
    return (
      <p className={styles.notice}>
        {translate({ id: "stakePoolDelegation.delegate.unavailable", message: "The delegation tool is unavailable right now. You can delegate directly inside your wallet app." })}
      </p>
    );
  }

  const showVoteCta = tx.status === "success" && account && !account.delegatedDrep;
  const searching = search.kind === "id" || search.kind === "ticker" || search.kind === "invalidId";
  const blockedReason = !wallet
    ? translate({ id: "stakePoolDelegation.delegate.blocked.noWallet", message: "Connect a wallet to delegate." })
    : wrongNetwork
      ? null
      : registrationStatus === "walletError"
        ? translate({ id: "stakePoolDelegation.delegate.blocked.walletError", message: "The stake key could not be read from this wallet, so delegation is off. Disconnect and try again." })
        : registrationStatus === "noStakeKey"
          ? translate({ id: "stakePoolDelegation.delegate.blocked.noStakeKey", message: "This wallet has no stake key. Delegation needs a Shelley-era wallet or account." })
          : registrationStatus === "loading"
            ? translate({ id: "stakePoolDelegation.delegate.blocked.checking", message: "Checking your stake key before you can delegate…" })
            : registrationStatus === "unknown"
              ? translate({ id: "stakePoolDelegation.delegate.blocked.unknown", message: "Your stake key could not be checked. Retry above before delegating." })
              : null;

  // While loading, cards that already arrived render in front of skeletons
  // for the remaining slots, so the grid fills in instead of appearing at once.
  const renderPools = (pools, isLoading, error, onRetry, emptyText) => {
    if (error) {
      return (
        <p className={styles.notice}>
          {error}
          <Retry onClick={onRetry} />
        </p>
      );
    }
    if (!pools.length && !isLoading) return <p className={styles.notice}>{emptyText}</p>;
    const placeholders = isLoading ? Math.max(0, DISPLAY_COUNT - pools.length) : 0;
    return (
      <div className={styles.cardGrid}>
        {pools.map((pool) => (
          <PoolCard
            key={pool.id}
            pool={pool}
            isCurrent={pool.id === currentPoolId}
            disabled={!canDelegate}
            busy={busyPoolId === pool.id}
            locale={locale}
            onDelegate={handleDelegate}
          />
        ))}
        {Array.from({ length: placeholders }, (_, i) => <Skeleton key={`skeleton-${i}`} />)}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.walletSection}>
        {wallet ? (
          <AccountStatus
            wallet={wallet}
            stakeAddress={stakeAddress}
            onSelectStakeAddress={handleSelectStakeAddress}
            accounts={accounts}
            registrationStatus={registrationStatus}
            depositLabel={depositLabel}
            locale={locale}
            busy={txBusy}
            onDisconnect={handleDisconnect}
            onRetry={accounts.retry}
          />
        ) : (
          <>
            <h3 className={styles.sectionHeading}>
              {translate({ id: "stakePoolDelegation.delegate.wallet.heading", message: "Connect a wallet to delegate" })}
            </h3>
            <WalletPicker
              onConnect={handleConnect}
              busy={txBusy}
              emptyMessage={
                <>
                  {translate({ id: "stakePoolDelegation.delegate.wallet.empty", message: "No Cardano wallet detected. Install Eternl, Lace, VESPR or another CIP-30 wallet, or delegate directly inside your wallet app." })}{" "}
                  <Link to="/wallets">{translate({ id: "stakePoolDelegation.delegate.wallet.findWallet", message: "Find a wallet" })}</Link>
                </>
              }
            />
          </>
        )}
        {wrongNetwork && <NetworkWarning />}
        <p className={styles.paramsLine}>
          {depositLabel && minCostLabel
            ? translate(
                { id: "stakePoolDelegation.delegate.params", message: "Current protocol values: stake key deposit {deposit} (refundable), minimum fixed fee per epoch {minCost}." },
                { deposit: depositLabel, minCost: minCostLabel }
              )
            : translate({ id: "stakePoolDelegation.delegate.paramsUnavailable", message: "Current protocol values (stake key deposit, minimum fixed fee) could not be loaded." })}
        </p>
      </div>

      <TxBanner state={tx} />

      {showVoteCta && (
        <div className={styles.voteCta}>
          <h3>{translate({ id: "stakePoolDelegation.delegate.vote.title", message: "One more step: delegate your vote" })}</h3>
          <p>{translate({ id: "stakePoolDelegation.delegate.vote.text", message: "Since the Plomin hard fork, staking rewards can only be withdrawn once your stake key also has an active vote delegation. Delegate to a DRep, or choose abstain or no confidence, in one more transaction." })}</p>
          <Link to="/governance/delegate" className="button button--primary">
            {translate({ id: "stakePoolDelegation.delegate.vote.cta", message: "Delegate your vote" })}
          </Link>
        </div>
      )}

      <div className={styles.searchSection}>
        <h3 className={styles.sectionHeading}>
          {translate({ id: "stakePoolDelegation.delegate.search.heading", message: "Find a stake pool" })}
        </h3>
        <SearchRow
          value={query}
          onChange={setQuery}
          placeholder={translate({ id: "stakePoolDelegation.delegate.search.placeholder", message: "Search by ticker or paste a pool ID" })}
          label={translate({ id: "stakePoolDelegation.delegate.search.label", message: "Search stake pools by ticker or pool ID" })}
        />
        {search.kind === "tooShort" && (
          <p className={styles.notice}>
            {translate({ id: "stakePoolDelegation.delegate.search.tooShort", message: "Type at least two characters of a ticker, or paste a full pool ID." })}
          </p>
        )}
      </div>

      {blockedReason && <p className={styles.notice}>{blockedReason}</p>}

      {searching ? (
        search.kind === "invalidId" ? (
          <p className={styles.notice}>
            {translate({ id: "stakePoolDelegation.delegate.search.invalidId", message: "This does not look like a valid pool ID. Check the ID." })}
          </p>
        ) : (
          renderPools(
            search.status === "ready" ? search.data.pools : [],
            search.status === "loading" || search.status === "idle",
            search.status === "error"
              ? translate({ id: "stakePoolDelegation.delegate.search.failed", message: "Search failed." })
              : search.status === "ready" && search.data.indexMissing
                ? translate({ id: "stakePoolDelegation.delegate.search.noIndex", message: "The pool list is not available, so ticker search is off. Paste a pool ID instead." })
                : null,
            // indexMissing only happens because the pool index itself failed to
            // load, so retrying the search would just reproduce it. Retry the
            // index instead, the other search error keeps retrying the search.
            search.status === "ready" && search.data.indexMissing ? index.retry : search.retry,
            search.kind === "id"
              ? translate({ id: "stakePoolDelegation.delegate.search.unknownId", message: "This pool is retired or unknown. Check the ID." })
              : translate({ id: "stakePoolDelegation.delegate.search.noResults", message: "No pool with that ticker. Try the pool ID instead." })
          )
        )
      ) : (
        <>
          <div className={styles.poolHeader}>
            <div className={styles.poolIntro}>
              <p className={styles.poolIntroText}>
                {translate({ id: "stakePoolDelegation.delegate.sampleIntro", message: "A random selection of registered pools that meet these minimums. This is not a recommendation. Shuffle for a new set or search by ticker or pool ID." })}
              </p>
              <p className={styles.poolCriteria}>
                {translate(
                  { id: "stakePoolDelegation.delegate.sampleCriteria", message: "Active stake at least {stake} · declared pledge at least {pledge} and met · margin below {margin}% · not saturated · at least one block minted" },
                  { stake: `${formatAdaCompact(MIN_ACTIVE_STAKE, locale)} ada`, pledge: `${formatAdaCompact(MIN_PLEDGE, locale)} ada`, margin: (MAX_MARGIN * 100).toLocaleString(locale) }
                )}
              </p>
            </div>
            <button
              type="button"
              className={`button button--secondary ${styles.shuffleButton}`}
              disabled={sample.status !== "ready" || txBusy}
              onClick={sample.shuffle}
            >
              {translate({ id: "stakePoolDelegation.delegate.shuffle", message: "Shuffle pools" })}
            </button>
          </div>
          {index.status === "error" ? (
            <p className={styles.notice}>
              {translate({ id: "stakePoolDelegation.delegate.index.failed", message: "Could not load the pool list. You can still delegate by pasting a pool ID." })}
              <Retry onClick={index.retry} />
            </p>
          ) : (
            renderPools(
              sample.data || [],
              sample.status === "loading" || sample.status === "idle",
              sample.status === "error"
                ? translate({ id: "stakePoolDelegation.delegate.sample.failed", message: "Could not load pool details." })
                : null,
              sample.retry,
              translate({ id: "stakePoolDelegation.delegate.sample.empty", message: "No pool matched the criteria right now. Search by ticker or pool ID." })
            )
          )}
        </>
      )}
    </div>
  );
}
