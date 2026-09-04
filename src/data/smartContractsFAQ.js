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
            "They solve the same problem but work differently. On Ethereum a contract is an account with its own state that executes when called. On Cardano a contract is a validator that approves or rejects a transaction, most often one that spends outputs the script guards. The Cardano model tells you the script result and the cost before you sign, though the transaction can still be rejected if an input it needs was spent first. The price is designing around outputs rather than shared state.",
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
            "The app or wallet normally evaluates the script before you sign, so a failing transaction is rarely sent. If a transaction is submitted and its script fails on chain anyway, the collateral your wallet set aside covers the network's work, and the rest of the transaction does not happen.",
        }),
      ],
    },
    {
      question: translate({
        id: "smartContracts.faq.approvals.q",
        message: "Do I need to approve tokens for a DApp?",
      }),
      answer: [
        translate({
          id: "smartContracts.faq.approvals.a",
          message:
            "No. Cardano has no allowance system. Your signature commits to the exact transaction you sign and nothing more, so review the inputs, outputs and warnings your wallet shows. A DApp cannot spend anything else from your wallet afterwards.",
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
            "Aiken is the fastest way in for most developers, with a familiar syntax and good tooling. Plinth, formerly Plutus Tx, is the choice if you already know Haskell, and Plutarch if you want fine control over execution cost. All of them compile to the same on-chain language.",
        }),
      ],
    },
  ];
}
