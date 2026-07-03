import React, { Suspense, lazy } from "react";
import Layout from "@theme/Layout";
import BrowserOnly from "@docusaurus/BrowserOnly";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import { translate } from "@docusaurus/Translate";

const TreasuryDonate = lazy(() =>
  import(/* webpackChunkName: "treasury-donate" */ "@site/src/components/TreasuryDonate")
);

function TreasuryHero() {
  return (
    <SiteHero
      title={translate({ id: "governance.treasury.hero.title", message: "Donate to the treasury" })}
      description={translate({
        id: "governance.treasury.hero.description",
        message: "Connect your wallet and add ada directly to the Cardano treasury. A real Conway treasury donation, signed and submitted by your wallet, with no recipient address.",
      })}
      bannerType="braidBlue"
    />
  );
}

const loadingFallback = (
  <div style={{ textAlign: "center", padding: "3rem 0" }}>
    {translate({ id: "governance.treasury.loading", message: "Loading donation tool…" })}
  </div>
);

export default function TreasuryPage() {
  return (
    <Layout
      title={translate({ id: "governance.treasury.layout.title", message: "Donate to the Treasury - Cardano Governance" })}
      description={translate({
        id: "governance.treasury.layout.description",
        message: "Make a Conway treasury donation directly from cardano.org. Connect your wallet and add ada to the Cardano treasury in one transaction.",
      })}
    >
      <OpenGraphInfo
        pageName="governance"
        title={translate({ id: "governance.treasury.og.title", message: "Donate to the treasury" })}
        description={translate({
          id: "governance.treasury.og.description",
          message: "Connect your wallet and add ada directly to the Cardano treasury in one transaction.",
        })}
      />
      <TreasuryHero />
      <BackgroundWrapper backgroundType={"zoom"}>
        <BoundaryBox>
          <BrowserOnly fallback={loadingFallback}>
            {() => (
              <Suspense fallback={loadingFallback}>
                <TreasuryDonate />
              </Suspense>
            )}
          </BrowserOnly>
          <SpacerBox size="small" />
        </BoundaryBox>
      </BackgroundWrapper>
    </Layout>
  );
}
