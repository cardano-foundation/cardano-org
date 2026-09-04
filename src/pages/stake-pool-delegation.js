import React, { Suspense, lazy } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { translate } from "@docusaurus/Translate";
import SiteHero from "@site/src/components/Layout/SiteHero";
import Divider from "@site/src/components/Layout/Divider";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import CtaOneColumn from "@site/src/components/Layout/CtaOneColumn";
import FAQSection from "@site/src/components/FAQSection";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import AppTile, { StarBadge } from "@site/src/components/AppTile";
import { Showcases } from "@site/src/data/apps";
import { compareByActivityThenPick } from "@site/src/utils/appStats";
import styles from "./stake-pool-delegation.module.css";

// Pool explorers from the app showcase, same ordering as the /apps panels.
const POOL_TOOLS = Showcases.filter((app) => app.category === "pooltool").sort(compareByActivityThenPick);

const StakePoolDelegate = lazy(() =>
  import(/* webpackChunkName: "stake-pool-delegate" */ "@site/src/components/StakePoolDelegate")
);

const loadingFallback = (
  <div style={{ textAlign: "center", padding: "3rem 0" }}>
    {translate({ id: "stakePoolDelegation.delegate.loading", message: "Loading delegation tool…" })}
  </div>
);

function getDelegationFAQData() {
  return [
    {
      question: translate({ id: "delegation.faq.q1", message: "What is a stake pool?" }),
      answer: [
        translate({ id: "delegation.faq.a1.p1", message: "Stake pools are run by stake pool operators, network participants who keep a node online around the clock. The protocol picks a slot leader for each block at random, and the chance of a pool being picked grows with the stake delegated to it. Each block a pool makes earns rewards, which the protocol shares with everyone delegating to that pool in proportion to their stake. Operators deduct their fixed cost and margin from the pool's share before the rest is distributed." }),
      ],
    },
    {
      question: translate({ id: "delegation.faq.q2", message: "Can I re-delegate my stake to another pool?" }),
      answer: [
        translate({ id: "delegation.faq.a2.p1", message: "Yes, at any time. A re-delegation becomes active in the epoch after next. Your old pool still earns you rewards for three more payouts, and the new pool takes over from the fourth. There is no gap and nothing is lost." }),
      ],
    },
    {
      question: translate({ id: "delegation.faq.qFirstRewards", message: "When do my first rewards arrive?" }),
      answer: [
        translate({ id: "delegation.faq.aFirstRewards.p1", message: "About 15 to 20 days after you delegate, provided the pool mints blocks. If you delegate in epoch N, your stake is counted in the snapshot at the start of epoch N+1, becomes active in epoch N+2, the rewards for that epoch are calculated during N+3 and paid at the start of N+4. From then on rewards arrive every epoch and are automatically part of your delegated stake." }),
      ],
    },
    {
      question: translate({ id: "delegation.faq.qVote", message: "Do I also need to delegate my vote?" }),
      answer: [
        translate({ id: "delegation.faq.aVote.p1", message: "Since the Plomin hard fork, staking rewards can only be withdrawn once your stake key also has an active vote delegation. You can delegate to a DRep, or choose abstain or no confidence, on the [vote delegation page](/governance/delegate). Rewards keep accumulating either way." }),
      ],
    },
    {
      question: translate({ id: "delegation.faq.q3", message: "Can I delegate to multiple stake pools?" }),
      answer: [
        translate({ id: "delegation.faq.a3.p1", message: "Some wallets let you split your ada across several accounts and delegate each to a different pool. [Discover wallets](/wallets)." }),
      ],
    },
    {
      question: translate({ id: "delegation.faq.q4", message: "What is stake pool performance?" }),
      answer: [
        translate({ id: "delegation.faq.a4.p1", message: "Performance compares the blocks a pool actually made with the blocks it was expected to make given its stake. The slot leader election is private, so this can only be estimated over time. A pool that has not been picked yet in the current epoch shows a low performance for that epoch even if it is running fine." }),
        translate({ id: "delegation.faq.a4.p2", message: "Performance ratings make more sense over a longer period of time. Pool explorers show lifetime and recent performance side by side." }),
      ],
    },
    {
      question: translate({ id: "delegation.faq.q5", message: "What is stake pool saturation?" }),
      answer: [
        translate({ id: "delegation.faq.a5.p1", message: "A pool is saturated once it holds more stake than the protocol considers ideal. Beyond that point the rewards for everyone in the pool shrink. The limit is set by a protocol parameter and applies to every pool equally." }),
        translate({ id: "delegation.faq.a5.p2", message: "The goal is to keep any single pool from growing too large, which keeps the network decentralized. Each pool's saturation is shown in most wallets and pool explorers, and in the delegation tool above." }),
      ],
    },
    {
      question: translate({ id: "delegation.faq.q8", message: "How should I choose a stake pool?" }),
      answer: [
        translate({ id: "delegation.faq.a8.p1", message: "Choosing a stake pool involves several factors. So-called [pool tools](/apps?tags=pooltool) can help you compare them." }),
        translate({ id: "delegation.faq.a8.p2", message: "**Performance:** Look at the pool's historical performance, which reflects its success rate in producing blocks. A consistently high performance is a good indicator of a well-run pool." }),
        translate({ id: "delegation.faq.a8.p3", message: "**Uptime:** Ensure the pool has high uptime. This means the pool's servers are running without interruption, increasing the chances of being selected to produce a block." }),
        translate({ id: "delegation.faq.a8.p4", message: "**Margin Fees:** Stake pools charge a percentage fee on the rewards earned. Lower fees can mean more rewards, but consider the balance between low fees and high pool performance." }),
        translate({ id: "delegation.faq.a8.p5", message: "**Fixed Fees:** Every pool charges a fixed fee per epoch of at least the [protocol minimum](/glossary/min-pool-cost). The current minimum is shown in the delegation tool above. Check what a pool charges." }),
        translate({ id: "delegation.faq.a8.p6", message: "**Saturation Point:** A pool becomes saturated when it has more stake than an optimal amount set by the protocol. Staking with a saturated pool can decrease your rewards." }),
        translate({ id: "delegation.faq.a8.p9", message: "**Pledge:** Operators commit some of their own ada to their pool. A pool that does not meet its declared [pledge](/glossary/pledge) earns no rewards for that epoch." }),
        translate({ id: "delegation.faq.a8.p7", message: "**Community Engagement:** Look for pools that actively engage with the Cardano community. This can be through educational content, community support, or contributions to the ecosystem." }),
        translate({ id: "delegation.faq.a8.p8", message: "**Mission-Driven Pools:** Some pools donate a portion of their fees to charitable causes or are dedicated to specific missions like environmental sustainability or social impact." }),
      ],
    },
    {
      question: translate({ id: "delegation.faq.q9", message: "How much will I earn in rewards?" }),
      answer: [
        translate({ id: "delegation.faq.a9.p1", message: "The [rewards calculator](/calculator/?calculator=delegator) gives you an estimate. It cannot predict the future: rewards depend on the pool's performance, its fees and the total stake in the network. Protocol parameters can change through on-chain governance, so estimates are subject to change." }),
      ],
    },
    {
      question: translate({ id: "delegation.faq.q10", message: "What wallets are supported and where do I find them?" }),
      answer: [
        translate({ id: "delegation.faq.a10.p1", message: "Most current self-custody Cardano wallets support delegation. Only download wallets from trustworthy sites. [Discover wallets](/wallets)." }),
      ],
    },
    {
      question: translate({ id: "delegation.faq.q12", message: "Will the ada rewards I earn be added to my delegated stake?" }),
      answer: [
        translate({ id: "delegation.faq.a12.p1", message: "Yes. Rewards accrue in your reward account and count towards your delegated stake automatically, so they compound without any action on your part. You can withdraw them to your spending balance at any time once your stake key also has an active vote delegation (see above)." }),
      ],
    },
  ];
}

function Hero() {
  return (
    <SiteHero
      title={[translate({ id: "stakePoolDelegation.hero.title", message: "Delegate Your Stake" })]}
      description={translate({ id: "stakePoolDelegation.hero.description", message: "Connect your wallet, choose a stake pool, and become eligible for staking rewards. Non-custodial, no lock-up, your ada never leaves your wallet and stays spendable." })}
      bannerType="overlap"
    />
  );
}

export default function StakePoolDelegationPage() {
  const steps = [
    {
      label: translate({ id: "stakePoolDelegation.how.wallet.label", message: "Wallet" }),
      text: translate({ id: "stakePoolDelegation.how.wallet.text", message: "Most current self-custody Cardano wallets support delegation. Connect one above or delegate directly inside your wallet app." }),
    },
    {
      label: translate({ id: "stakePoolDelegation.how.pool.label", message: "Pool" }),
      text: translate({ id: "stakePoolDelegation.how.pool.text", message: "Small pools mint blocks less often, so their rewards vary more from epoch to epoch. Compare performance, fees, pledge and saturation before choosing." }),
    },
    {
      label: translate({ id: "stakePoolDelegation.how.sign.label", message: "Sign" }),
      text: translate({ id: "stakePoolDelegation.how.sign.text", message: "One transaction with a small fee. If your stake key is new, it also includes a refundable stake key deposit." }),
    },
    {
      label: translate({ id: "stakePoolDelegation.how.rewards.label", message: "Rewards" }),
      text: translate({ id: "stakePoolDelegation.how.rewards.text", message: "Your delegation becomes active in the epoch after next. If the pool mints blocks, first rewards arrive about 15 to 20 days later and are paid every epoch after that. Rewards compound automatically." }),
    },
  ];

  return (
    <Layout
      title={translate({ id: "stakePoolDelegation.meta.title", message: "Delegate ada to a Stake Pool" })}
      description={translate({ id: "stakePoolDelegation.meta.description", message: "Delegate your ada to a Cardano stake pool directly from cardano.org. Connect your wallet, pick a pool, and become eligible for staking rewards." })}
    >
      <OpenGraphInfo pageName="stake-pool-delegation" />
      <Hero />
      <main>
        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <BrowserOnly fallback={loadingFallback}>
              {() => (
                <Suspense fallback={loadingFallback}>
                  <StakePoolDelegate />
                </Suspense>
              )}
            </BrowserOnly>
            <SpacerBox size="medium" />

            <Divider text={translate({ id: "stakePoolDelegation.how.divider", message: "How delegation works" })} id="how-it-works" />
            <ol className={styles.steps}>
              {steps.map((step) => (
                <li key={step.label}><strong>{step.label}</strong> {step.text}</li>
              ))}
            </ol>
            <p className="black-text">
              {translate({ id: "stakePoolDelegation.how.key", message: "Your ada stays in your wallet and remains spendable at any time. There is no lock-up, and you can switch pools whenever you like." })}
            </p>
            <p className="black-text">
              <Link to="/how-cardano-works#network">{translate({ id: "stakePoolDelegation.how.networkLink", message: "How staking secures the network" })}</Link>
              {" · "}
              <Link to="/glossary/stake-snapshot">{translate({ id: "stakePoolDelegation.how.glossary.snapshot", message: "Stake snapshot" })}</Link>
              {" · "}
              <Link to="/glossary/rewards">{translate({ id: "stakePoolDelegation.how.glossary.rewards", message: "Rewards" })}</Link>
              {" · "}
              <Link to="/glossary/pool-saturation">{translate({ id: "stakePoolDelegation.how.glossary.saturation", message: "Pool saturation" })}</Link>
              {" · "}
              <Link to="/glossary/min-pool-cost">{translate({ id: "stakePoolDelegation.how.glossary.minCost", message: "Minimum pool cost" })}</Link>
            </p>
            <SpacerBox size="medium" />

            <Divider text={translate({ id: "stakePoolDelegation.alt.heading", message: "Prefer another tool?" })} id="alternatives" />
            <p className="black-text">
              {translate({ id: "stakePoolDelegation.alt.intro", message: "These community pool explorers help you compare stake pools in depth." })}
            </p>
            <SpacerBox size="small" />
            <div className={styles.altGrid}>
              {POOL_TOOLS.map((app) => (
                <AppTile key={app.slug} app={app} badge={app.maintainerPick ? <StarBadge /> : null} />
              ))}
            </div>
            <SpacerBox size="small" />
            <p className="black-text">
              {translate({ id: "stakePoolDelegation.alt.wallets", message: "Most wallets can delegate on their own." })}{" "}
              <Link to="/wallets">{translate({ id: "stakePoolDelegation.alt.walletsLink", message: "Find a wallet" })}</Link>
              {" · "}
              <Link to="/apps?tags=pooltool">{translate({ id: "stakePoolDelegation.alt.more", message: "More tools" })}</Link>
            </p>
          </BoundaryBox>
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={"ada"}>
          <BoundaryBox>
            <CtaOneColumn
              title={translate({ id: "stakePoolDelegation.calculatorCta.title", message: "Try our staking calculator to see how much ada you could be rewarded for delegating to a stake pool." })}
              buttonLabel={translate({ id: "stakePoolDelegation.calculatorCta.buttonLabel", message: "Try Out" })}
              buttonLink={"/calculator/?calculator=delegator"}
            />
          </BoundaryBox>
        </BackgroundWrapper>

        <BoundaryBox>
          <FAQSection data={getDelegationFAQData()} />
          <SpacerBox size="medium" />
        </BoundaryBox>
      </main>
    </Layout>
  );
}
