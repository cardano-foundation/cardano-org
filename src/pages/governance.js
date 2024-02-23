import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import SiteHero from "@site/src/components/Layout/SiteHero";
import BackgroundWrapper from '@site/src/components/Layout/BackgroundWrapper';
import Divider from '@site/src/components/Layout/Divider';
import GovernanceBlueSection from '@site/src/components/GovernanceBlueSection';
import GovernanceWithinCardanoSection from '@site/src/components/GovernanceWithinCardanoSection';
import GovernanceWhyVoltaireSection from '@site/src/components/GovernanceWhyVoltaireSection';
import GovernanceProposalsSection from '@site/src/components/GovernanceProposalsSection';

function HomepageHeader() {
  const {siteTitle} = "useDocusaurusContext()";
  return (
    <SiteHero
        title={[
          'Built for the community',
          <br key="line1"/>,
          'by the community'
        ]}
        description='Cardano is developing the most secure and decentralized governance model in the world. A model to give everybody a voice, and control over the future development of the platform and the applications and services that emerge from it.'
        bannerType ='braidBlue'
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
        
        <BackgroundWrapper backgroundType={'solidBlue'}>
          <GovernanceBlueSection />
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={'zoom'}>
          <Divider text='Governance Within Cardano' /> 
          <GovernanceWithinCardanoSection /> 

          <Divider text='Why Voltaire' /> 
          <GovernanceWhyVoltaireSection /> 
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={'gradientLight'}>
          <GovernanceProposalsSection />
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}
