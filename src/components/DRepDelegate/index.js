import React, { useEffect, useState, useCallback, useMemo } from "react";
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
import {
  EXPECTED_NETWORK_ID,
  EXPLORER_TX_BASE,
  shortAddress,
  stringifyError,
  classifyError,
} from "@site/src/utils/walletTx";
import styles from "./styles.module.css";

const AVATAR_SET = new Set(drepAvatarsManifest.ids);

const VP_MIN_LOVELACE = 50_000_000_000;      // 50k ada
const VP_MAX_LOVELACE = 50_000_000_000_000;  // 50M ada
const DISPLAY_COUNT = 8;
const SEARCH_RESULT_LIMIT = 12;
// data.cardano.org proxy caps POST bodies at 5120 bytes, ~80 drep_ids max per batch.
const BATCH_SIZE = 50;
const POOL_CACHE_KEY = "cardano-org.drep-pool.v3";
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
    // Quota exceeded or storage disabled, cache is best-effort.
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

// Fold case and strip combining accents so "Muller" also finds "Müller".
function normalizeForSearch(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function searchByName(pool, rawQuery) {
  const needle = normalizeForSearch(rawQuery);
  return pool
    .map((drep) => ({ drep, haystack: normalizeForSearch(drep.name) }))
    .filter(({ haystack }) => haystack.includes(needle))
    .sort((a, b) => {
      // A DRep whose full name is exactly the query always stays visible,
      // however small it is against the rest of the matches.
      const aExact = a.haystack === needle;
      const bExact = b.haystack === needle;
      if (aExact !== bExact) return aExact ? -1 : 1;
      return Number(b.drep.votingPower || 0) - Number(a.drep.votingPower || 0);
    })
    .map(({ drep }) => drep);
}

function pickCurated(pool) {
  return fisherYates(pool.filter((d) => d.curated)).slice(0, DISPLAY_COUNT);
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

function SearchRow({ value, onChange }) {
  return (
    <div className={styles.searchRow}>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={translate({
          id: "governance.delegate.search.placeholder",
          message: "Search by name, or paste a DRep ID",
        })}
        className={styles.searchInput}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        aria-label={translate({
          id: "governance.delegate.search.label",
          message: "Search DReps by name or DRep ID",
        })}
      />
      {value && (
        <button
          type="button"
          className={styles.searchClear}
          onClick={() => onChange("")}
        >
          {translate({ id: "governance.delegate.search.clear", message: "Clear" })}
        </button>
      )}
    </div>
  );
}

// A DRep ID that is not in the pool is either inactive or has no published
// metadata. Delegation still works, so offer it with the bare ID.
function UnknownIdCard({ drepId, onSelect, disabled }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Initials name="?" />
        <div className={styles.cardIdentity}>
          <h3 className={styles.cardName}>
            {translate({
              id: "governance.delegate.search.unknownId.name",
              message: "Unlisted DRep",
            })}
          </h3>
          <span className={styles.cardId}>{shortAddress(drepId)}</span>
        </div>
      </div>
      <p className={styles.cardBio}>
        {translate({
          id: "governance.delegate.search.unknownId.help",
          message: "This DRep is not active or has published no metadata, so we cannot show a name. You can still delegate to this ID.",
        })}
      </p>
      <button
        type="button"
        className={`button button--primary ${styles.cardCta}`}
        disabled={disabled}
        onClick={() => onSelect({ dRepId: drepId }, drepId)}
      >
        {translate({ id: "governance.delegate.card.cta", message: "Delegate" })}
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
  const [query, setQuery] = useState("");
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
      setDisplayed(pickCurated(cached));
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

        // Everything active and self-described is searchable by name. The
        // curated voting-power range only narrows the randomly shown cards.
        const searchable = infos.filter((i) => i.active && i.meta_url);

        if (!searchable.length) {
          if (!cancelled) {
            setPool([]);
            setDisplayed([]);
            setLoading(false);
          }
          return;
        }

        const metaResults = await Promise.all(
          chunk(searchable.map((i) => i.drep_id), BATCH_SIZE).map((b) =>
            api.post("/drep_metadata", { _drep_ids: b })
          )
        );
        const metaById = new Map();
        for (const r of metaResults) {
          for (const m of r.data || []) {
            if (m.meta_json) metaById.set(m.drep_id, m.meta_json);
          }
        }

        const enriched = searchable
          .map((i) => {
            const meta = metaById.get(i.drep_id);
            if (!meta) return null;
            const name = extractName(meta);
            if (!name) return null;
            const vp = Number(i.amount || 0);
            return {
              drepId: i.drep_id,
              // Kept so a pasted hex ID resolves to the same DRep as bech32.
              hex: i.hex || null,
              votingPower: i.amount,
              name,
              bio: extractBio(meta),
              curated: vp >= VP_MIN_LOVELACE && vp <= VP_MAX_LOVELACE,
            };
          })
          .filter(Boolean);

        if (cancelled) return;
        writePoolCache(enriched);
        setPool(enriched);
        setDisplayed(pickCurated(enriched));
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
    setDisplayed(pickCurated(pool));
  }, [pool]);

  const curatedCount = useMemo(
    () => pool.filter((d) => d.curated).length,
    [pool]
  );

  const trimmedQuery = query.trim();

  // One field serves both lookups: anything shaped like a DRep ID resolves to
  // that single DRep, everything else is a name search across the whole pool.
  const search = useMemo(() => {
    if (!trimmedQuery) return null;
    if (isValidDRepId(trimmedQuery)) {
      const wanted = trimmedQuery.toLowerCase();
      const match = pool.find(
        (d) => d.drepId.toLowerCase() === wanted || d.hex?.toLowerCase() === wanted
      );
      return { byId: trimmedQuery, matches: match ? [match] : [] };
    }
    return { byId: null, matches: searchByName(pool, trimmedQuery) };
  }, [trimmedQuery, pool]);

  const visible = search
    ? search.matches.slice(0, SEARCH_RESULT_LIMIT)
    : displayed;

  const listStatus = (() => {
    if (!search) {
      return translate(
        {
          id: "governance.delegate.poolIntro",
          message: "{count} active DReps with mid-tier voting power. Refresh for a different selection.",
        },
        { count: curatedCount }
      );
    }
    // An ID card and the empty state both speak for themselves.
    if (search.byId || !search.matches.length) return null;
    if (search.matches.length > SEARCH_RESULT_LIMIT) {
      return translate(
        {
          id: "governance.delegate.search.resultCountCapped",
          message: "Showing the first {shown} of {total} matching DReps. Refine your search to narrow it down.",
        },
        { shown: SEARCH_RESULT_LIMIT, total: search.matches.length }
      );
    }
    if (search.matches.length === 1) {
      return translate({
        id: "governance.delegate.search.resultCountOne",
        message: "One matching DRep.",
      });
    }
    return translate(
      { id: "governance.delegate.search.resultCount", message: "{count} matching DReps." },
      { count: search.matches.length }
    );
  })();

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

  if (!pool.length) {
    return (
      <div className={styles.container}>
        <div className={styles.statusLine}>
          {translate({
            id: "governance.delegate.noResults",
            message: "No active DReps available right now. Try one of the alternative tools below.",
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

      <div className={styles.searchSection}>
        <h3 className={styles.sectionHeading}>
          {translate({
            id: "governance.delegate.search.heading",
            message: "Find a DRep",
          })}
        </h3>
        <SearchRow value={query} onChange={setQuery} />
      </div>

      {(listStatus || !search) && (
        <div className={styles.poolHeader}>
          {listStatus && <p className={styles.poolIntro}>{listStatus}</p>}
          {!search && (
            <button
              type="button"
              className={`button button--secondary ${styles.shuffleButton}`}
              onClick={reshuffle}
            >
              {translate({ id: "governance.delegate.shuffle", message: "Shuffle DReps" })}
            </button>
          )}
        </div>
      )}

      {search?.byId && !search.matches.length ? (
        <div className={styles.cardGrid}>
          <UnknownIdCard
            drepId={search.byId}
            onSelect={handleSelect}
            disabled={!canDelegate}
          />
        </div>
      ) : search && !search.matches.length ? (
        <p className={styles.searchEmpty}>
          {translate({
            id: "governance.delegate.search.noResults",
            message: "No DRep found under that name. If you have the DRep ID, paste it here instead.",
          })}
        </p>
      ) : (
        <div className={styles.cardGrid}>
          {visible.map((drep) => (
            <DRepCard
              key={drep.drepId}
              drep={drep}
              onSelect={handleSelect}
              disabled={!canDelegate}
            />
          ))}
        </div>
      )}

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
