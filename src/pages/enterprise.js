import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import SiteHero from "@site/src/components/SiteHero";
import UseCase from '../components/UseCase';


export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <SiteHero
        title='Enterprise'
        description='A developing platform, Cardano is being built to 
        accommodate a broad range of use cases, solving problems across multiple 
        industry verticals.'
        bannerType ='fluid'
      />
      <main>

      <UseCase
          title='Education'
          description={[
            'The issuance of academic certifications is heavily centralized. If diplomas, degrees, \
            or other credentials are damaged or lost, the re-issue process is often costly, and the \
            issuing institution might no longer exist. Sharing these credentials is also difficult, \
            as academic achievements are traditionally issued in physical form, which makes it almost\
             impossible to share when and where needed.',
            <br key='line1'/>,
            <br key='line2'/>,
            'Atala PRISM is an ID & credentials solution built on the Cardano blockchain. Atala PRISM \
             secures academic certifications within an immutable and tamper-proof ecosystem, empowering \
             students to own and share their achievements, and institutions to instantly verify those \
             credentials. Atala PRISM simplifies this process by enabling individuals to instantly share \
             verifiable credentials.',
             <br key='line3'/>,
             <br key='line4'/>,
             'Atala PRISM gives students ownership and control of their academic achievements, with no \
             third-party intermediaries, while removing friction and costly inefficiencies from the process. \
             The result? A seamless way for students and job seekers to prove who they are and what they have \
             achieved.',
            ]}
          solutions='Credential verification'
          product='Atala PRISM (IOG)'  
          buttonLink='https://atalaprism.io'
          isImageRight={false}
        />

        <UseCase
          title='Retail'
          description={[
            'In 2018, counterfeit goods inflicted a (US$)300bn blow to the global economy and the problem \
            is getting worse. If the trend is not reversed, markets will become flooded with fake products, \
            leading to substantial financial losses, damage to brand reputation, and marked reduction in \
            customer confidence.',
            <br key='line1'/>,
            <br key='line2'/>,
            'Anti-counterfeiting initiatives often involve lengthy and costly processes with little discernible \
            effect on the ongoing trade of counterfeit goods. Most fakes are sold online, which means that \
            these rogue traders operate in relative impunity.',
             <br key='line3'/>,
             <br key='line4'/>,
             'Atala SCAN leverages blockchain technology to offer the solution to this problem: A tamper-proof \
             system to establish product provenance and auditability to ensure every product sold is certified \
             original.',
            ]}
          solutions='Product counterfeiting'
          product='Atala SCAN (IOG)'  
          buttonLink='https://atalaprism.io'
          isImageRight={true}
        />
      </main>
    </Layout>
  );
}
