import { translate } from "@docusaurus/Translate";
import { academyUrl } from "@site/src/data/quiz/academy";
import {
  FaInfoCircle, FaCoins, FaWallet, FaPlay,
  FaSearch, FaShoppingCart, FaShieldAlt, FaLayerGroup, FaThLarge,
  FaCog, FaBalanceScale, FaCodeBranch, FaBook,
  FaVoteYea, FaUsers, FaPiggyBank, FaScroll, FaServer, FaCalculator,
  FaFlask, FaChartLine, FaHistory, FaBuilding, FaGraduationCap, FaCode,
} from "react-icons/fa";

export const ACADEMY_URL = academyUrl("landing", { medium: "learn", campaign: "learn_hub" });

// The five stages of /learn. Only routes that exist may appear here, the
// site build fails on broken links. New explainer pages join a stage by
// adding an item, the page itself does not change.
export function getLearningPath() {
  return [
    {
      key: "start",
      anchor: "start",
      level: "beginner",
      title: translate({ id: "learn.stage.start.title", message: "Start here" }),
      intro: translate({ id: "learn.stage.start.intro", message: "What Cardano is, what ada is, and the one tool you need to use either of them." }),
      quiz: translate({ id: "learn.stage.start.quiz", message: "Check what you learned with the [basics quiz](/quiz)." }),
      items: [
        { key: "what-is-cardano", href: "/what-is-cardano", icon: <FaInfoCircle />, title: translate({ id: "learn.item.whatIsCardano.title", message: "What is Cardano?" }), text: translate({ id: "learn.item.whatIsCardano.text", message: "The platform in plain terms: how it works, what makes it different, who runs it." }) },
        { key: "what-is-ada", href: "/what-is-ada", icon: <FaCoins />, title: translate({ id: "learn.item.whatIsAda.title", message: "What is ada?" }), text: translate({ id: "learn.item.whatIsAda.text", message: "The currency of the network, what it is used for and how to get it." }) },
        { key: "what-is-a-wallet", href: "/what-is-a-wallet", icon: <FaWallet />, title: translate({ id: "learn.item.whatIsAWallet.title", message: "What is a wallet?" }), text: translate({ id: "learn.item.whatIsAWallet.text", message: "Your keys, your ada. Wallet types, recovery phrases and how to stay safe." }) },
        { key: "get-started", href: "/get-started", icon: <FaPlay />, title: translate({ id: "learn.item.getStarted.title", message: "Get started" }), text: translate({ id: "learn.item.getStarted.text", message: "A guided walk-through from download to your first transaction." }) },
      ],
    },
    {
      key: "use",
      anchor: "use",
      level: "beginner",
      title: translate({ id: "learn.stage.use.title", message: "Use Cardano" }),
      intro: translate({ id: "learn.stage.use.intro", message: "Pick a wallet, get your first ada, keep it safe and put it to work." }),
      quiz: translate({ id: "learn.stage.use.quiz", message: "Check what you learned with the [wallets and security quizzes](/quiz)." }),
      items: [
        { key: "wallets", href: "/wallets", icon: <FaSearch />, title: translate({ id: "learn.item.wallets.title", message: "Find a wallet" }), text: translate({ id: "learn.item.wallets.text", message: "Compare wallets by platform, features and hardware support." }) },
        { key: "where-to-get-ada", href: "/where-to-get-ada", icon: <FaShoppingCart />, title: translate({ id: "learn.item.whereToGetAda.title", message: "Where to get ada" }), text: translate({ id: "learn.item.whereToGetAda.text", message: "Trusted exchanges and other ways to get ada." }) },
        { key: "common-scams", href: "/common-scams", icon: <FaShieldAlt />, title: translate({ id: "learn.item.commonScams.title", message: "Protect your ada" }), text: translate({ id: "learn.item.commonScams.text", message: "The scams that catch newcomers, and how to spot them." }) },
        { key: "delegation", href: "/stake-pool-delegation", icon: <FaLayerGroup />, title: translate({ id: "learn.item.delegation.title", message: "Delegate your ada" }), text: translate({ id: "learn.item.delegation.text", message: "Earn rewards by delegating to a stake pool, without giving up custody." }) },
        { key: "apps", href: "/apps", icon: <FaThLarge />, title: translate({ id: "learn.item.apps.title", message: "Explore apps" }), text: translate({ id: "learn.item.apps.text", message: "Curated wallets, exchanges, DeFi, identity and more." }) },
      ],
    },
    {
      key: "technology",
      anchor: "technology",
      level: "intermediate",
      title: translate({ id: "learn.stage.technology.title", message: "Understand the technology" }),
      intro: translate({ id: "learn.stage.technology.intro", message: "How the network reaches agreement, how it scales and how it changes over time." }),
      quiz: translate({ id: "learn.stage.technology.quiz", message: "Check what you learned with the [technical quiz](/quiz)." }),
      items: [
        { key: "ouroboros", href: "/ouroboros", icon: <FaCog />, title: translate({ id: "learn.item.ouroboros.title", message: "Ouroboros" }), text: translate({ id: "learn.item.ouroboros.text", message: "The proof-of-stake protocol behind every block." }) },
        { key: "stablecoins", href: "/stablecoins", icon: <FaBalanceScale />, title: translate({ id: "learn.item.stablecoins.title", message: "Stablecoins" }), text: translate({ id: "learn.item.stablecoins.text", message: "Stable value on Cardano: how the main stablecoins work and where to use them." }) },
        { key: "layer-2", href: "/layer-2", icon: <FaLayerGroup />, title: translate({ id: "learn.item.layer2.title", message: "Layer 2" }), text: translate({ id: "learn.item.layer2.text", message: "Hydra, Midnight and the other networks that extend Cardano." }) },
        { key: "hardforks", href: "/hardforks", icon: <FaCodeBranch />, title: translate({ id: "learn.item.hardforks.title", message: "Hard forks" }), text: translate({ id: "learn.item.hardforks.text", message: "Every protocol upgrade since launch, and how upgrades happen." }) },
        { key: "glossary", href: "/glossary", icon: <FaBook />, title: translate({ id: "learn.item.glossary.title", message: "Glossary" }), text: translate({ id: "learn.item.glossary.text", message: "Every term, explained, with mental models and sources." }) },
      ],
    },
    {
      key: "take-part",
      anchor: "take-part",
      level: "intermediate",
      title: translate({ id: "learn.stage.takePart.title", message: "Take part" }),
      intro: translate({ id: "learn.stage.takePart.intro", message: "Every ada carries a vote and a stake. Here is how to use both." }),
      quiz: translate({ id: "learn.stage.takePart.quiz", message: "Check what you learned with the [governance and staking quizzes](/quiz)." }),
      items: [
        { key: "governance", href: "/governance", icon: <FaVoteYea />, title: translate({ id: "learn.item.governance.title", message: "Governance" }), text: translate({ id: "learn.item.governance.text", message: "How on-chain governance works and where to start." }) },
        { key: "delegate-votes", href: "/governance/delegate", icon: <FaUsers />, title: translate({ id: "learn.item.delegateVotes.title", message: "Delegate your voting power" }), text: translate({ id: "learn.item.delegateVotes.text", message: "Find a representative who votes the way you would." }) },
        { key: "treasury", href: "/governance/treasury", icon: <FaPiggyBank />, title: translate({ id: "learn.item.treasury.title", message: "The treasury" }), text: translate({ id: "learn.item.treasury.text", message: "How the community fund is filled and spent." }) },
        { key: "constitution", href: "/constitution", icon: <FaScroll />, title: translate({ id: "learn.item.constitution.title", message: "The constitution" }), text: translate({ id: "learn.item.constitution.text", message: "The rules the community ratified, in full." }) },
        { key: "spo", href: "/stake-pool-operation", icon: <FaServer />, title: translate({ id: "learn.item.spo.title", message: "Run a stake pool" }), text: translate({ id: "learn.item.spo.text", message: "What it takes to operate a pool and produce blocks." }) },
        { key: "calculator", href: "/calculator", icon: <FaCalculator />, title: translate({ id: "learn.item.calculator.title", message: "Staking calculator" }), text: translate({ id: "learn.item.calculator.text", message: "Estimate rewards for delegating or running a pool." }) },
      ],
    },
    {
      key: "go-deeper",
      anchor: "go-deeper",
      level: "advanced",
      title: translate({ id: "learn.stage.goDeeper.title", message: "Go deeper" }),
      intro: translate({ id: "learn.stage.goDeeper.intro", message: "Research, data and courses for people who want the full picture." }),
      items: [
        { key: "research", href: "/research", icon: <FaFlask />, title: translate({ id: "learn.item.research.title", message: "Research" }), text: translate({ id: "learn.item.research.text", message: "The peer-reviewed papers Cardano is built on." }) },
        { key: "insights", href: "/insights", icon: <FaChartLine />, title: translate({ id: "learn.item.insights.title", message: "Insights" }), text: translate({ id: "learn.item.insights.text", message: "Live and regularly refreshed on-chain data." }) },
        { key: "genesis", href: "/genesis", icon: <FaHistory />, title: translate({ id: "learn.item.genesis.title", message: "Genesis" }), text: translate({ id: "learn.item.genesis.text", message: "How Cardano started and who launched it." }) },
        { key: "entities", href: "/entities", icon: <FaBuilding />, title: translate({ id: "learn.item.entities.title", message: "Entities" }), text: translate({ id: "learn.item.entities.text", message: "The organizations that contribute to Cardano today." }) },
        { key: "academy", href: ACADEMY_URL, icon: <FaGraduationCap />, title: translate({ id: "learn.item.academy.title", message: "Cardano Academy" }), text: translate({ id: "learn.item.academy.text", message: "Free, self-paced courses with certificates." }) },
        { key: "developers", href: "https://developers.cardano.org", icon: <FaCode />, title: translate({ id: "learn.item.developers.title", message: "Developer portal" }), text: translate({ id: "learn.item.developers.text", message: "Build on Cardano, from first transaction to smart contracts." }) },
      ],
    },
  ];
}

const LEVEL_LABELS = {
  beginner: () => translate({ id: "learn.level.beginner", message: "Beginner" }),
  intermediate: () => translate({ id: "learn.level.intermediate", message: "Intermediate" }),
  advanced: () => translate({ id: "learn.level.advanced", message: "Advanced" }),
};

export function getLevelLabel(level) {
  return (LEVEL_LABELS[level] || LEVEL_LABELS.beginner)();
}
