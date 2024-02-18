import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import WelcomeHero from "@site/src/components/WelcomeHero";

import FeaturedTitleWithText from "@site/src/components/FeaturedTitleWithText";
import Divider from "@site/src/components/Divider";
import QuoteBox from "@site/src/components/QuoteBox";
import BenefitsSection from '@site/src/components/BenefitsSection';
import VisionBox from '@site/src/components/VisionBox';
import TitleBox from '@site/src/components/TitleBox';
import FollowCardano from '@site/src/components/FollowCardano';
import DiscoverSection from '@site/src/components/DiscoverSection';
import PartnerSection from '@site/src/components/PartnersSection';
import FollowCardanoSection from '@site/src/components/FollowCardanoSection';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
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
      <main>
        
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

      
      <Divider headline='Benefits'/>
      <QuoteBox 
        description='Cardano restores trust to global systems – creating, through science, a more secure, transparent, and sustainable foundation for individuals to transact and exchange, systems to govern, and enterprises to grow.'
        quote = 'Cardano brings a new standard in technology – open and inclusive – to challenge the old and activate a new age of sustainable, globally-distributed innovation.'
        />

        <BenefitsSection />

        <VisionBox
          title={[
            'Define Your Possible.',
            <br key='line1'/>,
            'Change Your World.',
            ]}
          />

        <Divider headline='Make the Change'/> 
        <TitleBox 
          title='Discover Cardano' 
          description={[
            'Cardano is the first blockchain platform to be built through peer-reviewed research, \
          to be secure enough to protect the data of billions, scalable enough to accommodate global systems, \
          and robust enough to support foundational change.'
          ]}
          titleType='black'
        />

        <DiscoverSection />
        <PartnerSection />
        <FollowCardanoSection />

      </main>
    </Layout>
  );
}
