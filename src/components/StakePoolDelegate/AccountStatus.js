import React from "react";
import { translate } from "@docusaurus/Translate";
import { formatAda } from "@site/src/utils/cardano/lovelace.mjs";
import { shortAddress } from "@site/src/utils/walletTx";
import styles from "./styles.module.css";

function registrationLine(registrationStatus, account, depositLabel) {
  switch (registrationStatus) {
    case "walletError":
      return translate({
        id: "stakePoolDelegation.delegate.account.walletError",
        message: "Could not read the stake key from this wallet. Disconnect and try again.",
      });
    case "noStakeKey":
      return translate({
        id: "stakePoolDelegation.delegate.account.noStakeKey",
        message: "This wallet has no stake key. Delegation needs a Shelley-era wallet or account.",
      });
    case "loading":
      return translate({ id: "stakePoolDelegation.delegate.account.checking", message: "Checking your stake key…" });
    case "unknown":
      return translate({ id: "stakePoolDelegation.delegate.account.unknown", message: "Could not check your stake key." });
    case "unregistered":
      return depositLabel
        ? translate(
            {
              id: "stakePoolDelegation.delegate.account.unregistered",
              message:
                "Not yet delegated. Your first delegation also registers your stake key ({deposit} deposit, refunded when you deregister).",
            },
            { deposit: depositLabel }
          )
        : translate({
            id: "stakePoolDelegation.delegate.account.unregisteredNoAmount",
            message: "Not yet delegated. Your first delegation also registers your stake key (refundable deposit).",
          });
    default: {
      if (!account?.delegatedPoolId) {
        return translate({ id: "stakePoolDelegation.delegate.account.notDelegated", message: "Not delegated to a stake pool" });
      }
      const pool = account.delegatedPool;
      const label = pool?.ticker ? (pool.name ? `${pool.ticker} (${pool.name})` : pool.ticker) : shortAddress(account.delegatedPoolId);
      return translate(
        { id: "stakePoolDelegation.delegate.account.delegated", message: "Delegated to {pool}" },
        { pool: label }
      );
    }
  }
}

export default function AccountStatus({
  wallet, stakeAddress, onSelectStakeAddress, accounts, registrationStatus, depositLabel, locale, busy, onDisconnect, onRetry,
}) {
  const account = accounts.status === "ready" && stakeAddress ? accounts.data?.[stakeAddress] : null;
  const many = wallet.rewardAddresses.length > 1;
  return (
    <div className={styles.accountStatus}>
      <div className={styles.accountLeft}>
        <span className={styles.accountDot} aria-hidden="true" />
        <div className={styles.accountText}>
          <span>
            {translate(
              { id: "stakePoolDelegation.delegate.account.connected", message: "Connected: {name} · {addr}" },
              { name: wallet.name, addr: shortAddress(wallet.address) }
            )}
          </span>
          {stakeAddress && (
            <span className={styles.accountDetail}>
              {translate({ id: "stakePoolDelegation.delegate.account.stakeKey", message: "Stake key" })}{" "}
              {many ? (
                <select
                  className={styles.accountSelect}
                  value={stakeAddress}
                  disabled={busy}
                  onChange={(e) => onSelectStakeAddress(e.target.value)}
                  aria-label={translate({
                    id: "stakePoolDelegation.delegate.account.selectLabel",
                    message: "Choose the stake key to delegate",
                  })}
                >
                  {wallet.rewardAddresses.map((a) => {
                    const acc = accounts.status === "ready" ? accounts.data?.[a.bech32] : null;
                    const pool = acc?.delegatedPool?.ticker || (acc?.delegatedPoolId ? shortAddress(acc.delegatedPoolId) : null);
                    return (
                      <option key={a.bech32} value={a.bech32}>
                        {shortAddress(a.bech32)}
                        {pool ? ` · ${pool}` : ""}
                      </option>
                    );
                  })}
                </select>
              ) : (
                shortAddress(stakeAddress)
              )}
            </span>
          )}
          <span className={styles.accountDetail}>
            {registrationLine(registrationStatus, account, depositLabel)}
            {registrationStatus === "unknown" && (
              <button
                type="button"
                className={`button button--sm button--outline button--primary ${styles.retryButton}`}
                onClick={onRetry}
                disabled={busy}
              >
                {translate({ id: "stakePoolDelegation.delegate.retry", message: "Retry" })}
              </button>
            )}
          </span>
          {registrationStatus === "registered" && account && (
            <span className={styles.accountDetail}>
              {account.rewardsAvailable === null
                ? translate({
                    id: "stakePoolDelegation.delegate.account.rewardsUnavailable",
                    message: "Rewards available: not available right now",
                  })
                : translate(
                    { id: "stakePoolDelegation.delegate.account.rewards", message: "Rewards available: {amount} ada" },
                    { amount: formatAda(account.rewardsAvailable, locale) }
                  )}
            </span>
          )}
        </div>
      </div>
      <button type="button" onClick={onDisconnect} className={styles.disconnectButton} disabled={busy}>
        {translate({ id: "stakePoolDelegation.delegate.account.disconnect", message: "Disconnect" })}
      </button>
    </div>
  );
}
