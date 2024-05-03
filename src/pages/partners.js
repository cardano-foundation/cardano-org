import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import PartnersOverviewSection from "@site/src/components/PartnersOverviewSection";
import OpenGraphImage from "@site/src/components/Layout/OpenGraphImage";

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
          <Divider text="Entities" />
          <PartnersOverviewSection />
        </BoundaryBox>
        <SpacerBox size="medium" />
      </main>
    </Layout>
  );
}
