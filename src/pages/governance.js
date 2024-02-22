import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import SiteHero from "@site/src/components/SiteHero";
import Heading from '@theme/Heading';
import styles from './index.module.css';
import BackgroundWrapper from '@site/src/components/BackgroundWrapper';
import OneColumnBox from '@site/src/components/BackgroundWrapper';
import TitleBox from '../components/TitleBox';
import GovernanceBlueSection from '../components/GovernanceBlueSection';
 
export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <SiteHero
        title={[
          'Built for the community',
          <br key="line1"/>,
          'by the community'
        ]}
        description='Cardano is developing the most secure and decentralized governance model in the world. A model to give everybody a voice, and control over the future development of the platform and the applications and services that emerge from it.'
        bannerType ='braidBlue'
      />
      <main>
        
        <BackgroundWrapper backgroundType={'solidBlue'} >
            <GovernanceBlueSection />
        </BackgroundWrapper>
         
      </main>
    </Layout>
  );
}
