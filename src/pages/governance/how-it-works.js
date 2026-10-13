import React from "react";
import Layout from "@theme/Layout";
import { translate } from "@docusaurus/Translate";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import CtaOneColumn from "@site/src/components/Layout/CtaOneColumn";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import GovernanceStory, { GovernanceStorySources } from "@site/src/components/GovernanceStory";

export default function GovernanceHowItWorksPage() {
  const title = translate({ id: "governance.howItWorks.hero.title", message: "How Cardano decides" });
  const description = translate({
    id: "governance.howItWorks.hero.descriptionShort",
    message:
      "No single company decides what Cardano becomes. Ada holders, stake pool operators, and an elected committee do, on-chain. Here is how it works.",
  });
  return (
    <Layout
      title={translate({ id: "governance.howItWorks.meta.title", message: "How Cardano Decides - Cardano Governance" })}
      description={description}
    >
      <OpenGraphInfo pageName="governance" title={title} description={description} />
      <SiteHero title={title} description={description} bannerType="braidBlue" />
      <main>
        <GovernanceStory />
        <BoundaryBox>
          <SpacerBox size="medium" />
          <GovernanceStorySources />
          <SpacerBox size="medium" />
        </BoundaryBox>
        <BackgroundWrapper backgroundType={"gradientDark"}>
          <BoundaryBox>
            <CtaOneColumn
              title={translate({
                id: "governance.howItWorks.cta.title",
                message: "Every five days, the ledger counts. Make sure it counts you.",
              })}
              buttonLabel={translate({ id: "governance.howItWorks.cta.button", message: "Delegate your vote" })}
              buttonLink={"/governance/delegate"}
            />
            <SpacerBox size="small" />
          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}
