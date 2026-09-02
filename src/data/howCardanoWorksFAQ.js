import { translate } from "@docusaurus/Translate";

// Same shape as the JSON FAQ files, but as literal translate() calls so the
// strings reach Crowdin. FAQSection renders it through its data prop.
export function getHowCardanoWorksFAQ() {
  return [
    {
      question: translate({ id: "howCardanoWorks.faq.pos.q", message: "How does Cardano choose who produces the next block?" }),
      answer: [
        translate({
          id: "howCardanoWorks.faq.pos.a",
          message:
            "Through Ouroboros, its proof-of-stake protocol. Blocks are produced by stake pools chosen in proportion to the ada delegated to them. Cardano has never used mining.",
        }),
      ],
    },
    {
      question: translate({ id: "howCardanoWorks.faq.speed.q", message: "How many confirmations does a Cardano transaction need?" }),
      answer: [
        translate({
          id: "howCardanoWorks.faq.speed.a",
          message:
            "A block is produced roughly every 20 seconds, so a transaction normally appears on the chain within a minute. Services wait for several more blocks before treating it as final.",
        }),
      ],
    },
    {
      question: translate({ id: "howCardanoWorks.faq.slashing.q", message: "Can my ada be slashed?" }),
      answer: [
        translate({
          id: "howCardanoWorks.faq.slashing.a",
          message:
            "No. Cardano has no slashing. Delegated ada stays in your wallet, and a badly run pool only costs you rewards.",
        }),
      ],
    },
    {
      question: translate({ id: "howCardanoWorks.faq.gas.q", message: "Does Cardano have gas?" }),
      answer: [
        translate({
          id: "howCardanoWorks.faq.gas.a",
          message:
            "Not in the auction sense. Fees are a fixed formula based on transaction size, and script execution has a separately priced budget, so the cost is known before you sign and does not rise with demand.",
        }),
      ],
    },
    {
      question: translate({ id: "howCardanoWorks.faq.slot.q", message: "What is the difference between a slot and a block?" }),
      answer: [
        translate({
          id: "howCardanoWorks.faq.slot.a",
          message:
            "A slot is a one-second time unit. On average only one slot in twenty has a leader who produces a block, so blocks arrive about every 20 seconds.",
        }),
      ],
    },
    {
      question: translate({ id: "howCardanoWorks.faq.haskell.q", message: "Why is Cardano written in Haskell?" }),
      answer: [
        translate({
          id: "howCardanoWorks.faq.haskell.a",
          message:
            "Cardano's reference node and its ledger rules are written in Haskell, a functional language that lets the code stay close to the formal specifications the protocol is based on. Applications on Cardano can be written in many languages, and the on-chain scripts in Plutus or Aiken.",
        }),
      ],
    },
  ];
}
