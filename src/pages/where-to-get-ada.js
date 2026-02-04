import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import Divider from "@site/src/components/Layout/Divider";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import ExchangePicker from "@site/src/components/ExchangePicker";
import AppGrid from "@site/src/components/AppGrid";
import {translate} from '@docusaurus/Translate';

function HomepageHeader() {
  return (
    <SiteHero
      title={translate({id: 'whereToGetAda.hero.title', message: 'Where to get ada?'})}
      description={[
        translate({id: 'whereToGetAda.hero.description', message: 'There are many ways to obtain ada to use the Cardano blockchain.'})
      ]}
      bannerType="ada"
    />
  );
}

export default function Home() {

  return (
    <Layout
    title={translate({id: 'whereToGetAda.meta.title', message: 'Get ada | cardano.org'})}
    description={translate({id: 'whereToGetAda.meta.description', message: 'There are many ways to obtain ada to use the Cardano blockchain.'})}
    >
      <OpenGraphInfo pageName="where-to-get-ada" />
      <HomepageHeader />
      <main>

      <BackgroundWrapper backgroundType={"zoom"}>

        <BoundaryBox>
            <Divider text={translate({id: 'whereToGetAda.divider.exchanges', message: 'Buy ada using Exchanges'})} id="exchanges"/>
            <TitleWithText

                title={translate({id: 'whereToGetAda.cex.title', message: 'Centralized Exchanges'})}
                description={[

                 translate({id: 'whereToGetAda.cex.description', message: 'Centralized exchanges (CEXs) are platforms where cryptocurrencies and other digital assets are traded. They act as intermediaries between buyers and sellers, facilitating transactions and often providing additional services such as custodial storage, order matching, and regulatory compliance. Note that CEXs have custody over [ada](/what-is-ada/) and other native tokens until you send them to a [wallet](/what-is-ada/#wallets) that you control.'}),

                ]}
                headingDot={true}
              />

            <SpacerBox size="small"/>
            <ExchangePicker />
            <SpacerBox size="small"/>


            <TitleWithText
              description={[
                translate({id: 'whereToGetAda.cex.disclaimer', message: 'Listing here does not imply endorsement. This data is crowd-sourced by the community. Visit [CoinMarketCap](https://coinmarketcap.com/currencies/cardano/#Markets) to see a full list of exchanges that support [ada](/what-is-ada/).'}),
              ]}
              titleType="black"
            />

            <SpacerBox size="medium"/>

            <TitleWithText

            title={translate({id: 'whereToGetAda.dex.title', message: 'Decentralized Exchanges'})}
            description={[

            translate({id: 'whereToGetAda.dex.description', message: 'Decentralized exchanges (DEXs) are platforms for trading cryptocurrencies that operate without a central authority. They allow users to trade directly with each other (peer-to-peer) through automated processes facilitated by smart contracts. This approach enhances security and privacy, reducing the risk of hacking and custodial failures associated with centralized exchanges.'}),

            ]}
            headingDot={false}
            />

            <AppGrid tags={['dex']} limit={5} showRank={false} showStats={true} ctaText="Visit DEX" moreTitle="More DEXes" />
            <SpacerBox size="medium"/>

            <TitleWithText
              description={[
                translate({id: 'whereToGetAda.dex.disclaimer', message: 'DEXs are not suitable for beginners, as you must already have [ada](/what-is-ada/) to use them. Listing here does not imply endorsement. Transaction data is based on the last 30 days.'}),
              ]}
              titleType="black"
            />
         </BoundaryBox>
      </BackgroundWrapper>

      <BoundaryBox>
            <Divider text={translate({id: 'whereToGetAda.divider.receive', message: 'Receive ada from people around the world'})} id ="receive"/>
            <TitleWithText

                title={translate({id: 'whereToGetAda.receive.title', message: 'Receive ada'})}
                description={[

                  translate({id: 'whereToGetAda.receive.description1', message: 'Before receiving or buying [ada](/what-is-ada/), you need to set up a [Cardano wallet](/what-is-ada/#wallets).'}),
                  translate({id: 'whereToGetAda.receive.description2', message: 'Once you have a [Cardano wallet](/what-is-ada/#wallets), all you need to do is share your address to start sending and receiving [ada](/what-is-ada/) (and other native tokens) peer-to-peer.'}),
                  translate({id: 'whereToGetAda.receive.description3', message: 'Some [wallets](/what-is-ada/#wallets) let you purchase crypto with a debit/credit card, bank transfer, or Apple Pay. Availability depends on your location.'})

                ]}
                headingDot={true}
              />
        </BoundaryBox>


        <BoundaryBox>
            <Divider text={translate({id: 'whereToGetAda.divider.funding', message: 'Get funded in ada'})} id ="funding"/>
            <TitleWithText

                title={translate({id: 'whereToGetAda.funding.title', message: 'Project Catalyst'})}
                description={[

                 translate({id: 'whereToGetAda.funding.description', message: 'Discover Cardano\'s innovation fund designed to support groundbreaking projects and ideas. By participating, you can receive [ada](/what-is-ada/) funding to bring your vision to life. Visit [Project Catalyst](https://projectcatalyst.io) and learn how to create a proposal.'}),

                ]}
                headingDot={true}
              />
        </BoundaryBox>



        <BoundaryBox>
            <Divider text={translate({id: 'whereToGetAda.divider.rewards', message: 'Staking rewards'})} id ="rewards"/>
            <TitleWithText

                title={translate({id: 'whereToGetAda.staking.title', message: 'Staking rewards'})}
                description={[

                 translate({id: 'whereToGetAda.staking.description1', message: 'If you already have some [ada](/what-is-ada/), you can earn more by [delegating your ada to a stake pool](/stake-pool-delegation/). This allows you to participate in the network\'s proof-of-stake system and earn rewards. Alternatively, you can [run your own stake pool](/stake-pool-operation/), which requires more effort and technical knowledge but can be more rewarding.'}),
                 translate({id: 'whereToGetAda.staking.description2', message: 'Cardano offers several advantages for staking: there is no minimum amount of [ada](/what-is-ada/) required to stake, no risk of slashing (losing your staked [ada](/what-is-ada/)), and no locking period. You always maintain custody over your delegated [ada](/what-is-ada/), ensuring that your funds remain secure and accessible at all times. Additionally, rewards are distributed by the protocol itself, not by the pools, ensuring a fair and transparent distribution process.'})

                ]}
                headingDot={true}
              />
        </BoundaryBox>
        <SpacerBox size="medium"/>
      </main>
    </Layout>
  );
}
