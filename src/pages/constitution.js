import React, { useEffect, useMemo, useState } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import { FaClipboardList } from "react-icons/fa";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import HighlightCallout from "@site/src/components/Layout/HighlightCallout";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import TermExplainer from "@site/src/components/TermExplainer";
import { makeApiClient } from "@site/src/utils/insights/api";
import ConstitutionDocument from "@site/src/components/Constitution/ConstitutionDocument";
import ConstitutionToc from "@site/src/components/Constitution/ConstitutionToc";
import CONSTITUTION_META from "@site/src/data/constitution-meta";
import styles from "@site/src/components/Constitution/styles.module.css";

const localConstitutionUrl = require("!!file-loader!@site/src/data/constitution-608.md").default;
const localConstitutionContent = require("!!raw-loader!@site/src/data/constitution-608.md").default;

function ipfsToHttp(url) {
  return url && url.startsWith("ipfs://")
    ? url.replace("ipfs://", "https://ipfs.io/ipfs/")
    : url;
}

// Fetches the ratification history and the latest enacted version. The
// document body does not depend on this: it renders from the committed
// markdown regardless of API availability.
function useConstitutionProposals() {
  const { siteConfig: { customFields } } = useDocusaurusContext();
  const API_URL = customFields.CARDANO_ORG_API_URL;
  const [proposals, setProposals] = useState([]);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (!API_URL) {
      // Surface the missing-config error; this branch runs once, not in a loop.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setApiError("API URL is missing");
      return;
    }
    const api = makeApiClient(API_URL);
    // Thank you Koios Team for providing this. No auth header: the proxy
    // injects the key server-side; an Authorization header would trigger a
    // CORS preflight the proxy rejects.
    api
      .get("/proposal_list?proposal_type=eq.NewConstitution&ratified_epoch=not.is.null&select=proposal_type,enacted_epoch,ratified_epoch,proposal_description->contents->1")
      .then((res) => {
        const data = res.data
          .map((item) => ({
            enactedEpoch: item.enacted_epoch,
            ratifiedEpoch: item.ratified_epoch,
            contents: item.contents,
          }))
          .sort((a, b) => b.ratifiedEpoch - a.ratifiedEpoch);
        setProposals(data);
      })
      .catch((err) => {
        console.error("Error fetching constitutions:", err);
        setApiError(err.message);
      });
  }, [API_URL]);

  return { proposals, apiError };
}

// Compares the committed version against the latest on-chain enacted one.
// Returns { state: 'match' | 'newer' | 'unknown', latestEpoch }.
function getVerifyStatus(proposals) {
  const latest = proposals.find((p) => p.enactedEpoch);
  if (!latest) return { state: "unknown", latestEpoch: null };
  const onChainHash = latest.contents && latest.contents.anchor && latest.contents.anchor.dataHash;
  if (onChainHash && onChainHash === CONSTITUTION_META.dataHash) {
    return { state: "match", latestEpoch: latest.enactedEpoch };
  }
  if (latest.ratifiedEpoch > CONSTITUTION_META.ratifiedEpoch) {
    return { state: "newer", latestEpoch: latest.enactedEpoch };
  }
  return { state: "unknown", latestEpoch: latest.enactedEpoch };
}

function VerifyBadge({ status }) {
  if (status.state === "match") {
    return (
      <span style={{ color: "var(--ifm-color-success)", fontWeight: 600 }}>
        <span aria-hidden="true">&#10003;</span> {translate({ id: "constitution.verify.match", message: "Matches the current on-chain constitution" })}
      </span>
    );
  }
  if (status.state === "newer") {
    return (
      <span style={{ color: "var(--ifm-color-warning-dark)", fontWeight: 600 }}>
        {translate({ id: "constitution.verify.newer", message: "A newer version (epoch {epoch}) was enacted on-chain; showing the last published copy." }, { epoch: status.latestEpoch })}
      </span>
    );
  }
  return null;
}

function ConstitutionContent() {
  const { proposals, apiError } = useConstitutionProposals();
  const verifyStatus = useMemo(() => getVerifyStatus(proposals), [proposals]);
  const cid = CONSTITUTION_META.cid;
  const ipfsUrl = ipfsToHttp(cid);

  return (
    <div>
      <TitleWithText
        title={translate({ id: "constitution.enacted.title", message: "Current Enacted Cardano Constitution" })}
        description={[
          translate({ id: "constitution.enacted.description", message: "Discover the Cardano Constitution: the governance framework of the Cardano blockchain. Read the current enacted charter, explore its ratification history, and download the full text via IPFS." }),
        ]}
        headingDot
      />

      <p>
        <strong>
          {translate({ id: "constitution.meta.enactedAt", message: "Enacted at epoch" })} {CONSTITUTION_META.enactedEpoch}
        </strong>
        {verifyStatus.state !== "unknown" && <>{" "}&middot; <VerifyBadge status={verifyStatus} /></>}
      </p>

      <div style={{ marginBottom: "1.5rem" }}>
        <a href={ipfsUrl} target="_blank" rel="noopener noreferrer">
          {translate({ id: "constitution.link.viewOnIPFS", message: "View on IPFS" })}
        </a>{" "}|{" "}
        <a href={localConstitutionUrl} download>
          {translate({ id: "constitution.link.download", message: "Download Constitution" })}
        </a>
      </div>

      <HighlightCallout icon={<FaClipboardList />}>
        <p>
          <Link to="/governance/accountability">
            {translate({ id: "governance.accountability.link.plainLanguage", message: "See these obligations in plain language" })}
          </Link>
        </p>
      </HighlightCallout>
      <SpacerBox size="small" />

      <div className={styles.layout}>
        <ConstitutionToc content={localConstitutionContent} />
        <div className={styles.document}>
          <ConstitutionDocument content={localConstitutionContent} />
        </div>
      </div>

      <SpacerBox size="large" />

      <TitleWithText
        title={translate({ id: "constitution.history.title", message: "Constitution Ratification History" })}
        description={[
          translate({ id: "constitution.history.description", message: "Below you can find the Cardano Constitution and its ratification history. Click any version to view the full text on IPFS." }),
        ]}
      />
      {apiError ? (
        <p style={{ color: "var(--ifm-color-emphasis-600)" }}>
          {translate({ id: "constitution.history.unavailable", message: "Live ratification history is currently unavailable." })}
        </p>
      ) : !proposals.length ? (
        <p>{translate({ id: "constitution.loading.versions", message: "Loading constitution versions..." })}</p>
      ) : (
        <ul>
          {proposals.map((proposal) => (
            <li key={proposal.ratifiedEpoch}>
              <strong>
                {translate({ id: "constitution.history.versionRatified", message: "Version ratified at epoch" })} {proposal.ratifiedEpoch}
              </strong>
              {proposal.enactedEpoch && (
                <span> ({translate({ id: "constitution.history.enactedAtEpoch", message: "Enacted at epoch" })} {proposal.enactedEpoch})</span>
              )}
              <p style={{ fontSize: "0.9em", color: "var(--ifm-color-emphasis-600)" }}>
                {translate({ id: "constitution.history.hash", message: "Hash:" })}{" "}
                <code>{proposal.contents.anchor.dataHash}</code>
              </p>
              {proposal.enactedEpoch && (
                <div>
                  <a href={ipfsToHttp(proposal.contents.anchor.url)} target="_blank" rel="noopener noreferrer">
                    {translate({ id: "constitution.link.viewOnIPFSHistory", message: "View this constitution on IPFS" })}
                  </a>
                </div>
              )}
              <SpacerBox size="small" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function HomepageHeader() {
  return (
    <SiteHero
      title={translate({ id: "constitution.hero.title", message: "The Cardano Constitution" })}
      description={translate({ id: "constitution.hero.description", message: "Discover the Cardano Constitution: the governance framework of the Cardano blockchain." })}
      bannerType="zoom"
    />
  );
}

export default function Home() {
  return (
    <Layout
      title={translate({ id: "constitution.layout.title", message: "The Cardano Constitution, On-Chain Governance Framework" })}
      description={translate({ id: "constitution.layout.description", message: "Discover the Cardano Constitution: the governance framework of the Cardano blockchain. Read the current enacted charter, explore its ratification history, and download the full text via IPFS." })}
    >
      <OpenGraphInfo pageName="constitution" />
      <HomepageHeader />
      <main>
        <BackgroundWrapper backgroundType="zoom">
          <BoundaryBox>
            <ConstitutionContent />
            <SpacerBox size="medium" />
          </BoundaryBox>
        </BackgroundWrapper>
        <BackgroundWrapper backgroundType={"gradientLight"}>
          <BoundaryBox>
            <TermExplainer category="governance" />
          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}
