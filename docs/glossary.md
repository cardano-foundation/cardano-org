---
sidebar_label: Glossary
title: Glossary
description: Definitions of key terms in the Cardano ecosystem.
---

# Cardano Glossary

Definitions of key terms and concepts in the Cardano ecosystem.

:::tip For Contributors
If you're writing content for cardano.org, see the [Editorial Style Guide](/docs/get-involved/style-guide) for spelling conventions and usage guidelines.
:::

## A

### ada
The native cryptocurrency of the Cardano blockchain. Named after Ada Lovelace, the 19th-century mathematician often regarded as the first computer programmer.

### Aiken
A modern smart contract language for Cardano, designed to be beginner-friendly while producing efficient on-chain code. See [Aiken documentation](https://developers.cardano.org/docs/build/smart-contracts/languages/aiken/overview/) on the Developer Portal.

### Allegra
The [hard fork on December 16, 2020](/hardforks/) that added token locking capabilities, a prerequisite for smart contract functionality.

### Alonzo
The [hard fork on September 12, 2021](/hardforks/) that brought smart contract functionality to Cardano through Plutus.

### AMA
Ask Me Anything. A live Q&A session where community members can ask questions directly to project leaders, developers, or other notable figures in the Cardano ecosystem.

### ambassador
A community member who promotes Cardano education and adoption. See [Cardano Ambassadors](/ambassadors/) for the program.

### API
Application Programming Interface. A set of rules and protocols that allows different software applications to communicate with each other. In the Cardano ecosystem, APIs enable developers to interact with the blockchain, query data, and build applications. See [Builder Tools](https://developers.cardano.org/tools) on the Developer Portal for a list of APIs.

## B

### Babel fees
A mechanism that allows users to pay transaction fees using native tokens instead of ada. Stake pool operators act as liquidity providers, offering exchange rates for tokens they accept. The fees still settle in ada behind the scenes, keeping ada central to the ecosystem while enabling broader participation. Made possible by Cardano's eUTXO model. See [Native Tokens](https://developers.cardano.org/docs/native-tokens/) on the Developer Portal.

### Basho
The [fourth era of Cardano development](/research/#basho), focused on scaling and performance optimization. Named after Matsuo Basho, a Japanese poet and master of haiku.

### bech32
An address encoding format used for Cardano addresses since the [Shelley hard fork](/hardforks/). Bech32 provides built-in error detection to protect against accidental misspellings or truncations. Cardano addresses use prefixes like `addr1` for payment addresses and `stake1` for stake addresses. See [CIP-5](https://cips.cardano.org/cip/CIP-5) for common bech32 prefixes and [CIP-19](https://cips.cardano.org/cip/CIP-19) for address structure details.

### block
A unit of data containing a batch of transactions that is added to the blockchain. Each block includes a cryptographic reference to the previous block, forming an immutable chain. On Cardano, blocks are produced by stake pools selected through the [Ouroboros](/ouroboros/) protocol. Block size has been increased over time to improve network capacity.

### bridge
A protocol that connects Cardano to other blockchains, enabling assets to move between networks. See [bridge apps](/apps/?tags=bridge).

### Byron
The [first era of Cardano development](/research/#byron), establishing the foundation of the network. Named after Lord Byron, the Romantic poet and father of Ada Lovelace.

## C

### Cardano
A public, permissionless Layer 1 blockchain built on [peer-reviewed research](/research/). A collection of open-source, patent-free protocols for value transfer, identity, and governance.

### the Cardano Foundation
An independent, Swiss-based not-for-profit organization responsible for the advancement of Cardano. See [Cardano Foundation](/entities/?tab=cf) for details.

### Cardano Summit
The annual flagship event for the Cardano community, featuring announcements, technical presentations, and networking opportunities. The summit brings together developers, stake pool operators, partners, and community members from around the world.

### CBDC
Central Bank Digital Currency. A digital form of fiat currency issued and regulated by a central bank. Unlike decentralized cryptocurrencies, CBDCs are controlled by monetary authorities. Cardano's technology has been explored for CBDC implementations due to its scalability and security features.

### CEX
Centralized Exchange. A platform where cryptocurrencies are traded through an intermediary that manages order books, custody, and transactions. Unlike DEXs, CEXs hold custody of your funds until you withdraw to your own wallet. See [where to get ada](/where-to-get-ada/#exchanges).

### CIP
Cardano Improvement Proposal. A formal document describing proposed changes, features, or standards for the Cardano ecosystem. CIPs follow a structured process for community review and adoption. See all proposals at [cips.cardano.org](https://cips.cardano.org/).

### CIP-1694
The Cardano Improvement Proposal that defines Cardano's on-chain governance system, introducing DReps, the Constitutional Committee, and formal governance actions. See [governance](/governance/) for details.

### computation layer
An early conceptual term used in Cardano’s design to describe smart contract execution, alongside the "settlement layer". This framing was later replaced as smart contracts became integrated directly into transaction validation.

### constitution
The foundational document defining Cardano's governance principles, rules, and guardrails. See the [Cardano Constitution](/constitution/).

### Constitutional Committee
A governing body in Cardano's governance system that votes on the constitutionality of governance actions, serving as a check alongside DReps and stake pool operators.

### Conway
The [hard fork on September 1, 2024](/hardforks/) that enabled on-chain governance through CIP-1694, marking the beginning of the Voltaire era.

## D

### DApp
Decentralized Application. An application that runs on a blockchain network rather than centralized servers.

### delegation
The process of assigning your stake to a stake pool without transferring your ada. Delegators earn rewards while maintaining full control of their funds. See [stake pool delegation](/stake-pool-delegation/) and the [staking calculator](/calculator/).

### Developer Portal
An open source project at [developers.cardano.org](https://developers.cardano.org) providing resources for building on Cardano.

### DEX
Decentralized Exchange. A platform for trading tokens directly from your wallet without intermediaries. See [where to get ada](/where-to-get-ada/#exchanges).

### DID
Decentralized Identifier. A type of digital identity that is self-owned and independent of centralized registries. DIDs enable individuals to control their own identity data without relying on third parties.

### Djed
An algorithmic stablecoin protocol on Cardano. Djed uses a reserve of base coins (ada) and a reserve coin (SHEN) to maintain its peg to the US dollar, without relying on fiat-backed reserves.

### DRep
Delegated Representative. In Cardano's governance system, ada holders can delegate their voting power to DReps who vote on governance actions on their behalf.

### DYOR
Do Your Own Research. A common phrase in the cryptocurrency community encouraging individuals to thoroughly investigate projects, teams, and claims before investing or participating. See [common scams](/common-scams/) to learn how to protect yourself.

## E

### eclipse
A network attack where a node is isolated from honest peers and connected only to attacker-controlled nodes. This prevents the node from seeing the legitimate chain, potentially causing it to accept invalid transactions or blocks.

### Edinburgh Decentralisation Index (EDI)
A research framework developed by Input Output and the University of Edinburgh to measure and compare decentralization across blockchain systems. The EDI evaluates multiple layers including consensus, tokenomics, hardware, software, network, and governance. See the [EDI dashboard](https://informatics.ed.ac.uk/blockchain/edi).

### EMURGO
A global blockchain solutions company and one of the founding entities of Cardano. See [EMURGO](/entities/?tab=emurgo) for details.

### epoch
A period of five days in the Cardano network during which stake distribution is fixed and rewards are calculated. At each epoch boundary, rewards are distributed to delegators and stake pool operators.

### eUTXO
Extended UTXO. Cardano's enhanced version of the UTXO model that allows data and logic to be attached to outputs, enabling complex smart contract interactions while maintaining predictability and parallelism.

## G

### Goguen
The [third era of Cardano development](/research/#goguen), introducing smart contracts and native tokens. Named after Joseph Goguen, an American computer scientist.

### Governance Action
A formal proposal submitted on-chain for the Cardano community to vote on. Types include treasury withdrawals, protocol parameter changes, and constitutional amendments. See [Governance Actions](https://developers.cardano.org/docs/governance/cardano-governance/governance-actions) for details.

### Governance Tools
Applications that enable the community to register as DReps, delegate voting power, or vote on governance actions. See [Governance Tools](/apps/?tags=governance) for a list.

## H

### hard fork
A protocol upgrade that is not backward-compatible, requiring all nodes to update. Cardano uses a hard fork combinator to make these transitions smooth. See [hard forks](/hardforks/).

### Hydra
A Layer 2 scaling solution for Cardano using state channels (Hydra Heads) to enable fast, low-cost transactions off the main chain.

## I

### Icarus
A reference implementation for a lightweight Cardano wallet, developed by Input Output. Icarus served as the foundation for the Yoroi wallet.

### Input Output
A research and engineering company and one of the founding entities of Cardano. Formerly known as IOHK. See [Input Output](/entities/?tab=iog) for details.

### Intersect
A not-for-profit, member-based organization for the Cardano ecosystem focused on governance and community coordination. See [Intersect](/entities/?tab=intersect) for details.

### ISPO
Initial Stake Pool Offering. A fundraising method where delegators support a project by staking their ada to a designated stake pool. Instead of receiving full staking rewards, delegators divert some or all rewards to the project in exchange for the project's tokens. Unlike traditional token sales, participants never lose custody of their ada.

## J

### Jörmungandr
A node implementation written in Rust, originally developed for the Incentivized Testnet in late 2019. It ran a Praos-like consensus protocol. Later, Jörmungandr was used as a sidechain to power Project Catalyst voting. Named after the sea serpent from Norse mythology.

## L

### Layer 1
The base blockchain protocol. Cardano is a Layer 1 blockchain.

### Layer 2
Protocols built on top of a Layer 1 blockchain to improve scalability or add functionality. Hydra is Cardano's Layer 2 solution.

## M

### Mainnet
The production Cardano network where real ada transactions occur, as opposed to testnets used for development and testing.

### Mary
The [hard fork on March 1, 2021](/hardforks/) that introduced native tokens, allowing users to create and transact with custom tokens directly on Cardano.

## N

### native token
A token created and managed directly on the Cardano blockchain using its built-in token functionality, without requiring smart contracts. Introduced in the Mary hard fork.

### NFT
Non-Fungible Token. A unique digital asset on the blockchain representing ownership of items like art, collectibles, or in-game assets.

## O

### Ouroboros
The family of proof-of-stake consensus protocols that power Cardano. Variants include Classic, Praos, Genesis, and Chronos. See [Ouroboros](/ouroboros/) for details.

## P

### pool saturation
The point at which a stake pool has received more delegation than is optimal for rewards. Beyond saturation, additional delegation yields diminishing returns, encouraging stake distribution across multiple pools.

### Plutus Core
An umbrella term that may refer to either Untyped Plutus Core (UPLC) or Typed Plutus Core (TPLC), depending on context. Only Untyped Plutus Core is executed on-chain. See [smart contract languages](https://developers.cardano.org/docs/smart-contracts/#what-are-the-available-smart-contract-languages) on the Developer Portal.

### PRAGMA
A member-based, not-for-profit open source association for blockchain software projects. See [PRAGMA](/entities/?tab=pragma) for details.

### Project Catalyst
Cardano's innovation and [treasury](/insights/supply/summary/#treasury) funding platform where ada holders propose, discuss, and vote on projects to receive funding from the Cardano treasury.

### proof of stake
A consensus mechanism where validators are selected to create blocks based on the amount of cryptocurrency they hold and "stake" as collateral. Cardano uses proof of stake via [Ouroboros](/ouroboros/).

### proof of work
A consensus mechanism where miners compete to solve computational puzzles to create blocks. Bitcoin uses proof of work; Cardano does not.

## R

### rewards
Ada earned by delegators and stake pool operators for participating in the network. Rewards are calculated each epoch based on stake delegation and pool performance. Use the [staking calculator](/calculator/) to estimate returns.

## S

### SanchoNet
A testnet for testing Cardano's governance features introduced by CIP-1694. On SanchoNet, stake pool operators, DReps, and developers can experiment with governance actions, voting mechanisms, and related tooling before mainnet deployment. See [sancho.network](https://sancho.network).

### scam
A fraudulent scheme designed to steal funds or personal information, often exploiting trust or lack of knowledge. Common examples include fake giveaways and phishing attacks. See [common scams](/common-scams/) for how to protect yourself.

### Shelley
The [second era of Cardano development](/research/#shelley), introducing decentralization and stake pools. Named after Percy Bysshe Shelley, one of the major English Romantic poets.

### sidechains
Independent blockchains connected to the main Cardano blockchain, enabling interoperability and specialized functionality.

### slot
Each slot represents an opportunity for a block to be produced by an elected slot leader. Not every slot results in a block, on average, a block is produced approximately every 20 seconds.

### slot leader
The stake pool selected by [Ouroboros](/ouroboros/) to produce a block in a given time slot. Selection is probabilistic, weighted by the pool's delegated stake.

### SMASH
Stakepool Metadata Aggregation Server. An off-chain service that collects and stores stake pool metadata such as name, ticker, and homepage. Wallets and explorers can choose which SMASH server to use for displaying pool information. Delisting a pool from a SMASH server only affects how it appears in applications using that server—it does not prevent the pool from participating in the network or producing blocks.

### smart contract
Self-executing code stored on a blockchain that automatically enforces and executes agreement terms when predefined conditions are met.

### soft fork
A protocol upgrade that is backward-compatible. Nodes that don't upgrade can still participate in the network.

### spending password
A password used by wallets to encrypt the private key, adding a layer of security.

### stablecoin
A cryptocurrency designed to maintain a stable value, typically pegged to a fiat currency like the US dollar. USDM is a stablecoin on Cardano.

### stake pool
A server node that participates in the Cardano network by validating transactions and producing blocks. Ada holders can delegate their stake to pools to earn rewards. See the [staking calculator](/calculator/) to estimate returns.

### style guide
The [Editorial Style Guide](/docs/get-involved/style-guide/) defines writing conventions, spelling standards, and terminology usage for cardano.org content.

## T

### testnet
A test network for developers to experiment without using real ada. Cardano testnets include Preview and Preprod.

### tps
Transactions per second. A common but limited metric for measuring blockchain throughput.

### treasury
An on-chain fund that accumulates a portion of transaction fees and monetary expansion. Used to finance ecosystem development through Project Catalyst and governance actions. See [treasury charts](/insights/supply/summary/#treasury).

## U

### use case
A specific application or scenario where Cardano technology solves a problem. See [Cardano use cases](/use-cases/).

### Untyped Plutus Core (UPLC)
The low-level “machine language” that is executed on-chain by Cardano nodes during transaction validation. Developers do not write UPLC directly. Instead, smart contracts are written in higher-level languages such as Plinth or Aiken, which are then compiled down to UPLC. Every smart contract language on Cardano ultimately targets UPLC as the common execution format.

### USDM
A fiat-backed stablecoin on the Cardano blockchain.

### UTXO
Unspent Transaction Output. The accounting model used by Cardano (and Bitcoin) where transactions consume previous outputs and create new ones. See also eUTXO.

## V

### Vasil
The [hard fork on September 22, 2022](/hardforks/) that improved smart contract efficiency and network performance. Named after Vasil Dabov, a beloved Cardano community member.

### Voltaire
The [fifth era of Cardano development](/research/#voltaire), focused on governance and treasury management. Named after the French Enlightenment philosopher.

### VRF
Verifiable Random Function. A cryptographic function used in [Ouroboros](/ouroboros/) to fairly select which stake pool creates each block.

## W

### wallet
Software that stores your private keys and allows you to send, receive, and manage your ada and other tokens. See [wallet apps](/apps/?tags=wallet).

### working group
A group uniting experts and community members to focus on a specific topic within the Cardano ecosystem.
