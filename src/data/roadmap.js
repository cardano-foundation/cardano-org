import { translate } from "@docusaurus/Translate";

// Data for /roadmap: the hard forks being built and the upgrades each one
// carries. Scope and targets come from Intersect's hard fork working group.
// `stage` is typed here and says where the work runs today. Once a hard fork
// initiation action for `version` exists on mainnet, the page takes the
// stage from the chain instead (src/utils/cardano/hardForkStatus.mjs).
// Stages in order: development, devnet, preview, preprod.
// Enacted hard forks live in src/data/hardforks.js.

const INTERSECT_SCOPE_URL = "https://product.cardano.intersectmbo.org/hardfork-planning/dijkstra/";
const CIP_URL = "https://cips.cardano.org/cip/";

// Hard forks being built, next one first. `version` is the protocol major
// version the hard fork moves mainnet to, or null while none is assigned.
export function getHardForks() {
  return [
    {
      key: "dijkstra-1",
      name: translate({ id: "roadmap.fork.dijkstra1.name", message: "Dijkstra, phase 1" }),
      era: "Dijkstra",
      version: 12,
      target: translate({ id: "roadmap.fork.dijkstra1.target", message: "Code complete targeted Q4 2026" }),
      stage: "devnet",
      scopeNote: translate({ id: "roadmap.fork.dijkstra1.scopeNote", message: "More ledger changes are in scope." }),
      scopeUrl: INTERSECT_SCOPE_URL,
    },
    {
      key: "dijkstra-2",
      name: translate({ id: "roadmap.fork.dijkstra2.name", message: "Dijkstra, phase 2" }),
      era: "Dijkstra",
      version: null,
      target: translate({ id: "roadmap.fork.dijkstra2.target", message: "Code complete targeted Q2 2027" }),
      stage: "development",
      scopeUrl: INTERSECT_SCOPE_URL,
    },
  ];
}

// Upgrades of one hard fork, in row order. A metric is either a before and
// after pair (`from`, `to`) or a single `value`. `note` is set only where
// an upgrade is behind its hard fork.
export function getUpgrades(forkKey) {
  const upgrades = {
    "dijkstra-1": [
      {
        key: "leios",
        name: translate({ id: "roadmap.upgrade.leios.name", message: "Ouroboros Linear Leios" }),
        subtitle: translate({
          id: "roadmap.upgrade.leios.subtitle",
          message: "A second, larger block carries the transactions the base block has no room for",
        }),
        metric: {
          value: translate({ id: "roadmap.upgrade.leios.metric", message: "5 to 6x" }),
          label: translate({ id: "roadmap.upgrade.leios.metricLabel", message: "Throughput, measured on a public testnet" }),
        },
        note: translate({ id: "roadmap.upgrade.leios.note", message: "Not in a node release yet" }),
        href: `${CIP_URL}CIP-0164`,
      },
      {
        key: "nested-transactions",
        name: translate({ id: "roadmap.upgrade.nested.name", message: "Nested transactions" }),
        subtitle: translate({
          id: "roadmap.upgrade.nested.subtitle",
          message: "Sub-transactions settle together as one batch, so a swap offer needs no exchange in between",
        }),
        metric: {
          value: translate({ id: "roadmap.upgrade.nested.metric", message: "Sub-transactions" }),
          label: translate({ id: "roadmap.upgrade.nested.metricLabel", message: "A new kind of transaction, settled in batches" }),
        },
        href: `${CIP_URL}CIP-0118`,
      },
      {
        key: "plutus-v4",
        name: translate({ id: "roadmap.upgrade.plutusV4.name", message: "Plutus V4" }),
        subtitle: translate({
          id: "roadmap.upgrade.plutusV4.subtitle",
          message: "Smart contracts can read the new transaction and ledger structures",
        }),
        metric: {
          from: "V3",
          to: "V4",
          label: translate({ id: "roadmap.upgrade.plutusV4.metricLabel", message: "Plutus ledger language" }),
        },
        href: INTERSECT_SCOPE_URL,
      },
      {
        key: "reward-withdrawals",
        name: translate({ id: "roadmap.upgrade.withdrawals.name", message: "Reward withdrawals without a DRep" }),
        subtitle: translate({
          id: "roadmap.upgrade.withdrawals.subtitle",
          message: "Ada holders can withdraw staking rewards without delegating their vote first",
        }),
        metric: {
          from: "1",
          to: "0",
          label: translate({ id: "roadmap.upgrade.withdrawals.metricLabel", message: "Voting delegations needed to withdraw" }),
        },
        href: `${CIP_URL}CIP-0181`,
      },
    ],
    "dijkstra-2": [
      {
        key: "peras",
        name: translate({ id: "roadmap.upgrade.peras.name", message: "Ouroboros Peras" }),
        subtitle: translate({
          id: "roadmap.upgrade.peras.subtitle",
          message: "Stake pools vote on recent blocks, so a transaction settles sooner",
        }),
        metric: {
          from: translate({ id: "roadmap.upgrade.peras.metricFrom", message: "Hours" }),
          to: translate({ id: "roadmap.upgrade.peras.metricTo", message: "minutes" }),
          label: translate({ id: "roadmap.upgrade.peras.metricLabel", message: "Time to settle" }),
        },
        href: `${CIP_URL}CIP-0140`,
      },
    ],
  };
  return upgrades[forkKey] || [];
}
