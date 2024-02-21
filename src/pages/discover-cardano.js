import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import SiteHero from '@site/src/components/SiteHero';

import Heading from '@theme/Heading';
import styles from './index.module.css';
import DiscoverItem from '../components/DiscoverItem';
import DiscoverUsSection from '../components/DiscoverUsSection';
import BackgroundWrapper from '../components/BackgroundWrapper';

 

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <SiteHero
        title='Discover Cardano'
        description='Cardano is the nexus of five principles: People, purpose, technology, research, 
        and opportunity. Explore and learn this new constellation of knowledge.'
        bannerType ='starburst'
      />
      <main>
         <DiscoverItem
            imageName={'people'}
            title={'People'}
            subtitle={'Working together, we achieve more for the many.'}
            text={[
              'Cardano is built by a decentralized community of scientists, engineers, and thought leaders united in a common \
            purpose: to create a technology platform that will ignite the positive change the world needs. We believe the future \
            should not be defined by the past, and that more is possible - and, through technology, can be made possible for all. \
            We measure the worth of a task not by its challenge, but by its results.',
            <br key='line1'/>,
            <br key='line2'/>,
            'Every ada holder also holds a stake in the Cardano network. Ada stored in a wallet can be delegated to a stake pool \
            to earn rewards – to participate in the successful running of the network – or pledged to a stake pool to increase the \
            pool’s likelihood of receiving rewards. In time, ada will also be usable for a variety of applications and services on \
            the Cardano platform.'
            ]}
            isImageRight={false}
         />

          <BackgroundWrapper backgroundType={'gradientDark'}>
            <DiscoverUsSection />
          </BackgroundWrapper>

          <DiscoverItem
            imageName={'purpose'}
            title={'Purpose'}
            subtitle={'A platform built for a sustainable future, to help people work better together, trust one another, and build global solutions to global problems.'}
            text={[
              'Cardano is a fork in the road. It takes us from where we’ve been to where we’re destined to go: a global society that \
              is secure, transparent, and fair, and which serves the many as well as the few. Like the technological revolutions that \
              have come before, it offers a new template for how we work, interact, and create, as individuals, businesses, and \
              societies.',
            <br key='line1'/>,
            <br key='line2'/>,
            'Cardano began with a vision of a world without intermediaries, in which power is not controlled by an accountable few, \
            but by the empowered many. In this world, individuals have control over their data and how they interact and transact. \
            Businesses have the opportunity to grow independent of monopolistic and bureaucratic power structures. Societies are able \
            to pursue true democracy: self-governing, fair, and accountable. It is a world made possible by Cardano.'
            ]}
            isImageRight={true}
         />

          <DiscoverItem
            imageName={'technology'}
            title={'Technology'}
            subtitle={'Cardano brings a new standard in technology - open and inclusive – to challenge the old and activate a new age of sustainable, globally-distributed innovation.'}
            text={[
              'From the incremental to global, Cardano improves how we interact, transact, and create - and ultimately operate as a \
              global society.',
              <br key='line1'/>,
              <br key='line2'/>,
              'Cardano is a blockchain platform built on the groundbreaking Ouroboros proof-of-stake consensus protocol, and developed \
              using the Haskell programming language: a functional programming language that enables Cardano to pursue evidence-based \
              development, for unparalleled security and stability.',
              <br key='line3'/>,
              <br key='line4'/>,
              'Our technology is underpinned by research. We have redefined what it means to create a global software platform through \
              scientific methods. We have not compromised on our belief, or in our approach. To build a better future - secure, \
              sustainable, and governable by the many - we have taken the road less traveled. The result of our efforts is a blockchain \
              platform unparalleled in its capability and performance, and which is truly able to support global applications, systems, \
              and real-life business use cases.'
            ]}
            isImageRight={false}
         />

          <DiscoverItem
            imageName={'research'}
            title={'Research'}
            subtitle={'Pioneering tech begins with groundbreaking research.'}
            text={[
              'Cardano began with and has grown through research. Before any technology we integrate is developed, it is specified. \
              And before it is specified, it is researched. That research is peer-reviewed - a unique achievement for a blockchain \
              platform - so that our ideas may be challenged before they are validated.',
            <br key='line1'/>,
            <br key='line2'/>,
            'Our research - led by leading academics - explores philosophy, sociology, behavior, and game theory. To achieve each \
            outcome, we consider the minutiae of possibilities: the variables that often go unconsidered, but which may ultimately \
            impact the integrity and sustainability of a global, decentralized platform. We take nothing for granted.'
            ]}
            isImageRight={true}
         />

          <DiscoverItem
            imageName={'opportunity'}
            title={'Opportunity'}
            subtitle={'The staging point for every new opportunity. Empower your business through Cardano, and discover the future of technology.'}
            text={[
              'Cardano provides the template and toolset to a new age of innovation. It introduces leading-edge technologies, models, \
              and methodologies to help individuals, developers, and enterprises discover a new possible, realize change, and enrich \
              their lives..',
              <br key='line1'/>,
              <br key='line2'/>,
              'Blockchain technology holds the answer to a number of legacy challenges, whether financial, societal, or technological. \
              It disintermediates essential relationships, and redistributes power to alleviate costly dependencies, restrictive paradigms, \
              and inefficient systems of transaction and exchange. Cardano is a realization of this potential. It is a platform with the \
              security, privacy sustainability, and performance standards required to accelerate the mass adoption of the technology, and \
              support a lasting ecosystem.',
              <br key='line3'/>,
              <br key='line4'/>,
              'Cardano powers new, more secure, and globally scalable solutions. Its technology is continuously improved upon through \
              evidence-based development methods, and guided by a democratic voting system, in which every member has a voice. The \
              opportunity of Cardano is adaptable to your use case. It is an opportunity that creates other opportunities, continuously.'
            ]}
            isImageRight={false}
         />

      </main>
    </Layout>
  );
}
