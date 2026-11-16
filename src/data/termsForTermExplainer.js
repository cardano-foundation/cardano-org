import { translate } from "@docusaurus/Translate";

// Terms per category for TermExplainer as literal translate() calls so the
// strings reach Crowdin.
export function getTermsForTermExplainer() {
  return {
    staking: [
      {
        term: translate({ id: "termExplainer.staking.delegation.term", message: "Delegation" }),
        description: translate({
          id: "termExplainer.staking.delegation.description",
          message:
            "Delegation is the process by which ada holders delegate the stake associated with their ada to a stake pool. It allows ada holders that do not have the skills or desire to run a node to participate in the network and be rewarded in proportion to the amount of stake delegated.",
        }),
      },
      {
        term: translate({ id: "termExplainer.staking.stakePool.term", message: "Stake Pool" }),
        description: translate({
          id: "termExplainer.staking.stakePool.description",
          message:
            "A network node with a public address that ada holders can delegate to for earning rewards.",
        }),
      },
      {
        term: translate({ id: "termExplainer.staking.epoch.term", message: "Epoch" }),
        description: translate({
          id: "termExplainer.staking.epoch.description",
          message:
            "A period of time in the Cardano network after which staking rewards are calculated and distributed. One epoch are 5 days.",
        }),
      },
      {
        term: translate({ id: "termExplainer.staking.staking.term", message: "Staking" }),
        description: translate({
          id: "termExplainer.staking.staking.description",
          message:
            "Staking refers to the entire process of both delegating and setting up a pool. It is often confused with `delegating`.",
        }),
      },
    ],
    catalyst: [
      {
        term: translate({
          id: "termExplainer.catalyst.fundingProposal.term",
          message: "Funding Proposal",
        }),
        description: translate({
          id: "termExplainer.catalyst.fundingProposal.description",
          message:
            "A formal request or proposal to build something that is not yet covered by the Cardano protocol.",
        }),
      },
      {
        term: translate({ id: "termExplainer.catalyst.votingPower.term", message: "Voting Power" }),
        description: translate({
          id: "termExplainer.catalyst.votingPower.description",
          message:
            "The influence an ada holder has in Project Catalyst, determined by the amount of ada they hold.",
        }),
      },
      {
        term: translate({
          id: "termExplainer.catalyst.milestoneEvidence.term",
          message: "Evidence of milestone completion",
        }),
        description: translate({
          id: "termExplainer.catalyst.milestoneEvidence.description",
          message: "The evidence clearly and visibly shows that the milestone has been completed.",
        }),
      },
      {
        term: translate({
          id: "termExplainer.catalyst.statementOfMilestones.term",
          message: "Statement of Milestones (SoM)",
        }),
        description: translate({
          id: "termExplainer.catalyst.statementOfMilestones.description",
          message:
            "A list of milestones in the project created by Funded Project in the Milestone Module with the schedule, deliverables, milestone achievement dates, milestone funding amounts, and the expected PoA.",
        }),
      },
    ],
    governance: [
      {
        term: translate({ id: "termExplainer.governance.cip1694.term", message: "CIP-1694" }),
        description: translate({
          id: "termExplainer.governance.cip1694.description",
          message:
            "CIP-1694 introduces a new on-chain governance model for Cardano, aiming to give every ada holder a voice in governance. It proposes a tricameral system with three groups: stake pool operators (SPOs), Delegated Representatives (DReps), and a Constitutional Committee (CC), each with distinct roles.",
        }),
      },
      {
        term: translate({
          id: "termExplainer.governance.constitution.term",
          message: "Constitution",
        }),
        description: translate({
          id: "termExplainer.governance.constitution.description",
          message:
            "The [Cardano Constitution](/constitution) sets the rules for how the community makes collective decisions, defines the rights and principles of participants, and gives the Constitutional Committee the yardstick for judging governance actions. It was ratified on-chain in February 2025 and updated by community vote in January 2026, and it can be amended again through the same process.",
        }),
      },
      {
        term: translate({
          id: "termExplainer.governance.governanceAction.term",
          message: "Governance Action",
        }),
        description: translate({
          id: "termExplainer.governance.governanceAction.description",
          message:
            "A Governance Action is an on-chain proposal for voting, triggered by a transaction, with an expiration period after which it can’t be enacted. Any ada holder can submit a Governance Action, and voters then submit voting transactions. CIP-1694 describes seven types of Governance Actions: Motion of no-confidence, New constitutional committee or Quorum size, Updates to Constitution, Hard-Fork Initiation, Protocol Parameter Changes, Treasury Withdrawals, and Info.",
        }),
      },
    ],
    cip: [
      {
        term: translate({
          id: "termExplainer.cip.cip.term",
          message: "Cardano Improvement Proposal (CIP)",
        }),
        description: translate({
          id: "termExplainer.cip.cip.description",
          message:
            "CIPs are a way of formally proposing ideas in an agreed-upon fashion. However, they are often used for more than just finding standards. They are not binding in any way. CIPs are publicly visible to the community for discussion, and are located in the Cardano Foundation GitHub CIP repository.",
        }),
      },
      {
        term: translate({ id: "termExplainer.cip.cipEditors.term", message: "CIP Editors" }),
        description: translate({
          id: "termExplainer.cip.cipEditors.description",
          message:
            "CIP Editors safeguard the CIP process: they form a group enforcing the process described in this document and facilitating conversations between community actors. CIP editors should strive to keep up to date with general technical discussions and Cardano proposals.",
        }),
      },
    ],
  };
}
