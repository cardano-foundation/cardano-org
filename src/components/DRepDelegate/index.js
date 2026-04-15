import React, { useEffect, useRef, useState, useCallback } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { translate } from "@docusaurus/Translate";
import { makeApiClient } from "@site/src/utils/insights/api";
import styles from "./styles.module.css";

const VP_MIN_LOVELACE = 1_000_000_000_000;   // 1M ada
const VP_MAX_LOVELACE = 50_000_000_000_000;  // 50M ada
const DISPLAY_COUNT = 5;
const BATCH_SIZE = 50;

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

function DRepCard({ drep, onSelect }) {
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

function CustomDelegateRow({ onSelect }) {
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
        disabled={!valid}
        onClick={() => onSelect({ dRepId: trimmed }, trimmed)}
      >
        {translate({ id: "governance.delegate.custom.cta", message: "Delegate" })}
      </button>
    </div>
  );
}

function SpecialOption({ label, help, onSelect, target }) {
  return (
    <div className={styles.specialOption}>
      <button
        type="button"
        className={`button button--outline button--secondary ${styles.specialButton}`}
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

  const handleSelect = useCallback((drep) => {
    console.log("DRep selected:", drep.drepId);
  }, []);

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
          <DRepCard key={drep.drepId} drep={drep} onSelect={handleSelect} />
        ))}
      </div>

      <div className={styles.customSection}>
        <h3 className={styles.sectionHeading}>
          {translate({
            id: "governance.delegate.custom.heading",
            message: "Already know your DRep?",
          })}
        </h3>
        <CustomDelegateRow onSelect={handleSelect} />
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
          />
          <SpecialOption
            label={translate({ id: "governance.delegate.noConfidence.label", message: "No Confidence" })}
            help={translate({
              id: "governance.delegate.noConfidence.help",
              message: "Always vote no confidence in the current Constitutional Committee.",
            })}
            target={{ alwaysNoConfidence: null }}
            onSelect={handleSelect}
          />
        </div>
      </div>
    </div>
  );
}
