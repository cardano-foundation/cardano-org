import { translate } from "@docusaurus/Translate";

// Data for /roadmap. Upcoming upgrades come from the Intersect upgrade hub
// and the teams' own trackers; enacted upgrades keep the hardforks.* ids from
// the former /hardforks page so their translations carry over. Nothing here
// is dated by hand except a target a source states. When a hard fork is
// enacted, move its entry from getUpcoming() to the top of getUpgrades().

const UPGRADE_HUB_URL = "https://cardanoupgrades.docs.intersectmbo.org/";
const DIJKSTRA_OVERVIEW_URL =
  "https://cardanoupgrades.docs.intersectmbo.org/dijkstra-era-upgrade/dijkstra-upgrade-overview";
const LEIOS_TRACKER_URL = "https://engineering.iog.io/leios";
const PERAS_TRACKER_URL = "https://peras-tracker.tweag.io/";
const VISION_2030_URL = "https://product.cardano.intersectmbo.org/vision/";
const ORIGINAL_ROADMAP_URL = "https://roadmap.cardano.org/";

// The three readers every upcoming upgrade speaks to, in row order.
export function getReaders() {
  return [
    { key: "users", label: translate({ id: "roadmap.reader.users", message: "If you use Cardano" }) },
    { key: "builders", label: translate({ id: "roadmap.reader.builders", message: "If you build on Cardano" }) },
    { key: "operators", label: translate({ id: "roadmap.reader.operators", message: "If you run a stake pool" }) },
  ];
}

// Where an upcoming upgrade is, in the words of the steps below. The pill
// tone and label come from here and nowhere else.
export function describeStage(stage) {
  switch (stage) {
    case "development":
      return { tone: "info", label: translate({ id: "roadmap.stage.development", message: "In development" }) };
    case "testnets":
      return { tone: "info", label: translate({ id: "roadmap.stage.testnets", message: "On testnets" }) };
    case "vote":
      return { tone: "warning", label: translate({ id: "roadmap.stage.vote", message: "Up for vote" }) };
    case "scheduled":
      return { tone: "warning", label: translate({ id: "roadmap.stage.scheduled", message: "Scheduled" }) };
    default:
      return { tone: "success", label: translate({ id: "roadmap.stage.live", message: "Live" }) };
  }
}

// What the next upgrades change, outcome first. Each links to where the
// mechanism is explained.
export function getOutcomes() {
  return [
    {
      key: "capacity",
      icon: "capacity",
      accent: "blue",
      href: "/glossary/leios",
      title: translate({ id: "roadmap.outcome.capacity.title", message: "More capacity" }),
      text: translate({
        id: "roadmap.outcome.capacity.text",
        message: "Linear Leios lets every block carry more transactions, raised step by step after it activates, so busy periods clear faster.",
      }),
    },
    {
      key: "settlement",
      icon: "settlement",
      accent: "teal",
      href: "/news/2025-04-11-ouroboros-peras/",
      title: translate({ id: "roadmap.outcome.settlement.title", message: "Faster settlement" }),
      text: translate({
        id: "roadmap.outcome.settlement.text",
        message: "Peras lets stake pools vote on recent blocks, so a transaction counts as final in about two minutes instead of hours.",
      }),
    },
    {
      key: "programmability",
      icon: "programmability",
      accent: "violet",
      href: "/glossary/dijkstra",
      title: translate({ id: "roadmap.outcome.programmability.title", message: "Better programmability" }),
      text: translate({
        id: "roadmap.outcome.programmability.text",
        message: "Nested transactions let one transaction cover fees or collateral for others, and Plutus V4 gives scripts a new context.",
      }),
    },
  ];
}

// Upgrades being built, next one first. `target` only when the source states
// one. `fact` is the one sourced figure or headline content for the card;
// `forReaders` holds one line per reader key from getReaders(). The first
// entry of `links` is the card's link.
export function getUpcoming() {
  return [
    {
      key: "dijkstra-1",
      name: translate({ id: "roadmap.upcoming.dijkstra1.name", message: "Dijkstra, phase 1" }),
      era: translate({ id: "roadmap.upcoming.dijkstra1.era", message: "Dijkstra era, protocol version 12" }),
      stage: "development",
      target: translate({ id: "roadmap.upcoming.dijkstra1.target", message: "Targeted Q4 2026" }),
      outcome: translate({
        id: "roadmap.upcoming.dijkstra1.outcome",
        message: "More transactions per block with Ouroboros Linear Leios, and transactions that can pay for each other.",
      }),
      fact: translate({ id: "roadmap.upcoming.dijkstra1.fact", message: "Linear Leios, nested transactions, and Plutus V4" }),
      forReaders: {
        users: translate({
          id: "roadmap.upcoming.dijkstra1.users",
          message: "More room in every block, so busy periods clear faster. Nothing to do on your side.",
        }),
        builders: translate({
          id: "roadmap.upcoming.dijkstra1.builders",
          message: "Nested transactions, Plutus V4, and a new block and transaction format: indexers and wallets need an update.",
        }),
        operators: translate({
          id: "roadmap.upcoming.dijkstra1.operators",
          message: "A new node release, and BLS keys to register so your pool can vote on Leios blocks.",
        }),
      },
      links: [
        { label: translate({ id: "roadmap.link.dijkstraOverview", message: "Upgrade overview (Intersect)" }), href: DIJKSTRA_OVERVIEW_URL },
        { label: translate({ id: "roadmap.link.leiosTracker", message: "Leios tracker (Input Output)" }), href: LEIOS_TRACKER_URL },
        { label: translate({ id: "roadmap.link.dijkstraGlossary", message: "Dijkstra in the glossary" }), href: "/glossary/dijkstra" },
      ],
    },
    {
      key: "dijkstra-2",
      name: translate({ id: "roadmap.upcoming.dijkstra2.name", message: "Dijkstra, phase 2: Peras" }),
      era: translate({ id: "roadmap.upcoming.dijkstra2.era", message: "Dijkstra era, intra-era hard fork" }),
      stage: "development",
      target: translate({ id: "roadmap.upcoming.dijkstra2.target", message: "Targeted Q2 2027" }),
      outcome: translate({
        id: "roadmap.upcoming.dijkstra2.outcome",
        message: "Transactions settle in minutes instead of hours, with Ouroboros Peras.",
      }),
      fact: translate({ id: "roadmap.upcoming.dijkstra2.fact", message: "About 2 minutes to settle, down from hours" }),
      forReaders: {
        users: translate({
          id: "roadmap.upcoming.dijkstra2.users",
          message: "Exchanges and bridges can treat a deposit as final within minutes.",
        }),
        builders: translate({
          id: "roadmap.upcoming.dijkstra2.builders",
          message: "Apps that wait for confirmations can act on a block after a few minutes rather than hours.",
        }),
        operators: translate({
          id: "roadmap.upcoming.dijkstra2.operators",
          message: "Pools vote on recent blocks. A node release and an intra-era hard fork, no new era.",
        }),
      },
      links: [
        { label: translate({ id: "roadmap.link.dijkstraOverview", message: "Upgrade overview (Intersect)" }), href: DIJKSTRA_OVERVIEW_URL },
        { label: translate({ id: "roadmap.link.perasTracker", message: "Peras tracker (Tweag)" }), href: PERAS_TRACKER_URL },
        { label: translate({ id: "roadmap.link.perasExplained", message: "Peras explained" }), href: "/news/2025-04-11-ouroboros-peras/" },
      ],
    },
  ];
}

// Every upgrade enacted on mainnet, newest first. `date` is ISO and is
// formatted for the reader's locale by the component.
export function getUpgrades() {
  return [
    {
      key: "van-rossem",
      name: "van Rossem",
      era: translate({ id: "roadmap.era.conway", message: "Conway era" }),
      date: "2026-07-18",
      version: 11,
      summary: translate({ id: "roadmap.upgrade.van-rossem.summary", message: "New Plutus builtins, and the first upgrade ratified entirely by on-chain vote." }),
      glossary: "/glossary/van-rossem",
    },
    {
      key: "plomin",
      name: "Plomin",
      era: translate({ id: "roadmap.era.conway", message: "Conway era" }),
      date: "2025-01-29",
      version: 10,
      summary: translate({ id: "roadmap.upgrade.plomin.summary", message: "Full on-chain governance: DReps, treasury withdrawals, and every governance action." }),
      glossary: "/glossary/plomin",
    },
    {
      key: "chang",
      name: "Chang",
      era: translate({ id: "roadmap.era.conway", message: "Conway era" }),
      date: "2024-09-01",
      version: 9,
      summary: translate({ id: "roadmap.upgrade.chang.summary", message: "The first on-chain governance actions: parameter changes and hard fork initiations." }),
      glossary: "/glossary/chang",
    },
    {
      key: "valentine",
      name: "Valentine",
      era: translate({ id: "roadmap.era.babbage", message: "Babbage era" }),
      date: "2023-02-14",
      version: 8,
      summary: translate({ id: "roadmap.upgrade.valentine.summary", message: "New cryptographic primitives for cross-chain use in Plutus." }),
    },
    {
      key: "vasil",
      name: "Vasil",
      era: translate({ id: "roadmap.era.babbage", message: "Babbage era" }),
      date: "2022-09-22",
      version: 7,
      summary: translate({ id: "roadmap.upgrade.vasil.summary", message: "Reference inputs, inline datums, and reference scripts for cheaper, faster smart contracts." }),
      glossary: "/glossary/vasil",
    },
    {
      key: "alonzo-update",
      name: translate({ id: "roadmap.upgrade.alonzoUpdate.name", message: "Alonzo update" }),
      era: translate({ id: "roadmap.era.alonzo", message: "Alonzo era" }),
      date: "2021-10-22",
      version: 6,
      summary: translate({
        id: "roadmap.upgrade.alonzoUpdate.summary",
        message: "Intra-era hard fork to protocol version 6.",
      }),
    },
    {
      key: "alonzo",
      name: "Alonzo",
      era: translate({ id: "roadmap.era.alonzo", message: "Alonzo era" }),
      date: "2021-09-12",
      version: 5,
      summary: translate({ id: "roadmap.upgrade.alonzo.summary", message: "Plutus smart contracts arrive on mainnet." }),
      glossary: "/glossary/alonzo",
    },
    {
      key: "mary",
      name: "Mary",
      era: translate({ id: "roadmap.era.mary", message: "Mary era" }),
      date: "2021-03-01",
      version: 4,
      summary: translate({ id: "roadmap.upgrade.mary.summary", message: "Native tokens, minted and moved without smart contracts." }),
      glossary: "/glossary/mary",
    },
    {
      key: "allegra",
      name: "Allegra",
      era: translate({ id: "roadmap.era.allegra", message: "Allegra era" }),
      date: "2020-12-16",
      version: 3,
      summary: translate({ id: "roadmap.upgrade.allegra.summary", message: "Token locking, the groundwork for smart contracts." }),
      glossary: "/glossary/allegra",
    },
    {
      key: "shelley",
      name: "Shelley",
      era: translate({ id: "roadmap.era.shelley", message: "Shelley era" }),
      date: "2020-07-29",
      version: 2,
      summary: translate({ id: "roadmap.upgrade.shelley.summary", message: "Stake pools, delegation, and rewards: block production moves to the community." }),
      glossary: "/glossary/shelley",
    },
    {
      key: "byron",
      name: "Byron",
      era: translate({ id: "roadmap.era.byron", message: "Byron era" }),
      date: "2017-09-29",
      version: 1,
      summary: translate({ id: "roadmap.upgrade.byron.summary", message: "Mainnet launch and ada." }),
      glossary: "/glossary/byron",
    },
  ];
}

// The five development phases of the original roadmap. `milestones` lists
// what each one brought; an entry with an upgradeKey links to that tile.
export function getPhases() {
  return [
    {
      key: "byron",
      name: "Byron",
      theme: translate({ id: "roadmap.phase.byron.theme", message: "Foundation" }),
      milestones: [
        { text: translate({ id: "roadmap.phase.byron.d1", message: "Mainnet and ada" }), upgradeKey: "byron" },
        { text: translate({ id: "roadmap.phase.byron.d2", message: "Ouroboros, the first provably secure proof-of-stake protocol" }) },
      ],
    },
    {
      key: "shelley",
      name: "Shelley",
      theme: translate({ id: "roadmap.phase.shelley.theme", message: "Decentralization" }),
      milestones: [
        { text: translate({ id: "roadmap.phase.shelley.d1", message: "Stake pools, delegation and rewards" }), upgradeKey: "shelley" },
        { text: translate({ id: "roadmap.phase.shelley.d2", message: "Block production moved to community-run pools" }) },
      ],
    },
    {
      key: "goguen",
      name: "Goguen",
      theme: translate({ id: "roadmap.phase.goguen.theme", message: "Smart contracts" }),
      milestones: [
        { text: translate({ id: "roadmap.phase.goguen.d1", message: "Native tokens" }), upgradeKey: "mary" },
        { text: translate({ id: "roadmap.phase.goguen.d2", message: "Plutus smart contracts" }), upgradeKey: "alonzo" },
      ],
    },
    {
      key: "basho",
      name: "Basho",
      theme: translate({ id: "roadmap.phase.basho.theme", message: "Scaling" }),
      milestones: [
        { text: translate({ id: "roadmap.phase.basho.d1", message: "Reference inputs, inline datums and reference scripts" }), upgradeKey: "vasil" },
        { text: translate({ id: "roadmap.phase.basho.d2", message: "Hydra and Mithril; Leios and Peras continue it in Dijkstra" }) },
      ],
    },
    {
      key: "voltaire",
      name: "Voltaire",
      theme: translate({ id: "roadmap.phase.voltaire.theme", message: "Governance" }),
      milestones: [
        { text: translate({ id: "roadmap.phase.voltaire.d1", message: "On-chain governance actions" }), upgradeKey: "chang" },
        { text: translate({ id: "roadmap.phase.voltaire.d2", message: "DReps and the full set of governance actions" }), upgradeKey: "plomin" },
      ],
    },
  ];
}

// From proposal to mainnet. The stage of an upcoming upgrade uses the same
// words. Markdown links are rendered by the page.
export function getUpgradeSteps() {
  return [
    {
      key: "proposal",
      title: translate({ id: "roadmap.steps.proposal.title", message: "Proposal" }),
      text: translate({
        id: "roadmap.steps.proposal.text",
        message: "A change is written up as a [Cardano Improvement Proposal](/glossary/cip) and discussed in public. Intersect's hard fork working group scopes what goes into the next upgrade.",
      }),
    },
    {
      key: "development",
      title: translate({ id: "roadmap.steps.development.title", message: "Development" }),
      text: translate({
        id: "roadmap.steps.development.text",
        message: "The node, ledger and Plutus teams build and test it, with formal specifications and audits where they apply, and ship it in a node release.",
      }),
    },
    {
      key: "testnets",
      title: translate({ id: "roadmap.steps.testnets.title", message: "Testnets" }),
      text: translate({
        id: "roadmap.steps.testnets.text",
        message: "The hard fork runs on Preview and Preprod first, so wallets, exchanges and apps can adapt before mainnet.",
      }),
    },
    {
      key: "vote",
      title: translate({ id: "roadmap.steps.vote.title", message: "On-chain vote" }),
      text: translate({
        id: "roadmap.steps.vote.text",
        message: "A [hard fork initiation action](/glossary/hard-fork-initiation) is submitted and voted on by [DReps](/glossary/drep), stake pool operators and the [Constitutional Committee](/glossary/constitutional-committee).",
      }),
    },
    {
      key: "readiness",
      title: translate({ id: "roadmap.steps.readiness.title", message: "Pool readiness" }),
      text: translate({
        id: "roadmap.steps.readiness.text",
        message: "Stake pool operators install the release before the epoch the vote names. Intersect tracks readiness across pools, exchanges and wallets.",
      }),
    },
    {
      key: "enactment",
      title: translate({ id: "roadmap.steps.enactment.title", message: "Enactment" }),
      text: translate({
        id: "roadmap.steps.enactment.text",
        message: "At the [epoch](/glossary/epoch) boundary the vote chose, every node switches to the new rules at once. The chain keeps running; nothing splits.",
      }),
    },
  ];
}

export function getRoadmapFAQ() {
  return [
    {
      question: translate({ id: "roadmap.faq.official.q", message: "Is this the official Cardano roadmap?" }),
      answer: [
        translate({
          id: "roadmap.faq.official.a",
          message:
            "Cardano has no single official roadmap, because development is coordinated by several organizations. This page brings together the public plans of Intersect, Input Output and the Cardano Foundation, with a link to the source on every card. The original five-phase roadmap was published by Input Output at [roadmap.cardano.org]({originalRoadmap}); the long-term direction is now set through [Vision 2030]({vision}). After Dijkstra, Cardano documentation pencils in an era named Euler, with no scope yet.",
        }, { originalRoadmap: ORIGINAL_ROADMAP_URL, vision: VISION_2030_URL }),
      ],
    },
    {
      question: translate({ id: "roadmap.faq.action.q", message: "Do I need to do anything when an upgrade happens?" }),
      answer: [
        translate({
          id: "roadmap.faq.action.a",
          message:
            "If you hold or use ada: no. Your funds and delegation carry over, and wallets and apps update behind you. If you run a stake pool, a relay or an indexer, you install the node release before the hard fork; the [Intersect upgrade hub]({hub}) lists what each upgrade needs.",
        }, { hub: UPGRADE_HUB_URL }),
      ],
    },
    {
      question: translate({ id: "roadmap.faq.decides.q", message: "Who decides when an upgrade happens, and why do dates move?" }),
      answer: [
        translate({
          id: "roadmap.faq.decides.a",
          message:
            "Every hard fork since Chang has been enacted by on-chain vote: DReps, stake pool operators and the Constitutional Committee ratify a hard fork initiation action, and the network switches at the epoch it names. The quarters on this page are engineering targets from the teams doing the work; they move when testing takes longer, and the vote only happens once the release is ready. The [weekly development reports](/news/tags/development/) show where things stand.",
        }),
      ],
    },
  ];
}
