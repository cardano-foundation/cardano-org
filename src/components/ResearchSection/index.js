import clsx from "clsx";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import { parseMarkdownLikeText } from "@site/src/utils/textUtils";

// shows a image on the left
// shows a header with some description on the right with bullet points of links below
// can be inverted with isImageRight:true

function Category({
  title,
  imageName,
  isImageRight,
  subtitle,
  description,
  papers,
  specifications,
}) {
  // Construct the image URL using the imageName prop, we may want to handle image load errors in the future
  const imageUrl = useBaseUrl(`/img/eras/${imageName}.avif`);

  // Swap columns based on isImageRight flag
  const imageColumnClass = clsx("col col--4", styles.imageSection, {
    [styles.imageRight]: isImageRight,
  });
  const textColumnClass = clsx("col col--8", styles.textSection, {
    [styles.textRight]: isImageRight,
  });

  return (
    <div className={clsx("row", styles.container)}>
      <div className={imageColumnClass}>
        <img className={styles.imageFilter} src={imageUrl} alt={title} />
        <h2 className={clsx("slight-text", styles.subtitle)}>{subtitle}</h2>
      </div>
      <div className={textColumnClass}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{parseMarkdownLikeText(description)}</p>
        {/* Papers section */}
        {papers && papers.length > 0 && (
          <div className={styles.papers}>
            <h3>Papers</h3>
            <ul>
              {papers.map((paper, index) => (
                <li key={index}>
                  <Link to={useBaseUrl(paper.url)}>{paper.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Specifications section */}
        {specifications && specifications.length > 0 && (
          <div className={styles.specifications}>
            <h3>Specifications</h3>
            <ul>
              {specifications.map((specification, index) => (
                <li key={index}>
                  <Link to={useBaseUrl(specification.url)}>
                    {specification.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

Category.defaultProps = {
  isImageRight: false, // Default layout will have the image on the left
};

export default function EnterpriseSection({}) {

  return (
    <div>
      <div id="byron" />
      <Category
        title="Byron"
        imageName="byron"
        isImageRight={false}
        subtitle="Foundation"
        description={[
          "A period dedicated to building a foundational federated network that enabled the purchase \
          and sale of ada. The network ran the proof-of-stake Ouroboros consensus protocol.",
        ]}
        papers={[
          {
            title:
              "Ouroboros: A Provably Secure Proof-of-Stake Blockchain Protocol",
            url: "https://eprint.iacr.org/2016/889.pdf",
          },
          {
            title:
              "Ouroboros-BFT: A Simple Byzantine Fault Tolerant Consensus Protocol",
            url: "https://eprint.iacr.org/2018/1049.pdf",
          },
        ]}
        specifications={[
          {
            title: "A Formal Specification of the Cardano Ledger",
            url: "https://github.com/input-output-hk/cardano-ledger/releases/latest/download/byron-ledger.pdf",
          },
          {
            title: "Specification of the Blockchain Layer",
            url: "https://github.com/input-output-hk/cardano-ledger/releases/latest/download/byron-blockchain.pdf",
          },
          {
            title: "Formal Specification for a Cardano Wallet",
            url: "https://iohk.io/en/research/library/papers/formal-specification-for-a-cardano-wallet/",
          },
          {
            title: "Small Step Semantics for Cardano",
            url: "https://github.com/input-output-hk/cardano-ledger/releases/latest/download/small-step-semantics.pdf",
          },
        ]}
      />

      <div id="shelley" />
      <Category
        title="Shelley"
        imageName="shelley"
        isImageRight={true}
        subtitle="Decentralization"
        description={[
          "A period of growth and development occurred for the network, focusing on ensuring greater decentralization. \
          This phase led to enhanced security and a more robust environment, following the transition where the majority \
          of nodes became operated by network participants.",
        ]}
        papers={[
          {
            title:
              "Ouroboros Praos: An adaptively-secure, semi-synchronous proof-of-stake blockchain",
            url: "https://eprint.iacr.org/2017/573.pdf",
          },
          {
            title:
              "Ouroboros Genesis: Composable Proof-of-Stake Blockchains with Dynamic Availability",
            url: "https://eprint.iacr.org/2018/378.pdf",
          },
          {
            title: "Stake-Bleeding Attacks on Proof-of-Stake Blockchains",
            url: "https://eprint.iacr.org/2018/248.pdf",
          },
          {
            title: "Reward Sharing Schemes for Stake Pools",
            url: "https://arxiv.org/ftp/arxiv/papers/1807/1807.11218.pdf",
          },
          {
            title: "Account Management in Proof of Stake Ledgers",
            url: "https://eprint.iacr.org/2020/525.pdf",
          },
          {
            title:
              "Flexible Formality: Practical Experience with Agile Formal Methods",
            url: "https://iohk.io/en/research/library/papers/flexible-formalitypractical-experience-with-agile-formal-methods/",
          },
          {
            title: "Coalition-Safe Equilibria with Virtual Payoffs",
            url: "https://arxiv.org/pdf/2001.00047.pdf",
          },
        ]}
        specifications={[
          {
            title:
              "Engineering Design Specification for Delegation and Incentives in Cardano–Shelley",
            url: "https://github.com/input-output-hk/cardano-ledger/releases/latest/download/shelley-delegation.pdf",
          },
          {
            title:
              "A Specification of the Non-Integral Calculations in the Shelley Ledger",
            url: "https://github.com/input-output-hk/cardano-ledger/releases/latest/download/non-integer-calculations.pdf",
          },
        ]}
      />

      <div id="goguen" />
      <Category
        title="Goguen"
        imageName="goguen"
        isImageRight={false}
        subtitle="Smart Contracts"
        description={[
          "The Goguen era introduced smart-contract functionality, enabling the construction of decentralized applications \
          while supporting multifunctional assets, fungible, and non-fungible token standards.",
        ]}
        papers={[
          {
            title: "The Extended UTXO Model",
            url: "https://iohk.io/en/research/library/papers/the-extended-utxo-model/",
          },
          {
            title: "UTXOma: UTXO with Multi-Asset Support",
            url: "https://iohk.io/en/research/library/papers/utxoma-utxo-with-multi-asset-support/",
          },
          {
            title: "Native Custom Tokens in the Extended UTXO Model",
            url: "https://iohk.io/en/research/library/papers/native-custom-tokens-in-the-extended-utxo-model/",
          },
          {
            title: "Functional Blockchain Contracts",
            url: "https://iohk.io/en/research/library/papers/functional-blockchain-contracts/",
          },
          {
            title:
              "Scripting Smart Contracts for Distributed Ledger Technology",
            url: "https://eprint.iacr.org/2016/1156.pdf",
          },
          {
            title: "Marlowe: financial contracts on blockchain",
            url: "https://iohk.io/en/research/library/papers/marlowefinancial-contracts-on-blockchain/",
          },
          {
            title:
              "Marlowe: implementing and analysing financial contracts on blockchain",
            url: "https://iohk.io/en/research/library/papers/marloweimplementing-and-analysing-financial-contracts-on-blockchain/",
          },
          {
            title:
              "Unraveling recursion: compiling an IR with recursion to System F",
            url: "https://iohk.io/en/research/library/papers/unraveling-recursioncompiling-an-ir-with-recursion-to-system-f/",
          },
          {
            title: "System F in Agda, for fun and profit",
            url: "https://iohk.io/en/research/library/papers/system-f-in-agdafor-fun-and-profit/",
          },
          {
            title: "Translation Certification for Smart Contracts",
            url: "https://iohk.io/en/research/library/papers/translation-certification-for-smart-contracts/",
          },
        ]}
        specifications={[
          {
            title:
              "A Formal Specification of the Cardano Ledger with a Native Multi-Asset Implementation",
            url: "https://github.com/input-output-hk/cardano-ledger/releases/latest/download/mary-ledger.pdf",
          },
          {
            title:
              "A Formal Specification of the Cardano Ledger integrating Plutus Core",
            url: "https://github.com/input-output-hk/cardano-ledger/releases/latest/download/alonzo-ledger.pdf",
          },
        ]}
      />

    <div id="basho" />
      <Category
        title="Basho"
        imageName="basho"
        isImageRight={true}
        subtitle="Scaling"
        description={[
          "An era of optimization, improving the scalability and interoperability of the network. Enhancing the network \
          performance, Basho will introduce sidechains, new blockchains, interoperable with the main Cardano chain, with \
          immense potential to extend the network’s capabilities.",
        ]}
        papers={[
          {
            title:
              "Proof-of-Stake Sidechains",
            url: "https://eprint.iacr.org/2018/1239.pdf",
          },
          {
            title:
              "Hydra: Fast Isomorphic State Channels",
            url: "https://eprint.iacr.org/2020/299.pdf",
          },
          {
            title:
              "Interhead Hydra: Two Heads are Better than One",
            url: "https://iohk.io/en/research/library/papers/interhead-hydratwo-heads-are-better-than-one/",
          },
          {
            title:
              "Mithril: Stake-based Threshold Multisignatures",
            url: "https://iohk.io/en/research/library/papers/mithrilstake-based-threshold-multisignatures/",
          },
          {
            title:
              "Babel Fees via Limited Liabilities",
            url: "https://iohk.io/en/research/library/papers/babel-fees-via-limited-liabilities/",
          },
          {
            title:
              "Djed: A Formally Verified Crypto-Backed Pegged Algorithmic Stablecoin",
            url: "https://iohk.io/en/research/library/papers/djeda-formally-verified-crypto-backed-pegged-algorithmic-stablecoin/",
          },
        ]}
        specifications={[
          {
            title:
              "Formal Specification of the Cardano Ledger for the Babbage era",
            url: "https://github.com/input-output-hk/cardano-ledger/releases/latest/download/babbage-ledger.pdf",
          },
        ]}
      />

    <div id="voltaire" />
      <Category
        title="Voltaire"
        imageName="voltaire"
        isImageRight={false}
        subtitle="Governance"
        description={[
          "The development era is currently enabling the Cardano network to become a self-sustaining system. Voltaire is \
          introducing a voting and treasury system that allows network participants to use their stake and voting rights \
          to influence the future development of the blockchain.",
        ]}
        papers={[
          {
            title:
              "A Treasury System for Cryptocurrencies: Enabling Better Collaborative Intelligence",
            url: "https://eprint.iacr.org/2018/435.pdf",
          },
          {
            title:
              "Updatable Blockchains",
            url: "https://eprint.iacr.org/2020/887.pdf",
          },
          {
            title:
              "SoK: Blockchain Governance",
            url: "https://iohk.io/en/research/library/papers/sokblockchain-governance/yyyy",
          },
        ]}
        specifications={[
          {
            title:
              "CIP-1694: An On-Chain Decentralized Governance Mechanism for Voltaire",
            url: "https://github.com/cardano-foundation/CIPs/blob/master/CIP-1694/README.md",
          },
        ]}
      />
        
    </div>
  );
}
