import { translate } from "@docusaurus/Translate";

// Same shape as the former governanceFAQ.json, but as literal translate()
// calls so the strings reach Crowdin. GovernanceFAQ renders it through its
// data prop. Answers are arrays: one entry per paragraph, a leading "- "
// turns an entry into a list item.
export function getGovernanceFAQ() {
  return [
    {
      question: translate({ id: "governance.faq.item.loseAda.q", message: "Do I lose my ada when I delegate?" }),
      answer: [
        translate({
          id: "governance.faq.item.loseAda.a1",
          message:
            "No. Delegation is completely non-custodial. Your ada never leaves your wallet. You are only lending your voting power to a DRep, not transferring any funds.",
        }),
      ],
      category: "getting-started",
      popular: translate({ id: "governance.faq.item.loseAda.popular", message: "No. Your ada never leaves your wallet." }),
    },
    {
      question: translate({ id: "governance.faq.item.delegateCost.q", message: "How much does it cost to delegate?" }),
      answer: [
        translate({
          id: "governance.faq.item.delegateCost.a1",
          message:
            "Delegating your voting power to a DRep is free beyond the standard transaction fee (typically less than 0.2 ada). There is no deposit required for delegation.",
        }),
      ],
      category: "getting-started",
      popular: translate({
        id: "governance.faq.item.delegateCost.popular",
        message: "Delegating to a DRep is free. You only pay standard network fees.",
      }),
    },
    {
      question: translate({ id: "governance.faq.item.changeDrep.q", message: "Can I change my DRep later?" }),
      answer: [
        translate({
          id: "governance.faq.item.changeDrep.a1",
          message:
            "Yes, you can change your DRep at any time. Simply delegate to a different DRep and the change takes effect in the next epoch.",
        }),
      ],
      category: "delegation",
      popular: translate({
        id: "governance.faq.item.changeDrep.popular",
        message: "Yes. You can update or remove your delegation at any time.",
      }),
    },
    {
      question: translate({
        id: "governance.faq.item.drepAndPool.q",
        message: "Can I delegate my ada to a DRep and a stake pool at the same time?",
      }),
      answer: [
        translate({
          id: "governance.faq.item.drepAndPool.a1",
          message:
            "Yes, and most ada holders do exactly that. DRep delegation and stake pool delegation are two independent actions that delegate two different things from the same ada.",
        }),
        translate({
          id: "governance.faq.item.drepAndPool.a2",
          message:
            "Stake pool delegation points your stake at a pool operator who produces blocks, and in return you earn a share of block rewards. DRep delegation assigns the voting power of that same stake to someone who votes on governance proposals. Your ada is never locked, spent, or moved in either case. Both are just on-chain signals attached to your stake address.",
        }),
        translate({
          id: "governance.faq.item.drepAndPool.a3",
          message:
            "Because they run on different rails (block production vs. governance), the two delegations don't compete. You can change either one independently, and you keep earning rewards the whole time.",
        }),
      ],
      category: "delegation",
      popular: translate({
        id: "governance.faq.item.drepAndPool.popular",
        message:
          "Yes. Stake pool delegation earns rewards, DRep delegation assigns voting power. Same ada, two independent signals.",
      }),
    },
    {
      question: translate({ id: "governance.faq.item.noDelegation.q", message: "What happens if I don't delegate?" }),
      answer: [
        translate({
          id: "governance.faq.item.noDelegation.a1",
          message:
            "If you don't delegate your voting power, your ada does not count toward any governance vote. Your voice goes unused. Delegating ensures your stake contributes to the decisions that shape Cardano.",
        }),
      ],
      category: "delegation",
    },
    {
      question: translate({
        id: "governance.faq.item.activation.q",
        message: "How long does delegation take to become active?",
      }),
      answer: [
        translate({
          id: "governance.faq.item.activation.a1",
          message:
            "Delegation becomes active at the start of the next epoch. Epochs on Cardano last 5 days, so it can take up to 5 days for your delegation to take effect.",
        }),
      ],
      category: "technical",
    },
    {
      question: translate({ id: "governance.faq.item.drepCost.q", message: "What does it cost to become a DRep?" }),
      answer: [
        translate({
          id: "governance.faq.item.drepCost.a1",
          message:
            "Registering as a DRep requires a refundable deposit of 500 ada. This deposit is returned when you retire as a DRep. There is also a standard transaction fee for the registration.",
        }),
      ],
      category: "drep-role",
    },
    {
      question: translate({
        id: "governance.faq.item.alternatives.q",
        message: "What are the alternatives to delegating to a DRep?",
      }),
      answer: [
        translate({
          id: "governance.faq.item.alternatives.a1",
          message: "Instead of delegating to a specific DRep, you can choose one of two automatic voting options:",
        }),
        translate({
          id: "governance.faq.item.alternatives.a2",
          message: "- **Abstain** keeps your stake out of every vote, it is not counted for or against any proposal",
          description: "Keep the leading '- ' and the ** markers, they render as a bulleted list item with bold text.",
        }),
        translate({
          id: "governance.faq.item.alternatives.a3",
          message:
            "- **No Confidence** counts as a No on every governance action, except a motion of no confidence in the Constitutional Committee, where it counts as a Yes",
          description: "Keep the leading '- ' and the ** markers, they render as a bulleted list item with bold text.",
        }),
      ],
      category: "governance-basics",
    },
    {
      question: translate({ id: "governance.faq.item.governanceAction.q", message: "What is a governance action?" }),
      answer: [
        translate({
          id: "governance.faq.item.governanceAction.a1",
          message:
            "A governance action is an on-chain proposal that can change how Cardano works. There are several types, including protocol parameter changes, hard fork initiations, treasury withdrawals, and constitutional amendments. Each type requires different approval thresholds from DReps, SPOs, and the Constitutional Committee.",
        }),
      ],
      category: "governance-basics",
    },
  ];
}
