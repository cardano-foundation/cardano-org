import React, { useEffect, useRef, useState, useCallback } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { translate } from "@docusaurus/Translate";
import { makeApiClient } from "@site/src/utils/insights/api";
import { convertLovelacesToAda } from "@site/src/utils/insights/numbers";
import styles from "./styles.module.css";

const ANIMATION_DURATION = 1500;

function useCountUp(target, duration = ANIMATION_DURATION) {
  const [value, setValue] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    if (target == null || target === 0) {
      setValue(target ?? 0);
      return;
    }

    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setValue(target);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration]);

  return value;
}

function AnimatedStat({ target, format, label }) {
  const animated = useCountUp(target);
  return (
    <div className={styles.statCard}>
      <span className={styles.statValue}>{format(animated)}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

function formatAdaValue(value) {
  if (value == null) return "...";
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B ada`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M ada`;
  return `${Math.round(value).toLocaleString()} ada`;
}

export default function GovernancePulse() {
  const { siteConfig: { customFields } } = useDocusaurusContext();
  const API_URL = customFields.CARDANO_ORG_API_URL;
  const apiRef = useRef(null);
  if (!apiRef.current && API_URL) apiRef.current = makeApiClient(API_URL);

  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!API_URL) return;
    const api = apiRef.current;
    if (!api) return;

    async function fetchData() {
      try {
        const [tipRes, proposalsRes] = await Promise.all([
          api.get("/tip"),
          api.get("/proposal_list?select=proposal_id,enacted_epoch,expiration&order=proposal_id.desc&limit=100"),
        ]);

        const epochNo = tipRes.data?.[0]?.epoch_no;

        // /totals is a POST endpoint that requires _epoch_no in the body
        let treasury = null;
        if (epochNo) {
          try {
            const totalsRes = await api.post("/totals", { _epoch_no: epochNo });
            treasury = totalsRes.data?.[0]?.treasury;
          } catch {
            // Fall back to previous epoch if current isn't available yet
            const totalsRes = await api.post("/totals", { _epoch_no: epochNo - 1 });
            treasury = totalsRes.data?.[0]?.treasury;
          }
        }

        const proposals = proposalsRes.data || [];
        const active = proposals.filter(
          (p) => p.enacted_epoch === null && (p.expiration === null || p.expiration > epochNo)
        ).length;
        const enacted = proposals.filter((p) => p.enacted_epoch !== null).length;

        setData({
          epoch: epochNo,
          treasury: treasury ? convertLovelacesToAda(treasury) : null,
          activeProposals: active,
          enactedActions: enacted,
        });
      } catch (err) {
        console.error("GovernancePulse: failed to fetch data", err);
        setError(true);
      }
    }

    fetchData();
  }, [API_URL]);

  if (error || !API_URL) return null;

  if (!data) {
    return (
      <div className={styles.pulseWrapper}>
        <div className={`row ${styles.statsRow}`}>
          {[0, 1, 2, 3].map((i) => (
            <div className="col col--3" key={i}>
              <div className={styles.statCard}>
                <span className={styles.statValue}>...</span>
                <span className={styles.statLabel}>&nbsp;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pulseWrapper}>
      <div className={`row ${styles.statsRow}`}>
        <div className="col col--3">
          <AnimatedStat
            target={data.treasury}
            format={formatAdaValue}
            label={translate({ id: "governance.pulse.treasury", message: "Treasury" })}
          />
        </div>
        <div className="col col--3">
          <AnimatedStat
            target={data.activeProposals}
            format={(v) => String(Math.round(v))}
            label={translate({ id: "governance.pulse.activeProposals", message: "Active proposals" })}
          />
        </div>
        <div className="col col--3">
          <AnimatedStat
            target={data.epoch}
            format={(v) => String(Math.round(v))}
            label={translate({ id: "governance.pulse.epoch", message: "Current epoch" })}
          />
        </div>
        <div className="col col--3">
          <AnimatedStat
            target={data.enactedActions}
            format={(v) => String(Math.round(v))}
            label={translate({ id: "governance.pulse.enacted", message: "Actions enacted" })}
          />
        </div>
      </div>
      <p className={styles.pulseLine}>
        <span className={styles.pulseDot} />
        {translate(
          { id: "governance.pulse.liveLine", message: "Epoch {epoch} is live. {count} proposals are being voted on right now." },
          { epoch: data.epoch, count: data.activeProposals }
        )}
      </p>
    </div>
  );
}
