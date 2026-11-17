import { translate } from "@docusaurus/Translate";

// Data for /roadmap: the hard forks being built and what each one changes.
// Scope and targets come from Intersect's hard fork plan. `stage` says how
// far a hard fork has come and is one of: development, devnet, preview,
// preprod, vote, mainnet. Update it by hand when the hard fork working group
// reports a new step. Enacted hard forks live in src/data/hardforks.js.

const INTERSECT_PLAN_URL = "https://product.cardano.intersectmbo.org/hardfork-planning/dijkstra/";
const WORKING_GROUP_URL = "https://cardanoupgrades.docs.intersectmbo.org/general/hard-fork-working-group-meeting-minutes";
const cip = (number) => ({ label: `CIP-${number}`, href: `https://cips.cardano.org/cip/CIP-${String(number).padStart(4, "0")}` });

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
      summary: translate({
        id: "roadmap.fork.dijkstra1.summary",
        message:
          "The next hard fork starts the Dijkstra ledger era. Intersect targets code completion for Q4 2026. There is no mainnet date yet: an on-chain vote sets it after the release has run on the test networks.",
      }),
      stage: "devnet",
      stageSource: WORKING_GROUP_URL,
      planUrl: INTERSECT_PLAN_URL,
    },
    {
      key: "dijkstra-2",
      name: translate({ id: "roadmap.fork.dijkstra2.name", message: "Dijkstra, phase 2" }),
      era: "Dijkstra",
      version: null,
      summary: translate({
        id: "roadmap.fork.dijkstra2.summary",
        message: "A second hard fork inside the Dijkstra era. Intersect targets code completion for Q2 2027.",
      }),
      stage: "development",
      stageSource: WORKING_GROUP_URL,
      planUrl: INTERSECT_PLAN_URL,
    },
  ];
}

// The main changes of a hard fork, in display order. `figure` is set only
// where a source states one: a before and after pair (`from`, `to`) or a
// single `value`, with a label. `note` flags a change that is behind its
// hard fork. `source` is the proposal or plan the entry rests on.
export function getUpgrades(forkKey) {
  const upgrades = {
    "dijkstra-1": [
      {
        key: "leios",
        name: translate({ id: "roadmap.upgrade.leios.name", message: "Ouroboros Linear Leios" }),
        text: translate({
          id: "roadmap.upgrade.leios.text",
          message: "Block producers publish a second, larger block next to the regular one, so the network carries more transactions.",
        }),
        figure: {
          value: translate({ id: "roadmap.upgrade.leios.figure", message: "5 to 6x" }),
          label: translate({ id: "roadmap.upgrade.leios.figureLabel", message: "Throughput measured on a public testnet" }),
        },
        note: translate({ id: "roadmap.upgrade.leios.note", message: "Not in a node release yet" }),
        source: cip(164),
      },
      {
        key: "reward-withdrawals",
        name: translate({ id: "roadmap.upgrade.withdrawals.name", message: "Reward withdrawals without a DRep" }),
        text: translate({
          id: "roadmap.upgrade.withdrawals.text",
          message: "Ada holders can withdraw their rewards without first delegating their vote to a DRep.",
        }),
        figure: {
          from: "1",
          to: "0",
          label: translate({ id: "roadmap.upgrade.withdrawals.figureLabel", message: "Vote delegations needed to withdraw rewards" }),
        },
        source: cip(181),
      },
      {
        key: "nested-transactions",
        name: translate({ id: "roadmap.upgrade.nested.name", message: "Nested transactions" }),
        text: translate({
          id: "roadmap.upgrade.nested.text",
          message:
            "A transaction can contain sub-transactions that settle together. A swap offer can then be made and accepted without an exchange in between.",
        }),
        source: cip(118),
      },
      {
        key: "plutus-v4",
        name: translate({ id: "roadmap.upgrade.plutusV4.name", message: "Plutus V4" }),
        text: translate({
          id: "roadmap.upgrade.plutusV4.text",
          message: "A new script context lets smart contracts read the transaction and ledger structures that Dijkstra introduces.",
        }),
        source: { label: translate({ id: "roadmap.source.intersect", message: "Intersect plan" }), href: INTERSECT_PLAN_URL },
      },
    ],
    "dijkstra-2": [
      {
        key: "peras",
        name: translate({ id: "roadmap.upgrade.peras.name", message: "Ouroboros Peras" }),
        text: translate({
          id: "roadmap.upgrade.peras.text",
          message: "Stake pools vote on recent blocks, so the network treats a block as final sooner.",
        }),
        figure: {
          from: translate({ id: "roadmap.upgrade.peras.figureFrom", message: "Hours" }),
          to: translate({ id: "roadmap.upgrade.peras.figureTo", message: "minutes" }),
          label: translate({ id: "roadmap.upgrade.peras.figureLabel", message: "Time until a transaction is settled" }),
        },
        source: cip(140),
      },
    ],
  };
  return upgrades[forkKey] || [];
}

// The remaining scope of a hard fork: one line each.
export function getSmallerChanges(forkKey) {
  const changes = {
    "dijkstra-1": [
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
        name: translate({ id: "roadmap.change.isValid.name", message: "Simpler transactions" }),
        text: translate({ id: "roadmap.change.isValid.text", message: "The isValid field is removed from transactions." }),
        source: cip(167),
      },
      {
        key: "block-body",
        name: translate({ id: "roadmap.change.blockBody.name", message: "Block body format" }),
        text: translate({ id: "roadmap.change.blockBody.text", message: "A block stores each transaction in one piece, which Leios needs." }),
        source: cip(176),
      },
      {
        key: "peras-groundwork",
        name: translate({ id: "roadmap.change.perasGroundwork.name", message: "Groundwork for Peras" }),
        text: translate({ id: "roadmap.change.perasGroundwork.text", message: "The block format and parameters Peras needs, without switching Peras on." }),
        source: cip(140),
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
        key: "fair-min-fees",
        name: translate({ id: "roadmap.change.minFees.name", message: "Fair minimum fees" }),
        text: translate({
          id: "roadmap.change.minFees.text",
          message: "A minimum stake pool margin parameter. Its fee rule activates in this hard fork or a later one.",
        }),
        source: cip(23),
      },
      {
        key: "reference-fees",
        name: translate({ id: "roadmap.change.referenceFees.name", message: "Fees for reference inputs and scripts" }),
        text: translate({
          id: "roadmap.change.referenceFees.text",
          message: "The fee function accounts for reference inputs, and the pricing of reference scripts becomes a protocol parameter.",
        }),
      },
    ],
  };
  return changes[forkKey] || [];
}
