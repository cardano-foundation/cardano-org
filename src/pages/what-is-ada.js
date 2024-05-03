import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import WhatIsAda from "@site/src/components/WhatIsAda";
import HowToBuyAdaSection from "@site/src/components/HowToBuyAdaSection";
import WalletSection from "@site/src/components/WalletSection";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import OpenGraphImage from "@site/src/components/Layout/OpenGraphImage";

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="What is ada?"
      description={[
        "A new type of currency. A new means of transaction.",
        <br key="line1" />, /* FIXME: too hacky */
        "Direct. Secure. From Anywhere. For Everyone.",
      ]}
      bannerType="ada"
    />
  );
}

export default function Home() {

  return (
    <Layout
    title="What is ada? | cardano.org"
    description="A new type of currency. A new means of transaction. Direct. Secure. From Anywhere. For Everyone."
    >
      <OpenGraphImage pageName="what-is-ada" />
      <HomepageHeader />
      <main>
        <BoundaryBox>
          <WhatIsAda
            headline="What is ada?"
            title="Ada Is The Native Token Of Cardano"
            description={[
              "It is named after Ada Lovelace: a 19th-century mathematician who is recognized as the first \
              computer programmer, and is the daughter of the poet Lord Byron.",

              "Ada is a digital currency. Any user, located anywhere in the world, can use ada as a secure \
              exchange of value – without requiring a third party to mediate the exchange. Every transaction \
              is permanently, securely, and transparently recorded on the Cardano blockchain.",

              "Every ada holder also holds a stake in the Cardano network. Ada stored in a wallet can be delegated \
              to a stake pool to earn rewards – to participate in the successful running of the network – or found \
              and run your own stake pool to increase the pool's likelihood of receiving rewards. In time, ada will \
              also be usable for a variety of applications and services on the Cardano platform.",
            ]}
            quote="What can I do with ada?"
          />
        </BoundaryBox>
        <HowToBuyAdaSection />
        <BoundaryBox>
          <WalletSection />
        </BoundaryBox>
      </main>
    </Layout>
  );
}
