import React, { useEffect, useRef, useState } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { translate } from "@docusaurus/Translate";
import { makeApiClient } from "@site/src/utils/insights/api";
import { convertLovelacesToAda } from "@site/src/utils/insights/numbers";
import styles from "./styles.module.css";

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

  const formatAda = (value) => {
    if (value == null) return "...";
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    return value.toLocaleString();
  };

  const stats = [
    {
      label: translate({ id: "governance.pulse.treasury", message: "Treasury" }),
      value: data ? `${formatAda(data.treasury)} ada` : "...",
    },
    {
      label: translate({ id: "governance.pulse.activeProposals", message: "Active proposals" }),
      value: data ? String(data.activeProposals) : "...",
    },
    {
      label: translate({ id: "governance.pulse.epoch", message: "Current epoch" }),
      value: data ? String(data.epoch) : "...",
    },
    {
      label: translate({ id: "governance.pulse.enacted", message: "Actions enacted" }),
      value: data ? String(data.enactedActions) : "...",
    },
  ];

  return (
    <div className={styles.pulseWrapper}>
      <div className={`row ${styles.statsRow}`}>
        {stats.map((stat) => (
          <div className="col col--3" key={stat.label}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
      {data && (
        <p className={styles.pulseLine}>
          <span className={styles.pulseDot} />
          {translate(
            { id: "governance.pulse.liveLine", message: "Epoch {epoch} is live. {count} proposals are being voted on right now." },
            { epoch: data.epoch, count: data.activeProposals }
          )}
        </p>
      )}
    </div>
  );
}
