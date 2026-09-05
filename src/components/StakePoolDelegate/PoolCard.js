import React, { useEffect, useRef, useState } from "react";
import { translate } from "@docusaurus/Translate";
import { Initials } from "@site/src/components/WalletDelegation";
import { formatAdaCompact, formatAdaWhole } from "@site/src/utils/cardano/lovelace.mjs";
import { shortAddress } from "@site/src/utils/walletTx";
import styles from "./styles.module.css";

// The explorer.cardano.org hub has no pool route (it only resolves
// transaction, block, epoch, address, governance-action and drep), so pool
// pages link to Cexplorer, which is listed on the hub and takes bech32 ids.
const EXPLORER_POOL_BASE = "https://cexplorer.io/pool/";

function Metric({ label, value }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </>
  );
}

export default function PoolCard({ pool, isCurrent, disabled, busy, locale, onDelegate }) {
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef(null);
  useEffect(() => () => clearTimeout(copyTimerRef.current), []);
  const saturation = pool.saturation;
  const pledgeMet = BigInt(pool.livePledge) >= BigInt(pool.pledge);
  const retired = pool.status === "retired";
  const retiring = pool.retiringEpoch != null;
  const fillClass = saturation == null ? "" : saturation >= 100 ? styles.saturationOver : saturation >= 90 ? styles.saturationWarn : "";
  const num = (n, digits = 0) => n.toLocaleString(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits });

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(pool.id);
      setCopied(true);
      clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be unavailable, the full id is still in the explorer link.
    }
  };

  return (
    <div className={`${styles.card} ${isCurrent ? styles.cardCurrent : ""}`}>
      <div className={styles.cardHeader}>
        <Initials name={pool.ticker || pool.name} />
        <div className={styles.cardIdentity}>
          <h3 className={styles.cardTicker}>{pool.ticker || shortAddress(pool.id)}</h3>
          {pool.name && <span className={styles.cardName}>{pool.name}</span>}
          {pool.group && (
            <span className={styles.cardGroup}>
              {translate(
                { id: "stakePoolDelegation.delegate.card.group", message: "Part of a multi-pool operator ({group})" },
                { group: pool.group }
              )}
            </span>
          )}
        </div>
      </div>

      {isCurrent && (
        <span className={styles.badge}>
          {translate({ id: "stakePoolDelegation.delegate.card.current", message: "Your current pool" })}
        </span>
      )}

      <dl className={styles.metrics}>
        <Metric
          label={translate({ id: "stakePoolDelegation.delegate.card.saturation", message: "Saturation" })}
          value={saturation == null ? "?" : `${num(saturation, 1)}%`}
        />
        <Metric
          label={translate({ id: "stakePoolDelegation.delegate.card.margin", message: "Margin" })}
          value={pool.margin == null ? "?" : `${num(pool.margin * 100, 1)}%`}
        />
        <Metric
          label={translate({ id: "stakePoolDelegation.delegate.card.fixedCost", message: "Fixed cost per epoch" })}
          value={`${formatAdaWhole(pool.fixedCost, locale)} ada`}
        />
        <Metric
          label={translate({ id: "stakePoolDelegation.delegate.card.pledge", message: "Pledge" })}
          value={`${formatAdaCompact(pool.pledge, locale)} ada`}
        />
        <Metric
          label={translate({ id: "stakePoolDelegation.delegate.card.liveStake", message: "Live stake" })}
          value={`${formatAdaCompact(pool.liveStake, locale)} ada`}
        />
        <Metric
          label={translate({ id: "stakePoolDelegation.delegate.card.delegators", message: "Delegators" })}
          value={num(pool.delegators)}
        />
        <Metric
          label={translate({ id: "stakePoolDelegation.delegate.card.blocks", message: "Lifetime blocks" })}
          value={num(pool.blocks)}
        />
      </dl>

      <div className={styles.saturationTrack} aria-hidden="true">
        <div
          className={`${styles.saturationFill} ${fillClass}`}
          style={{ width: `${Math.min(100, Math.max(0, saturation ?? 0))}%` }}
        />
      </div>

      {saturation != null && saturation >= 100 && (
        <p className={styles.hint}>
          {translate({
            id: "stakePoolDelegation.delegate.card.saturated",
            message: "Saturated: rewards for all delegators are reduced.",
          })}
        </p>
      )}
      {!pledgeMet && (
        <p className={styles.hint}>
          {translate({
            id: "stakePoolDelegation.delegate.card.pledgeNotMet",
            message: "Pledge not met: the pool earns no rewards for epochs in which its pledge is not met.",
          })}
        </p>
      )}
      {retiring && (
        <p className={styles.hint}>
          {translate(
            {
              id: "stakePoolDelegation.delegate.card.retiring",
              message: "Retiring in epoch {epoch}. New delegations to this pool are not possible here.",
            },
            { epoch: pool.retiringEpoch }
          )}
        </p>
      )}

      <div className={styles.cardLinks}>
        {pool.homepage && (
          <a href={pool.homepage} target="_blank" rel="noopener noreferrer">
            {translate({ id: "stakePoolDelegation.delegate.card.homepage", message: "Homepage" })}
          </a>
        )}
        <a href={EXPLORER_POOL_BASE + pool.id} target="_blank" rel="noopener noreferrer">
          {translate({ id: "stakePoolDelegation.delegate.card.explorer", message: "View on Cexplorer" })}
        </a>
        <span className={styles.poolId}>
          {shortAddress(pool.id)}
          <button type="button" className={styles.copyButton} onClick={copyId}>
            {copied
              ? translate({ id: "stakePoolDelegation.delegate.card.copied", message: "Copied" })
              : translate({ id: "stakePoolDelegation.delegate.card.copy", message: "Copy ID" })}
          </button>
        </span>
      </div>

      {!retired && (
        <button
          type="button"
          className={`button button--primary ${styles.cardCta}`}
          disabled={disabled || busy || isCurrent || retiring}
          onClick={() => onDelegate(pool)}
        >
          {busy
            ? translate({ id: "stakePoolDelegation.delegate.card.ctaBusy", message: "Preparing…" })
            : translate({ id: "stakePoolDelegation.delegate.card.cta", message: "Delegate" })}
        </button>
      )}
    </div>
  );
}
