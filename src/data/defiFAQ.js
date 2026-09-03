import { translate } from "@docusaurus/Translate";

// Same shape as the JSON FAQ files, but as literal translate() calls so the
// strings reach Crowdin. FAQSection renders it through its data prop.
export function getDefiFAQ() {
  return [
    {
      question: translate({
        id: "defi.faq.safe.q",
        message: "Is DeFi safe?",
      }),
      answer: [
        translate({
          id: "defi.faq.safe.a",
          message:
            "It is as safe as the contract you use and the care you take. Well-audited protocols with open code and a long track record have held up for years, and new or unaudited ones fail regularly. Never put in more than you can afford to lose, and treat every transaction you sign as final.",
        }),
      ],
    },
    {
      question: translate({
        id: "defi.faq.approvals.q",
        message: "Do I need to approve tokens for a DApp on Cardano?",
      }),
      answer: [
        translate({
          id: "defi.faq.approvals.a",
          message:
            "No. Cardano has no allowance system, so the revoke-approvals housekeeping you may know from other chains does not exist here. Each transaction you sign spends exactly what it shows, and a DApp cannot spend anything else from your wallet later.",
        }),
      ],
    },
    {
      question: translate({
        id: "defi.faq.yields.q",
        message: "Are DeFi yields guaranteed?",
      }),
      answer: [
        translate({
          id: "defi.faq.yields.a",
          message:
            "No. Yields come from trading fees, borrower interest or token rewards, all of which change with demand and can drop to zero. A yield that looks far above the rest usually carries a risk that is not on the label.",
        }),
      ],
    },
    {
      question: translate({
        id: "defi.faq.loss.q",
        message: "Can I lose more than I put in?",
      }),
      answer: [
        translate({
          id: "defi.faq.loss.a",
          message:
            "You cannot owe more than you put in. With a swap or a lending deposit the most at stake is the amount you sent, and a contract bug can still cost you all of it. With borrowing you can lose the collateral you locked if its price falls and the position is liquidated, but a protocol cannot claim funds you did not lock.",
        }),
      ],
    },
    {
      question: translate({
        id: "defi.faq.staking.q",
        message: "Do I keep earning staking rewards while I use DeFi?",
      }),
      answer: [
        translate({
          id: "defi.faq.staking.a",
          message:
            "Ada in your wallet keeps earning rewards from the pool you delegate to, and using it in a DApp does not undo the delegation. Ada you send into a contract is controlled by that contract's rules, and whether it still earns rewards for you depends on how the protocol handles staking.",
        }),
      ],
    },
    {
      question: translate({
        id: "defi.faq.stablecoins.q",
        message: "Which stablecoins exist on Cardano?",
      }),
      answer: [
        translate({
          id: "defi.faq.stablecoins.a",
          message:
            "Several, with different backing models: fiat-backed, crypto-backed and synthetic designs. The [stablecoins page](/stablecoins) lists each one with how it keeps its value.",
        }),
      ],
    },
  ];
}
