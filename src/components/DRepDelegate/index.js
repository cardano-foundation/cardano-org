import React, { useEffect, useRef, useState, useCallback } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { translate } from "@docusaurus/Translate";
import { BrowserWallet } from "@meshsdk/wallet";
import { MeshTxBuilder } from "@meshsdk/transaction";
import { KoiosProvider } from "@meshsdk/provider";
import { makeApiClient } from "@site/src/utils/insights/api";
import styles from "./styles.module.css";

const VP_MIN_LOVELACE = 1_000_000_000_000;   // 1M ada
const VP_MAX_LOVELACE = 50_000_000_000_000;  // 50M ada
const DISPLAY_COUNT = 5;
const BATCH_SIZE = 50;
const EXPECTED_NETWORK_ID = 1; // mainnet
const EXPLORER_TX_BASE = "https://cardanoscan.io/transaction/";

function fisherYates(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function formatVotingPower(lovelace) {
  const ada = Number(lovelace) / 1_000_000;
  if (ada >= 1_000_000) return `${(ada / 1_000_000).toFixed(2)}M ada`;
  if (ada >= 1_000) return `${(ada / 1_000).toFixed(0)}k ada`;
  return `${Math.round(ada).toLocaleString()} ada`;
}

// CIP-119 has `body.givenName`, but many DReps still use legacy `name`.
// Try both, plus a few common alternates seen in the wild.
function extractName(meta) {
  return (
    meta?.body?.givenName ||
    meta?.body?.name ||
    meta?.name ||
    null
  );
}

function extractImage(meta) {
  return (
    meta?.body?.image?.contentUrl ||
    meta?.body?.image ||
    meta?.image?.contentUrl ||
    meta?.image ||
    null
  );
}

function extractBio(meta) {
  const candidate =
    meta?.body?.motivations ||
    meta?.body?.objectives ||
    meta?.body?.qualifications ||
    meta?.motivation ||
    meta?.bio ||
    "";
  if (typeof candidate !== "string") return "";
  return candidate.length > 180 ? candidate.slice(0, 177) + "…" : candidate;
}

function isValidDRepId(input) {
  if (!input || typeof input !== "string") return false;
  const t = input.trim();
  if (/^drep(_script)?1[a-z0-9]{40,}$/i.test(t)) return true;
  if (/^[0-9a-f]{56,64}$/i.test(t)) return true;
  return false;
}

function shortAddress(addr) {
  if (!addr) return "";
  return `${addr.slice(0, 12)}…${addr.slice(-8)}`;
}

function classifyError(err) {
  const msg = String(err?.message || err || "");
  if (/StakeKeyNotRegistered|StakeNotRegistered/i.test(msg)) return "stakeNotRegistered";
  if (/declined|rejected|cancel/i.test(msg)) return "userCancelled";
  return "generic";
}

function WalletPicker({ onConnect, busy }) {
  const [available, setAvailable] = useState([]);
  const [pickerError, setPickerError] = useState(null);

  useEffect(() => {
    try {
      setAvailable(BrowserWallet.getInstalledWallets() || []);
    } catch (err) {
      setPickerError(String(err?.message || err));
    }
  }, []);

  const connect = async (walletName) => {
    try {
      const instance = await BrowserWallet.enable(walletName);
      const [addresses, networkId] = await Promise.all([
        instance.getUsedAddresses(),
        instance.getNetworkId(),
      ]);
      onConnect({
        instance,
        name: walletName,
        address: addresses?.[0] || null,
        networkId,
      });
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
          { id: "governance.delegate.wallet.error", message: "Wallet error: {error}" },
          { error: pickerError }
        )}
      </p>
    );
  }

  if (!available.length) {
    return (
      <p className={styles.walletEmpty}>
        {translate({
          id: "governance.delegate.wallet.empty",
          message: "No Cardano wallet detected. Install Eternl, Lace, Nami, Yoroi or another CIP-30 wallet to continue.",
        })}
      </p>
    );
  }

  return (
    <div className={styles.walletPicker}>
      {available.map((w) => {
        const name = w?.name || String(w);
        const icon = w?.icon;
        return (
          <button
            key={name}
            type="button"
            disabled={busy}
            onClick={() => connect(name)}
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
            { id: "governance.delegate.wallet.connected", message: "Connected: {name} · {addr}" },
            { name: wallet.name, addr: shortAddress(wallet.address) }
          )}
        </span>
      </div>
      <button type="button" onClick={onDisconnect} className={styles.disconnectButton}>
        {translate({ id: "governance.delegate.wallet.disconnect", message: "Disconnect" })}
      </button>
    </div>
  );
}

function NetworkWarning() {
  return (
    <div className={styles.banner + " " + styles.bannerWarning}>
      {translate({
        id: "governance.delegate.networkWarning",
        message: "Your wallet is on the wrong network. Switch to Mainnet to delegate.",
      })}
    </div>
  );
}

function TxBanner({ state }) {
  if (state.status === "building") {
    return (
      <div className={`${styles.banner} ${styles.bannerInfo}`}>
        {translate(
          { id: "governance.delegate.tx.building", message: "Preparing delegation to {target}. Please confirm in your wallet…" },
          { target: state.target }
        )}
      </div>
    );
  }
  if (state.status === "success") {
    return (
      <div className={`${styles.banner} ${styles.bannerSuccess}`}>
        <p style={{ margin: 0 }}>
          {translate(
            { id: "governance.delegate.tx.success", message: "Delegation submitted to {target}." },
            { target: state.target }
          )}
        </p>
        <a href={EXPLORER_TX_BASE + state.txHash} target="_blank" rel="noopener noreferrer">
          {translate({ id: "governance.delegate.tx.viewOnExplorer", message: "View on Cardanoscan" })}
        </a>
      </div>
    );
  }
  if (state.status === "error") {
    return (
      <div className={`${styles.banner} ${styles.bannerError}`}>
        {state.message}
      </div>
    );
  }
  return null;
}

function Initials({ name }) {
  const text = (name || "?")
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return <div className={styles.initials} aria-hidden="true">{text}</div>;
}

function DRepCard({ drep, onSelect, disabled }) {
  const [imgError, setImgError] = useState(false);
  const showImage = drep.image && !imgError;
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        {showImage ? (
          <img
            src={drep.image}
            alt=""
            className={styles.avatar}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <Initials name={drep.name} />
        )}
        <div className={styles.cardIdentity}>
          <h3 className={styles.cardName}>{drep.name}</h3>
          <span className={styles.cardVp}>{formatVotingPower(drep.votingPower)}</span>
        </div>
      </div>
      {drep.bio && <p className={styles.cardBio}>{drep.bio}</p>}
      <button
        type="button"
        className={`button button--primary ${styles.cardCta}`}
        disabled={disabled}
        onClick={() => onSelect({ dRepId: drep.drepId }, drep.name)}
      >
        {translate(
          { id: "governance.delegate.card.cta", message: "Delegate to {name}" },
          { name: drep.name }
        )}
      </button>
    </div>
  );
}

function CustomDelegateRow({ onSelect, disabled }) {
  const [value, setValue] = useState("");
  const trimmed = value.trim();
  const valid = isValidDRepId(trimmed);
  return (
    <div className={styles.customRow}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={translate({
          id: "governance.delegate.custom.placeholder",
          message: "drep1… or hex DRep ID",
        })}
        className={styles.customInput}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        aria-label={translate({
          id: "governance.delegate.custom.label",
          message: "Custom DRep ID",
        })}
      />
      <button
        type="button"
        className="button button--primary"
        disabled={!valid || disabled}
        onClick={() => onSelect({ dRepId: trimmed }, trimmed)}
      >
        {translate({ id: "governance.delegate.custom.cta", message: "Delegate" })}
      </button>
    </div>
  );
}

function SpecialOption({ label, help, onSelect, target, disabled }) {
  return (
    <div className={styles.specialOption}>
      <button
        type="button"
        className={`button button--outline button--secondary ${styles.specialButton}`}
        disabled={disabled}
        onClick={() => onSelect(target, label)}
      >
        {label}
      </button>
      <p className={styles.specialHelp}>{help}</p>
    </div>
  );
}

export default function DRepDelegate() {
  const { siteConfig: { customFields } } = useDocusaurusContext();
  const API_URL = customFields.CARDANO_ORG_API_URL;
  const apiRef = useRef(null);
  if (!apiRef.current && API_URL) apiRef.current = makeApiClient(API_URL);

  const [pool, setPool] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [tx, setTx] = useState({ status: "idle" });

  useEffect(() => {
    if (!API_URL) return;
    const api = apiRef.current;
    if (!api) return;

    let cancelled = false;

    async function fetchDReps() {
      try {
        const listRes = await api.get("/drep_list?select=drep_id&registered=eq.true");
        const ids = (listRes.data || []).map((r) => r.drep_id).filter(Boolean);
        if (!ids.length) throw new Error("No DReps returned by /drep_list");

        const infoResults = await Promise.all(
          chunk(ids, BATCH_SIZE).map((b) =>
            api.post("/drep_info", { _drep_ids: b })
          )
        );
        const infos = infoResults.flatMap((r) => r.data || []);

        const inRange = infos.filter((i) => {
          if (!i.active) return false;
          if (!i.meta_url) return false;
          const vp = Number(i.amount || 0);
          return vp >= VP_MIN_LOVELACE && vp <= VP_MAX_LOVELACE;
        });

        if (!inRange.length) {
          if (!cancelled) {
            setPool([]);
            setDisplayed([]);
            setLoading(false);
          }
          return;
        }

        const metaResults = await Promise.all(
          chunk(inRange.map((i) => i.drep_id), BATCH_SIZE).map((b) =>
            api.post("/drep_metadata", { _drep_ids: b })
          )
        );
        const metaById = new Map();
        for (const r of metaResults) {
          for (const m of r.data || []) {
            if (m.meta_json) metaById.set(m.drep_id, m.meta_json);
          }
        }

        const enriched = inRange
          .map((i) => {
            const meta = metaById.get(i.drep_id);
            if (!meta) return null;
            const name = extractName(meta);
            if (!name) return null;
            return {
              drepId: i.drep_id,
              votingPower: i.amount,
              name,
              image: extractImage(meta),
              bio: extractBio(meta),
            };
          })
          .filter(Boolean);

        if (cancelled) return;
        setPool(enriched);
        setDisplayed(fisherYates(enriched).slice(0, DISPLAY_COUNT));
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        console.error("DRepDelegate: failed to fetch DReps", err);
        setError(true);
        setLoading(false);
      }
    }

    fetchDReps();
    return () => { cancelled = true; };
  }, [API_URL]);

  const reshuffle = useCallback(() => {
    setDisplayed(fisherYates(pool).slice(0, DISPLAY_COUNT));
  }, [pool]);

  const wrongNetwork = wallet && wallet.networkId !== EXPECTED_NETWORK_ID;
  const txBusy = tx.status === "building";
  const canDelegate = !!wallet && !wrongNetwork && !txBusy;

  const handleDisconnect = useCallback(() => {
    setWallet(null);
    setTx({ status: "idle" });
  }, []);

  const handleSelect = useCallback(async (target, displayName) => {
    if (!wallet || wrongNetwork || txBusy) return;
    setTx({ status: "building", target: displayName });
    try {
      const provider = new KoiosProvider(API_URL);
      const [utxos, changeAddress, rewardAddrs] = await Promise.all([
        wallet.instance.getUtxos(),
        wallet.instance.getChangeAddress(),
        wallet.instance.getRewardAddresses(),
      ]);
      if (!rewardAddrs?.length) {
        throw new Error("Wallet did not return a reward address.");
      }
      const txBuilder = new MeshTxBuilder({
        fetcher: provider,
        submitter: provider,
        verbose: false,
      });
      const unsignedTx = await txBuilder
        .voteDelegationCertificate(target, rewardAddrs[0])
        .changeAddress(changeAddress)
        .selectUtxosFrom(utxos)
        .complete();
      const signedTx = await wallet.instance.signTx(unsignedTx, true);
      const txHash = await wallet.instance.submitTx(signedTx);
      setTx({ status: "success", txHash, target: displayName });
    } catch (err) {
      const kind = classifyError(err);
      if (kind === "userCancelled") {
        setTx({ status: "idle" });
        return;
      }
      const message = kind === "stakeNotRegistered"
        ? translate({
            id: "governance.delegate.error.stakeNotRegistered",
            message: "Your stake key isn't registered yet. Delegate to any stake pool once to register it, then come back to delegate your vote.",
          })
        : translate(
            { id: "governance.delegate.error.generic", message: "Delegation failed: {error}" },
            { error: String(err?.message || err) }
          );
      setTx({ status: "error", message });
    }
  }, [wallet, wrongNetwork, txBusy, API_URL]);

  if (!API_URL) return null;

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.statusLine}>
          {translate({ id: "governance.delegate.loadingDReps", message: "Loading active DReps…" })}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.statusLine}>
          {translate({
            id: "governance.delegate.error.fetch",
            message: "Could not load DReps right now. Please refresh in a moment.",
          })}
        </div>
      </div>
    );
  }

  if (!displayed.length) {
    return (
      <div className={styles.container}>
        <div className={styles.statusLine}>
          {translate({
            id: "governance.delegate.noResults",
            message: "No DReps in the curated range right now. Try one of the alternative tools below.",
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.walletSection}>
        {wallet ? (
          <WalletStatus wallet={wallet} onDisconnect={handleDisconnect} />
        ) : (
          <>
            <h3 className={styles.sectionHeading}>
              {translate({ id: "governance.delegate.wallet.heading", message: "Connect a wallet to delegate" })}
            </h3>
            <WalletPicker onConnect={setWallet} busy={txBusy} />
          </>
        )}
        {wrongNetwork && <NetworkWarning />}
      </div>

      <TxBanner state={tx} />

      <div className={styles.poolHeader}>
        <p className={styles.poolIntro}>
          {translate(
            {
              id: "governance.delegate.poolIntro",
              message: "{count} active DReps with mid-tier voting power. Refresh for a different selection.",
            },
            { count: pool.length }
          )}
        </p>
        <button
          type="button"
          className={`button button--secondary ${styles.shuffleButton}`}
          onClick={reshuffle}
        >
          {translate({ id: "governance.delegate.shuffle", message: "Shuffle DReps" })}
        </button>
      </div>
      <div className={styles.cardGrid}>
        {displayed.map((drep) => (
          <DRepCard
            key={drep.drepId}
            drep={drep}
            onSelect={handleSelect}
            disabled={!canDelegate}
          />
        ))}
      </div>

      <div className={styles.customSection}>
        <h3 className={styles.sectionHeading}>
          {translate({
            id: "governance.delegate.custom.heading",
            message: "Already know your DRep?",
          })}
        </h3>
        <CustomDelegateRow onSelect={handleSelect} disabled={!canDelegate} />
      </div>

      <div className={styles.specialSection}>
        <h3 className={styles.sectionHeading}>
          {translate({
            id: "governance.delegate.special.heading",
            message: "Or pick a protocol option",
          })}
        </h3>
        <div className={styles.specialGrid}>
          <SpecialOption
            label={translate({ id: "governance.delegate.abstain.label", message: "Abstain" })}
            help={translate({
              id: "governance.delegate.abstain.help",
              message: "Always abstain. Your stake counts toward turnout but never picks a side on any proposal.",
            })}
            target={{ alwaysAbstain: null }}
            onSelect={handleSelect}
            disabled={!canDelegate}
          />
          <SpecialOption
            label={translate({ id: "governance.delegate.noConfidence.label", message: "No Confidence" })}
            help={translate({
              id: "governance.delegate.noConfidence.help",
              message: "Always vote no confidence in the current Constitutional Committee.",
            })}
            target={{ alwaysNoConfidence: null }}
            onSelect={handleSelect}
            disabled={!canDelegate}
          />
        </div>
      </div>
    </div>
  );
}
