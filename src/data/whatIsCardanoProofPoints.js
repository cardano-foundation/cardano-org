import { translate } from "@docusaurus/Translate";
import DottedLockOpen from "@site/src/components/DottedIcons/DottedLockOpen";
import DottedEutxo from "@site/src/components/DottedIcons/DottedEutxo";
import DottedBallot from "@site/src/components/DottedIcons/DottedBallot";
import DottedFlask from "@site/src/components/DottedIcons/DottedFlask";
import DottedCoins from "@site/src/components/DottedIcons/DottedCoins";
import DottedNetwork from "@site/src/components/DottedIcons/DottedNetwork";
import DottedScale from "@site/src/components/DottedIcons/DottedScale";

// Shared between /what-is-cardano (all seven) and the homepage (a subset).
// Strings are literal translate() calls so Crowdin can extract them.
export function getProofPoints() {
  return [
    {
      key: "staking",
      icon: <DottedLockOpen />,
      title: translate({ id: "whatIsCardano.proof.staking.title", message: "Staking without strings" }),
      tagline: translate({ id: "whatIsCardano.proof.staking.tagline", message: "Non-custodial, liquid staking" }),
      text: translate({
        id: "whatIsCardano.proof.staking.text",
        message:
          "Delegating ada to a stake pool never moves it out of your wallet. There is no lock-up period, no minimum beyond a small deposit, and no slashing: the protocol cannot take your ada as a penalty. You can spend or re-delegate at any time.",
      }),
    },
    {
      // Merges the former "Fees you can predict" point with the extended UTXO
      // model, the property both follow from.
      key: "eutxo",
      icon: <DottedEutxo />,
      title: translate({ id: "whatIsCardano.proof.eutxo.title", message: "Predictable by design" }),
      tagline: translate({ id: "whatIsCardano.proof.eutxo.tagline", message: "Extended UTXO model" }),
      text: translate({
        id: "whatIsCardano.proof.eutxo.text",
        message:
          "A Cardano transaction spends specific outputs and creates new ones, so its result and its fee are known before it is submitted. One transaction can have many inputs and outputs, paying several recipients or settling several trades together. Fees follow a fixed formula set by protocol parameters, not an auction.",
      }),
    },
    {
      key: "tokens",
      icon: <DottedCoins />,
      title: translate({ id: "whatIsCardano.proof.tokens.title", message: "Tokens built into the chain" }),
      tagline: translate({ id: "whatIsCardano.proof.tokens.tagline", message: "Native assets" }),
      text: translate({
        id: "whatIsCardano.proof.tokens.text",
        message:
          "Any token on Cardano, from stablecoins to NFTs, is handled by the ledger itself with the same security as ada. No contract has to be written or trusted to move it.",
      }),
    },
    {
      key: "decentralized",
      icon: <DottedNetwork />,
      title: translate({ id: "whatIsCardano.proof.decentralized.title", message: "Decentralized by design" }),
      tagline: translate({ id: "whatIsCardano.proof.decentralized.tagline", message: "Independent stake pools" }),
      text: translate({
        id: "whatIsCardano.proof.decentralized.text",
        message:
          "Blocks are produced by around a thousand stake pools, run by hundreds of independent operators: individuals, companies and communities around the world. The protocol rewards pools for staying below a saturation point, which discourages any single operator from growing too large.",
      }),
    },
    {
      key: "research",
      icon: <DottedFlask />,
      title: translate({ id: "whatIsCardano.proof.research.title", message: "Backed by research" }),
      tagline: translate({ id: "whatIsCardano.proof.research.tagline", message: "Peer review and formal methods" }),
      text: translate({
        id: "whatIsCardano.proof.research.text",
        message:
          "Cardano's core protocols were designed as academic research first, reviewed by other cryptographers, then implemented. The node is written in Haskell and the ledger is built with formal methods, so the code can be checked against its specification.",
      }),
    },
    {
      key: "governance",
      icon: <DottedBallot />,
      title: translate({ id: "whatIsCardano.proof.governance.title", message: "Governed on the chain itself" }),
      tagline: translate({ id: "whatIsCardano.proof.governance.tagline", message: "On-chain governance and treasury" }),
      text: translate({
        id: "whatIsCardano.proof.governance.text",
        message:
          "Protocol changes, treasury spending and even the constitution are proposed and decided on-chain. Ada holders vote directly or delegate their voting power to a representative. Stake pool operators and a constitutional committee provide checks and balances.",
      }),
    },
    {
      key: "regulation",
      icon: <DottedScale />,
      title: translate({ id: "whatIsCardano.proof.regulation.title", message: "Ready for regulation" }),
      tagline: translate({ id: "whatIsCardano.proof.regulation.tagline", message: "MiCA-conform disclosures" }),
      text: translate({
        id: "whatIsCardano.proof.regulation.text",
        message:
          "Ada is covered by white papers that follow the EU's Markets in Crypto-Assets regulation, and the Cardano Foundation works with regulators and standards bodies. That matters for exchanges, businesses and institutions that need clear disclosures before they can work with an asset.",
      }),
    },
  ];
}
