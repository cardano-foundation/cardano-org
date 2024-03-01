import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import BrandAssetsSection from "../components/BrandAssetsSection";

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="Brand Assets"
      description="Our brand is a reflection of everything that we create. Here are 
        some of the things that make up our brand and how you can use them."
      bannerType="braidRedBlue"
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
          <BrandAssetsSection />
        </BoundaryBox>
      </main>
    </Layout>
  );
}
