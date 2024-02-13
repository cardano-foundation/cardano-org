import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import SiteHero from "@site/src/components/SiteHero";
import FollowCardano from "@site/src/components/FollowCardano";
import Divider from '@site/src/components/Divider';
import WelcomeHero from '@site/src/components/WelcomeHero';
import FeaturedTitleWithText from '@site/src/components/FeaturedTitleWithText';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <Divider headline='WelcomeHero Component' />   
      <WelcomeHero
        title={[
          'Making the world',
          <br key='line1'/>,
          'Work Better For All',
        ]}
        description='Cardano is a blockchain platform for changemakers, innovators, and visionaries, 
        with the tools and technologies required to create possibility for the many, as well as the few, 
        and bring about positive global change.'
      />
      <Divider headline='SiteHero Component Examples' />  
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
        <Divider headline='Various other components' />  
        <FollowCardano />
        <hr />
        <FeaturedTitleWithText
          title='Our World Is Changing. Together, We Can Change It For The Better.'
          description={[
            'Cardano is a proof-of-stake blockchain platform: the first to be founded on peer-reviewed \
            research and developed through evidence-based methods. It combines pioneering technologies \
            to provide unparalleled security and sustainability to decentralized applications, systems, \
            and societies.',
            <br key='line1'/>,
            <br key='line2'/>,
            'With a leading team of engineers, Cardano exists to redistribute power from unaccountable \
            structures to the margins – to individuals – and be an enabling force for positive change and progress.',
            ]}
          quote={[
            'A History Of Impossible,',
            <br key='line1'/>,
            'Made Possible'
            ]}
          buttonLabel='Use Cases'
          buttonLink='/enterprise'
        />
      </main>
      
    </Layout>
  );
}