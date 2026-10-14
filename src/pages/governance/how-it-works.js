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
    id: "governance.howItWorks.hero.descriptionDecided",
    message:
      "Changes to Cardano and its treasury are decided on-chain by DReps, stake pool operators, and an elected Constitutional Committee. Here is how it works, and where your ada fits in.",
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
                id: "governance.howItWorks.cta.titleDelegate",
                message: "Your ada only counts in governance once it is delegated.",
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
