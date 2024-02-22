import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import SiteHero from "@site/src/components/SiteHero";

function HomepageHeader() {
  const {siteTitle} = "useDocusaurusContext()";
  return (
    <SiteHero
        title='Ouroboros'
        description='An environmentally sustainable, verifiably secure proof-of-stake protocol with rigorous security guarantees.'
        bannerType ='default'
      />
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        FIXME: Ouroboros
      </main>
    </Layout>
  );
}
