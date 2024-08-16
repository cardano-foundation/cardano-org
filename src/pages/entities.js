import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import PartnersOverviewSection from "@site/src/components/PartnersOverviewSection";
import OpenGraphImage from "@site/src/components/Layout/OpenGraphImage";
import Logos from "@site/src/components/Layout/Logos";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import TitleWithText from "@site/src/components/Layout/TitleWithText";

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="Entities building on Cardano"
      description="Numerous independent entities, including companies actively building on Cardano, collaborate to advance the platform and ensure it remains aligned with its mission."
      bannerType="zoomBlueRed"
    />
  );
}

export default function Home() {

  return (
    <Layout
    title="Entities building on Cardano | cardano.org"
    description="Numerous independent entities, including companies actively building on Cardano, collaborate to advance the platform and ensure it remains aligned with its mission."
    >
      <OpenGraphImage pageName="entities" />
      <HomepageHeader />
      <main>
        <BoundaryBox>
          <Divider text="Entities advancing Cardano" id="entities" />
          <PartnersOverviewSection />
        </BoundaryBox>
        <SpacerBox size="medium" />
        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <Divider text="Companies, associations, and collaborations building on Cardano"  id="companies" />
            <TitleWithText
              description="There is a growing number of entities that build on Cardano. Below are a few of them:"
              titleType="none"
              headingDot={false}
            />
            <Logos jsonFileName="logosCompanies" /> 
          </BoundaryBox>
        </BackgroundWrapper>    
      </main>
    </Layout>
  );
}
