import React, { useEffect, useState } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { translate } from "@docusaurus/Translate";
import { makeApiClient } from "@site/src/utils/insights/api";
import { convertLovelacesToAda, formatAdaValue } from "@site/src/utils/insights/numbers";
import StatFigure, { CountFigure, StatStrip } from "@site/src/components/Layout/StatFigure";
import styles from "./styles.module.css";

const formatWhole = (v) => String(Math.round(v));

export default function GovernancePulse() {
  const { siteConfig: { customFields } } = useDocusaurusContext();
  const API_URL = customFields.CARDANO_ORG_API_URL;

  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!API_URL) return;
    const api = makeApiClient(API_URL);

    async function fetchData() {
      try {
        const [tipRes, proposalsRes] = await Promise.all([
          api.get("/tip"),
          api.get("/proposal_list?select=proposal_id,enacted_epoch,expiration&order=proposal_id.desc&limit=1000"),
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
        <StatStrip className={styles.statsRow}>
          {[0, 1, 2, 3].map((i) => (
            <StatFigure key={i} loading label={"\u00a0"} />
          ))}
        </StatStrip>
      </div>
    );
  }

  return (
    <div className={styles.pulseWrapper}>
      <StatStrip className={styles.statsRow}>
        <CountFigure
          target={data.treasury}
          format={formatAdaValue}
          label={translate({ id: "governance.pulse.treasury", message: "Treasury" })}
        />
        <CountFigure
          target={data.activeProposals}
          format={formatWhole}
          label={translate({ id: "governance.pulse.activeProposals", message: "Active proposals" })}
        />
        <CountFigure
          target={data.epoch}
          format={formatWhole}
          label={translate({ id: "governance.pulse.epoch", message: "Current epoch" })}
        />
        <CountFigure
          target={data.enactedActions}
          format={formatWhole}
          label={translate({ id: "governance.pulse.enacted", message: "Actions enacted" })}
        />
      </StatStrip>
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
