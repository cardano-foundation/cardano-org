import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import WhatIsAda from "@site/src/components/WhatIsAda";
import HowToBuyAdaSection from "@site/src/components/HowToBuyAdaSection";
import WalletSection from "@site/src/components/WalletSection";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import QuizCard from "@site/src/components/QuizCard";
import { getQuizData as getBasicsQuiz } from "@site/src/data/quiz/generated/basics";
import {translate} from '@docusaurus/Translate';

function HomepageHeader() {
  return (
    <SiteHero
      title={translate({id: 'whatIsAda.hero.title', message: 'What is ada?'})}
      description={[
        translate({id: 'whatIsAda.hero.description1', message: 'A new type of currency. A new means of transaction.'}),
        <br key="line1" />,
        translate({id: 'whatIsAda.hero.description2', message: 'Direct. Secure. From Anywhere. For Everyone.'}),
      ]}
      bannerType="ada"
    />
  );
}

export default function Home() {
  const basicsQuiz = getBasicsQuiz();

  return (
    <Layout
      title={translate({id: 'whatIsAda.meta.title', message: 'What Is ada, the Native Token of Cardano'})}
      description={translate({id: 'whatIsAda.meta.description', message: 'ada is the native cryptocurrency of the Cardano blockchain. Use it for transactions, staking, governance voting, and interacting with decentralized applications.'})}
    >
      <OpenGraphInfo pageName="what-is-ada" />
      <HomepageHeader />
      <main>
        <BoundaryBox>
          <WhatIsAda
            headline={translate({id: 'whatIsAda.section.headline', message: 'What is ada?'})}
            title={translate({id: 'whatIsAda.section.title', message: "Ada is the native currency of Cardano"})}
            description={[
              translate({id: 'whatIsAda.section.description1', message: 'It is named after Ada Lovelace: a 19th-century mathematician who is recognized as the first computer programmer, and is the daughter of the poet Lord Byron.'}),
              translate({id: 'whatIsAda.section.description2', message: "Ada is a digital currency. Anyone, anywhere in the world, can use ada to exchange value directly, without a third party in between. Every transaction is recorded permanently and transparently on the Cardano blockchain."}),
              translate({id: 'whatIsAda.section.description3', message: "Every ada holder also holds a stake in the Cardano network. You can delegate your ada to a stake pool to help run the network and earn rewards, and it never leaves your wallet while you do. Ada pays the fees for every transaction, lets you take part in on-chain governance by voting as a DRep or delegating your voting power to one, and is used across the applications and services built on Cardano."}),
            ]}
            quote={translate({id: 'whatIsAda.section.quote', message: 'What can I do with ada?'})}
          />
          <TitleWithText headingLevel={2}
            description={translate({id: 'whatIsAda.section.platformLink', message: "New to the platform itself? Read [what Cardano is](/what-is-cardano). Ready to put your ada to work? [Delegate it to a stake pool](/stake-pool-delegation) and [delegate your voting power](/governance/delegate)."})}
          />
        </BoundaryBox>
        <HowToBuyAdaSection />
        <BoundaryBox>
          <WalletSection />
        </BoundaryBox>
        <BoundaryBox>
          <QuizCard
            quizData={basicsQuiz}
            title={translate({id: 'whatIsAda.quiz.title', message: "Test what you learned"})}
            description={basicsQuiz.description}
            buttonText={translate({id: 'whatIsAda.quiz.buttonText', message: "Start quiz"})}
            questionCount={basicsQuiz.questionCount}
            allowRetry={false}
          />
        </BoundaryBox>
        <SpacerBox size="medium" />
      </main>
    </Layout>
  );
}
