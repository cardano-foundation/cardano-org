import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import EnterpriseSection from "@site/src/components/EnterpriseSection";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";


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
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
    title="Cardano - making the world work better for all"
    description="An open platform designed to empower billions without economic identity by offering decentralized applications for managing identity, value, and governance."
    >
      <HomepageHeader />
      <main>
        <BoundaryBox>
          <EnterpriseSection />
        </BoundaryBox>
      </main>
    </Layout>
  );
}
