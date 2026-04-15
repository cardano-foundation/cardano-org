import React, { Suspense, lazy } from "react";
import Layout from "@theme/Layout";
import BrowserOnly from "@docusaurus/BrowserOnly";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import { translate } from "@docusaurus/Translate";

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
      <OpenGraphInfo pageName="governance" />
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
        </BoundaryBox>
      </BackgroundWrapper>
    </Layout>
  );
}
