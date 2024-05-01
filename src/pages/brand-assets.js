import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import BrandAssetsSection from "../components/BrandAssetsSection";
import Head from '@docusaurus/Head';

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

function MetaData() {
  return (
    <Head>
      <meta property="og:image" content="https://cardano.org/img/og/brand-assets.jpg" />
      <meta name="twitter:image" content="https://cardano.org/img/og/brand-assets.jpg" />
    </Head>
  )
}

export default function Home() {
  return (
    <Layout
    title="Cardano - brand assets"
    description="Our brand is a reflection of everything that we create. Here are some of the things that make up our brand and how you can use them."
    >
      <HomepageHeader />
      <MetaData />
      <main>
        <BoundaryBox>
          <BrandAssetsSection />
        </BoundaryBox>
      </main>
    </Layout>
  );
}
