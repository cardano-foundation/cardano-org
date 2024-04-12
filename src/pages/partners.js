import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import PartnersOverviewSection from "@site/src/components/PartnersOverviewSection";

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
    title="Cardano - making the world work better for all"
    description="An open platform designed to empower billions without economic identity by offering decentralized applications for managing identity, value, and governance."
    >
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
