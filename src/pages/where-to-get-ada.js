import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import DottedImageWithText  from "@site/src/components/Layout/DottedImageWithText";
import Divider from "@site/src/components/Layout/Divider";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import ExchangePicker from "@site/src/components/ExchangePicker";
import AppGrid from "@site/src/components/AppGrid";

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="Where to get ada?"
      description={[
        "There are many ways to obtain ada to use the Cardano blockchain."
      ]}
      bannerType="ada"
    />
  );
}

export default function Home() {

  return (
    <Layout
    title="Get ada | cardano.org"
    description="There are many ways to obtain ada to use the Cardano blockchain."
    >
      <OpenGraphInfo pageName="where-to-get-ada" /> 
      <HomepageHeader />
      <main>
        
      <BackgroundWrapper backgroundType={"zoom"}>
              
        <BoundaryBox>
            <Divider text="Buy ada using Exchanges" id="exchanges"/>
            <TitleWithText
                
                title="Centralized Exchanges"
                description={[
                  
                 "Centralized exchanges (CEXs) are platforms where cryptocurrencies and other digital assets are traded. They act as intermediaries between buyers and sellers, facilitating transactions and often providing additional services such as custodial storage, order matching, and regulatory compliance. Note that CEXs have custody over [ada](/what-is-ada/)  and other native tokens until you send them to a [wallet](/what-is-ada/#wallets) that you control.",
                  
                ]}
                headingDot={true}
              />
            
            <SpacerBox size="small"/>
            <ExchangePicker />
            <SpacerBox size="small"/>
            

            <TitleWithText 
              description={[
                "Listing here does not imply endorsement. This data is crowd-sourced by the community. Visit [CoinMarketCap](https://coinmarketcap.com/currencies/cardano/#Markets) to see a full list of exchanges that support [ada](/what-is-ada/).",
              ]}
              titleType="black"
            />

            <SpacerBox size="medium"/>

            <TitleWithText

            title="Decentralized Exchanges"
            description={[
              
            "Decentralized exchanges (DEXs) are platforms for trading cryptocurrencies that operate without a central authority. They allow users to trade directly with each other (peer-to-peer) through automated processes facilitated by smart contracts. This approach enhances security and privacy, reducing the risk of hacking and custodial failures associated with centralized exchanges.",
              
            ]}
            headingDot={false}
            />

            <AppGrid tags={['dex']} limit={5} showRank={false} showStats={true} ctaText="Visit DEX" moreTitle="More DEXes" />
            <SpacerBox size="medium"/>

            <TitleWithText 
              description={[
                "DEXs are not suitable for beginners, as you must already have [ada](/what-is-ada/) to use them. Listing here does not imply endorsement. Transaction data is based on the last 30 days.",
              ]}
              titleType="black"
            />
         </BoundaryBox>
      </BackgroundWrapper>

      <BoundaryBox>
            <Divider text="Receive ada from people around the world" id ="receive"/>
            <TitleWithText
                
                title="Receive ada"
                description={[
                 
                  "Before receiving or buying [ada](/what-is-ada/), you need to set up a [Cardano wallet](/what-is-ada/#wallets).", "Once you have a [Cardano wallet](/what-is-ada/#wallets), all you need to do is share your address to start sending and receiving [ada](/what-is-ada/) (and other native tokens) peer-to-peer.",
                 "Some [wallets](/what-is-ada/#wallets) let you purchase crypto with a debit/credit card, bank transfer, or Apple Pay. Availability depends on your location."
                 
                ]}
                headingDot={true}
              />
        </BoundaryBox>

     
        <BoundaryBox>
            <Divider text="Get funded in ada" id ="funding"/>
            <TitleWithText
                
                title="Project Catalyst"
                description={[
                  
                 "Discover Cardano’s innovation fund designed to support groundbreaking projects and ideas. By participating, you can receive [ada](/what-is-ada/) funding to bring your vision to life. Visit [Project Catalyst](https://projectcatalyst.io) and learn how to create a proposal.",
                 
                ]}
                headingDot={true}
              />
        </BoundaryBox>
      

      
        <BoundaryBox>
            <Divider text="Staking rewards" id ="rewards"/>
            <TitleWithText
                
                title="Staking rewards"
                description={[
                  
                 "If you already have some [ada](/what-is-ada/), you can earn more by [delegating your ada to a stake pool](/stake-pool-delegation/). This allows you to participate in the network’s proof-of-stake system and earn rewards. Alternatively, you can [run your own stake pool](/stake-pool-operation/), which requires more effort and technical knowledge but can be more rewarding.",
                 "Cardano offers several advantages for staking: there is no minimum amount of [ada](/what-is-ada/) required to stake, no risk of slashing (losing your staked [ada](/what-is-ada/)), and no locking period. You always maintain custody over your delegated [ada](/what-is-ada/), ensuring that your funds remain secure and accessible at all times. Additionally, rewards are distributed by the protocol itself, not by the pools, ensuring a fair and transparent distribution process."
                 
                ]}
                headingDot={true}
              />
        </BoundaryBox>
        <SpacerBox size="medium"/>
      </main>
    </Layout>
  );
}
