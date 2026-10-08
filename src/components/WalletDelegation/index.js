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
/**
 * Lists the detected CIP-30 wallets and connects the one the user picks.
 *
 * @param {object} props
 * @param {Function} props.onConnect Called with `{ instance, name, address, networkId }` after a wallet is enabled.
 * @param {boolean} [props.busy] Disables the wallet buttons, e.g. while a transaction runs.
 * @param {string} [props.emptyMessage] Text shown when no wallet is found. Falls back to a default hint.
 */
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

/**
 * Warning banner for a wallet connected to the wrong network.
 */
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

/**
 * Status banner for a delegation transaction.
 *
 * @param {object} props
 * @param {object} props.state Transaction state with `status` ("building", "success", "error"), a translated `message` and `txHash` on success.
 */
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

/**
 * Placeholder avatar with up to two initials of a name.
 *
 * @param {object} props
 * @param {string} [props.name] Name to take the initials from. Shows "?" when empty.
 */
export function Initials({ name }) {
  const text = (name || "?").split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  return <div className={styles.initials} aria-hidden="true">{text}</div>;
}

/**
 * Self-hosted snapshot image (DRep avatar, pool logo) with the Initials fallback. A file missing at runtime falls back as well.
 *
 * @param {object} props
 * @param {Set<string>} props.ids Ids from the snapshot manifest that have an image.
 * @param {string} props.id Id to look up in `ids`.
 * @param {string} props.path Site relative image path.
 * @param {string} [props.name] Name for the Initials fallback.
 * @param {string} [props.className] Class on the image.
 */
export function SnapshotImage({ ids, id, path, name, className }) {
  const [imgError, setImgError] = useState(false);
  const src = useBaseUrl(path);
  if (!ids.has(id) || imgError) return <Initials name={name} />;
  return <img src={src} alt="" className={className} width="48" height="48" loading="lazy" onError={() => setImgError(true)} />;
}

/**
 * Search input with a clear button.
 *
 * @param {object} props
 * @param {string} props.value Current search text.
 * @param {Function} props.onChange Called with the new text.
 * @param {string} [props.placeholder] Placeholder of the input.
 * @param {string} [props.label] Accessible label of the input.
 */
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
