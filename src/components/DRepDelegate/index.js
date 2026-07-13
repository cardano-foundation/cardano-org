import React, { useEffect, useState, useCallback } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { translate } from "@docusaurus/Translate";
import { makeApiClient } from "@site/src/utils/insights/api";
import {
  detectWallets,
  enableWallet,
  firstAddressBech32,
  firstRewardAddressBech32,
  delegateVote,
} from "@site/src/utils/cardano/wallet";
import drepAvatarsManifest from "@site/src/data/drep-avatars.json";
import styles from "./styles.module.css";

const AVATAR_SET = new Set(drepAvatarsManifest.ids);

const VP_MIN_LOVELACE = 1_000_000_000_000;   // 1M ada
const VP_MAX_LOVELACE = 50_000_000_000_000;  // 50M ada
const DISPLAY_COUNT = 8;
// data.cardano.org proxy caps POST bodies at 5120 bytes — ~80 drep_ids max per batch.
const BATCH_SIZE = 50;
const EXPECTED_NETWORK_ID = 1; // mainnet
const EXPLORER_TX_BASE = "https://explorer.cardano.org/transaction/";
const POOL_CACHE_KEY = "cardano-org.drep-pool.v2";
const POOL_CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

function readPoolCache() {
  try {
    const raw = sessionStorage.getItem(POOL_CACHE_KEY);
    if (!raw) return null;
    const { ts, pool } = JSON.parse(raw);
    if (Date.now() - ts > POOL_CACHE_TTL_MS) return null;
    return Array.isArray(pool) ? pool : null;
  } catch {
    return null;
  }
}

function writePoolCache(pool) {
  try {
    sessionStorage.setItem(POOL_CACHE_KEY, JSON.stringify({ ts: Date.now(), pool }));
  } catch {
    // Quota exceeded or storage disabled — cache is best-effort.
  }
}

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

async function fetchAllDRepIds(api) {
  const PAGE_SIZE = 600;
  const ids = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const page = await api.get(
      `/drep_list?registered=eq.true&limit=${PAGE_SIZE}&offset=${offset}`
    );
    const rows = page.data || [];
    for (const r of rows) if (r.drep_id) ids.push(r.drep_id);
    if (rows.length < PAGE_SIZE) break;
  }
  return ids;
}

function formatVotingPower(lovelace) {
  const ada = Number(lovelace) / 1_000_000;
  if (ada >= 1_000_000) return `${(ada / 1_000_000).toFixed(2)}M ada`;
  if (ada >= 1_000) return `${(ada / 1_000).toFixed(0)}k ada`;
  return `${Math.round(ada).toLocaleString()} ada`;
}

// CIP-119 metadata is JSON-LD: string values may be wrapped as `{"@value": "..."}`.
function asString(v) {
  if (v == null) return null;
  if (typeof v === "string") return v;
  if (typeof v === "object" && typeof v["@value"] === "string") return v["@value"];
  return null;
}

function extractName(meta) {
  return (
    asString(meta?.body?.givenName) ||
    asString(meta?.body?.name) ||
    asString(meta?.name) ||
    null
  );
}

function extractBio(meta) {
  const candidate =
    asString(meta?.body?.motivations) ||
    asString(meta?.body?.objectives) ||
    asString(meta?.body?.qualifications) ||
    asString(meta?.motivation) ||
    asString(meta?.bio) ||
    "";
  return candidate.length > 180 ? candidate.slice(0, 177) + "…" : candidate;
}

function isValidDRepId(input) {
  if (!input || typeof input !== "string") return false;
  const t = input.trim();
  if (/^drep(_script)?1[a-z0-9]{40,}$/.test(t)) return true;
  if (/^[0-9a-f]{56,64}$/i.test(t)) return true;
  return false;
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
  if (/StakeKeyNotRegistered|StakeNotRegistered/i.test(msg)) return "stakeNotRegistered";
  // CIP-30 signTx throws code 2 for UserDeclined; submitTx code 2 means Failure.
  // Only classify as cancel when the message corroborates it.
  if (/user\s*(declined|rejected|cancel)|declined\s*by\s*user|rejected\s*by\s*user/i.test(msg)) {
    return "userCancelled";
  }
  return "generic";
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
      onConnect({
        instance,
        name: displayName,
        address,
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

function formatDelegationLabel(delegation) {
  if (delegation === undefined) {
    return translate({
      id: "governance.delegate.wallet.delegationLoading",
      message: "Checking current delegation…",
    });
  }
  if (delegation === null) {
    return translate({
      id: "governance.delegate.wallet.delegationNone",
      message: "Not yet delegated",
    });
  }
  if (delegation.kind === "abstain") {
    return translate({
      id: "governance.delegate.wallet.delegationAbstain",
      message: "Delegated: Always Abstain",
    });
  }
  if (delegation.kind === "noConfidence") {
    return translate({
      id: "governance.delegate.wallet.delegationNoConfidence",
      message: "Delegated: Always No Confidence",
    });
  }
  if (delegation.name) {
    return translate(
      { id: "governance.delegate.wallet.delegationNamed", message: "Delegated to {name}" },
      { name: delegation.name }
    );
  }
  return translate(
    { id: "governance.delegate.wallet.delegationIdOnly", message: "Delegated to {id}" },
    { id: `${delegation.drepId.slice(0, 14)}…${delegation.drepId.slice(-6)}` }
  );
}

function WalletStatus({ wallet, delegation, onDisconnect }) {
  const wrongNetwork = wallet.networkId !== EXPECTED_NETWORK_ID;
  return (
    <div className={`${styles.walletStatus} ${wrongNetwork ? styles.walletStatusWarning : ""}`}>
      <div className={styles.walletStatusLeft}>
        <span className={styles.walletDot} aria-hidden="true" />
        <div className={styles.walletStatusText}>
          <span>
            {translate(
              { id: "governance.delegate.wallet.connected", message: "Connected: {name} · {addr}" },
              { name: wallet.name, addr: shortAddress(wallet.address) }
            )}
          </span>
          <span className={styles.walletDelegation}>
            {formatDelegationLabel(delegation)}
          </span>
        </div>
      </div>
      <button type="button" onClick={onDisconnect} className={styles.disconnectButton}>
        {translate({ id: "governance.delegate.wallet.disconnect", message: "Disconnect" })}
      </button>
    </div>
  );
}

function NetworkWarning() {
  return (
    <div className={`${styles.banner} ${styles.bannerWarning}`} role="alert">
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
      <div className={`${styles.banner} ${styles.bannerInfo}`} role="status">
        {translate(
          { id: "governance.delegate.tx.building", message: "Preparing delegation to {target}. Please confirm in your wallet…" },
          { target: state.target }
        )}
      </div>
    );
  }
  if (state.status === "success") {
    return (
      <div className={`${styles.banner} ${styles.bannerSuccess}`} role="status">
        <p style={{ margin: 0 }}>
          {translate(
            { id: "governance.delegate.tx.success", message: "Delegation submitted to {target}." },
            { target: state.target }
          )}
        </p>
        <a href={EXPLORER_TX_BASE + state.txHash} target="_blank" rel="noopener noreferrer">
          {translate({ id: "governance.delegate.tx.viewOnExplorer", message: "View on explorer" })}
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
  const hasLocalAvatar = AVATAR_SET.has(drep.drepId);
  const localAvatar = useBaseUrl(`/img/dreps/${drep.drepId}.jpg`);
  const showImage = hasLocalAvatar && !imgError;
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        {showImage ? (
          <img
            src={localAvatar}
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
        {translate({ id: "governance.delegate.card.cta", message: "Delegate" })}
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
  // Create the API client once. A lazy useState initializer keeps it stable
  // across renders without reading a ref during render.
  const [apiClient] = useState(() => (API_URL ? makeApiClient(API_URL) : null));

  const [pool, setPool] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [tx, setTx] = useState({ status: "idle" });
  const [delegation, setDelegation] = useState(undefined);
  const [stakeRegistered, setStakeRegistered] = useState(undefined);

  useEffect(() => {
    if (!API_URL) return;
    const api = apiClient;
    if (!api) return;

    let cancelled = false;

    const cached = readPoolCache();
    if (cached) {
      // Hydrate from the client-only localStorage cache on mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPool(cached);
      setDisplayed(fisherYates(cached).slice(0, DISPLAY_COUNT));
      setLoading(false);
      return () => { cancelled = true; };
    }

    async function fetchDReps() {
      try {
        const ids = await fetchAllDRepIds(api);
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
              bio: extractBio(meta),
            };
          })
          .filter(Boolean);

        if (cancelled) return;
        writePoolCache(enriched);
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
  }, [API_URL, apiClient]);

  const reshuffle = useCallback(() => {
    setDisplayed(fisherYates(pool).slice(0, DISPLAY_COUNT));
  }, [pool]);

  const wrongNetwork = wallet && wallet.networkId !== EXPECTED_NETWORK_ID;
  const txBusy = tx.status === "building";
  const canDelegate = !!wallet && !wrongNetwork && !txBusy;

  const handleDisconnect = useCallback(() => {
    setWallet(null);
    setTx({ status: "idle" });
    setDelegation(undefined);
    setStakeRegistered(undefined);
  }, []);

  useEffect(() => {
    if (!wallet) return;
    const api = apiClient;
    if (!api) return;
    let cancelled = false;
    // Reset delegation state when the connected wallet changes, before refetch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDelegation(undefined);
    setStakeRegistered(undefined);
    (async () => {
      try {
        const stakeAddr = await firstRewardAddressBech32(wallet.instance);
        if (!stakeAddr) {
          if (!cancelled) { setDelegation(null); setStakeRegistered(false); }
          return;
        }
        const res = await api.post("/account_info", { _stake_addresses: [stakeAddr] });
        if (cancelled) return;
        const info = res.data?.[0] || {};
        setStakeRegistered(info.status === "registered");
        const drepId = info.delegated_drep || null;
        if (!drepId) { setDelegation(null); return; }
        if (drepId.startsWith("drep_always_abstain")) { setDelegation({ kind: "abstain" }); return; }
        if (drepId.startsWith("drep_always_no_confidence")) { setDelegation({ kind: "noConfidence" }); return; }
        const match = pool.find((p) => p.drepId === drepId);
        setDelegation({ kind: "drep", drepId, name: match?.name || null });
      } catch (err) {
        if (cancelled) return;
        console.error("DRepDelegate: failed to load current delegation", err);
        setDelegation(null);
        setStakeRegistered(undefined);
      }
    })();
    return () => { cancelled = true; };
  }, [wallet, pool, tx.status, apiClient]);

  const handleSelect = useCallback(async (target, displayName) => {
    if (!wallet || wrongNetwork || txBusy) return;
    if (stakeRegistered === false) {
      setTx({
        status: "error",
        message: translate({
          id: "governance.delegate.error.stakeNotRegistered",
          message: "Your stake key isn't registered yet. Delegate to any stake pool once to register it, then come back to delegate your vote.",
        }),
      });
      return;
    }
    setTx({ status: "building", target: displayName });
    try {
      // Re-check network live in case user switched wallet network since connect.
      const liveNetworkId = await wallet.instance.getNetworkId();
      if (liveNetworkId !== EXPECTED_NETWORK_ID) {
        throw new Error(translate({
          id: "governance.delegate.error.wrongNetwork",
          message: "Wallet is on the wrong network. Switch to Mainnet and try again.",
        }));
      }
      const txHash = await delegateVote({
        api: wallet.instance,
        target,
        koiosUrl: API_URL,
      });
      setTx({ status: "success", txHash, target: displayName });
    } catch (err) {
      const kind = classifyError(err);
      if (kind === "userCancelled") {
        setTx({ status: "idle" });
        return;
      }
      console.error("DRepDelegate: delegation failed", err);
      const message = kind === "stakeNotRegistered"
        ? translate({
            id: "governance.delegate.error.stakeNotRegistered",
            message: "Your stake key isn't registered yet. Delegate to any stake pool once to register it, then come back to delegate your vote.",
          })
        : translate(
            { id: "governance.delegate.error.generic", message: "Delegation failed: {error}" },
            { error: stringifyError(err) }
          );
      setTx({ status: "error", message });
    }
  }, [wallet, wrongNetwork, txBusy, API_URL, stakeRegistered]);

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
          <WalletStatus wallet={wallet} delegation={delegation} onDisconnect={handleDisconnect} />
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
