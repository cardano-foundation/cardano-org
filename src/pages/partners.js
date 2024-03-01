import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import PartnersOverviewSection from "@site/src/components/PartnersOverviewSection";

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="Our Partners"
      description="A decentralized team works across many entities to 
        ensure that Cardano stays true to its purpose as we advance and evolve."
      bannerType="zoomBlueRed"
    />
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
    title="Cardano - making the world work better for all"
    description="An open platform designed to empower billions without economic identity by offering decentralized applications for managing identity, value, and governance."
    >
      <HomepageHeader />
      <main>
        <BoundaryBox>
          <Divider text="Partners" />
          <PartnersOverviewSection />
        </BoundaryBox>
        <SpacerBox size="medium" />
      </main>
    </Layout>
  );
}
