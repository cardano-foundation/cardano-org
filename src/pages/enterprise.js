import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import EnterpriseSection from "@site/src/components/EnterpriseSection";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import OpenGraphImage from "@site/src/components/Layout/OpenGraphImage";

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="Enterprise"
      description="A developing platform, Cardano is being built to 
      accommodate a broad range of use cases, solving problems across multiple 
      industry verticals."
      bannerType="fluid"
    />
  );
}

export default function Home() {

  return (
    <Layout
    title="Use cases for enterprise | cardano.org"
    description="An open platform designed to empower billions without economic identity by offering decentralized applications for managing identity, value, and governance."
    >
      <OpenGraphImage pageName="use-cases-for-enterprise" />
      <HomepageHeader />
      <main>
        <BoundaryBox>
          <EnterpriseSection />
        </BoundaryBox>
      </main>
    </Layout>
  );
}
