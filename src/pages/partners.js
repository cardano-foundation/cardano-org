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
      title="Entities"
      description="Several independent entities collaborate to advance Cardano, ensuring it stays true to its mission."
      bannerType="zoomBlueRed"
    />
  );
}

export default function Home() {

  return (
    <Layout
    title="Entities | cardano.org"
    description="Several independent entities collaborate to advance Cardano, ensuring it stays true to its mission."
    >
      <OpenGraphImage pageName="entities" />
      <HomepageHeader />
      <main>
        <BoundaryBox>
          <Divider text="Entities" id="entities" />
          <PartnersOverviewSection />
        </BoundaryBox>
        <SpacerBox size="medium" />
        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <Divider text="Companies building on Cardano"  id="companies" />
            <TitleWithText
              description="There is a growing number of companies that build on Cardano. These are a few of them:"
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
