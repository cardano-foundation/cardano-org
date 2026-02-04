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
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import {translate} from '@docusaurus/Translate';

/* FIXME: shouldn't this file be named "Cardano Integration"? */

function HomepageHeader() {
  return (
    <SiteHero
      title={translate({id: 'exchanges.hero.title', message: 'Integrate Cardano'})}
      description={translate({id: 'exchanges.hero.description', message: 'Easy integration with Cardano. All of the upgrades. None of the maintenance.'})}
      bannerType="fluidBlue"
    />
  );
}

export default function Home() {

  return (
    <Layout
    title={translate({id: 'exchanges.layout.title', message: 'Integrate Cardano | cardano.org'})}
    description={translate({id: 'exchanges.layout.description', message: 'Easy integration with Cardano. All of the upgrades. None of the maintenance.'})}
    >
      <OpenGraphInfo pageName="integrate-cardano" />
      <HomepageHeader />
      <main>
        <BoundaryBox>
          <SpacerBox size="small" />
          <TitleWithText
              description={[
                translate({id: 'exchanges.intro.description', message: 'There are various [ways to integrate Cardano](https://developers.cardano.org), one of which is Adrestia. The Adrestia team focuses on supporting exchange and developer integrations by providing a wallet SDK and set of APIs that make it easier for developers and exchanges to integrate and interact with Cardano across releases.'}),
              ]}
              titleType="black"
              headingDot={true}
            />

             <Divider text={translate({id: 'exchanges.whyAdrestia.divider', message: 'Why Adrestia?'})} />
              <TwoColumnBox
                leftText={[
                  translate({id: 'exchanges.whyAdrestia.leftText', message: 'Blockchains - and especially Cardano - are fast developing. Staying up to date with releases can become a maintenance challenge. We\'re committed to making it as easy as possible to develop and integrate with Cardano. Through Adrestia, Cardano is adaptable to your systems and requirements.'}),
                ]}
                rightText={[
                  translate({id: 'exchanges.whyAdrestia.rightText', message: 'Improvements to Cardano should not mean greater complexity or resource overhead. We want to innovate and deploy improvements as they\'re available, and as they become necessary. This might mean a few updates one month, and many the next. Adrestia is a consistent SDK and set of GraphQL APIs that make it easy for developers to create applications and maintain core compatibility and functionality with the Cardano network across releases.'}),
                ]}
              />
               <SpacerBox size="small" />
        </BoundaryBox>


        <BackgroundWrapper backgroundType={"gradientLight"}>
          <BoundaryBox>
            <CtaOneColumn
              title={translate({id: 'exchanges.cta1.title', message: 'Focus On What Matters. Leave The Rest To Us.'})}
              buttonLabel={translate({id: 'exchanges.cta1.buttonLabel', message: 'Access Adrestia'})}
              buttonLink={"https://input-output-hk.github.io/adrestia/"}
            />
          </BoundaryBox>
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <Divider text={translate({id: 'exchanges.accessAdrestia.divider', message: 'Access Adrestia'})} />
            <TitleWithText
                title={translate({id: 'exchanges.whatMakesDifferent.title', message: 'What makes Adrestia different?'})}
                description={[
                  translate({id: 'exchanges.whatMakesDifferent.description1', message: 'Cardano\'s architecture is built for modularity and adaptability. Through Adrestia, we\'re able to save developers and exchanges significant maintenance overhead and, most importantly, time.'}),

                  translate({id: 'exchanges.whatMakesDifferent.description2', message: 'Unlike most blockchain API suites, Adrestia decouples and splits out key services from the core Cardano node. The new SDK and APIs are consistent across releases, which means developers are not required to re-learn the platform with each release. Adrestia offers a host of self-contained services and ways to query, transact, and extract information.'}),

                ]}
                titleType="black"
                headingDot={true}
              />

            <DottedImageWithText
              imageName="dots-with-line"
              title={translate({id: 'exchanges.benefits.reduceTime.title', message: 'Reduce Time To Market'})}
              text={[
                translate({id: 'exchanges.benefits.reduceTime.text', message: 'Develop applications for Cardano without worrying about new releases breaking your code.'}),
              ]}
              headingDot={true}
              />

            <DottedImageWithText
              imageName="ada-upturned-hand"
              title={translate({id: 'exchanges.benefits.reduceDowntime.title', message: 'Reduce Downtime'})}
              text={[
                translate({id: 'exchanges.benefits.reduceDowntime.text', message: 'Fewer backward compatibility issues mean significantly reduced downtime.'}),
              ]}
              />

            <DottedImageWithText
              imageName="machine-squares"
              title={translate({id: 'exchanges.benefits.reduceMaintenance.title', message: 'Reduce Maintenance Costs'})}
              text={[
                translate({id: 'exchanges.benefits.reduceMaintenance.text', message: 'Spend less time and resources on maintaining application compatibility across releases.'}),
              ]}
              />

            <DottedImageWithText
                imageName="power-arrows"
                title={translate({id: 'exchanges.benefits.increaseProductivity.title', message: 'Increase Productivity'})}
                text={[
                  translate({id: 'exchanges.benefits.increaseProductivity.text', message: 'Focus on what matters - application and wallet development - and leave the updates to us.'}),
                ]}
                />

          </BoundaryBox>
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={"ada"}>
          <BoundaryBox>
            <CtaOneColumn
              title={translate({id: 'exchanges.cta2.title', message: 'Discover how components work and interact with the Cardano core node, and choose the right component to suit your requirements.'})}
              buttonLabel={translate({id: 'exchanges.cta2.buttonLabel', message: 'Learn the Core Node Architecture'})}
              buttonLink={"https://input-output-hk.github.io/adrestia/code/Adrestia-Architecture"}
            />
          </BoundaryBox>
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <Divider text={translate({id: 'exchanges.learnArchitecture.divider', message: 'Learn the Core Node Architecture'})} />
            <TitleWithText
                title={translate({id: 'exchanges.howDoesItWork.title', message: 'How Does It Work?'})}
                description={[
                  translate({id: 'exchanges.howDoesItWork.description', message: 'Cardano introduces an additional layer between users and developers and the core node. Within this layer, our code node team tracks and manages complex changes, potential issues, and hard forks that arise from protocol improvements. We implement necessary updates across Adrestia libraries and APIs, and take care of the maintenance so you don\'t have to.'}),
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
                  leftTitle={translate({id: 'exchanges.ctaTwoColumn.leftTitle', message: 'Adrestia User Guide'})}
                  leftText={translate({id: 'exchanges.ctaTwoColumn.leftText', message: 'Find out more about Adrestia and what it could mean for you. Our user guide is a handy, straight-forward resource to help you determine which actions to take and when.'})}
                  leftButtonLabel={translate({id: 'exchanges.ctaTwoColumn.leftButtonLabel', message: 'Access Adrestia'})}
                  leftButtonLink={"https://input-output-hk.github.io/adrestia/cardano-wallet/developers/api-references"}
                  leftHeadingDot={false}
                  rightTitle={translate({id: 'exchanges.ctaTwoColumn.rightTitle', message: 'Adrestia Component Overview & Flow Chart Guide'})}
                  rightText={translate({id: 'exchanges.ctaTwoColumn.rightText', message: 'Discover our new, self-contained set of libraries and APIs to decide which is right for you.'})}
                  rightButtonLabel={translate({id: 'exchanges.ctaTwoColumn.rightButtonLabel', message: 'Find out more'})}
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
