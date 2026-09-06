// UI building blocks shared by the DRep and stake pool delegation tools.
// Translation ids stay under governance.delegate.* so the existing Crowdin
// strings keep working for both pages.
import React, { useEffect, useState } from "react";
import { translate } from "@docusaurus/Translate";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { detectWallets, enableWallet, firstAddressBech32 } from "@site/src/utils/cardano/wallet";
import { classifyError, EXPLORER_TX_BASE } from "@site/src/utils/walletTx";
import styles from "./styles.module.css";

// phase: detecting (scanning window.cardano) | ready | connecting (enable()
// dialog open). Buttons are disabled while connecting so a second click
// cannot open a second wallet prompt.
export function WalletPicker({ onConnect, busy, emptyMessage }) {
  const [available, setAvailable] = useState([]);
  const [phase, setPhase] = useState("detecting");
  const [pickerError, setPickerError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    detectWallets()
      .then((wallets) => {
        if (cancelled) return;
        setAvailable(wallets);
        setPhase("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setPickerError(String(err?.message || err));
        setPhase("ready");
      });
    return () => { cancelled = true; };
  }, []);

  const connect = async (walletId, displayName) => {
    if (phase === "connecting") return;
    setPhase("connecting");
    setPickerError(null);
    try {
      const instance = await enableWallet(walletId);
      const [address, networkId] = await Promise.all([
        firstAddressBech32(instance),
        instance.getNetworkId(),
      ]);
      await onConnect({ instance, name: displayName, address, networkId });
    } catch (err) {
      if (classifyError(err) !== "userCancelled") {
        setPickerError(String(err?.message || err));
      }
    } finally {
      setPhase("ready");
    }
  };

  if (phase === "detecting") {
    return (
      <p className={styles.walletDetecting} role="status">
        {translate({ id: "governance.delegate.wallet.detecting", message: "Looking for Cardano wallets…" })}
      </p>
    );
  }

  if (!available.length) {
    return (
      <p className={styles.walletEmpty}>
        {emptyMessage || translate({
          id: "governance.delegate.wallet.empty",
          message: "No Cardano wallet detected. Install Eternl, Typhon, Begin or another CIP-30 wallet to continue.",
        })}
      </p>
    );
  }

  return (
    <div>
      <div className={styles.walletPicker}>
        {available.map((w) => {
          const id = w?.id || w?.name;
          const name = w?.name || String(w);
          const icon = w?.icon;
          return (
            <button
              key={id}
              type="button"
              disabled={busy || phase === "connecting"}
              onClick={() => connect(id, name)}
              className={styles.walletButton}
            >
              {icon && <img src={icon} alt="" className={styles.walletIcon} />}
              <span>{name}</span>
            </button>
          );
        })}
      </div>
      {phase === "connecting" && (
        <p className={styles.walletDetecting} role="status">
          {translate({ id: "governance.delegate.wallet.connecting", message: "Waiting for your wallet…" })}
        </p>
      )}
      {pickerError && (
        <p className={styles.walletError} role="alert">
          {translate(
            { id: "governance.delegate.wallet.error", message: "Wallet error: {error}" },
            { error: pickerError }
          )}
        </p>
      )}
    </div>
  );
}

export function NetworkWarning() {
  return (
    <div className={`${styles.banner} ${styles.bannerWarning}`} role="alert">
      {translate({
        id: "governance.delegate.networkWarning",
        message: "Your wallet is on the wrong network. Switch to Mainnet to delegate.",
      })}
    </div>
  );
}

// state.message is already translated by the caller, the banner only picks
// the tone and, on success, appends the explorer link.
export function TxBanner({ state }) {
  if (state.status === "building") {
    return <div className={`${styles.banner} ${styles.bannerInfo}`} role="status">{state.message}</div>;
  }
  if (state.status === "success") {
    return (
      <div className={`${styles.banner} ${styles.bannerSuccess}`} role="status">
        <p style={{ margin: 0 }}>{state.message}</p>
        <a href={EXPLORER_TX_BASE + state.txHash} target="_blank" rel="noopener noreferrer">
          {translate({ id: "governance.delegate.tx.viewOnExplorer", message: "View on explorer" })}
        </a>
      </div>
    );
  }
  if (state.status === "error") {
    return <div className={`${styles.banner} ${styles.bannerError}`} role="alert">{state.message}</div>;
  }
  return null;
}

export function Initials({ name }) {
  const text = (name || "?").split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  return <div className={styles.initials} aria-hidden="true">{text}</div>;
}

// Self-hosted snapshot image (DRep avatar, pool logo) with the Initials
// fallback. `ids` is the Set from the snapshot manifest, `path` the site
// relative image path. A file missing at runtime falls back as well.
export function SnapshotImage({ ids, id, path, name, className }) {
  const [imgError, setImgError] = useState(false);
  const src = useBaseUrl(path);
  if (!ids.has(id) || imgError) return <Initials name={name} />;
  return <img src={src} alt="" className={className} width="48" height="48" loading="lazy" onError={() => setImgError(true)} />;
}

export function SearchRow({ value, onChange, placeholder, label }) {
  return (
    <div className={styles.searchRow}>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.searchInput}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        aria-label={label}
      />
      {value && (
        <button type="button" className={styles.searchClear} onClick={() => onChange("")}>
          {translate({ id: "governance.delegate.search.clear", message: "Clear" })}
        </button>
      )}
    </div>
  );
}
