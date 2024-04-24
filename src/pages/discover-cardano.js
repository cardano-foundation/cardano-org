import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import ImageWithText from "@site/src/components/Layout/ImageWithText";
import DiscoverUsSection from "@site/src/components/DiscoverUsSection";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "../components/Layout/BoundaryBox";
import SpacerBox from "../components/Layout/SpacerBox";

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="Discover Cardano"
      description="Cardano is the nexus of five principles: People, purpose, technology, research, 
        and opportunity. Explore and learn this new constellation of knowledge."
      bannerType="starburst"
    />
  );
}

export default function Home() {

  return (
    <Layout
    title="Cardano - making the world work better for all"
    description="An open platform designed to empower billions without economic identity by offering decentralized applications for managing identity, value, and governance."
    >
      <HomepageHeader />
      <main>
        <BoundaryBox>
          <ImageWithText
            imageName={"discover/people.webp"}
            title={"People"}
            subtitle={"Working together, we achieve more for the many."}
            text={[
              "Cardano is built by a decentralized community of scientists, engineers, and thought leaders united in a common \
              purpose: to create a technology platform that will ignite the positive change the world needs. We believe the future \
              should not be defined by the past, and that more is possible - and, through technology, can be made possible for all. \
              We measure the worth of a task not by its challenge, but by its results.",

              "Every ada holder also holds a stake in the Cardano network. Ada stored in a wallet can be delegated to a stake pool \
              to earn rewards – to participate in the successful running of the network – or pledged to a stake pool to increase the \
              pool’s likelihood of receiving rewards. In time, ada will also be usable for a variety of applications and services on \
              the Cardano platform.",
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
              title={"Purpose"}
              subtitle={
                "A platform built for a sustainable future, to help people work better together, trust one another, and build global solutions to global problems."
              }
              text={[
                "Cardano is a fork in the road. It takes us from where we’ve been to where we’re destined to go: a global society that \
                  is secure, transparent, and fair, and which serves the many as well as the few. Like the technological revolutions that \
                  have come before, it offers a new template for how we work, interact, and create, as individuals, businesses, and \
                  societies.",

                "Cardano began with a vision of a world without intermediaries, in which power is not controlled by an accountable few, \
                but by the empowered many. In this world, individuals have control over their data and how they interact and transact. \
                Businesses have the opportunity to grow independent of monopolistic and bureaucratic power structures. Societies are able \
                to pursue true democracy: self-governing, fair, and accountable. It is a world made possible by Cardano.",
              ]}
              isImageRight={true}
              id={"purpose"}
            />

            <ImageWithText
              imageName={"discover/technology.webp"}
              title={"Technology"}
              subtitle={
                "Cardano brings a new standard in technology - open and inclusive – to challenge the old and activate a new age of sustainable, globally-distributed innovation."
              }
              text={[
                "From the incremental to global, Cardano improves how we interact, transact, and create - and ultimately operate as a \
                  global society.",

                "Cardano is a blockchain platform built on the groundbreaking Ouroboros proof-of-stake consensus protocol, and developed \
                  using the Haskell programming language: a functional programming language that enables Cardano to pursue evidence-based \
                  development, for unparalleled security and stability.",

                "Our technology is underpinned by [research](/research). We have redefined what it means to create a global software platform through \
                  scientific methods. We have not compromised on our belief, or in our approach. To build a better future - secure, \
                  sustainable, and governable by the many - we have taken the road less traveled. The result of our efforts is a blockchain \
                  platform unparalleled in its capability and performance, and which is truly able to support global applications, systems, \
                  and real-life business use cases.",
              ]}
              isImageRight={false}
              id={"technology"}
            />

            <ImageWithText
              imageName={"discover/research.webp"}
              title={"Research"}
              subtitle={"Pioneering tech begins with groundbreaking research."}
              text={[
                "Cardano began with and has grown through [research](/research). Before any technology we integrate is developed, it is specified. \
                  And before it is specified, it is researched. That [research](/research) is peer-reviewed - a unique achievement for a blockchain \
                  platform - so that our ideas may be challenged before they are validated.",

                "[Our research](/research) - led by leading academics - explores philosophy, sociology, behavior, and game theory. To achieve each \
                outcome, we consider the minutiae of possibilities: the variables that often go unconsidered, but which may ultimately \
                impact the integrity and sustainability of a global, decentralized platform. We take nothing for granted.",
              ]}
              isImageRight={true}
              id={"research"}
            />

            <ImageWithText
              imageName={"discover/opportunity.webp"}
              title={"Opportunity"}
              subtitle={
                "The staging point for every new opportunity. Empower your business through Cardano, and discover the future of technology."
              }
              text={[
                "Cardano provides the template and toolset to a new age of innovation. It introduces leading-edge technologies, models, \
                  and methodologies to help individuals, developers, and enterprises discover a new possible, realize change, and enrich \
                  their lives..",

                "Blockchain technology holds the answer to a number of legacy challenges, whether financial, societal, or technological. \
                  It disintermediates essential relationships, and redistributes power to alleviate costly dependencies, restrictive paradigms, \
                  and inefficient systems of transaction and exchange. Cardano is a realization of this potential. It is a platform with the \
                  security, privacy sustainability, and performance standards required to accelerate the mass adoption of the technology, and \
                  support a lasting ecosystem.",

                "Cardano powers new, more secure, and globally scalable solutions. Its technology is continuously improved upon through \
                  evidence-based development methods, and guided by a democratic voting system, in which every member has a voice. The \
                  opportunity of Cardano is adaptable to your use case. It is an opportunity that creates other opportunities, continuously.",
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
