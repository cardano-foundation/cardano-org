import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import ImageWithText from "@site/src/components/Layout/ImageWithText";
import DiscoverUsSection from "@site/src/components/DiscoverUsSection";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "../components/Layout/BoundaryBox";
import SpacerBox from "../components/Layout/SpacerBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import {translate} from '@docusaurus/Translate';

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title={translate({id: 'discoverCardano.hero.title', message: 'Discover Cardano'})}
      description={translate({id: 'discoverCardano.hero.description', message: 'Cardano is the nexus of five principles: People, purpose, technology, research, and opportunity. Explore and learn this new constellation of knowledge.'})}
      bannerType="starburst"
    />
  );
}

export default function Home() {

  return (
    <Layout
      title={translate({id: 'discoverCardano.meta.title', message: 'Discover Cardano | cardano.org'})}
      description={translate({id: 'discoverCardano.meta.description', message: 'Cardano is the nexus of five principles: People, purpose, technology, research, and opportunity. Explore and learn this new constellation of knowledge.'})}
    >
      <OpenGraphInfo pageName="discover-cardano" />
      <HomepageHeader />
      <main>
        <BoundaryBox>
          <ImageWithText
            imageName={"discover/people.webp"}
            title={translate({id: 'discoverCardano.people.title', message: 'People'})}
            subtitle={translate({id: 'discoverCardano.people.subtitle', message: 'Working together, we achieve more for the many.'})}
            text={[
              translate({id: 'discoverCardano.people.text1', message: 'Cardano is built by a decentralized community of scientists, engineers, and thought leaders united in a common purpose: to create a technology platform that will ignite the positive change the world needs. We believe the future should not be defined by the past, and that more is possible - and, through technology, can be made possible for all. We measure the worth of a task not by its challenge, but by its results.'}),
              translate({id: 'discoverCardano.people.text2', message: "Every ada holder also holds a stake in the Cardano network. Ada stored in a wallet can be delegated to a stake pool to earn rewards – to participate in the successful running of the network – or pledged to a stake pool to increase the pool's likelihood of receiving rewards. In time, ada will also be usable for a variety of applications and services on the Cardano platform."}),
            ]}
            isImageRight={false}
            id={"people"}
          />
        </BoundaryBox>

        <BackgroundWrapper backgroundType={"gradientDark"}>
          <DiscoverUsSection />
        </BackgroundWrapper>

        <BoundaryBox>
            <ImageWithText
              imageName={"discover/purpose.webp"}
              title={translate({id: 'discoverCardano.purpose.title', message: 'Purpose'})}
              subtitle={translate({id: 'discoverCardano.purpose.subtitle', message: 'A platform built for a sustainable future, to help people work better together, trust one another, and build global solutions to global problems.'})}
              text={[
                translate({id: 'discoverCardano.purpose.text1', message: 'Cardano is a fork in the road. It takes us from where we\'ve been to where we\'re destined to go: a global society that is secure, transparent, and fair, and which serves the many as well as the few. Like the technological revolutions that have come before, it offers a new template for how we work, interact, and create, as individuals, businesses, and societies.'}),
                translate({id: 'discoverCardano.purpose.text2', message: 'Cardano began with a vision of a world without intermediaries, in which power is not controlled by an accountable few, but by the empowered many. In this world, individuals have control over their data and how they interact and transact. Businesses have the opportunity to grow independent of monopolistic and bureaucratic power structures. Societies are able to pursue true democracy: self-governing, fair, and accountable. It is a world made possible by Cardano.'}),
              ]}
              isImageRight={true}
              id={"purpose"}
            />

            <ImageWithText
              imageName={"discover/technology.webp"}
              title={translate({id: 'discoverCardano.technology.title', message: 'Technology'})}
              subtitle={translate({id: 'discoverCardano.technology.subtitle', message: 'Cardano brings a new standard in technology - open and inclusive – to challenge the old and activate a new age of sustainable, globally-distributed innovation.'})}
              text={[
                translate({id: 'discoverCardano.technology.text1', message: 'From the incremental to global, Cardano improves how we interact, transact, and create - and ultimately operate as a global society.'}),
                translate({id: 'discoverCardano.technology.text2', message: 'Cardano is a blockchain platform built on the groundbreaking Ouroboros proof-of-stake consensus protocol, and developed using the Haskell programming language: a functional programming language that enables Cardano to pursue evidence-based development, for unparalleled security and stability.'}),
                translate({id: 'discoverCardano.technology.text3', message: 'Our technology is underpinned by [research](/research). We have redefined what it means to create a global software platform through scientific methods. We have not compromised on our belief, or in our approach. To build a better future - secure, sustainable, and governable by the many - we have taken the road less traveled. The result of our efforts is a blockchain platform unparalleled in its capability and performance, and which is truly able to support global applications, systems, and real-life business use cases.'}),
              ]}
              isImageRight={false}
              id={"technology"}
            />

            <ImageWithText
              imageName={"discover/research.webp"}
              title={translate({id: 'discoverCardano.research.title', message: 'Research'})}
              subtitle={translate({id: 'discoverCardano.research.subtitle', message: 'Pioneering tech begins with groundbreaking research.'})}
              text={[
                translate({id: 'discoverCardano.research.text1', message: 'Cardano began with and has grown through [research](/research). Before any technology we integrate is developed, it is specified. And before it is specified, it is researched. That [research](/research) is peer-reviewed - a unique achievement for a blockchain platform - so that our ideas may be challenged before they are validated.'}),
                translate({id: 'discoverCardano.research.text2', message: '[Our research](/research) - led by leading academics - explores philosophy, sociology, behavior, and game theory. To achieve each outcome, we consider the minutiae of possibilities: the variables that often go unconsidered, but which may ultimately impact the integrity and sustainability of a global, decentralized platform. We take nothing for granted.'}),
              ]}
              isImageRight={true}
              id={"research"}
            />

            <ImageWithText
              imageName={"discover/opportunity.webp"}
              title={translate({id: 'discoverCardano.opportunity.title', message: 'Opportunity'})}
              subtitle={translate({id: 'discoverCardano.opportunity.subtitle', message: 'The staging point for every new opportunity. Empower your business through Cardano, and discover the future of technology.'})}
              text={[
                translate({id: 'discoverCardano.opportunity.text1', message: 'Cardano provides the template and toolset to a new age of innovation. It introduces leading-edge technologies, models, and methodologies to help individuals, developers, and enterprises discover a new possible, realize change, and enrich their lives..'}),
                translate({id: 'discoverCardano.opportunity.text2', message: 'Blockchain technology holds the answer to a number of legacy challenges, whether financial, societal, or technological. It disintermediates essential relationships, and redistributes power to alleviate costly dependencies, restrictive paradigms, and inefficient systems of transaction and exchange. Cardano is a realization of this potential. It is a platform with the security, privacy sustainability, and performance standards required to accelerate the mass adoption of the technology, and support a lasting ecosystem.'}),
                translate({id: 'discoverCardano.opportunity.text3', message: 'Cardano powers new, more secure, and globally scalable solutions. Its technology is continuously improved upon through evidence-based development methods, and guided by a democratic voting system, in which every member has a voice. The opportunity of Cardano is adaptable to your use case. It is an opportunity that creates other opportunities, continuously.'}),
              ]}
              isImageRight={false}
              id={"opportunity"}
            />
        </BoundaryBox>

        <SpacerBox size="medium" />
      </main>
    </Layout>
  );
}
