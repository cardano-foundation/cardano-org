import { translate } from "@docusaurus/Translate";

// Data for /roadmap. Two record types, both taken from Intersect's hard fork
// plan and typed here:
//
// A hard fork: where it stands and what it moves the Cardano mainnet to.
// `stage` is one of development, devnet, preview, preprod, vote, mainnet.
// Update it by hand when the hard fork working group reports a new step,
// together with `note` and the link to the minutes that report it in
// `sources`.
//
// A change: one thing a hard fork brings, in the order of Intersect's plan.
// `figure` is set only where a source states one, as a before and after pair
// (`from`, `to`) or a single `value`, with a label. `source` is the CIP, or
// the section of the plan where a change has no CIP.
//
// Enacted hard forks live in src/data/hardforks.js.

// Links point at the section that backs the entry, not at the top of a page.
const INTERSECT_PLAN_URL = "https://product.cardano.intersectmbo.org/hardfork-planning/dijkstra/";
const WORKING_GROUP_MINUTES_URL =
  "https://cardanoupgrades.docs.intersectmbo.org/general/hard-fork-working-group-meeting-minutes/10th-november-2026";
const cip = (number) => ({ label: `CIP-${number}`, href: `https://cips.cardano.org/cip/CIP-${String(number).padStart(4, "0")}` });
const hardForkPlan = (section) => ({
  label: translate({ id: "roadmap.source.plan", message: "Hard fork plan" }),
  href: `${INTERSECT_PLAN_URL}#${section}`,
});
const workingGroupMinutes = () => ({
  label: translate({ id: "roadmap.path.source", message: "Hard fork working group minutes" }),
  href: WORKING_GROUP_MINUTES_URL,
});

// Hard forks being built, next one first. `version` is the protocol major
// version the hard fork moves the Cardano mainnet to, or null while none is
// assigned.
export function getHardForks() {
  return [
    {
      key: "dijkstra-1",
      name: translate({ id: "roadmap.fork.dijkstra1.name", message: "Dijkstra, phase 1" }),
      era: "Dijkstra",
      version: 12,
      stage: "devnet",
      note: translate({
        id: "roadmap.fork.dijkstra1.note",
        message:
          "Code completion is targeted for Q4 2026. The developer testnet, DijkstraNet, runs every change except Linear Leios and fair minimum fees. An on-chain vote sets the mainnet date.",
      }),
      sources: [workingGroupMinutes(), hardForkPlan("phase-1-dijkstra-hard-fork-protocol-version-12-q4-2026")],
    },
    {
      key: "dijkstra-2",
      name: translate({ id: "roadmap.fork.dijkstra2.name", message: "Dijkstra, phase 2" }),
      era: "Dijkstra",
      version: null,
      stage: "development",
      note: translate({
        id: "roadmap.fork.dijkstra2.note",
        message: "Code completion is targeted for Q2 2027. An on-chain vote sets the mainnet date.",
      }),
      sources: [hardForkPlan("phase-2-peras-activation-intra-era-hard-fork-q2-2027")],
    },
  ];
}

// What a hard fork changes, in the order Intersect's plan lists it.
export function getChanges(forkKey) {
  const changes = {
    "dijkstra-1": [
      {
        key: "leios",
        name: translate({ id: "roadmap.change.leios.name", message: "Ouroboros Linear Leios" }),
        text: translate({
          id: "roadmap.change.leios.text",
          message: "Block producers publish a second, larger block next to the regular one, so the network carries more transactions.",
        }),
        figure: {
          value: translate({ id: "roadmap.change.leios.figure", message: "5 to 6x" }),
          label: translate({ id: "roadmap.change.leios.figureLabel", message: "Throughput measured on a public testnet" }),
        },
        source: cip(164),
      },
      {
        key: "nested-transactions",
        name: translate({ id: "roadmap.change.nested.name", message: "Nested transactions" }),
        text: translate({
          id: "roadmap.change.nested.text",
          message: "A transaction can contain sub-transactions that settle together, so a swap offer can be made and accepted without an exchange in between.",
        }),
        source: cip(118),
      },
      {
        key: "guard-scripts",
        name: translate({ id: "roadmap.change.guards.name", message: "Guard scripts" }),
        text: translate({ id: "roadmap.change.guards.text", message: "A script type that can check a transaction without spending or minting." }),
        source: cip(112),
      },
      {
        key: "account-addresses",
        name: translate({ id: "roadmap.change.accounts.name", message: "Account addresses, phase 1" }),
        text: translate({ id: "roadmap.change.accounts.text", message: "The ledger definitions for account-style addresses." }),
        source: cip(159),
      },
      {
        key: "is-valid",
        name: translate({ id: "roadmap.change.isValid.name", message: "isValid removed from transactions" }),
        text: translate({
          id: "roadmap.change.isValid.text",
          message: "Removing the field simplifies the transaction structure and script execution.",
        }),
        source: cip(167),
      },
      {
        key: "block-body",
        name: translate({ id: "roadmap.change.blockBody.name", message: "Block body format" }),
        text: translate({ id: "roadmap.change.blockBody.text", message: "A block stores each transaction in one piece, which Leios needs." }),
        source: cip(176),
      },
      {
        key: "plutus-v4",
        name: translate({ id: "roadmap.change.plutusV4.name", message: "Plutus V4" }),
        text: translate({
          id: "roadmap.change.plutusV4.text",
          message: "A new script context lets smart contracts read the transaction and ledger structures that Dijkstra introduces.",
        }),
        source: hardForkPlan("plutusv4-script-context"),
      },
      {
        key: "reference-fees",
        name: translate({ id: "roadmap.change.referenceFees.name", message: "Fees for reference inputs" }),
        text: translate({ id: "roadmap.change.referenceFees.text", message: "The fee function accounts for reference inputs." }),
        source: hardForkPlan("fee-function-update-reference-inputs"),
      },
      {
        key: "reference-scripts",
        name: translate({ id: "roadmap.change.referenceScripts.name", message: "Reference script pricing and limits" }),
        text: translate({
          id: "roadmap.change.referenceScripts.text",
          message: "The pricing and size limits of reference scripts become protocol parameters.",
        }),
        source: hardForkPlan("reference-script-pricing-and-limits"),
      },
      {
        key: "reward-withdrawals",
        name: translate({ id: "roadmap.change.withdrawals.name", message: "Reward withdrawals without a DRep" }),
        text: translate({
          id: "roadmap.change.withdrawals.text",
          message: "Ada holders can withdraw their rewards without first delegating their vote to a DRep.",
        }),
        figure: {
          from: "1",
          to: "0",
          label: translate({ id: "roadmap.change.withdrawals.figureLabel", message: "Vote delegations needed to withdraw rewards" }),
        },
        source: cip(181),
      },
      {
        key: "pledge-leverage",
        name: translate({ id: "roadmap.change.pledge.name", message: "Pledge leverage parameter" }),
        text: translate({
          id: "roadmap.change.pledge.text",
          message: "A parameter that can tie stake pool rewards to pledge. It starts switched off, so nothing changes at the hard fork.",
        }),
        source: cip(50),
      },
      {
        key: "peras-groundwork",
        name: translate({ id: "roadmap.change.perasGroundwork.name", message: "Groundwork for Peras" }),
        text: translate({ id: "roadmap.change.perasGroundwork.text", message: "The block format and parameters Peras needs, without switching Peras on." }),
        source: cip(140),
      },
      {
        key: "fair-min-fees",
        name: translate({ id: "roadmap.change.minFees.name", message: "Fair minimum fees" }),
        text: translate({
          id: "roadmap.change.minFees.text",
          message: "A minimum stake pool margin parameter. Its fee rule activates in this hard fork or a later one.",
        }),
        source: cip(23),
      },
    ],
    "dijkstra-2": [
      {
        key: "peras",
        name: translate({ id: "roadmap.change.peras.name", message: "Ouroboros Peras" }),
        text: translate({
          id: "roadmap.change.peras.text",
          message: "Stake pools vote on recent blocks, so the network treats a block as final sooner.",
        }),
        figure: {
          from: translate({ id: "roadmap.change.peras.figureFrom", message: "Hours" }),
          to: translate({ id: "roadmap.change.peras.figureTo", message: "minutes" }),
          label: translate({ id: "roadmap.change.peras.figureLabel", message: "Time until a transaction is settled" }),
        },
        source: cip(140),
      },
    ],
  };
  return changes[forkKey] || [];
}

// Proposals without a hard fork, in the two groups Intersect's plan gives
// them. A group's `note` links to the plan in markdown form. `text` is the
// reason the plan states, where it states one. A proposal that has been
// merged links to its CIP, any other to its request in the CIPs repository.
export function getUnscheduled() {
  const pull = (number) => ({
    label: translate({ id: "roadmap.source.proposal", message: "Proposal" }),
    href: `https://github.com/cardano-foundation/CIPs/pull/${number}`,
  });
  return [
    {
      key: "not-assigned",
      name: translate({ id: "roadmap.unscheduled.notAssigned.name", message: "Not assigned to a hard fork yet" }),
      note: translate(
        {
          id: "roadmap.unscheduled.notAssigned.note",
          message: "Community proposals that [the hard fork plan]({plan}) lists for future consideration.",
        },
        { plan: `${INTERSECT_PLAN_URL}#wishlist--future-consideration` },
      ),
      items: [
        {
          key: "optimistic-constitutionality",
          name: translate({ id: "roadmap.unscheduled.constitutionality", message: "Optimistic constitutionality" }),
          source: pull(1164),
        },
        {
          key: "builtin-value-functions",
          name: translate({ id: "roadmap.unscheduled.builtinValue", message: "More BuiltinValue functions" }),
          source: cip(168),
        },
        {
          key: "script-purposes",
          name: translate({ id: "roadmap.unscheduled.scriptPurposes", message: "More descriptive script purposes" }),
          source: pull(1072),
        },
        {
          key: "quantum-secure-signatures",
          name: translate({ id: "roadmap.unscheduled.quantum", message: "Quantum-secure signature schemes" }),
        },
      ],
    },
    {
      key: "left-out",
      name: translate({ id: "roadmap.unscheduled.leftOut.name", message: "Considered for Dijkstra and left out" }),
      note: translate(
        {
          id: "roadmap.unscheduled.leftOut.note",
          message: "Proposals that were evaluated for the Dijkstra era and will not be part of it, with the reason [the hard fork plan]({plan}) gives.",
        },
        { plan: `${INTERSECT_PLAN_URL}#considered-but-not-included-in-this-era` },
      ),
      items: [
        {
          key: "producer-identification",
          name: translate({ id: "roadmap.unscheduled.producerId", message: "Producer identification" }),
          text: translate({
            id: "roadmap.unscheduled.producerId.text",
            message: "The ledger team has no capacity for it in this era, and the node implementations have not agreed on an approach.",
          }),
          source: pull(1157),
        },
        {
          key: "multi-asset-treasury",
          name: translate({ id: "roadmap.unscheduled.treasury", message: "Cardano multi-asset treasury" }),
          text: translate({
            id: "roadmap.unscheduled.treasury.text",
            message: "It needs the account address groundwork that phase 1 brings, so it is better targeted at the era after Dijkstra.",
          }),
          source: pull(1103),
        },
        {
          key: "multi-index-array",
          name: translate({ id: "roadmap.unscheduled.multiIndexArray", message: "multiIndexArray builtin" }),
          text: translate({
            id: "roadmap.unscheduled.multiIndexArray.text",
            message: "Left out of the Plutus V4 scope for lack of capacity. It needs no ledger change, so a later hard fork inside the era could take it.",
          }),
          source: cip(156),
        },
        {
          key: "receiving-script-purpose",
          name: translate({ id: "roadmap.unscheduled.receiving", message: "Receiving script purpose and addresses" }),
          text: translate({
            id: "roadmap.unscheduled.receiving.text",
            message: "Too complex for the ledger capacity available in this era.",
          }),
          source: cip(160),
        },
        {
          key: "time-bound-delegation",
          name: translate({ id: "roadmap.unscheduled.timeBound", message: "Time-bound delegation with dynamic rewards" }),
          text: translate({
            id: "roadmap.unscheduled.timeBound.text",
            message: "Contentious: 54.1% voted no in a community poll.",
          }),
          source: cip(163),
        },
        {
          key: "net-change-limit",
          name: translate({ id: "roadmap.unscheduled.netChangeLimit", message: "Net change limit parameter" }),
          text: translate({
            id: "roadmap.unscheduled.netChangeLimit.text",
            message: "Not implementable today, because the ledger keeps no history of what flowed in and out in past epochs.",
          }),
          source: cip(173),
        },
        {
          key: "hot-credentials",
          name: translate({ id: "roadmap.unscheduled.hotCredentials", message: "Stake pool hot credentials" }),
          text: translate({
            id: "roadmap.unscheduled.hotCredentials.text",
            message: "Too complex given the ledger team's commitments for this era.",
          }),
          source: cip(175),
        },
      ],
    },
  ];
}
