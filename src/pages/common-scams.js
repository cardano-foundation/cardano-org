import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
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

 

function HomepageHeader() {
  const { siteTitle } = useDocusaurusContext();
  return (
    <SiteHero
      title="Common Cardano scams"
      description="The cryptocurrency space is full of opportunities, but it’s also a playground for scammers."
      bannerType="starburst"
    />
  );
}

export default function Home() {
  return (
    <Layout
      title="Common Cardano scams you should avoid | cardano.org"
      description="The cryptocurrency space is full of opportunities, but it’s also a playground for scammers."
    >
      <OpenGraphInfo pageName="common-scams" />
      <HomepageHeader />
      <BackgroundWrapper backgroundType={"zoom"}>
        <BoundaryBox>
          <TwoColumnLayout
            sidebar={
              <QuizCard
                quizData={scamsQuizData}
                title="Test Your Knowledge"
                description="Take the 5-question quiz to see how well you can identify and avoid common blockchain scams."
                buttonText="Start Quiz"
                questionCount={5}
                passingScore={80}
                allowRetry={false}
                showDot={true}
              />
            }
          >
            <TitleWithText
              title="Protecting your ada from scammers"
              description={["The cryptocurrency space is full of opportunities, but it's also a playground for scammers. Cardano (ada), one of the most popular blockchains, isn't immune to these threats. From fake giveaways to phishing attacks, scammers are constantly innovating new ways to exploit users. As artificial intelligence continues to improve, these scams are also becoming more sophisticated. This page outlines the most common scams in the Cardano ecosystem and how you can protect yourself.",

              "**Remember:** If someone gains access to your seed words (recovery phrase), they can take full control of your wallet—no spending password can protect you. Once your ada is stolen, it's gone forever, with no way to recover it.",

              ]}
              headingDot={true}
            />

          <Divider text="Giveaway" id="giveaway"/>
          <TitleWithText
            title="Ada Giveaway Scam"
            description= {[ "One of the most well-known scams targeting the Cardano community is the **Ada Giveaway Scam.** Scammers promise to double your ada if you send them a certain amount first. These scams often feature fake live streams of Charles Hoskinson, or other well-known personalities, to appear legitimate. The streams may mimic genuine events and include a wallet address for you to send your ada.",

            "How to protect yourself:",
            {
              list: [
                "Legitimate giveaways **never** ask for money upfront.",
                "Avoid clicking on links in unsolicited messages or live streams.",
                "Remember: Once sent, your ada is gone forever.",
                "Read reports and scam sightings from users in [the Cardano forum](https://forum.cardano.org/c/english/report-a-scam/184).",
              ],
            },
          ]}
            headingDot={false}
          />

          <Divider text="Phishing" id="phishing"/>
          <TitleWithText
            title="Phishing Attacks"
            description= {[ "Phishing scams involve fake websites, apps or emails designed to steal sensitive information, such as your wallet credentials or recovery phrase (seed words). These fraudulent sites often mimic popular wallets like [Typhon, VESPR or Eternl](what-is-ada#wallets).",

            "How to protect yourself:",
            {
              list: [
                "Double-check URLs to ensure they match actual wallet websites.",
                "**Never** share your recovery phrase, **even** with “support” staff or “moderators”.",
                "Consider using hardware wallets.",
                "Use two-factor authentication where possible.",
              ],
            },
          ]}
            headingDot={false}
          />

          <Divider text="Fake Investment" id="investment"/>
          <TitleWithText
            title="Fake Investment Opportunities"
            description= {[ "Fraudulent investment schemes are another popular scam. Scammers promote fake projects, claiming they are “Cardano-backed” or “ada-specific” opportunities with guaranteed high returns. Victims are urged to send ada or other funds to a provided wallet address, with promises of earning exponential profits.",

            "How to protect yourself:",
            {
              list: [
                "Legitimate projects **never** promise guaranteed returns.",
                "Be skeptical of unsolicited investment offers.",
                "Research projects thoroughly, checking for transparency and a credible team..",
              ],
            },
          ]}
            headingDot={false}
          />


          <Divider text="Fake Support" id="support"/>
          <TitleWithText
            title="Fake Tech Support"
            description= {[ "In this scam, fraudsters pose as “official“ Cardano support representatives. They often reach out via social media, forums, or email, claiming they can fix your wallet or troubleshoot an issue. They also often copy the profiles of real moderators and to “help,” they’ll ask for your recovery phrase (seed words) or private keys.",
            
            "This scam is often seen when a [new user enters a channel](/docs/communities) and asks a question about a wallet. Scammers quickly respond, pretending to be official support.",

            "How to protect yourself:",
            {
              list: [
                "Legitimate people on [forums and channels](/docs/communities) will **never** ask for your passwords, recovery phrases or private keys.",
                "Never engage with unsolicited messages claiming to be from support.",
                "Legitimate people on forums and channels will **never** contact you first in a private message.",
              ],
            },
          ]}
            headingDot={false}
          />

          <Divider text="Rug Pulls" id="rug"/>
          <TitleWithText
            title="Rug Pulls in Cardano Ecosystem"
            description= {[ "Cardano is a public, permissionless Layer 1 blockchain and everyone can use it. Some fraudulent projects launch on Cardano, gaining attention with big promises and flashy marketing. After collecting a significant amount of ada from investors, these projects disappear—this is known as a “rug pull.”",

            "How to protect yourself:",
            {
              list: [
                "Research the project team’s credentials and reputation.",
                "Check for audits or transparent documentation.",
                "Avoid projects with anonymous teams or unrealistic promises.",
                "Only get utility tokens when you need to use the utility.",
                "Find out what other people think about projects in [the Cardano forum](https://forum.cardano.org/c/english/report-a-scam/184).",
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