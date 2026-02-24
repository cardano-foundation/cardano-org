import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import GenesisStats from "@site/src/components/GenesisStats";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import {translate} from '@docusaurus/Translate';

function HomepageHeader() {
  return (
    <SiteHero
      title={translate({id: 'genesis.hero.title', message: 'Genesis'})}
      description={translate({id: 'genesis.hero.description', message: 'Distribution of ada token vouchers, which are part of the Cardano settlement layer, took place in Asia in four stages between October 2015 and the start of January 2017.'})}
      bannerType="starburst"
    />
  );
}

export default function Home() {

  return (
    <Layout
      title={translate({id: 'genesis.layout.title', message: 'Genesis Distribution | cardano.org'})}
      description={translate({id: 'genesis.layout.description', message: 'Distribution of ada token vouchers, which are part of the Cardano settlement layer, took place in Asia in four stages between October 2015 and the start of January 2017.'})}
    >
      <OpenGraphInfo pageName="genesis" />
      <HomepageHeader />
      <main>
        <BoundaryBox>
          <Divider text={translate({id: 'genesis.divider.distribution', message: 'Genesis Distribution'})} />
          <TitleWithText
            title={translate({id: 'genesis.distribution.title', message: 'Distribution'})}
            description={[
              translate({id: 'genesis.distribution.paragraph1', message: 'The initial distribution of ada, essentially a pre-launch sales event, was the first in the cryptocurrency industry to set Know Your Customer guidelines, and an audit was performed on the distribution process. Information and statistics about the voucher distribution are detailed below in the Ada Voucher Distribution Stats section.'}),

              translate({id: 'genesis.distribution.paragraph2', message: 'In addition to these ada, the Genesis Block Distribution includes an amount equal to 20% of the ada vouchers sold during the Sale period, or **5,185,414,108 ada**. These have been generated and distributed to three groups of entities of the Cardano ecosystem that are part of the Technical and Business Development Pool; IOHK, EMURGO, and the Cardano Foundation, as follows:'}),

              translate({id: 'genesis.distribution.cardanoFoundation', message: 'The Cardano Foundation, Switzerland: **648,176,761 ada**'}),

              translate({id: 'genesis.distribution.emurgo', message: 'EMURGO: **2,074,165,644 ada**'}),

              translate({id: 'genesis.distribution.iohk', message: 'IOHK: **2,463,071,701 ada**'}),

              translate({id: 'genesis.distribution.totalAmount', message: 'The public sales distribution accounts for **25,927,070,538 ada**. The total amount of ada available at launch was therefore equal to **31,112,484,646 ada**.'}),

              translate({id: 'genesis.distribution.supplyTracking', message: 'Since the Genesis Block, and especially since the Shelley phase with staking rewards, Cardano token distribution and supply have been continuously expanding. This can be tracked epoch by epoch on the [Supply Insight page](/insights/supply).'})
            ]}
            titleType="black"
            headingDot={true}
          />
        </BoundaryBox>

        <BackgroundWrapper backgroundStyle="solidGrey">
          <BoundaryBox>
            <Divider text={translate({id: 'genesis.divider.proceeds', message: 'Genesis Proceeds'})} />
            <TitleWithText
            title={translate({id: 'genesis.proceeds.title', message: 'Proceeds'})}
            description={[
              translate({id: 'genesis.proceeds.paragraph1', message: 'The ada vouchers were sold by a Japanese corporation and its sales force in Japan with total gross sales of 108,844.5 BTC. Further information on the sale can be found here.'}),

              translate({id: 'genesis.proceeds.paragraph2', message: 'A part of the total sales proceeds were donated to the Cardano Foundation as follows:'}),

              translate({id: 'genesis.proceeds.isleOfMan', message: 'Cardano Foundation, Isle of Man (predecessor): **1,090.00 BTC**'}),

              translate({id: 'genesis.proceeds.switzerland', message: 'Cardano Foundation, Switzerland: **7,168.00 BTC**'}),
            ]}
            titleType="black"
            headingDot={true}
          />
          </BoundaryBox>
        </BackgroundWrapper> 

        <GenesisStats />

      </main>
    </Layout>
  );
}
