import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import WhatIsAda from "@site/src/components/WhatIsAda";
import HowToBuyAdaSection from "@site/src/components/HowToBuyAdaSection";
import WalletSection from "@site/src/components/WalletSection";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
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

  return (
    <Layout
      title={translate({id: 'whatIsAda.meta.title', message: 'What is ada? | cardano.org'})}
      description={translate({id: 'whatIsAda.meta.description', message: 'A new type of currency. A new means of transaction. Direct. Secure. From Anywhere. For Everyone.'})}
    >
      <OpenGraphInfo pageName="what-is-ada" />
      <HomepageHeader />
      <main>
        <BoundaryBox>
          <WhatIsAda
            headline={translate({id: 'whatIsAda.section.headline', message: 'What is ada?'})}
            title={translate({id: 'whatIsAda.section.title', message: 'Ada Is The Native Token Of Cardano'})}
            description={[
              translate({id: 'whatIsAda.section.description1', message: 'It is named after Ada Lovelace: a 19th-century mathematician who is recognized as the first computer programmer, and is the daughter of the poet Lord Byron.'}),
              translate({id: 'whatIsAda.section.description2', message: 'Ada is a digital currency. Any user, located anywhere in the world, can use ada as a secure exchange of value – without requiring a third party to mediate the exchange. Every transaction is permanently, securely, and transparently recorded on the Cardano blockchain.'}),
              translate({id: 'whatIsAda.section.description3', message: 'Every ada holder also holds a stake in the Cardano network. Ada stored in a wallet can be delegated to a stake pool to earn rewards – to participate in the successful running of the network – or found and run your own stake pool to increase the pool\'s likelihood of receiving rewards. In time, ada will also be usable for a variety of applications and services on the Cardano platform.'}),
            ]}
            quote={translate({id: 'whatIsAda.section.quote', message: 'What can I do with ada?'})}
          />
        </BoundaryBox>
        <HowToBuyAdaSection />
        <BoundaryBox>
          <WalletSection />
        </BoundaryBox>
        <SpacerBox size="medium" />
      </main>
    </Layout>
  );
}
