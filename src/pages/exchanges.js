import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import Divider from "@site/src/components/Layout/Divider";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import TwoColumnBox from "@site/src/components/Layout/TwoColumnBox";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import CtaOneColumn from "@site/src/components/Layout/CtaOneColumn";
import CtaTwoColumn from "@site/src/components/Layout/CtaTwoColumn";
import DottedImageWithText from "@site/src/components/Layout/DottedImageWithText";
import OpenGraphImage from "@site/src/components/Layout/OpenGraphImage";

/* FIXME: shouldn't this file be named "Cardano Integration"? */

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="Integrate Cardano"
      description="Easy integration with Cardano. All of the upgrades. None of the maintenance."
      bannerType="fluidBlue"
    />
  );
}

export default function Home() {

  return (
    <Layout
    title="Integrate Cardano | cardano.org"
    description="Easy integration with Cardano. All of the upgrades. None of the maintenance."
    >
      <OpenGraphImage pageName="integrate-cardano" />
      <HomepageHeader />
      <main>
        <BoundaryBox>
          <SpacerBox size="small" />
          <TitleWithText   
              description={[
                "There are various [ways to integrate Cardano](https://developers.cardano.org), one of which is Adrestia. The Adrestia team focuses on \
                supporting exchange and developer integrations by providing a wallet SDK and set of APIs that make it \
                easier for developers and exchanges to integrate and interact with Cardano across releases.",
              ]}
              titleType="black"
              headingDot={true}
            />
        
             <Divider text="Why Adrestia?" />
              <TwoColumnBox 
                leftText={[
                  "Blockchains - and especially Cardano - are fast developing. Staying up to date with releases can become a maintenance challenge. \
                  We’re committed to making it as easy as possible to develop and integrate with Cardano. Through Adrestia, Cardano is adaptable to \
                  your systems and requirements.",
                ]}
                rightText={[
                  "Improvements to Cardano should not mean greater complexity or resource overhead. We want to innovate and deploy improvements as \
                  they’re available, and as they become necessary. This might mean a few updates one month, and many the next. Adrestia is a \
                  consistent SDK and set of GraphQL APIs that make it easy for developers to create applications and maintain core compatibility \
                  and functionality with the Cardano network across releases.",
                ]}
              />
               <SpacerBox size="small" />
        </BoundaryBox>


        <BackgroundWrapper backgroundType={"gradientLight"}>
          <BoundaryBox>
            <CtaOneColumn
              title="Focus On What Matters. Leave The Rest To Us."
              buttonLabel={"Access Adrestia"}
              buttonLink={"https://input-output-hk.github.io/adrestia/"}
            />
          </BoundaryBox>
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <Divider text="Access Adrestia" />
            <TitleWithText   
                title="What makes Adrestia different?"
                description={[
                  "Cardano’s architecture is built for modularity and adaptability. Through Adrestia, we’re able to save developers and \
                  exchanges significant maintenance overhead and, most importantly, time.",

                  "Unlike most blockchain API suites, Adrestia decouples and splits out key services from the core Cardano node. The new \
                  SDK and APIs are consistent across releases, which means developers are not required to re-learn the platform with each \
                  release. Adrestia offers a host of self-contained services and ways to query, transact, and extract information.",

                ]}
                titleType="black"
                headingDot={true}
              />

            <DottedImageWithText
              imageName="dots-with-line"
              title="Reduce Time To Market"
              text={[
                "Develop applications for Cardano without worrying about new releases breaking your code.",
              ]}
              headingDot={true}
              />

            <DottedImageWithText
              imageName="ada-upturned-hand"
              title="Reduce Downtime"
              text={[
                "Fewer backward compatibility issues mean significantly reduced downtime.",
              ]}
              />

            <DottedImageWithText
              imageName="machine-squares"
              title="Reduce Maintenance Costs"
              text={[
                "Spend less time and resources on maintaining application compatibility across releases.",
              ]}
              />

            <DottedImageWithText
                imageName="power-arrows"
                title="Increase Productivity"
                text={[
                  "Focus on what matters - application and wallet development - and leave the updates to us.",
                ]}
                />

          </BoundaryBox>
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={"ada"}>
          <BoundaryBox>
            <CtaOneColumn
              title="Discover how components work and interact with the Cardano core node, and choose the right component to suit your requirements."
              buttonLabel={"Learn the Core Node Architecture"}
              buttonLink={"https://input-output-hk.github.io/adrestia/code/Adrestia-Architecture"}
            />
          </BoundaryBox>
        </BackgroundWrapper>
        
        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <Divider text="Learn the Core Node Architecture" />
            <TitleWithText   
                title="How Does It Work?"
                description={[
                  "Cardano introduces an additional layer between users and developers and the core node. Within this layer, our code node \
                  team tracks and manages complex changes, potential issues, and hard forks that arise from protocol improvements. We \
                  implement necessary updates across Adrestia libraries and APIs, and take care of the maintenance so you don’t have to.",
                ]}
                titleType="black"
                headingDot={true}
              />
              <SpacerBox size="medium" />
          </BoundaryBox>
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={"gradientLight"}>
          <BoundaryBox>
            <CtaTwoColumn
                  leftTitle="Adrestia User Guide"
                  leftText="Find out more about Adrestia and what it could mean for you. Our user guide is a handy, straight-forward resource to help you determine which actions to take and when."
                  leftButtonLabel={"Access Adrestia"}
                  leftButtonLink={"https://input-output-hk.github.io/adrestia/cardano-wallet/developers/api-references"}
                  leftHeadingDot={false}
                  rightTitle="Adrestia Component Overview & Flow Chart Guide"
                  rightText="Discover our new, self-contained set of libraries and APIs to decide which is right for you."
                  rightButtonLabel={"Find out more"}
                  rightButtonLink={"https://input-output-hk.github.io/adrestia/cardano-wallet/user-guide"}
                  rightHeadingDot={false}
                />
          </BoundaryBox>
        </BackgroundWrapper>

        <SpacerBox size="medium" />
      </main>
    </Layout>
  );
}
