import React, { useEffect, useState, useCallback } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { translate } from "@docusaurus/Translate";
import { makeApiClient } from "@site/src/utils/insights/api";
import {
  detectWallets,
  enableWallet,
  firstAddressBech32,
  donateToTreasury,
} from "@site/src/utils/cardano/wallet";
import styles from "./styles.module.css";

const EXPECTED_NETWORK_ID = 1; // mainnet
const EXPLORER_TX_BASE = "https://explorer.cardano.org/transaction/";
const DEFAULT_AMOUNT_ADA = "10";
const LOVELACE_PER_ADA = 1_000_000n;

// Parse a user-entered ADA string into lovelace, or null if it isn't a
// well-formed positive decimal with at most 6 fractional digits.
function parseAdaToLovelace(value) {
  const trimmed = value.trim();
  if (!/^\d+(\.\d{1,6})?$/.test(trimmed)) return null;
  const [whole, fractional = ""] = trimmed.split(".");
  const paddedFraction = `${fractional}000000`.slice(0, 6);
  const lovelace = BigInt(whole) * LOVELACE_PER_ADA + BigInt(paddedFraction);
  return lovelace > 0n ? lovelace : null;
}

function formatAda(lovelace) {
  const ada = Number(lovelace) / 1_000_000;
  if (ada >= 1_000_000_000) return `${(ada / 1_000_000_000).toFixed(2)}B ada`;
  if (ada >= 1_000_000) return `${(ada / 1_000_000).toFixed(2)}M ada`;
  return `${Math.round(ada).toLocaleString()} ada`;
}

function shortAddress(addr) {
  if (!addr) return "";
  return `${addr.slice(0, 12)}…${addr.slice(-8)}`;
}

function stringifyError(err) {
  if (!err) return "";
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message || err.toString();
  const parts = [];
  if (err.message) parts.push(String(err.message));
  if (err.info) parts.push(String(err.info));
  if (err.code != null) parts.push(`code=${err.code}`);
  if (!parts.length) {
    try { return JSON.stringify(err); } catch { return String(err); }
  }
  return parts.join(" · ");
}

function classifyError(err) {
  const msg = stringifyError(err);
  // CIP-30 signTx throws code 2 for UserDeclined; only treat as a cancel when
  // the message corroborates it so we don't swallow genuine failures.
  if (/user\s*(declined|rejected|cancel)|declined\s*by\s*user|rejected\s*by\s*user/i.test(msg)) {
    return "userCancelled";
  }
  return "generic";
}

// Read the current treasury balance from Koios; /totals lists the current epoch first.
async function fetchLatestTreasury(api) {
  const res = await api.get("/totals?limit=1");
  const value = res.data?.[0]?.treasury;
  return value ? BigInt(value) : null;
}

function WalletPicker({ onConnect, busy }) {
  const [available, setAvailable] = useState([]);
  const [pickerError, setPickerError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    detectWallets()
      .then((wallets) => {
        if (!cancelled) setAvailable(wallets);
      })
      .catch((err) => {
        if (!cancelled) setPickerError(String(err?.message || err));
      });
    return () => { cancelled = true; };
  }, []);

  const connect = async (walletId, displayName) => {
    try {
      const instance = await enableWallet(walletId);
      const [address, networkId] = await Promise.all([
        firstAddressBech32(instance),
        instance.getNetworkId(),
      ]);
      onConnect({ instance, name: displayName, address, networkId });
    } catch (err) {
      if (classifyError(err) !== "userCancelled") {
        setPickerError(String(err?.message || err));
      }
    }
  };

  if (pickerError) {
    return (
      <p className={styles.walletError}>
        {translate(
          { id: "governance.treasury.wallet.error", message: "Wallet error: {error}" },
          { error: pickerError }
        )}
      </p>
    );
  }

  if (!available.length) {
    return (
      <p className={styles.walletEmpty}>
        {translate({
          id: "governance.treasury.wallet.empty",
          message: "No Cardano wallet detected. Install Eternl, Typhon, Begin or another CIP-30 wallet to continue.",
        })}
      </p>
    );
  }

  return (
    <div className={styles.walletPicker}>
      {available.map((w) => {
        const id = w?.id || w?.name;
        const name = w?.name || String(w);
        const icon = w?.icon;
        return (
          <button
            key={id}
            type="button"
            disabled={busy}
            onClick={() => connect(id, name)}
            className={styles.walletButton}
          >
            {icon && <img src={icon} alt="" className={styles.walletIcon} />}
            <span>{name}</span>
          </button>
        );
      })}
    </div>
  );
}

function WalletStatus({ wallet, onDisconnect }) {
  const wrongNetwork = wallet.networkId !== EXPECTED_NETWORK_ID;
  return (
    <div className={`${styles.walletStatus} ${wrongNetwork ? styles.walletStatusWarning : ""}`}>
      <div className={styles.walletStatusLeft}>
        <span className={styles.walletDot} aria-hidden="true" />
        <span>
          {translate(
            { id: "governance.treasury.wallet.connected", message: "Connected: {name} · {addr}" },
            { name: wallet.name, addr: shortAddress(wallet.address) }
          )}
        </span>
      </div>
      <button type="button" onClick={onDisconnect} className={styles.disconnectButton}>
        {translate({ id: "governance.treasury.wallet.disconnect", message: "Disconnect" })}
      </button>
    </div>
  );
}

function NetworkWarning() {
  return (
    <div className={`${styles.banner} ${styles.bannerWarning}`} role="alert">
      {translate({
        id: "governance.treasury.networkWarning",
        message: "Your wallet is on the wrong network. Switch to Mainnet to donate.",
      })}
    </div>
  );
}

function TxBanner({ state }) {
  if (state.status === "building") {
    return (
      <div className={`${styles.banner} ${styles.bannerInfo}`} role="status">
        {translate({
          id: "governance.treasury.tx.building",
          message: "Building the treasury donation. Please confirm in your wallet…",
        })}
      </div>
    );
  }
  if (state.status === "success") {
    return (
      <div className={`${styles.banner} ${styles.bannerSuccess}`} role="status">
        <p style={{ margin: 0 }}>
          {translate(
            { id: "governance.treasury.tx.success", message: "Donation of {amount} submitted to the treasury." },
            { amount: state.amount }
          )}
        </p>
        <a href={EXPLORER_TX_BASE + state.txHash} target="_blank" rel="noopener noreferrer">
          {translate({ id: "governance.treasury.tx.viewOnExplorer", message: "View on explorer" })}
        </a>
      </div>
    );
  }
  if (state.status === "error") {
    return (
      <div className={`${styles.banner} ${styles.bannerError}`} role="alert">
        {state.message}
      </div>
    );
  }
  return null;
}

export default function TreasuryDonate() {
  const { siteConfig: { customFields } } = useDocusaurusContext();
  const API_URL = customFields.CARDANO_ORG_API_URL;
  const [apiClient] = useState(() => (API_URL ? makeApiClient(API_URL) : null));

  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState(DEFAULT_AMOUNT_ADA);
  const [treasury, setTreasury] = useState(undefined); // undefined = loading, null = unavailable
  const [tx, setTx] = useState({ status: "idle" });

  // Pull the current treasury balance for context. It's also reused as
  // currentTreasuryValue when building the tx, but the donate button does NOT
  // wait on this fetch; handleDonate fetches on demand if it isn't ready yet.
  useEffect(() => {
    if (!apiClient) return;
    let cancelled = false;
    fetchLatestTreasury(apiClient)
      .then((value) => { if (!cancelled) setTreasury(value); })
      .catch((err) => {
        if (cancelled) return;
        console.error("TreasuryDonate: failed to load treasury totals", err);
        setTreasury(null);
      });
    return () => { cancelled = true; };
  }, [apiClient]);

  const wrongNetwork = wallet && wallet.networkId !== EXPECTED_NETWORK_ID;
  const txBusy = tx.status === "building";
  const parsedAmount = parseAdaToLovelace(amount);
  const amountValid = parsedAmount !== null;
  const canDonate = !!wallet && !wrongNetwork && !txBusy && amountValid;

  // Explain why the button is disabled, so it never looks mysteriously greyed out.
  const disabledReason = !wallet
    ? translate({ id: "governance.treasury.disabled.wallet", message: "Connect a wallet above to donate." })
    : wrongNetwork
      ? translate({ id: "governance.treasury.disabled.network", message: "Switch your wallet to Mainnet to donate." })
      : !amountValid
        ? translate({ id: "governance.treasury.disabled.amount", message: "Enter a positive ADA amount (up to 6 decimal places)." })
        : null;

  const handleDisconnect = useCallback(() => {
    setWallet(null);
    setTx({ status: "idle" });
  }, []);

  const handleDonate = useCallback(async () => {
    if (!wallet || wrongNetwork || txBusy) return;
    const lovelace = parseAdaToLovelace(amount);
    if (lovelace === null) {
      setTx({
        status: "error",
        message: translate({
          id: "governance.treasury.error.amount",
          message: "Enter a positive ADA amount (up to 6 decimal places).",
        }),
      });
      return;
    }

    setTx({ status: "building" });
    try {
      // Re-check the network live in case the user switched it after connecting.
      const liveNetworkId = await wallet.instance.getNetworkId();
      if (liveNetworkId !== EXPECTED_NETWORK_ID) {
        throw new Error(translate({
          id: "governance.treasury.error.wrongNetwork",
          message: "Wallet is on the wrong network. Switch to Mainnet and try again.",
        }));
      }
      // The background fetch usually has this already; fetch on demand otherwise
      // so a slow or failed background load never blocks the donation.
      let currentTreasury = treasury;
      if (currentTreasury == null) {
        currentTreasury = await fetchLatestTreasury(apiClient);
        if (currentTreasury != null) setTreasury(currentTreasury);
      }
      if (currentTreasury == null) {
        throw new Error(translate({
          id: "governance.treasury.error.treasury",
          message: "Could not read the current treasury value. Please try again in a moment.",
        }));
      }
      const txHash = await donateToTreasury({
        api: wallet.instance,
        amountLovelace: lovelace,
        currentTreasuryValue: currentTreasury,
        koiosUrl: API_URL,
      });
      setTx({ status: "success", txHash, amount: formatAda(lovelace) });
    } catch (err) {
      if (classifyError(err) === "userCancelled") {
        setTx({ status: "idle" });
        return;
      }
      console.error("TreasuryDonate: donation failed", err);
      setTx({
        status: "error",
        message: translate(
          { id: "governance.treasury.error.generic", message: "Donation failed: {error}" },
          { error: stringifyError(err) }
        ),
      });
    }
  }, [wallet, wrongNetwork, txBusy, amount, treasury, API_URL, apiClient]);

  if (!API_URL) return null;

  return (
    <div className={styles.container}>
      <div className={styles.intro}>
        <p className={styles.introCopy}>
          {translate({
            id: "governance.treasury.intro",
            message: "This builds a real Conway treasury donation, not a payment to an address. Your wallet selects the inputs, signs the transaction, and submits it. The ada leaves your wallet and is added directly to the Cardano treasury.",
          })}
        </p>
        <div className={styles.treasuryFact}>
          <span className={styles.factLabel}>
            {translate({ id: "governance.treasury.balanceLabel", message: "Current treasury balance" })}
          </span>
          <span className={styles.factValue}>
            {treasury === undefined
              ? translate({ id: "governance.treasury.balanceLoading", message: "Loading…" })
              : treasury === null
                ? translate({ id: "governance.treasury.balanceUnavailable", message: "Unavailable" })
                : formatAda(treasury)}
          </span>
        </div>
      </div>

      <div className={styles.walletSection}>
        {wallet ? (
          <WalletStatus wallet={wallet} onDisconnect={handleDisconnect} />
        ) : (
          <>
            <h3 className={styles.sectionHeading}>
              {translate({ id: "governance.treasury.wallet.heading", message: "Connect a wallet to donate" })}
            </h3>
            <WalletPicker onConnect={setWallet} busy={txBusy} />
          </>
        )}
        {wrongNetwork && <NetworkWarning />}
      </div>

      <TxBanner state={tx} />

      <div className={styles.donateSection}>
        <h3 className={styles.sectionHeading}>
          {translate({ id: "governance.treasury.amount.heading", message: "Donation amount" })}
        </h3>
        <div className={styles.donateRow}>
          <div className={styles.amountField}>
            <input
              type="number"
              min="1"
              step="0.1"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={styles.amountInput}
              aria-label={translate({
                id: "governance.treasury.amount.label",
                message: "Donation amount in ADA",
              })}
            />
            <span className={styles.amountUnit}>ADA</span>
          </div>
          <button
            type="button"
            className="button button--primary"
            disabled={!canDonate}
            onClick={handleDonate}
            aria-describedby={
              !canDonate && !txBusy && disabledReason ? "treasury-donate-hint" : undefined
            }
          >
            {txBusy
              ? translate({ id: "governance.treasury.amount.ctaBusy", message: "Building…" })
              : translate({ id: "governance.treasury.amount.cta", message: "Donate to treasury" })}
          </button>
        </div>
        {!canDonate && !txBusy && disabledReason && (
          <p className={styles.donateHint} id="treasury-donate-hint">{disabledReason}</p>
        )}
        <p className={styles.footnote}>
          {translate({
            id: "governance.treasury.footnote",
            message: "Treasury donations are irreversible and must be submitted in the same epoch they are built.",
          })}
        </p>
      </div>
    </div>
  );
}
