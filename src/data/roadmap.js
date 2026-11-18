import { translate } from "@docusaurus/Translate";

// Data for /roadmap. Fields and rules: docs/get-involved/update-roadmap.md.
// Enacted hard forks live in src/data/hardforks.js, their changes are here.

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
const vanRossemOverview = () => ({
  label: translate({ id: "roadmap.source.overview", message: "Upgrade overview" }),
  href: "https://cardanoupgrades.docs.intersectmbo.org/van-rossem-upgrade/van-rossem-hard-fork-overview",
});
const plutusV3Docs = () => ({
  label: translate({ id: "roadmap.source.plutus", message: "Plutus documentation" }),
  href: "https://plutus.cardano.intersectmbo.org/docs/working-with-scripts/ledger-language-version#plutus-v3",
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

// What each enacted hard fork changed, by major protocol version, in the same
// shape as the changes of an upcoming hard fork. A hard fork without an entry
// shows no grid.
export function getCompletedChanges() {
  return {
    // van Rossem
    11: [
      {
        key: "builtins-all-versions",
        name: translate({ id: "roadmap.change.builtins-all-versions.name", message: "Built-in functions in every Plutus version" }),
        text: translate({
          id: "roadmap.change.builtins-all-versions.text",
          message: "Plutus V1 and V2 scripts can use the built-in functions that only newer Plutus versions had.",
        }),
        source: vanRossemOverview(),
      },
      {
        key: "case-builtin-types",
        name: translate({ id: "roadmap.change.case-builtin-types.name", message: "Case expressions on built-in types" }),
        text: translate({
          id: "roadmap.change.case-builtin-types.text",
          message: "Scripts can use case expressions on Bool, Integer, and Data values, which makes matching on data faster.",
        }),
        source: vanRossemOverview(),
      },
      {
        key: "array-type",
        name: translate({ id: "roadmap.change.array-type.name", message: "Array type" }),
        text: translate({
          id: "roadmap.change.array-type.text",
          message: "A built-in array type lets a script look up an element in constant time.",
        }),
        source: cip(138),
      },
      {
        key: "value-type",
        name: translate({ id: "roadmap.change.value-type.name", message: "Multi-asset value type" }),
        text: translate({
          id: "roadmap.change.value-type.text",
          message: "Scripts can work with multi-asset values directly, without encoding them as nested maps.",
        }),
        source: cip(153),
      },
      {
        key: "modular-exponentiation",
        name: translate({ id: "roadmap.change.modular-exponentiation.name", message: "Modular exponentiation" }),
        text: translate({
          id: "roadmap.change.modular-exponentiation.text",
          message: "A built-in function calculates modular exponentiation, including inverses.",
        }),
        source: cip(109),
      },
      {
        key: "drop-list",
        name: "dropList",
        text: translate({
          id: "roadmap.change.drop-list.text",
          message: "A built-in function drops a given number of elements from a list, which makes reading an element by its position much faster.",
        }),
        source: cip(132),
      },
      {
        key: "multi-scalar-multiplication",
        name: translate({ id: "roadmap.change.multi-scalar-multiplication.name", message: "Multi-scalar multiplication" }),
        text: translate({
          id: "roadmap.change.multi-scalar-multiplication.text",
          message: "A built-in function computes multi-scalar multiplication over the BLS12-381 curve, an operation that cryptographic protocols use.",
        }),
        source: cip(133),
      },
      {
        key: "vrf-key-uniqueness",
        name: translate({ id: "roadmap.change.vrf-key-uniqueness.name", message: "VRF key uniqueness" }),
        text: translate({
          id: "roadmap.change.vrf-key-uniqueness.text",
          message: "No two stake pools can register the same VRF key. The ledger enforces this from the hard fork on.",
        }),
        source: vanRossemOverview(),
      },
      {
        key: "committee-voting-rule",
        name: translate({ id: "roadmap.change.committee-voting-rule.name", message: "Constitutional Committee voting rule" }),
        text: translate({
          id: "roadmap.change.committee-voting-rule.text",
          message: "A restriction on Constitutional Committee votes was only checked when a node received a transaction. It is now a ledger rule.",
        }),
        source: vanRossemOverview(),
      },
    ],
    // Plomin
    10: [
      {
        key: "withdrawals-need-drep",
        name: translate({ id: "roadmap.change.withdrawals-need-drep.name", message: "Reward withdrawals need a DRep" }),
        text: translate({
          id: "roadmap.change.withdrawals-need-drep.text",
          message: "With the bootstrap phase over, staking rewards can only be withdrawn when the stake is delegated to a DRep or to one of the options Abstain and No confidence.",
        }),
        source: cip(1694),
      },
      {
        key: "logical-operations",
        name: translate({ id: "roadmap.change.logical-operations.name", message: "Logical operations on byte strings" }),
        text: translate({
          id: "roadmap.change.logical-operations.text",
          message: "Plutus V3 scripts get built-in functions for AND, OR, XOR, and complement on byte strings, and for reading and setting single bits.",
        }),
        source: cip(122),
      },
      {
        key: "bitwise-operations",
        name: translate({ id: "roadmap.change.bitwise-operations.name", message: "Bit shifts and rotations" }),
        text: translate({
          id: "roadmap.change.bitwise-operations.text",
          message: "Plutus V3 scripts get built-in functions that shift and rotate byte strings, count the set bits, and find the first set bit.",
        }),
        source: cip(123),
      },
      {
        key: "ripemd-160",
        name: translate({ id: "roadmap.change.ripemd-160.name", message: "RIPEMD-160 hashing" }),
        text: translate({
          id: "roadmap.change.ripemd-160.text",
          message: "A built-in function computes the RIPEMD-160 hash, for compatibility with Bitcoin's cryptography.",
        }),
        source: cip(127),
      },
    ],
    // Chang
    9: [
      {
        key: "governance",
        name: translate({ id: "roadmap.change.governance.name", message: "On-chain governance" }),
        text: translate({
          id: "roadmap.change.governance.text",
          message: "Any ada holder can submit a governance action. A Constitutional Committee, DReps, and stake pool operators vote on them.",
        }),
        source: cip(1694),
      },
      {
        key: "plutus-v3",
        name: "Plutus V3",
        text: translate({
          id: "roadmap.change.plutus-v3.text",
          message: "A new Plutus version whose scripts can also validate governance actions and votes.",
        }),
        source: plutusV3Docs(),
      },
      {
        key: "sums-of-products",
        name: translate({ id: "roadmap.change.sums-of-products.name", message: "Sums of products" }),
        text: translate({
          id: "roadmap.change.sums-of-products.text",
          message: "Plutus Core supports data types natively, which makes scripts more efficient.",
        }),
        source: cip(85),
      },
      {
        key: "bls12-381",
        name: translate({ id: "roadmap.change.bls12-381.name", message: "BLS12-381 built-ins" }),
        text: translate({
          id: "roadmap.change.bls12-381.text",
          message: "Built-in functions for operations on the BLS12-381 curve, which many cryptographic schemes build on.",
        }),
        source: cip(381),
      },
      {
        key: "keccak-256",
        name: translate({ id: "roadmap.change.keccak-256.name", message: "Keccak-256 hashing" }),
        text: translate({
          id: "roadmap.change.keccak-256.text",
          message: "A built-in function computes the Keccak-256 hash, for compatibility with Ethereum's cryptography.",
        }),
        source: cip(101),
      },
      {
        key: "integer-conversions",
        name: translate({ id: "roadmap.change.integer-conversions.name", message: "Integer and byte string conversions" }),
        text: translate({
          id: "roadmap.change.integer-conversions.text",
          message: "Built-in functions convert an integer to a byte string and back.",
        }),
        source: cip(121),
      },
      {
        key: "script-arguments",
        name: translate({ id: "roadmap.change.script-arguments.name", message: "Uniform script arguments" }),
        text: translate({
          id: "roadmap.change.script-arguments.text",
          message: "Every Plutus V3 script takes the same single argument, whatever it validates, and a spending script no longer needs a datum.",
        }),
        source: cip(69),
      },
      {
        key: "plutus-v1-reference-scripts",
        name: translate({ id: "roadmap.change.plutus-v1-reference-scripts.name", message: "Reference scripts for Plutus V1" }),
        text: translate({
          id: "roadmap.change.plutus-v1-reference-scripts.text",
          message: "A transaction that runs a Plutus V1 script can point to the script on the chain and no longer has to carry it, which saves block space.",
        }),
        source: cip(110),
      },
    ],
    // Valentine
    8: [
      {
        key: "secp256k1",
        name: translate({ id: "roadmap.change.secp256k1.name", message: "ECDSA and Schnorr signatures" }),
        text: translate({
          id: "roadmap.change.secp256k1.text",
          message: "Built-in functions let Plutus scripts verify ECDSA and Schnorr signatures over the secp256k1 curve.",
        }),
        source: cip(49),
      },
    ],
    // Vasil
    7: [
      {
        key: "reference-inputs",
        name: translate({ id: "roadmap.change.reference-inputs.name", message: "Reference inputs" }),
        text: translate({
          id: "roadmap.change.reference-inputs.text",
          message: "A transaction can read an output without spending it.",
        }),
        source: cip(31),
      },
      {
        key: "inline-datums",
        name: translate({ id: "roadmap.change.inline-datums.name", message: "Inline datums" }),
        text: translate({
          id: "roadmap.change.inline-datums.text",
          message: "A datum can be attached to an output itself, where before the output only held its hash.",
        }),
        source: cip(32),
      },
      {
        key: "script-references",
        name: translate({ id: "roadmap.change.script-references.name", message: "Reference scripts" }),
        text: translate({
          id: "roadmap.change.script-references.text",
          message: "A script can be attached to an output and used by other transactions, which makes those transactions much smaller.",
        }),
        source: cip(33),
      },
      {
        key: "collateral-outputs",
        name: translate({ id: "roadmap.change.collateral-outputs.name", message: "Collateral outputs" }),
        text: translate({
          id: "roadmap.change.collateral-outputs.text",
          message: "A transaction can name an output for the change from its collateral. Before, a failed script consumed the collateral input entirely.",
        }),
        source: cip(40),
      },
      {
        key: "serialise-data",
        name: "serialiseData",
        text: translate({
          id: "roadmap.change.serialise-data.text",
          message: "A built-in function serializes data to a byte string.",
        }),
        source: cip(42),
      },
    ],
  };
}
