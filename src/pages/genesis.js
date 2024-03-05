import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import GenesisStats from "@site/src/components/GenesisStats";

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="Genesis"
      description="Distribution of ada token vouchers, which are part of the Cardano settlement layer, 
      took place in Asia in four stages between October 2015 and the start of January 2017."
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
          <Divider text="Genesis Distribution" />
          <TitleWithText 
            title="Distribution"
            description={[
              "The initial distribution of ada, essentially a pre-launch sales event, was the first in the cryptocurrency industry to \
              set Know Your Customer guidelines, and an audit was performed on the distribution process. Information and statistics \
              about the voucher distribution are detailed below in the Ada Voucher Distribution Stats section.",

              "In addition to these ada, the Genesis Block Distribution includes an amount equal to 20% of the ada vouchers sold during \
              the Sale period, or **5,185,414,108 ada**. These have been generated and distributed to three groups of entities of the \
              Cardano ecosystem that are part of the Technical and Business Development Pool; IOHK, EMURGO, and the Cardano Foundation, \
              as follows:",
              
              "The Cardano Foundation, Switzerland: **648,176,761 ada**",
              
              "EMURGO: **2,074,165,644 ada**",
              
              "IOHK: **2,463,071,701 ada**",
              
              "The public sales distribution accounts for **25,927,070,538 ada**. The total amount of ada available at launch was therefore \
              equal to **31,112,484,646 ada**."
            ]}
            titleType="black"
            headingDot={true}
          />
        </BoundaryBox>

        <BackgroundWrapper backgroundStyle="solidGrey">
          <BoundaryBox>
            <Divider text="Genesis Proceeds" />
            <TitleWithText 
            title="Proceeds"
            description={[
              "The ada vouchers were sold by a Japanese corporation and its sales force in Japan with total gross sales of \
              108,844.5 BTC. Further information on the sale can be found here.",

              "A part of the total sales proceeds were donated to the Cardano Foundation as follows:",
              
              "Cardano Foundation, Isle of Man (predecessor): **1,090.00 BTC**",
              
              "Cardano Foundation, Switzerland: **7,168.00 BTC**",
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
