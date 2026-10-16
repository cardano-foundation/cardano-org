import { translate } from "@docusaurus/Translate";

// Content model for /governance/how-it-works.
//
// Sourcing rules:
// - Only three figures change over time on this page: the number of active
//   DReps, the committee size, and the treasury balance. They load live from
//   data.cardano.org and are left out of the text when that data is missing.
//   Do not add other running totals ("so far", "since"); they go stale.
// - Vote results are dated, so they stay true. They are the ledger's own
//   ratification tallies.
// - Thresholds, deposits, and time limits follow CIP-1694 and the protocol
//   parameters in force. Update them when a parameter change is enacted.

// Seats drawn on the bench before the live committee size arrives. Only used
// for the picture, never shown as a number.
export const DEFAULT_SEATS = 7;

// Live figures from useAccountabilityStats, checked against sane ranges.
// A figure that is missing or out of range is null, and the page leaves it out.
export function storyCounts(live = {}) {
  const ok = (v, lo, hi) => Number.isFinite(v) && v >= lo && v <= hi;
  return {
    dreps: ok(live.dreps, 1, 5000) ? live.dreps : null,
    committee: ok(live.committee, 1, 12) ? live.committee : null,
    treasury: ok(live.treasury, 1e6, 1e11) ? live.treasury : null,
  };
}

// Thresholds per action type. Shares are of voting stake; the committee votes
// one member, one vote. `spo: "sec"` means pools only vote when the change
// touches a security-relevant parameter.
export const ACTION_RULES = {
  hardfork: { drep: 0.6, spo: 0.51, cc: true },
  treasury: { drep: 0.67, spo: null, cc: true },
  param: { drep: 0.67, spo: "sec", cc: true },
  paramgov: { drep: 0.75, spo: null, cc: true },
  constitution: { drep: 0.75, spo: null, cc: true },
  committee: { drep: 0.67, spo: 0.51, cc: false },
  noconf: { drep: 0.67, spo: 0.51, cc: false },
};

export function getActionNames() {
  return {
    hardfork: translate({ id: "governance.howItWorks.action.hardfork", message: "Hard fork" }),
    treasury: translate({ id: "governance.howItWorks.action.treasury", message: "Treasury withdrawal" }),
    param: translate({ id: "governance.howItWorks.action.param", message: "Parameter change" }),
    paramgov: translate({ id: "governance.howItWorks.action.paramgov", message: "Parameter change, governance group" }),
    constitution: translate({ id: "governance.howItWorks.action.constitution", message: "New constitution" }),
    committee: translate({ id: "governance.howItWorks.action.committee", message: "Update committee" }),
    noconf: translate({ id: "governance.howItWorks.action.noconf", message: "No confidence" }),
    info: translate({ id: "governance.howItWorks.action.info", message: "Info action" }),
  };
}

// "Who votes on what": one entry per action type.
export function getVoteMatrix() {
  const names = getActionNames();
  const cc = {
    v: 2 / 3,
    t: "2/3",
    note: translate({ id: "governance.howItWorks.matrix.ccNote", message: "of committee seats" }),
  };
  const drepStake = translate({ id: "governance.howItWorks.matrix.drepStake", message: "of active DRep stake" });
  const poolStake = translate({ id: "governance.howItWorks.matrix.poolStake", message: "of pool stake" });
  return [
    {
      id: "treasury",
      name: names.treasury,
      desc: translate({
        id: "governance.howItWorks.matrix.treasury.descPays",
        message: "Pays ada from the treasury to one or more stake addresses. It must stay within the net change limit and follow the constitution's treasury rules.",
      }),
      drep: { v: 0.67, t: "67%", note: drepStake },
      spo: null,
      cc,
      ex: translate({
        id: "governance.howItWorks.matrix.treasury.exampleAug26",
        message: "In August 2026, a 120 million ada withdrawal passed with 80.1% of DRep stake and six of seven committee votes.",
      }),
    },
    {
      id: "param",
      name: names.param,
      desc: translate({
        id: "governance.howItWorks.matrix.param.descParameter",
        message:
          "Changes a protocol parameter such as fees, block size, or script limits. Parameters fall into four groups: network, economic, technical, and governance. Some are also security-relevant.",
      }),
      drep: {
        v: 0.67,
        t: "67%",
        note: translate({ id: "governance.howItWorks.matrix.param.drepNoteGov", message: "75% for governance parameters" }),
      },
      spo: {
        v: 0.51,
        t: "51%",
        note: translate({ id: "governance.howItWorks.matrix.param.poolNoteSecurity", message: "only when a security-relevant parameter changes" }),
      },
      cc,
      ex: translate({
        id: "governance.howItWorks.matrix.param.exampleFeb",
        message: "In February 2026, higher Plutus execution limits passed with 86.5% of DRep stake, 58.6% of pool stake, and six of seven committee votes.",
      }),
    },
    {
      id: "hardfork",
      name: names.hardfork,
      desc: translate({
        id: "governance.howItWorks.matrix.hardfork.desc",
        message: "Moves Cardano to a new major protocol version. Node software has to be ready first.",
      }),
      drep: { v: 0.6, t: "60%", note: drepStake },
      spo: { v: 0.51, t: "51%", note: poolStake },
      cc,
      ex: translate({
        id: "governance.howItWorks.matrix.hardfork.example",
        message:
          "The van Rossem hard fork in July 2026 moved Cardano to protocol version 11 with 77.6% of DRep stake, 52.5% of pool stake, and six of seven committee votes. It was the first hard fork approved by all three groups.",
      }),
    },
    {
      id: "constitution",
      name: names.constitution,
      desc: translate({
        id: "governance.howItWorks.matrix.constitution.desc",
        message: "Replaces the constitution, its guardrails script, or both.",
      }),
      drep: { v: 0.75, t: "75%", note: drepStake },
      spo: null,
      cc,
      ex: translate({
        id: "governance.howItWorks.matrix.constitution.example",
        message:
          "The January 2026 update passed with 79.9% of DRep stake and six of seven committee votes. The first version passed in February 2025 with 84.7%.",
      }),
    },
    {
      id: "committee",
      name: names.committee,
      desc: translate({
        id: "governance.howItWorks.matrix.committee.desc",
        message: "Adds or removes committee members, or changes their terms or the share of votes they need.",
      }),
      drep: {
        v: 0.67,
        t: "67%",
        note: translate({ id: "governance.howItWorks.matrix.committee.drepNote", message: "60% after a no-confidence vote" }),
      },
      spo: { v: 0.51, t: "51%", note: poolStake },
      cc: null,
      ex: translate({
        id: "governance.howItWorks.matrix.committee.exampleSeats",
        message: "The September 2026 election filled four seats with 72.0% of DRep stake and 56.2% of pool stake.",
      }),
    },
    {
      id: "noconf",
      name: names.noconf,
      desc: translate({
        id: "governance.howItWorks.matrix.noconf.desc",
        message: "Removes the current committee. Until a new one is elected, actions that need the committee cannot pass.",
      }),
      drep: { v: 0.67, t: "67%", note: drepStake },
      spo: { v: 0.51, t: "51%", note: poolStake },
      cc: null,
      ex: translate({
        id: "governance.howItWorks.matrix.noconf.examplePurpose",
        message: "It lets DReps and stake pool operators remove a committee they no longer trust.",
      }),
    },
    {
      id: "info",
      name: names.info,
      info: true,
      desc: translate({
        id: "governance.howItWorks.matrix.info.desc",
        message: "A non-binding poll. It records a view on-chain and changes nothing by itself.",
      }),
      ex: translate({
        id: "governance.howItWorks.matrix.info.exampleUse",
        message: "DReps use them, for example, to agree on the treasury's net change limit.",
      }),
    },
  ];
}

// Real votes for the simulator. Stake in billions of ada from the ledger's
// ratification tallies: [yes, no, silent, abstain]. Committee seats: Y yes,
// N no, A abstain, D did not vote.
export function getPresets() {
  return [
    {
      id: "vr",
      label: translate({ id: "governance.howItWorks.preset.vr.label", message: "van Rossem hard fork" }),
      action: "hardfork",
      sec: false,
      drep: [4.14684, 0.17595, 1.01913, 9.34431],
      // No pool voted No. Every pool on the No side stayed silent, which counts as No on a hard fork.
      spo: [10.34855, 0, 9.34837, 1.69913],
      cc: "YYYYYYD",
      note: translate({
        id: "governance.howItWorks.preset.vr.outcome",
        message: "Ratified in July 2026. The upgrade to protocol version 11. DReps 77.63%, stake pools 52.54%, and six of seven committee votes.",
      }),
    },
    {
      id: "c26",
      label: translate({ id: "governance.howItWorks.preset.c26.label", message: "Constitution update" }),
      action: "constitution",
      sec: false,
      drep: [4.49478, 0.35773, 0.77653, 8.39926],
      spo: null,
      cc: "YYYYYYN",
      note: translate({
        id: "governance.howItWorks.preset.c26.outcome",
        message: "Ratified in January 2026. DReps 79.85%. Six committee members voted yes and one voted no.",
      }),
    },
    {
      id: "pl",
      label: translate({ id: "governance.howItWorks.preset.pl.label", message: "Plutus limits and pool cost" }),
      action: "param",
      sec: true,
      drep: [3.50464, 0.38734, 1.21889, 9.8474],
      spo: [3.71046, 1.17277, 5.8246, 10.68349],
      cc: "YYYYYDD",
      note: translate({
        id: "governance.howItWorks.preset.pl.outcome",
        message:
          "Expired in September 2026. Higher script limits and a lower minimum pool cost. DReps said yes (68.57%), and so did five of seven committee members. Stake pools fell short: 34.65% against the 51% needed.",
      }),
    },
    {
      id: "tc",
      label: translate({ id: "governance.howItWorks.preset.tc.label", message: "Treasury cut to 10%" }),
      action: "param",
      sec: false,
      drep: [0.9093, 2.18506, 0.8214, 5.62179],
      spo: null,
      cc: "YYNNNNN",
      note: translate({
        id: "governance.howItWorks.preset.tc.outcome",
        message: "Expired in March 2025. A proposal to halve the treasury's share of rewards. DReps 23.22%, and two of seven committee members.",
      }),
    },
    {
      id: "sm",
      label: translate({ id: "governance.howItWorks.preset.sm.label", message: "103,000 ada withdrawal" }),
      action: "treasury",
      sec: false,
      drep: [2.89089, 0.19403, 1.34993, 11.10807],
      spo: null,
      cc: "YYYYYND",
      note: translate({
        id: "governance.howItWorks.preset.sm.outcome",
        message:
          "Expired in September 2026. Five of seven committee members said yes. DReps reached 65.19%, short of 67%. Silence decided it: DReps holding 1.35 billion ada did not vote, and that counted as No.",
      }),
    },
  ];
}

// "How much time do you have?"
export function getRoles() {
  return [
    {
      id: "delegate",
      time: translate({ id: "governance.howItWorks.role.delegate.time", message: "Five minutes" }),
      who: translate({ id: "governance.howItWorks.role.delegate.who", message: "Most holders" }),
      title: translate({ id: "governance.howItWorks.role.delegate.title", message: "Delegate your vote." }),
      points: [
        translate({
          id: "governance.howItWorks.role.delegate.1",
          message: "Pick a DRep whose views match yours, or choose Always Abstain or Always No Confidence.",
        }),
        translate({
          id: "governance.howItWorks.role.delegate.2",
          message: "Most wallets support it. It costs a small transaction fee, plus a refundable deposit if your stake key is not registered yet.",
        }),
        translate({ id: "governance.howItWorks.role.delegate.3", message: "Switch or remove your delegation at any time." }),
      ],
      cta: translate({ id: "governance.howItWorks.role.delegate.cta", message: "Choose a DRep" }),
      to: "/governance/delegate",
    },
    {
      id: "drep",
      time: translate({ id: "governance.howItWorks.role.drep.time", message: "A few hours a week" }),
      who: translate({ id: "governance.howItWorks.role.drep.who", message: "Represent others" }),
      title: translate({ id: "governance.howItWorks.role.drep.title", message: "Become a DRep." }),
      points: [
        translate({ id: "governance.howItWorks.role.drep.1", message: "Register with a 500 ada deposit, refunded when you retire." }),
        translate({
          id: "governance.howItWorks.role.drep.2",
          message: "Publish who you are and how you decide. Then vote, and explain each vote.",
        }),
        translate({
          id: "governance.howItWorks.role.drep.3",
          message: "Stay active. After 20 epochs without a vote, your delegated stake stops counting.",
        }),
      ],
      cta: translate({ id: "governance.howItWorks.role.drep.cta", message: "What DReps are expected to do" }),
      to: "/governance/accountability#dreps",
    },
    {
      id: "pool",
      time: translate({ id: "governance.howItWorks.role.pool.time", message: "I run a stake pool" }),
      who: translate({ id: "governance.howItWorks.role.pool.who", message: "Operators" }),
      title: translate({ id: "governance.howItWorks.role.pool.title", message: "Vote from your pool." }),
      points: [
        translate({
          id: "governance.howItWorks.role.pool.votes",
          message: "Your pool votes on hard forks, security-relevant parameter changes, committee updates, and motions of no confidence.",
        }),
        translate({ id: "governance.howItWorks.role.pool.2", message: "Votes are weighted by the stake your pool holds." }),
        translate({
          id: "governance.howItWorks.role.pool.silence",
          message: "A silent pool counts as No, unless its reward account is delegated to Always Abstain. On hard forks, silence always counts as No.",
        }),
      ],
      cta: translate({ id: "governance.howItWorks.role.pool.cta", message: "What stake pool operators are expected to do" }),
      to: "/governance/accountability#spos",
    },
    {
      id: "rules",
      time: translate({ id: "governance.howItWorks.role.rules.time", message: "I want the details" }),
      who: translate({ id: "governance.howItWorks.role.rules.who", message: "Read the rules" }),
      title: translate({ id: "governance.howItWorks.role.rules.title", message: "Read the constitution." }),
      points: [
        translate({
          id: "governance.howItWorks.role.rules.1",
          message: "Ten tenets, the role of each group, and the rules for treasury spending.",
        }),
        translate({
          id: "governance.howItWorks.role.rules.2",
          message: "An appendix lists the guardrails, including the limits the script checks.",
        }),
        translate({
          id: "governance.howItWorks.role.rules.3",
          message: "Changing it takes 75% of DRep stake and two thirds of the committee.",
        }),
      ],
      cta: translate({ id: "governance.howItWorks.role.rules.cta", message: "Read the constitution" }),
      to: "/constitution",
    },
    {
      id: "propose",
      time: translate({ id: "governance.howItWorks.role.propose.time", message: "I have a proposal" }),
      who: translate({ id: "governance.howItWorks.role.propose.who", message: "Builders and advocates" }),
      title: translate({ id: "governance.howItWorks.role.propose.title", message: "Put an idea on-chain." }),
      points: [
        translate({
          id: "governance.howItWorks.role.propose.1",
          message: "Any holder can submit a governance action with a 100,000 ada deposit, returned when voting ends.",
        }),
        translate({
          id: "governance.howItWorks.role.propose.2",
          message: "Write a clear rationale. DReps read it, and many publish why they voted as they did.",
        }),
        translate({
          id: "governance.howItWorks.role.propose.3",
          message: "Study past actions to see what passed, what failed, and why.",
        }),
      ],
      cta: translate({ id: "governance.howItWorks.role.propose.cta", message: "Browse governance actions" }),
      to: "/insights/governance-actions",
    },
  ];
}
