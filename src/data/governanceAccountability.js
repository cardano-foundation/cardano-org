import React from "react";
import { translate } from "@docusaurus/Translate";
import { FaUsers, FaUniversity, FaServer, FaHandHoldingUsd } from "react-icons/fa";

// Content model for the Governance Accountability hub.
//
// Sourcing rules honored here:
// - Every "obligation" is a plain-language restatement of an existing rule in
//   the Cardano Constitution (src/data/constitution-608.md). The `source`
//   field is the human-readable citation and `href` points to /constitution.
// - "expectations" are widely-held community norms ("what good looks like"),
//   not cardano.org mandates. They are phrased as norms, not new rules.
// - No statistics are fabricated. Curated benchmark entries either carry a
//   genuinely sourced value or point to where the current figure can be seen.
export function getAccountabilityRoles() {
  return [
    {
      id: "dreps",
      accent: "blue",
      icon: <FaUsers />,
      title: translate({ id: "governance.accountability.dreps.title", message: "Delegated Representatives" }),
      teaser: translate({ id: "governance.accountability.dreps.teaser", message: "Represent ada holders" }),
      evidence: translate({ id: "governance.accountability.dreps.evidence", message: "Voting history" }),
      groundedIn: translate({ id: "governance.accountability.dreps.groundedIn", message: "Constitution, Article II Sections 2 and 4" }),
      groundedInHref: "/constitution#section-4-delegated-representatives",
      power: translate({
        id: "governance.accountability.dreps.power",
        message: "Vote on governance actions on behalf of the ada holders who delegate to them.",
      }),
      obligations: [
        {
          text: translate({
            id: "governance.accountability.dreps.obl.1",
            message: "Publicly disclose any compensation received as a DRep in a timely manner, and never pay ada owners in exchange for delegation or their votes. A DRep may act in the interest of the ada owners who delegate to them.",
          }),
          source: translate({ id: "governance.accountability.dreps.obl.1.src", message: "Constitution, Article II Sections 2 and 4" }),
          href: "/constitution#section-4-delegated-representatives",
        },
        {
          text: translate({
            id: "governance.accountability.dreps.obl.2",
            message: "Act within the Cardano Tenets and Guardrails.",
          }),
          source: translate({ id: "governance.accountability.dreps.obl.2.src", message: "Constitution, Article I" }),
          href: "/constitution#section-1-guiding-tenets",
        },
      ],
      expectations: [
        translate({ id: "governance.accountability.dreps.exp.1", message: "Publishes a rationale for how it votes." }),
        translate({ id: "governance.accountability.dreps.exp.2", message: "Keeps an up-to-date public profile." }),
        translate({ id: "governance.accountability.dreps.exp.3", message: "Votes consistently and discloses conflicts of interest." }),
      ],
      benchmarks: {
        liveKey: "dreps",
        curated: [
          {
            label: translate({ id: "governance.accountability.dreps.curated.1.label", message: "Participation on recent actions" }),
            value: translate({ id: "governance.accountability.dreps.curated.1.value", message: "See governance tools" }),
          },
        ],
        checkIndividuals: {
          label: translate({ id: "governance.accountability.dreps.check", message: "Find tools to explore DReps" }),
          href: "/apps?tags=governance",
        },
      },
      verifyAndAct: [
        { label: translate({ id: "governance.accountability.dreps.act.1", message: "Choose or change your DRep" }), href: "/governance/delegate" },
      ],
    },
    {
      id: "committee",
      accent: "teal",
      icon: <FaUniversity />,
      title: translate({ id: "governance.accountability.committee.title", message: "Constitutional Committee" }),
      teaser: translate({ id: "governance.accountability.committee.teaser", message: "Checks constitutionality" }),
      evidence: translate({ id: "governance.accountability.committee.evidence", message: "Published decisions" }),
      groundedIn: translate({ id: "governance.accountability.committee.groundedIn", message: "Constitution, Article III Sections 1, 3 and 4" }),
      groundedInHref: "/constitution#section-1-role-and-scope",
      power: translate({
        id: "governance.accountability.committee.power",
        message: "Rules on whether governance actions are constitutional; most actions cannot take effect on-chain without the committee's affirmation.",
      }),
      obligations: [
        {
          text: translate({
            id: "governance.accountability.committee.obl.1",
            message: "Judge governance actions only on whether they are constitutional, so that what is enacted on-chain stays consistent with the Constitution.",
          }),
          source: translate({ id: "governance.accountability.committee.obl.1.src", message: "Constitution, Article III Section 1" }),
          href: "/constitution#section-1-role-and-scope",
        },
        {
          text: translate({
            id: "governance.accountability.committee.obl.2",
            message: "Work transparently, publish every decision, and cite the specific parts of the Constitution behind any vote that an action is unconstitutional.",
          }),
          source: translate({ id: "governance.accountability.committee.obl.2.src", message: "Constitution, Article III Section 4" }),
          href: "/constitution#section-4-transparency-and-conduct",
        },
        {
          text: translate({
            id: "governance.accountability.committee.obl.3",
            message: "Disclose any compensation received for committee work in a timely manner.",
          }),
          source: translate({ id: "governance.accountability.committee.obl.3.src", message: "Constitution, Article III Section 4" }),
          href: "/constitution#section-4-transparency-and-conduct",
        },
      ],
      expectations: [
        translate({ id: "governance.accountability.committee.exp.1", message: "Explains the reasoning behind each constitutionality decision." }),
        translate({ id: "governance.accountability.committee.exp.2", message: "Engages openly with the community about its process." }),
        translate({ id: "governance.accountability.committee.exp.3", message: "Members disclose potential conflicts of interest." }),
      ],
      benchmarks: {
        liveKey: "committee",
        curated: [
          {
            label: translate({ id: "governance.accountability.committee.curated.1.label", message: "Published decisions and votes" }),
            value: translate({ id: "governance.accountability.committee.curated.1.value", message: "See governance tools" }),
          },
        ],
        checkIndividuals: {
          label: translate({ id: "governance.accountability.committee.check", message: "Find governance tools" }),
          href: "/apps?tags=governance",
        },
      },
      verifyAndAct: [
        { label: translate({ id: "governance.accountability.committee.act.1", message: "No-confidence and removal" }), href: "/constitution#section-3-election-process-no-confidence-and-removal" },
      ],
    },
    {
      id: "spos",
      accent: "violet",
      icon: <FaServer />,
      title: translate({ id: "governance.accountability.spos.title", message: "Stake Pool Operators" }),
      teaser: translate({ id: "governance.accountability.spos.teaser", message: "Secure and vote" }),
      evidence: translate({ id: "governance.accountability.spos.evidence", message: "Pool record" }),
      groundedIn: translate({ id: "governance.accountability.spos.groundedIn", message: "Constitution, Articles I and II" }),
      groundedInHref: "/constitution#section-5-stake-pool-operators",
      power: translate({
        id: "governance.accountability.spos.power",
        message: "Run the block-producing nodes that secure the network and vote on the governance actions reserved to stake pools.",
      }),
      obligations: [
        {
          text: translate({
            id: "governance.accountability.spos.obl.1",
            message: "Vote on the actions reserved to stake pools: no confidence, committee updates, hard fork initiations, security-relevant parameter changes, and info actions.",
          }),
          source: translate({ id: "governance.accountability.spos.obl.1.src", message: "Constitution, Article II Section 5" }),
          href: "/constitution#section-5-stake-pool-operators",
        },
        {
          text: translate({
            id: "governance.accountability.spos.obl.2",
            message: "Stay within the Cardano Guardrails when voting on security-relevant changes.",
          }),
          source: translate({ id: "governance.accountability.spos.obl.2.src", message: "Constitution, Article I Section 2" }),
          href: "/constitution#section-2-implementation-of-guardrails",
        },
      ],
      expectations: [
        translate({ id: "governance.accountability.spos.exp.1", message: "Runs reliable, well-configured infrastructure with high uptime." }),
        translate({ id: "governance.accountability.spos.exp.4", message: "Understands running online infrastructure and Cardano's parameters and mechanisms." }),
        translate({ id: "governance.accountability.spos.exp.2", message: "Publishes contact details and keeps pool metadata current." }),
        translate({ id: "governance.accountability.spos.exp.3", message: "Takes part in the votes open to stake pools, sharing arguments and reasoning, on top of casting a vote." }),
      ],
      benchmarks: {
        liveKey: "spos",
        curated: [
          {
            label: translate({ id: "governance.accountability.spos.curated.1.label", message: "Active stake pools" }),
            value: translate({ id: "governance.accountability.spos.curated.1.value", message: "See pool tools" }),
          },
        ],
        checkIndividuals: {
          label: translate({ id: "governance.accountability.spos.check", message: "Find pool tools" }),
          href: "/apps?tags=pooltool",
        },
      },
      verifyAndAct: [
        { label: translate({ id: "governance.accountability.spos.act.1", message: "Choose or change your stake pool" }), href: "/stake-pool-delegation" },
      ],
    },
    {
      id: "funding",
      accent: "green",
      icon: <FaHandHoldingUsd />,
      title: translate({ id: "governance.accountability.funding.title", message: "Treasury-Funded Work" }),
      teaser: translate({ id: "governance.accountability.funding.teaser", message: "Delivers public value" }),
      evidence: translate({ id: "governance.accountability.funding.evidence", message: "Milestones and reports" }),
      groundedIn: translate({ id: "governance.accountability.funding.groundedIn", message: "Constitution, Article II Sections 6 and 7" }),
      groundedInHref: "/constitution#section-6-governance-action-standards",
      power: translate({
        id: "governance.accountability.funding.power",
        message: "Receive ada from the Cardano Treasury to carry out work for the ecosystem, under the terms approved on-chain.",
      }),
      obligations: [
        {
          text: translate({
            id: "governance.accountability.funding.obl.1",
            message: "Present the funding request in the standardized, transparent format, with a permanent rationale document anyone can review.",
          }),
          source: translate({ id: "governance.accountability.funding.obl.1.src", message: "Constitution, Article II Section 6" }),
          href: "/constitution#section-6-governance-action-standards",
        },
        {
          text: translate({
            id: "governance.accountability.funding.obl.2",
            message: "State the purpose, timeline, costs, and refund conditions of the withdrawal, and disclose any treasury funding received in the previous 24 months.",
          }),
          source: translate({ id: "governance.accountability.funding.obl.2.src", message: "Constitution, Article II Section 7" }),
          href: "/constitution#section-7-treasury-withdrawals-action-standards",
        },
        {
          text: translate({
            id: "governance.accountability.funding.obl.3",
            message: "Fund independent audits and name administrators who track how the ada is spent and whether the deliverables are met.",
          }),
          source: translate({ id: "governance.accountability.funding.obl.3.src", message: "Constitution, Article II Section 7" }),
          href: "/constitution#section-7-treasury-withdrawals-action-standards",
        },
        {
          text: translate({
            id: "governance.accountability.funding.obl.4",
            message: "Stay within the treasury's Net Change Limit, the cap on how much ada can leave the treasury in a given period.",
          }),
          source: translate({ id: "governance.accountability.funding.obl.4.src", message: "Constitution, Article II Section 7" }),
          href: "/constitution#section-7-treasury-withdrawals-action-standards",
        },
      ],
      expectations: [
        translate({ id: "governance.accountability.funding.exp.1", message: "Reports progress against milestones openly." }),
        translate({ id: "governance.accountability.funding.exp.2", message: "Publishes how the funds were spent." }),
        translate({ id: "governance.accountability.funding.exp.3", message: "Delivers what was proposed and returns unused funds where applicable." }),
      ],
      benchmarks: {
        liveKey: "treasury",
        curated: [
          {
            label: translate({ id: "governance.accountability.funding.curated.1.label", message: "Treasury withdrawals enacted on-chain" }),
            value: translate({ id: "governance.accountability.funding.curated.1.value", message: "See governance tools" }),
          },
        ],
        checkIndividuals: {
          label: translate({ id: "governance.accountability.funding.check", message: "Treasury balance and outflows" }),
          href: "/insights/supply/summary/#treasury",
        },
      },
      verifyAndAct: [
        { label: translate({ id: "governance.accountability.funding.act.1", message: "How withdrawals are justified" }), href: "/constitution#section-7-treasury-withdrawals-action-standards" },
      ],
    },
  ];
}
