import { translate } from "@docusaurus/Translate";

// Same shape as the JSON FAQ files, but as literal translate() calls so the
// strings reach Crowdin. FAQSection renders it through its data prop.
export function getSmartContractsFAQ() {
  return [
    {
      question: translate({
        id: "smartContracts.faq.ethereum.q",
        message: "Are smart contracts on Cardano the same as on Ethereum?",
      }),
      answer: [
        translate({
          id: "smartContracts.faq.ethereum.a",
          message:
            "They solve the same problem but work differently. On Ethereum a contract is an account with its own state that executes when called. On Cardano a contract is a validator that guards outputs on the ledger and approves or rejects transactions that spend them. The Cardano model gives you the exact outcome and cost before you sign, at the price of designing around outputs rather than shared state.",
        }),
      ],
    },
    {
      question: translate({
        id: "smartContracts.faq.signature.q",
        message: "Can a smart contract take my ada without my signature?",
      }),
      answer: [
        translate({
          id: "smartContracts.faq.signature.a",
          message:
            "No. A script can only control funds that were sent to it in a transaction someone signed, and it can only spend them in transactions that satisfy its rules. Your wallet's own funds move only with your signature.",
        }),
      ],
    },
    {
      question: translate({
        id: "smartContracts.faq.failure.q",
        message: "What happens if a script fails?",
      }),
      answer: [
        translate({
          id: "smartContracts.faq.failure.a",
          message:
            "Your wallet runs the script before submitting, so a failing transaction is normally never sent. If a transaction is submitted and its script fails on chain anyway, the collateral your wallet set aside covers the network's work, and the rest of the transaction does not happen.",
        }),
      ],
    },
    {
      question: translate({
        id: "smartContracts.faq.approvals.q",
        message: "Do I need to approve tokens for a dApp?",
      }),
      answer: [
        translate({
          id: "smartContracts.faq.approvals.a",
          message:
            "No. Cardano has no allowance system. Every transaction you sign spends exactly what it shows, and a dApp cannot spend anything later on your behalf.",
        }),
      ],
    },
    {
      question: translate({
        id: "smartContracts.faq.upgrades.q",
        message: "Can a smart contract be changed after it is deployed?",
      }),
      answer: [
        translate({
          id: "smartContracts.faq.upgrades.a",
          message:
            "A script is identified by the hash of its code, so the code itself cannot change. Projects upgrade by deploying a new version and moving funds under rules the old script allows, sometimes controlled by a governance token or a multi-signature key. Check how a project handles upgrades before trusting it with large amounts.",
        }),
      ],
    },
    {
      question: translate({
        id: "smartContracts.faq.language.q",
        message: "Which language should I learn?",
      }),
      answer: [
        translate({
          id: "smartContracts.faq.language.a",
          message:
            "Aiken is the fastest way in for most developers, with a familiar syntax and good tooling. Plutus is the choice if you already know Haskell or want the deepest control. Both compile to the same on-chain language.",
        }),
      ],
    },
  ];
}
