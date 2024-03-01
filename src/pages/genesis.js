import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="Genesis"
      description="Distribution of ada token vouchers, which are part of the Cardano settlement layer, 
      took place in Asia in four stages between October 2015 and the start of January 2017."
      bannerType="fluid"
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
          FIXME: Genesis
        </BoundaryBox>
      </main>
    </Layout>
  );
}
