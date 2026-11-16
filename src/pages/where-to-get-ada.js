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
import QuizCard from "@site/src/components/QuizCard";
import { getQuizData as getSecurityQuiz } from "@site/src/data/quiz/generated/security";
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
  const securityQuiz = getSecurityQuiz();

  return (
    <Layout
    title={translate({id: 'whereToGetAda.meta.title', message: 'Buy ada, Where to Get Cardano\'s Native Token'})}
    description={translate({id: 'whereToGetAda.meta.description', message: 'Buy ada on centralized or decentralized exchanges, earn staking rewards, or receive it directly. Find the best way to get Cardano\'s native token.'})}
    >
      <OpenGraphInfo pageName="where-to-get-ada" />
      <HomepageHeader />
      <main>

      <BackgroundWrapper backgroundType={"zoom"}>

        <BoundaryBox>
            <Divider text={translate({id: 'whereToGetAda.divider.exchanges', message: 'Buy ada using Exchanges'})} id="exchanges"/>
            <TitleWithText headingLevel={2}

                title={translate({id: 'whereToGetAda.cex.title', message: 'Centralized Exchanges'})}
                description={[

                 translate({id: 'whereToGetAda.cex.description', message: "Centralized exchanges (CEXs) are platforms where cryptocurrencies and other digital assets are traded. They act as intermediaries between buyers and sellers, facilitating transactions and often providing additional services such as custodial storage, order matching, and regulatory compliance. Note that CEXs have custody over [ada](/what-is-ada/) and other native tokens until you send them to a [wallet](/what-is-a-wallet) that you control."}),

                ]}
                headingDot={true}
              />

            <SpacerBox size="small"/>
            <ExchangePicker />
            <SpacerBox size="small"/>


            <TitleWithText headingLevel={2}
              description={[
                translate({id: 'whereToGetAda.cex.disclaimer', message: 'Listing here does not imply endorsement. This data is crowd-sourced by the community. Visit [CoinMarketCap](https://coinmarketcap.com/currencies/cardano/#Markets) to see a full list of exchanges that support [ada](/what-is-ada/).'}),
              ]}
              titleType="black"
            />

            <SpacerBox size="medium"/>

            <TitleWithText headingLevel={2}

            title={translate({id: 'whereToGetAda.dex.title', message: 'Decentralized Exchanges'})}
            description={[

            translate({id: 'whereToGetAda.dex.description', message: "Decentralized exchanges (DEXs) are platforms for trading cryptocurrencies that operate without a central authority. They allow users to trade directly with each other (peer-to-peer) through automated processes facilitated by smart contracts. You keep your ada in your own wallet instead of handing it to an exchange, but smart contracts carry their own risks, and every trade is public on the blockchain."}),

            ]}
            headingDot={false}
            />

            <AppGrid categories={['dex']} limit={5} showRank={false} showStats={true} ctaText={translate({ id: "whereToGetAda.dex.visit", message: "Visit DEX" })} moreTitle={translate({ id: "whereToGetAda.dex.more", message: "More DEXes" })} />
            <SpacerBox size="medium"/>

            <TitleWithText headingLevel={2}
              description={[
                translate({id: 'whereToGetAda.dex.disclaimer', message: 'DEXs are not suitable for beginners, as you must already have [ada](/what-is-ada/) to use them. Listing here does not imply endorsement. Transaction data is based on the last 30 days.'}),
              ]}
              titleType="black"
            />
         </BoundaryBox>
      </BackgroundWrapper>

      <BoundaryBox>
            <Divider text={translate({id: 'whereToGetAda.divider.receive', message: 'Receive ada from people around the world'})} id ="receive"/>
            <TitleWithText headingLevel={2}

                title={translate({id: 'whereToGetAda.receive.title', message: 'Receive ada'})}
                description={[

                  translate({id: 'whereToGetAda.receive.description1', message: "To hold [ada](/what-is-ada/) yourself, you need a [Cardano wallet](/what-is-a-wallet)."}),
                  translate({id: 'whereToGetAda.receive.description2', message: "Once you have a [Cardano wallet](/what-is-a-wallet), share its receiving address with anyone who wants to send you [ada](/what-is-ada/) (or other native tokens) peer-to-peer. To send ada, enter the recipient's address in your wallet and approve the transaction."}),
                  translate({id: 'whereToGetAda.receive.description3', message: "Some [wallets](/wallets) let you purchase crypto with a debit/credit card, bank transfer, or Apple Pay. Availability depends on your location."})

                ]}
                headingDot={true}
              />
        </BoundaryBox>


        <BoundaryBox>
            <Divider text={translate({id: 'whereToGetAda.divider.funding', message: 'Get funded in ada'})} id ="funding"/>
            <TitleWithText headingLevel={2}

                title={translate({id: 'whereToGetAda.funding.title', message: 'Project Catalyst'})}
                description={[

                 translate({id: 'whereToGetAda.funding.description', message: "Project Catalyst is Cardano's community innovation fund. It pays [ada](/what-is-ada/) to proposals that the community votes for. Visit [Project Catalyst](https://projectcatalyst.io) to see whether a funding round is open."}),
                 translate({id: 'whereToGetAda.funding.directory', message: 'Catalyst is one of several routes. The [grants and funding page](/grants-funding) lists grants, treasury proposals, accelerators, and venture funds, and says who each one is for.'}),

                ]}
                headingDot={true}
              />
        </BoundaryBox>



        <BoundaryBox>
            <Divider text={translate({id: 'whereToGetAda.divider.rewards', message: 'Staking rewards'})} id ="rewards"/>
            <TitleWithText headingLevel={2}

                title={translate({id: 'whereToGetAda.staking.title', message: 'Staking rewards'})}
                description={[

                 translate({id: 'whereToGetAda.staking.description1', message: "If you already have some [ada](/what-is-ada/), you can earn more by [delegating your ada to a stake pool](/stake-pool-delegation/). This allows you to participate in the network's [proof-of-stake](/glossary/proof-of-stake) system and earn rewards. Alternatively, you can [run your own stake pool](/stake-pool-operation/), which takes more effort, technical knowledge and a refundable 500 ada pool deposit."}),
                 translate({id: 'whereToGetAda.staking.description2', message: "Cardano offers several advantages for [staking](/glossary/staking). Registering your stake key takes a refundable [deposit](/glossary/stake-address-deposit) of 2 [ada](/what-is-ada/). Beyond that, there is no minimum amount. There is no risk of slashing (losing your staked ada) and no locking period. Your ada stays in your wallet, so you can spend it at any time. Rewards are paid by the protocol itself, not by the pools."})

                ]}
                headingDot={true}
              />
        </BoundaryBox>

        <BoundaryBox>
            <TitleWithText headingLevel={2}
              description={translate({id: 'whereToGetAda.learn.description', message: "New to Cardano? [What is Cardano](/what-is-cardano#get-started) explains the platform in plain terms, and the [learning path](/learn) takes you on from there step by step."})}
            />
            <SpacerBox size="small"/>
            <QuizCard
              quizData={securityQuiz}
              title={translate({id: 'whereToGetAda.quiz.title', message: "Test what you learned"})}
              description={securityQuiz.description}
              buttonText={translate({id: 'whereToGetAda.quiz.buttonText', message: "Start quiz"})}
              questionCount={securityQuiz.questionCount}
              allowRetry={false}
            />
        </BoundaryBox>
        <SpacerBox size="medium"/>
      </main>
    </Layout>
  );
}
