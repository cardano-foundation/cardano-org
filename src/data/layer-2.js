import { translate } from "@docusaurus/Translate";

// Data for the /layer-2 page (Cardano Layer 2 Landscape).
//
// Each category renders as a section of <Layer2Card> components.
// - `name` values are brand names and are intentionally NOT translated.
// - `status` must be one of the keys supported by <Layer2Card> (see the
//   component and its docs): "production-ready", "in-production", "deployed",
//   "mainnet", "in-development", "proof-of-concept", "status-tbc".
// - `logo` / `logoBackground` reproduce the project logo tiles from the Figma
//   design. Hydrozoa is a monogram in the source design. The logo SVGs are
//   single-colour (black) marks, so they sit on solid light tiles that stay
//   legible in both light and dark themes.
// - `cta.label` is the visible link text, `cta.href` its destination.

export const StateChannels = {
  title: translate({ id: "layer2.stateChannels.title", message: "State Channels" }),
  description: translate({
    id: "layer2.stateChannels.description",
    message:
      "Peer-to-peer solutions to execute numerous transactions in a private channel before finalizing them on-chain. State channels provide cost-effectiveness while maintaining security.",
  }),
  projects: [
    {
      name: "Hydra",
      status: "production-ready",
      logo: "/img/layer-2/hydra.svg",
      logoBackground: "#e0f0ff",
      description: translate({
        id: "layer2.data.hydra.description",
        message:
          "Hydra processes transactions in off-chain mini-ledgers called Heads, which use the same ledger rules as Cardano's layer 1 chain. The same security as Cardano's mainchain but with more capacity, lower costs, and higher throughput.",
      }),
      cta: { label: translate({ id: "layer2.cta.repository", message: "Go to Repository" }), href: "https://hydra.family" },
    },
    {
      name: "Hydrozoa",
      status: "proof-of-concept",
      logoBackground: "#0033ad",
      logoColor: "#ffffff",
      description: translate({
        id: "layer2.data.hydrozoa.description",
        message:
          "Lightweight and dynamic payment channels for transactions among multiple parties. Peers minimize costs and activity on layer 1 without compromising on security. Ability to add more peers if all involved parties agree.",
      }),
      cta: { label: translate({ id: "layer2.cta.repository", message: "Go to Repository" }), href: "https://github.com/cardano-hydrozoa/hydrozoa" },
    },
    {
      name: "Gummiworm",
      status: "in-development",
      logo: "/img/layer-2/gummiworm.svg",
      logoBackground: "#1f111e",
      description: translate({
        id: "layer2.data.gummiworm.description",
        message:
          "Optimized for finance and built on Hydra for infinite scalability, Gummiworm promises milliseconds transaction speeds with just a few cents for fees.",
      }),
      cta: { label: translate({ id: "layer2.cta.website", message: "Go to Website" }), href: "https://sundae.fi/products/gummiworm" },
    },
  ],
};

export const Rollups = {
  title: translate({ id: "layer2.rollups.title", message: "Rollups" }),
  description: translate({
    id: "layer2.rollups.description",
    message:
      "Options to compile several transactions into one single piece of data, saving on costs and time. Rollups are processed off-chain before being added back into Cardano's layer 1 chain.",
  }),
  projects: [
    {
      name: "Midgard",
      status: "in-development",
      logo: "/img/layer-2/midgard.svg",
      logoBackground: "#f7f6f6",
      description: translate({
        id: "layer2.data.midgard.description",
        message:
          "No tokens required for using Cardano's first optimistic rollup. Off-chain transactions are assumed as valid and published to mainnet without publishing proofs of validity. Fraud proofs maintain security by establishing a challenge period to contest transactions.",
      }),
      cta: { label: translate({ id: "layer2.cta.repository", message: "Go to Repository" }), href: "https://github.com/Anastasia-Labs/Midgard" },
    },
    {
      name: "Sundial",
      status: "in-development",
      logo: "/img/layer-2/sundial.svg",
      logoBackground: "#ffb70c",
      description: translate({
        id: "layer2.data.sundial.description",
        message:
          "High-performance cross-chain transactions for institutional users. Built in collaboration with Midgard, Sundial provides interoperability and zero-knowledge proof validation for Bitcoin.",
      }),
      cta: { label: translate({ id: "layer2.cta.website", message: "Go to Website" }), href: "https://www.sundialprotocol.com/" },
    },
    {
      name: "zkFold Rollup",
      status: "in-development",
      logo: "/img/layer-2/zkfold.svg",
      logoBackground: "#ffffff",
      description: translate({
        id: "layer2.data.zkfold.description",
        message:
          "A single zero-knowledge proof verifies multiple transactions compressed into batches — a general-purpose scaling solution.",
      }),
      cta: { label: translate({ id: "layer2.cta.repository", message: "Go to Repository" }), href: "https://github.com/zkFold/rollup-offchain" },
    },
  ],
};

export const Sidechains = {
  title: translate({ id: "layer2.sidechains.title", message: "Sidechains and Private Chains" }),
  description: translate({
    id: "layer2.sidechains.description",
    message:
      "Public and closed-access chains bridged to Cardano give users the possibility to keep data public or restricted depending on their needs.",
  }),
  projects: [
    {
      name: "Midnight",
      status: "deployed",
      logo: "/img/layer-2/midnight.svg",
      logoBackground: "#0a0a0a",
      description: translate({
        id: "layer2.data.midnight.description",
        message:
          "A partner chain to Cardano, Midnight focuses on data protection and programmable privacy. This chain follows its own consensus mechanism and requires the use of the native token Night. Midnight uses Hydra as a scaling solution.",
      }),
      cta: { label: translate({ id: "layer2.cta.website", message: "Go to Website" }), href: "https://midnight.network/" },
    },
    {
      name: "Vola Network",
      status: "in-development",
      logo: "/img/layer-2/vola.svg",
      logoBackground: "#ffffff",
      description: translate({
        id: "layer2.data.vola.description",
        message:
          "Private chain providing decentralized cloud storage for governments, enterprises, and individuals. The Vola Network delivers security without demanding private-key management from users or relying on centralized structures.",
      }),
      cta: { label: translate({ id: "layer2.cta.website", message: "Go to Website" }), href: "https://vola.network/" },
    },
    {
      name: "Strike Node",
      status: "deployed",
      logo: "/img/layer-2/strike-node.svg",
      logoBackground: "#24fcaf",
      description: translate({
        id: "layer2.data.strike.description",
        message:
          "Network layer built on top of Cardano. From order placements, cancellations, and modifications to balance updates, all trading activities happen in an execution level separate from the mainchain. Settlement then happens on Cardano's mainnet to make records verifiable by anyone.",
      }),
      cta: { label: translate({ id: "layer2.cta.website", message: "Go to Website" }), href: "https://docs.strikefinance.org/perpetuals/strike-node" },
    },
    {
      name: "Materios",
      status: "in-development",
      logo: "/img/layer-2/materios.svg",
      logoBackground: "#ffffff",
      description: translate({
        id: "layer2.data.materios.description",
        message:
          "Partner chain optimized for AI verification and high-throughput storage of AI receipts. Materios uses a dual-token system and batches transactions together via Merkle-hashing with a root periodically anchored to Cardano's main chain.",
      }),
      cta: { label: translate({ id: "layer2.cta.documentation", message: "Go to Documentation" }), href: "https://docs.fluxpointstudios.com/materios-partner-chain/materios" },
    },
  ],
};

export const Layer2Categories = [StateChannels, Rollups, Sidechains];
