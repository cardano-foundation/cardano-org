import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import QuizCard from "@site/src/components/QuizCard";
import TwoColumnLayout from "@site/src/components/TwoColumnLayout";
import scamsQuizData from "@site/src/data/quiz-scams.json";
import {translate} from '@docusaurus/Translate';



function HomepageHeader() {
  return (
    <SiteHero
      title={translate({id: 'commonScams.hero.title', message: 'Common Cardano scams'})}
      description={translate({id: 'commonScams.hero.description', message: 'The cryptocurrency space is full of opportunities, but it\'s also a playground for scammers.'})}
      bannerType="starburst"
    />
  );
}

export default function Home() {
  return (
    <Layout
      title={translate({id: 'commonScams.meta.title', message: 'Common Cardano scams you should avoid | cardano.org'})}
      description={translate({id: 'commonScams.meta.description', message: 'The cryptocurrency space is full of opportunities, but it\'s also a playground for scammers.'})}
    >
      <OpenGraphInfo pageName="common-scams" />
      <HomepageHeader />
      <BackgroundWrapper backgroundType={"zoom"}>
        <BoundaryBox>
          <TwoColumnLayout
            sidebar={
              <QuizCard
                quizData={scamsQuizData}
                title={translate({id: 'commonScams.quiz.title', message: 'Test Your Knowledge'})}
                description={translate({id: 'commonScams.quiz.description', message: 'Take the 5-question quiz to see how well you can identify and avoid common blockchain scams.'})}
                buttonText={translate({id: 'commonScams.quiz.buttonText', message: 'Start Quiz'})}
                questionCount={5}
                passingScore={80}
                allowRetry={false}
                showDot={true}
              />
            }
          >
            <TitleWithText
              title={translate({id: 'commonScams.intro.title', message: 'Protecting your ada from scammers'})}
              description={[
                translate({id: 'commonScams.intro.description1', message: 'The cryptocurrency space is full of opportunities, but it\'s also a playground for scammers. Cardano (ada), one of the most popular blockchains, isn\'t immune to these threats. From fake giveaways to phishing attacks, scammers are constantly innovating new ways to exploit users. As artificial intelligence continues to improve, these scams are also becoming more sophisticated. This page outlines the most common scams in the Cardano ecosystem and how you can protect yourself.'}),
                translate({id: 'commonScams.intro.description2', message: '**Remember:** If someone gains access to your seed words (recovery phrase), they can take full control of your wallet—no spending password can protect you. Once your ada is stolen, it\'s gone forever, with no way to recover it.'}),
              ]}
              headingDot={true}
            />

          <Divider text={translate({id: 'commonScams.divider.giveaway', message: 'Giveaway'})} id="giveaway"/>
          <TitleWithText
            title={translate({id: 'commonScams.giveaway.title', message: 'Ada Giveaway Scam'})}
            description={[
              translate({id: 'commonScams.giveaway.description1', message: 'One of the most well-known scams targeting the Cardano community is the **Ada Giveaway Scam.** Scammers promise to double your ada if you send them a certain amount first. These scams often feature fake live streams of Charles Hoskinson, or other well-known personalities, to appear legitimate. The streams may mimic genuine events and include a wallet address for you to send your ada.'}),
              translate({id: 'commonScams.giveaway.howToProtect', message: 'How to protect yourself:'}),
              {
                list: [
                  translate({id: 'commonScams.giveaway.tip1', message: 'Legitimate giveaways **never** ask for money upfront.'}),
                  translate({id: 'commonScams.giveaway.tip2', message: 'Avoid clicking on links in unsolicited messages or live streams.'}),
                  translate({id: 'commonScams.giveaway.tip3', message: 'Remember: Once sent, your ada is gone forever.'}),
                  translate({id: 'commonScams.giveaway.tip4', message: 'Read reports and scam sightings from users in [the Cardano forum](https://forum.cardano.org/c/english/report-a-scam/184).'}),
                ],
              },
            ]}
            headingDot={false}
          />

          <Divider text={translate({id: 'commonScams.divider.phishing', message: 'Phishing'})} id="phishing"/>
          <TitleWithText
            title={translate({id: 'commonScams.phishing.title', message: 'Phishing Attacks'})}
            description={[
              translate({id: 'commonScams.phishing.description', message: 'Phishing scams involve fake websites, apps or emails designed to steal sensitive information, such as your wallet credentials or recovery phrase (seed words). These fraudulent sites often mimic popular wallets like [Typhon, VESPR or Eternl](/what-is-ada/#wallets).'}),
              translate({id: 'commonScams.phishing.howToProtect', message: 'How to protect yourself:'}),
              {
                list: [
                  translate({id: 'commonScams.phishing.tip1', message: 'Double-check URLs to ensure they match actual wallet websites.'}),
                  translate({id: 'commonScams.phishing.tip2', message: '**Never** share your recovery phrase, **even** with "support" staff or "moderators".'}),
                  translate({id: 'commonScams.phishing.tip3', message: 'Consider using hardware wallets.'}),
                  translate({id: 'commonScams.phishing.tip4', message: 'Use two-factor authentication where possible.'}),
                ],
              },
            ]}
            headingDot={false}
          />

          <Divider text={translate({id: 'commonScams.divider.investment', message: 'Fake Investment'})} id="investment"/>
          <TitleWithText
            title={translate({id: 'commonScams.investment.title', message: 'Fake Investment Opportunities'})}
            description={[
              translate({id: 'commonScams.investment.description', message: 'Fraudulent investment schemes are another popular scam. Scammers promote fake projects, claiming they are "Cardano-backed" or "ada-specific" opportunities with guaranteed high returns. Victims are urged to send ada or other funds to a provided wallet address, with promises of earning exponential profits.'}),
              translate({id: 'commonScams.investment.howToProtect', message: 'How to protect yourself:'}),
              {
                list: [
                  translate({id: 'commonScams.investment.tip1', message: 'Legitimate projects **never** promise guaranteed returns.'}),
                  translate({id: 'commonScams.investment.tip2', message: 'Be skeptical of unsolicited investment offers.'}),
                  translate({id: 'commonScams.investment.tip3', message: 'Research projects thoroughly, checking for transparency and a credible team.'}),
                ],
              },
            ]}
            headingDot={false}
          />


          <Divider text={translate({id: 'commonScams.divider.support', message: 'Fake Support'})} id="support"/>
          <TitleWithText
            title={translate({id: 'commonScams.support.title', message: 'Fake Tech Support'})}
            description={[
              translate({id: 'commonScams.support.description1', message: 'In this scam, fraudsters pose as "official" Cardano support representatives. They often reach out via social media, forums, or email, claiming they can fix your wallet or troubleshoot an issue. They also often copy the profiles of real moderators and to "help," they\'ll ask for your recovery phrase (seed words) or private keys.'}),
              translate({id: 'commonScams.support.description2', message: 'This scam is often seen when a [new user enters a channel](/docs/communities) and asks a question about a wallet. Scammers quickly respond, pretending to be official support.'}),
              translate({id: 'commonScams.support.howToProtect', message: 'How to protect yourself:'}),
              {
                list: [
                  translate({id: 'commonScams.support.tip1', message: 'Legitimate people on [forums and channels](/docs/communities) will **never** ask for your passwords, recovery phrases or private keys.'}),
                  translate({id: 'commonScams.support.tip2', message: 'Never engage with unsolicited messages claiming to be from support.'}),
                  translate({id: 'commonScams.support.tip3', message: 'Legitimate people on forums and channels will **never** contact you first in a private message.'}),
                ],
              },
            ]}
            headingDot={false}
          />

          <Divider text={translate({id: 'commonScams.divider.rug', message: 'Rug Pulls'})} id="rug"/>
          <TitleWithText
            title={translate({id: 'commonScams.rug.title', message: 'Rug Pulls in Cardano Ecosystem'})}
            description={[
              translate({id: 'commonScams.rug.description', message: 'Cardano is a public, permissionless Layer 1 blockchain and everyone can use it. Some fraudulent projects launch on Cardano, gaining attention with big promises and flashy marketing. After collecting a significant amount of ada from investors, these projects disappear—this is known as a "rug pull."'}),
              translate({id: 'commonScams.rug.howToProtect', message: 'How to protect yourself:'}),
              {
                list: [
                  translate({id: 'commonScams.rug.tip1', message: 'Research the project team\'s credentials and reputation.'}),
                  translate({id: 'commonScams.rug.tip2', message: 'Check for audits or transparent documentation.'}),
                  translate({id: 'commonScams.rug.tip3', message: 'Avoid projects with anonymous teams or unrealistic promises.'}),
                  translate({id: 'commonScams.rug.tip4', message: 'Only get utility tokens when you need to use the utility.'}),
                  translate({id: 'commonScams.rug.tip5', message: 'Find out what other people think about projects in [the Cardano forum](https://forum.cardano.org/c/english/report-a-scam/184).'}),
                ],
              },
            ]}
            headingDot={false}
          />
          </TwoColumnLayout>

         <SpacerBox size="large" />
        </BoundaryBox>
      </BackgroundWrapper>

    </Layout>
  );
}
