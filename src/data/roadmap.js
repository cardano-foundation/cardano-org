import { translate } from "@docusaurus/Translate";

// Data for /roadmap. Fields and rules: docs/get-involved/update-roadmap.md.
// Enacted hard forks live in src/data/hardforks.js.

// Links point at the section that backs the entry, not at the top of a page.
const INTERSECT_PLAN_URL = "https://product.cardano.intersectmbo.org/hardfork-planning/dijkstra/";
const DIJKSTRANET_URL = "https://book.play.dev.cardano.org/adv-dijkstra.html";
const WORKING_GROUP_MINUTES_URL =
  "https://cardanoupgrades.docs.intersectmbo.org/general/hard-fork-working-group-meeting-minutes/10th-november-2026";
const cip = (number) => ({ label: `CIP-${number}`, href: `https://cips.cardano.org/cip/CIP-${String(number).padStart(4, "0")}` });
const hardForkPlan = (section) => ({
  label: translate({ id: "roadmap.source.plan", message: "Hard fork plan" }),
  href: `${INTERSECT_PLAN_URL}#${section}`,
});

// Hard forks being built, next one first, each with its changes in the order
// of the hard fork plan.
export function getHardForks() {
  return [
    {
      key: "dijkstra-1",
      name: translate({ id: "roadmap.fork.dijkstra-1.name", message: "Dijkstra, phase 1" }),
      era: "Dijkstra",
      version: 12,
      stage: "devnet",
      note: translate(
        {
          id: "roadmap.fork.dijkstra-1.note",
          message:
            "The [hard fork plan]({plan}) targets code completion for Q4 2026. The hard fork working group reports in its [minutes]({minutes}) that most of the changes can be tested on [DijkstraNet]({testnet}), a test network for developers.",
        },
        {
          plan: `${INTERSECT_PLAN_URL}#phase-1-dijkstra-hard-fork-protocol-version-12-q4-2026`,
          minutes: WORKING_GROUP_MINUTES_URL,
          testnet: DIJKSTRANET_URL,
        },
      ),
      changes: [
        {
          key: "leios",
          name: "Ouroboros Linear Leios",
          text: translate({
            id: "roadmap.change.leios.text",
            message: "A block producer can publish a second, larger block alongside the regular one. Its transactions enter the ledger after a committee of stake pools votes for it, so the network carries more transactions.",
          }),
          source: cip(164),
        },
        {
          key: "nested-transactions",
          name: translate({ id: "roadmap.change.nested-transactions.name", message: "Nested transactions" }),
          text: translate({
            id: "roadmap.change.nested-transactions.text",
            message: "A transaction can contain sub-transactions that settle together, so a swap offer can be made and accepted without an exchange in between.",
          }),
          source: cip(118),
        },
        {
          key: "guard-scripts",
          name: translate({ id: "roadmap.change.guard-scripts.name", message: "Guard scripts" }),
          text: translate({ id: "roadmap.change.guard-scripts.text", message: "A new script type can check a transaction without spending or minting." }),
          source: cip(112),
        },
        {
          key: "account-addresses",
          name: translate({ id: "roadmap.change.account-addresses.name", message: "Account addresses, phase 1" }),
          text: translate({ id: "roadmap.change.account-addresses.text", message: "Ada can be deposited into account addresses, which today only receive staking rewards." }),
          source: cip(159),
        },
        {
          key: "is-valid",
          name: translate({ id: "roadmap.change.is-valid.name", message: "isValid removed from transactions" }),
          text: translate({
            id: "roadmap.change.is-valid.text",
            message: "Removing the field simplifies the transaction structure and script execution.",
          }),
          source: cip(167),
        },
        {
          key: "block-body",
          name: translate({ id: "roadmap.change.block-body.name", message: "Block body format" }),
          text: translate({ id: "roadmap.change.block-body.text", message: "A block stores each transaction in one piece, which Leios needs." }),
          source: cip(176),
        },
        {
          key: "plutus-v4",
          name: "Plutus V4",
          text: translate({
            id: "roadmap.change.plutus-v4.text",
            message: "A new script context lets smart contracts read the transaction and ledger structures that Dijkstra introduces.",
          }),
          source: hardForkPlan("plutusv4-script-context"),
        },
        {
          key: "reference-fees",
          name: translate({ id: "roadmap.change.reference-fees.name", message: "Fees for reference inputs" }),
          text: translate({ id: "roadmap.change.reference-fees.text", message: "The fee function accounts for reference inputs." }),
          source: hardForkPlan("fee-function-update-reference-inputs"),
        },
        {
          key: "reference-scripts",
          name: translate({ id: "roadmap.change.reference-scripts.name", message: "Reference script pricing and limits" }),
          text: translate({
            id: "roadmap.change.reference-scripts.text",
            message: "The pricing and size limits of reference scripts have been fixed values since Conway. They become protocol parameters, which governance can change once the Constitution and its guardrails cover them.",
          }),
          source: hardForkPlan("reference-script-pricing-and-limits"),
        },
        {
          key: "reward-withdrawals",
          name: translate({ id: "roadmap.change.reward-withdrawals.name", message: "Reward withdrawals without a DRep" }),
          text: translate({
            id: "roadmap.change.reward-withdrawals.text",
            message: "Ada holders can withdraw their rewards without first delegating their vote to a DRep.",
          }),
          source: cip(181),
        },
        {
          key: "pledge-leverage",
          name: translate({ id: "roadmap.change.pledge-leverage.name", message: "Pledge leverage parameter" }),
          text: translate({
            id: "roadmap.change.pledge-leverage.text",
            message: "A new parameter can tie stake pool rewards to pledge. It starts switched off, so nothing changes at the hard fork.",
          }),
          source: cip(50),
        },
        {
          key: "peras-groundwork",
          name: translate({ id: "roadmap.change.peras-groundwork.name", message: "Groundwork for Peras" }),
          text: translate({ id: "roadmap.change.peras-groundwork.text", message: "Phase 1 adds the block format and parameters Peras needs, without switching Peras on." }),
          source: cip(140),
        },
        {
          key: "fair-min-fees",
          name: translate({ id: "roadmap.change.fair-min-fees.name", message: "Fair minimum fees" }),
          text: translate({
            id: "roadmap.change.fair-min-fees.text",
            message: "A new parameter sets the lowest margin a stake pool may charge. It starts at zero. Its rule takes effect in this hard fork or a later one in the Dijkstra era.",
          }),
          source: cip(23),
        },
      ],
    },
    {
      key: "dijkstra-2",
      name: translate({ id: "roadmap.fork.dijkstra-2.name", message: "Dijkstra, phase 2" }),
      era: "Dijkstra",
      version: null,
      stage: "development",
      note: translate(
        {
          id: "roadmap.fork.dijkstra-2.note",
          message: "The [hard fork plan]({plan}) targets code completion for Q2 2027.",
        },
        { plan: `${INTERSECT_PLAN_URL}#phase-2-peras-activation-intra-era-hard-fork-q2-2027` },
      ),
      changes: [
        {
          key: "peras",
          name: "Ouroboros Peras",
          text: translate({
            id: "roadmap.change.peras.text",
            message: "In each round a committee of stake pools votes for a recent block. A block with enough votes is far less likely to be rolled back, so transactions settle sooner.",
          }),
          source: cip(140),
        },
      ],
    },
  ];
}
