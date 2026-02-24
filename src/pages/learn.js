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
    title={translate({id: 'learn.layout.title', message: 'Learn | cardano.org'})}
    description={translate({id: 'learn.layout.description', message: 'An open platform designed to empower billions without economic identity by offering decentralized applications for managing identity, value, and governance.'})}
    >
      <HomepageHeader />
      <BoundaryBox>
          FIXME: Learn
        </BoundaryBox>
    </Layout>
  );
}
