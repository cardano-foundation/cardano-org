import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import {translate} from '@docusaurus/Translate';

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title={translate({id: 'learn.hero.title', message: 'Learn'})}
      description={translate({id: 'learn.hero.description', message: 'Empowering the digital architects of the future.'})}
      bannerType="default"
    />
  );
}

export default function Home() {

  return (
    <Layout
    title={translate({id: 'learn.layout.title', message: 'Learn About Cardano, Guides, Tutorials and Resources'})}
    description={translate({id: 'learn.layout.description', message: 'Learn how Cardano works, from proof-of-stake consensus and smart contracts to staking, governance, and building decentralized applications.'})}
    >
      <HomepageHeader />
      <BoundaryBox>
          FIXME: Learn
        </BoundaryBox>
    </Layout>
  );
}
