import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import BrandAssetsSection from "../components/BrandAssetsSection";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import {translate} from '@docusaurus/Translate';

function HomepageHeader() {
  return (
    <SiteHero
      title={translate({id: 'brandAssets.hero.title', message: 'Brand Assets'})}
      description={translate({id: 'brandAssets.hero.description', message: 'Our brand is a reflection of everything that we create. Here are some of the things that make up our brand and how you can use them.'})}
      bannerType="braidRedBlue"
    />
  );
}

export default function Home() {
  return (
    <Layout
      title={translate({id: 'brandAssets.layout.title', message: 'Brand Assets | cardano.org'})}
      description={translate({id: 'brandAssets.layout.description', message: 'Our brand is a reflection of everything that we create. Here are some of the things that make up our brand and how you can use them.'})}
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
