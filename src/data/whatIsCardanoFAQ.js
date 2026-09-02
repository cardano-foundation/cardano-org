import { translate } from "@docusaurus/Translate";

// Same shape as the JSON FAQ files, but as literal translate() calls so the
// strings reach Crowdin. FAQSection renders it through its data prop.
export function getWhatIsCardanoFAQ() {
  return [
    {
      question: translate({ id: "whatIsCardano.faq.crypto.q", message: "Is Cardano a cryptocurrency?" }),
      answer: [
        translate({
          id: "whatIsCardano.faq.crypto.a",
          message:
            "Cardano is the blockchain platform. Ada is its cryptocurrency. People often use the names interchangeably, but when you buy Cardano on an exchange, you are buying ada.",
        }),
      ],
    },
    {
      question: translate({ id: "whatIsCardano.faq.pos.q", message: "Is Cardano proof of stake?" }),
      answer: [
        translate({
          id: "whatIsCardano.faq.pos.a",
          message:
            "Yes. Cardano has used the Ouroboros proof-of-stake protocol since launch. It never used mining, and blocks are produced by stake pools chosen in proportion to the ada delegated to them.",
        }),
      ],
    },
    {
      question: translate({ id: "whatIsCardano.faq.slashing.q", message: "Can I lose my ada by staking?" }),
      answer: [
        translate({
          id: "whatIsCardano.faq.slashing.a",
          message:
            "No. Delegating ada keeps it in your wallet, and the protocol has no slashing, so it cannot take your ada as a penalty. The only thing at risk is the size of your rewards if you pick a poorly run pool.",
        }),
      ],
    },
    {
      question: translate({ id: "whatIsCardano.faq.speed.q", message: "How long does a transaction take?" }),
      answer: [
        translate({
          id: "whatIsCardano.faq.speed.a",
          message:
            "A new block is produced roughly every 20 seconds, so a transaction usually appears on the chain within a minute. Exchanges and applications typically wait for several more blocks before treating it as final.",
        }),
      ],
    },
    {
      question: translate({ id: "whatIsCardano.faq.control.q", message: "Who controls Cardano?" }),
      answer: [
        translate({
          id: "whatIsCardano.faq.control.a",
          message:
            "Nobody controls it alone. Ada holders and their delegated representatives, stake pool operators and a constitutional committee vote on-chain on changes and spending. The Cardano Foundation, IOG, Emurgo and Intersect contribute, but none of them can change the protocol by themselves.",
        }),
      ],
    },
    {
      question: translate({ id: "whatIsCardano.faq.mica.q", message: "Is Cardano regulated in the EU?" }),
      answer: [
        translate({
          id: "whatIsCardano.faq.mica.a",
          message:
            "Ada is covered by white papers that follow the EU's Markets in Crypto-Assets regulation (MiCA), which is what exchanges and service providers need to offer it to customers in the EU. The network itself is open software that anyone can run.",
        }),
      ],
    },
    {
      question: translate({ id: "whatIsCardano.faq.build.q", message: "What can I build on Cardano?" }),
      answer: [
        translate({
          id: "whatIsCardano.faq.build.a",
          message:
            "Anything from a token or an NFT collection (no contract needed) to full applications with smart contracts written in Plutus, Aiken or Marlowe. The [developer portal](https://developers.cardano.org) has starter guides.",
        }),
      ],
    },
    {
      question: translate({ id: "whatIsCardano.faq.ethereum.q", message: "How is Cardano different from Ethereum?" }),
      answer: [
        translate({
          id: "whatIsCardano.faq.ethereum.a",
          message:
            "Both run smart contracts and use proof of stake. Cardano tracks ownership with the extended UTXO model instead of accounts, which makes fees and outcomes predictable before you sign, handles tokens natively without contracts, and decides upgrades and treasury spending through on-chain governance.",
        }),
      ],
    },
  ];
}
