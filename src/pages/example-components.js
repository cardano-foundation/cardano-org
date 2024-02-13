import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import SiteHero from "@site/src/components/SiteHero";
import FollowCardano from "@site/src/components/FollowCardano";

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <SiteHero
        title={[
          'SiteHero Component',
        ]}
        description='bannerType: ada'
        bannerType ='ada'
      />
      <hr />
      <SiteHero
        title={[
          'SiteHero Component',
        ]}
        description='bannerType: dots'
        bannerType ='dots'
      />
      <hr />
      <SiteHero
        title={[
          'SiteHero Component',
        ]}
        description='bannerType: fluid'
        bannerType ='fluid'
      />
      <hr />
      <SiteHero
        title={[
          'SiteHero Component',
        ]}
        description='bannerType: overlap'
        bannerType ='overlap'
      />
      <hr />
      <SiteHero
        title={[
          'SiteHero Component',
        ]}
        description='bannerType: zoomRedWhite'
        bannerType ='zoomRedWhite'
      />
      <hr />
      <SiteHero
        title={[
          'SiteHero Component',
        ]}
        description='bannerType: zoom (default)'
        bannerType ='default'
      />

      <main>
        <HomepageFeatures />
      </main>
      <FollowCardano />
    </Layout>
  );
}