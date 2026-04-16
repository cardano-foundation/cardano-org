import React, { Suspense, lazy } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import BrowserOnly from "@docusaurus/BrowserOnly";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import { translate } from "@docusaurus/Translate";
import styles from "./delegate.module.css";

const ALTERNATIVES = [
  {
    name: "GovTool",
    url: "https://gov.tools",
    descId: "governance.delegate.alt.govtool",
    desc: "Intersect's full-feature governance interface.",
  },
  {
    name: "Tempo",
    url: "https://tempo.vote/dreps",
    descId: "governance.delegate.alt.tempo",
    desc: "Browse, compare, and follow DReps with rich profiles.",
  },
  {
    name: "AdaStat",
    url: "https://adastat.net/dreps",
    descId: "governance.delegate.alt.adastat",
    desc: "Track every governance action and DRep on-chain.",
  },
  {
    name: "CGOV",
    url: "https://app.cgov.io/drep",
    descId: "governance.delegate.alt.cgov",
    desc: "Dashboard to monitor DReps and governance actions.",
  },
];

const DRepDelegate = lazy(() =>
  import(/* webpackChunkName: "drep-delegate" */ "@site/src/components/DRepDelegate")
);

function DelegateHero() {
  return (
    <SiteHero
      title={translate({ id: "governance.delegate.hero.title", message: "Delegate your voice" })}
      description={translate({
        id: "governance.delegate.hero.description",
        message: "Connect your wallet, choose a Delegated Representative, and vote on Cardano's future. No middlemen, no custody, your stake stays in your wallet.",
      })}
      bannerType="braidBlue"
    />
  );
}

const loadingFallback = (
  <div style={{ textAlign: "center", padding: "3rem 0" }}>
    {translate({ id: "governance.delegate.loading", message: "Loading delegation tool…" })}
  </div>
);

export default function DelegatePage() {
  return (
    <Layout
      title={translate({ id: "governance.delegate.layout.title", message: "Delegate to a DRep — Cardano Governance" })}
      description={translate({
        id: "governance.delegate.layout.description",
        message: "Delegate your Cardano voting power to a Delegated Representative directly from cardano.org. Connect your wallet and choose from curated active DReps.",
      })}
    >
      <OpenGraphInfo
        pageName="governance"
        title={translate({ id: "governance.delegate.og.title", message: "Delegate your voice" })}
        description={translate({
          id: "governance.delegate.og.description",
          message: "Connect your wallet and delegate your Cardano voting power to a DRep in one transaction.",
        })}
      />
      <DelegateHero />
      <BackgroundWrapper backgroundType={"zoom"}>
        <BoundaryBox>
          <BrowserOnly fallback={loadingFallback}>
            {() => (
              <Suspense fallback={loadingFallback}>
                <DRepDelegate />
              </Suspense>
            )}
          </BrowserOnly>

          <SpacerBox size="medium" />
          <Divider
            text={translate({ id: "governance.delegate.alt.heading", message: "Prefer another tool?" })}
            id="alternatives"
          />
          <p className="black-text">
            {translate({
              id: "governance.delegate.alt.intro",
              message: "Specialized governance tools cover advanced flows like proposal authoring, vote tracking, and detailed DRep profiles.",
            })}
          </p>
          <SpacerBox size="small" />
          <div className={styles.altGrid}>
            {ALTERNATIVES.map((tool) => (
              <Link key={tool.name} to={tool.url} className={styles.altCard}>
                <h3 className={styles.altName}>{tool.name}</h3>
                <p className={styles.altDesc}>
                  {translate({ id: tool.descId, message: tool.desc })}
                </p>
              </Link>
            ))}
          </div>
          <SpacerBox size="small" />
        </BoundaryBox>
      </BackgroundWrapper>
    </Layout>
  );
}
