import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import BrandAssetsSection from "../components/BrandAssetsSection";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";

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
    title="Brand Assets | cardano.org"
    description="Our brand is a reflection of everything that we create. Here are some of the things that make up our brand and how you can use them."
    >
      <OpenGraphInfo pageName="brand-assets" />
      <HomepageHeader />
      <main>
        <BoundaryBox>
          <BrandAssetsSection />
        </BoundaryBox>
      </main>
    </Layout>
  );
}
