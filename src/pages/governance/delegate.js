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
import AppTile, { StarBadge } from "@site/src/components/AppTile";
import { Showcases } from "@site/src/data/apps";
import { compareByTxDesc } from "@site/src/utils/appStats";
import styles from "./delegate.module.css";

// Apps carrying the drepdelegation property support delegating voting power
// directly. Same ordering as the /apps category panels: most active first,
// maintainer pick as tiebreaker, then alphabetical for a stable order.
const DELEGATION_APPS = Showcases
  .filter((app) => app.properties.includes("drepdelegation"))
  .sort((a, b) => {
    const txDiff = compareByTxDesc(a, b);
    if (txDiff !== 0) return txDiff;
    if (a.maintainerPick !== b.maintainerPick) return a.maintainerPick ? -1 : 1;
    return a.title.localeCompare(b.title);
  });

const DRepDelegate = lazy(() =>
  import(/* webpackChunkName: "drep-delegate" */ "@site/src/components/DRepDelegate")
);

function DelegateHero() {
  return (
    <SiteHero
      title={translate({ id: "governance.delegate.hero.title", message: "Delegate your voice" })}
      description={translate({
        id: "governance.delegate.hero.description",
        message: "Connect your wallet, pick a Delegated Representative, and lend them your voting power. Non-custodial, no lock-up, your ada never leaves your wallet.",
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
              message: "These community tools also support delegating your voting power to a DRep.",
            })}
          </p>
          <p className="black-text">
            <Link to="/governance/accountability#dreps">
              {translate({ id: "governance.accountability.link.judgeDrep", message: "How to judge a DRep" })}
            </Link>
          </p>
          <SpacerBox size="small" />
          <div className={styles.altGrid}>
            {DELEGATION_APPS.map((app) => (
              <AppTile key={app.slug} app={app} badge={app.maintainerPick ? <StarBadge /> : null} />
            ))}
          </div>
          <SpacerBox size="small" />
          <p>
            <Link to="/apps?tags=governance">
              {translate({ id: "governance.tools.more", message: "More tools" })}
            </Link>
          </p>
        </BoundaryBox>
      </BackgroundWrapper>
    </Layout>
  );
}
