import { translate } from "@docusaurus/Translate";

export const NATIVE_STABLECOINS = [
  {
    id: "usdcx",
    name: "USDCx",
    // CoinGecko's "usdcx" id resolves to a different chain's USDCx, not Cardano's
    // (Circle xReserve). Sourcing this coin's market cap from Koios by design.
    coingeckoId: null,
    cardanoAsset: {
      policyId: "1f3aec8bfe7ea4fe14c5f121e2a92e301afe414147860d557cac7e34",
      assetNameHex: "5553444378",
      decimals: 6,
      pegUsd: 1,
    },
    logo: "/img/stablecoins/usdcx.png",
    accent: "blue",
    tags: [
      translate({ id: "stablecoins.tag.fiatBacked", message: "Fiat-backed" }),
      translate({
        id: "stablecoins.usdcx.tag.launched",
        message: "Launched Feb 2026",
      }),
    ],
    tagline: translate({
      id: "stablecoins.usdcx.tagline",
      message: "USDCx — The world's most trusted stablecoin, now on Cardano.",
    }),
    body: [
      translate({
        id: "stablecoins.usdcx.body1",
        message: "1:1 backed by USDC. Cross-chain liquidity.",
      }),
      translate({
        id: "stablecoins.usdcx.body2",
        message:
          "USDCx arrived on Cardano in February 2026, brought by Circle, the very company behind USDC, the world's second-largest stablecoin. It's backed 1:1 by Circle's USDC reserves and accessible via Circle's xReserve bridge.",
      }),
      translate({
        id: "stablecoins.usdcx.body3",
        message:
          "For both institutions and individuals, USDCx means accessing the liquidity and trust of USDC while transacting on Cardano's low-fee, high-security network. Within days of launch, USDCx became the largest stablecoin on Cardano by market cap.",
      }),
    ],
    metadata: [
      {
        label: translate({
          id: "stablecoins.meta.backing",
          message: "Backing",
        }),
        value: "1:1 USDC (Circle xReserve)",
      },
    ],
    href: "https://usdcx.iog.io/bridge",
    learnMore: translate({
      id: "stablecoins.usdcx.learnMore",
      message: "Learn more about USDCx",
    }),
  },
  {
    id: "usdm",
    name: "USDM",
    coingeckoId: "usdm-2",
    logo: "/img/stablecoins/usdm.png",
    accent: "blue",
    tags: [
      translate({ id: "stablecoins.tag.fiatBacked", message: "Fiat-backed" }),
      translate({
        id: "stablecoins.tag.cardanoNative",
        message: "Cardano-native",
      }),
      translate({
        id: "stablecoins.usdm.tag.launched",
        message: "Launched March 2024",
      }),
    ],
    tagline: translate({
      id: "stablecoins.usdm.tagline",
      message: "USDM — Cardano's original fiat-backed stablecoin.",
    }),
    body: [
      translate({
        id: "stablecoins.usdm.body1",
        message:
          "Regulated, reserve-backed, and built from the ground up for the Cardano ecosystem.",
      }),
      translate({
        id: "stablecoins.usdm.body2",
        message:
          "Issued by Moneta and launched in March 2024, USDM was the first fiat-backed stablecoin native to Cardano. Every USDM is backed 1:1 by US dollars held at regulated financial institutions, including Fidelity and Western Asset Management. Cardano's native oracle network Charli3 delivers on-chain proof of reserves.",
      }),
      translate({
        id: "stablecoins.usdm.body3",
        message:
          "USDM is registered with FinCEN and compliant with MiCA, making it one of the few stablecoins that meets both US and European regulatory frameworks simultaneously.",
      }),
    ],
    metadata: [
      {
        label: translate({
          id: "stablecoins.meta.custodians",
          message: "Custodians",
        }),
        value: "Fidelity, Western Asset Management",
      },
      {
        label: translate({
          id: "stablecoins.meta.compliance",
          message: "Compliance",
        }),
        value: "FinCEN (US), MiCA (EU)",
      },
    ],
    href: "https://moneta.global",
    learnMore: translate({
      id: "stablecoins.usdm.learnMore",
      message: "Learn more about USDM",
    }),
  },
  {
    id: "usda",
    name: "USDA",
    coingeckoId: "anzens-usda",
    logo: "/img/stablecoins/usda.png",
    accent: "teal",
    tags: [
      translate({ id: "stablecoins.tag.fiatBacked", message: "Fiat-backed" }),
      translate({
        id: "stablecoins.usda.tag.institutional",
        message: "Institutional grade",
      }),
    ],
    tagline: translate({
      id: "stablecoins.usda.tagline",
      message:
        "USDA — Institutional-grade stability, backed by a Cardano founding entity.",
    }),
    body: [
      translate({
        id: "stablecoins.usda.body1",
        message:
          "US Treasury-backed reserves. EMURGO issuer credibility. Available in 80+ countries.",
      }),
      translate({
        id: "stablecoins.usda.body2",
        message:
          "USDA is the stablecoin built by Anzens in collaboration with EMURGO — one of Cardano's three founding entities. Secured by BitGo custody and available to users across more than 80 countries, its reserves are backed by US Treasury instruments, bringing a world's best in class stable asset to Cardano.",
      }),
      translate({
        id: "stablecoins.usda.body3",
        message:
          "For businesses and institutions looking to move dollars on-chain without counterparty exposure to volatile assets, USDA offers sovereign-grade backing with the programmability of Cardano's blockchain.",
      }),
    ],
    metadata: [
      {
        label: translate({
          id: "stablecoins.meta.reserves",
          message: "Reserves",
        }),
        value: "US Treasury instruments",
      },
      {
        label: translate({
          id: "stablecoins.meta.custody",
          message: "Custody",
        }),
        value: "BitGo",
      },
      {
        label: translate({
          id: "stablecoins.meta.issuerPartner",
          message: "Issuer partner",
        }),
        value: "EMURGO",
      },
    ],
    href: "https://anzens.com",
    learnMore: translate({
      id: "stablecoins.usda.learnMore",
      message: "Learn more about USDA",
    }),
  },
  {
    id: "djed",
    name: "DJED",
    coingeckoId: "djed",
    logo: "/img/stablecoins/djed.png",
    accent: "gold",
    tags: [
      translate({
        id: "stablecoins.djed.tag.overcoll",
        message: "Overcollateralised",
      }),
      translate({
        id: "stablecoins.djed.tag.formal",
        message: "Formally verified",
      }),
      translate({
        id: "stablecoins.djed.tag.launched",
        message: "Launched Jan 2023",
      }),
    ],
    tagline: translate({
      id: "stablecoins.djed.tagline",
      message: "DJED — The first mathematically proven stablecoin in history.",
    }),
    body: [
      translate({
        id: "stablecoins.djed.body1",
        message:
          "No bank. No custodian. Just cryptography, collateral, and mathematics you can verify yourself.",
      }),
      translate({
        id: "stablecoins.djed.body2",
        message:
          "DJED is unlike any other stablecoin. There simply is no company holding your dollars. Instead, every DJED is backed by ada collateral held in a smart contract at a ratio between 400% and 800% of DJED's face value. An over-collateralization that mathematically prevents the collapse seen in other algorithmic stablecoins.",
      }),
      translate({
        id: "stablecoins.djed.body3",
        message:
          "DJED's stability properties are formally verified. The protocol was published as a peer-reviewed paper and mathematically proven to be immune to bank run dynamics and reserve draining attacks. It launched on Cardano's Mainnet in January 2023 and has maintained its peg through every market condition since.",
      }),
    ],
    metadata: [
      {
        label: translate({
          id: "stablecoins.meta.collateral",
          message: "Collateral",
        }),
        value: "400-800% ada-backed",
      },
      {
        label: translate({
          id: "stablecoins.meta.reserve",
          message: "Reserve",
        }),
        value: "SHEN",
      },
    ],
    href: "https://djed.xyz",
    learnMore: translate({
      id: "stablecoins.djed.learnMore",
      message: "Learn more about DJED",
    }),
  },
  {
    id: "iusd",
    name: "iUSD",
    coingeckoId: "iusd",
    logo: "/img/stablecoins/iusd.png",
    accent: "violet",
    tags: [
      translate({ id: "stablecoins.iusd.tag.synthetic", message: "Synthetic" }),
      translate({
        id: "stablecoins.iusd.tag.defiNative",
        message: "DeFi-native",
      }),
    ],
    tagline: translate({
      id: "stablecoins.iusd.tagline",
      message: "iUSD — Earn yield while your collateral stays on-chain.",
    }),
    body: [
      translate({
        id: "stablecoins.iusd.body1",
        message:
          "A synthetic dollar minted by Cardano's DeFi community, for Cardano's DeFi community.",
      }),
      translate({
        id: "stablecoins.iusd.body2",
        message:
          "iUSD is a dollar-pegged asset fully on-chain and free of any custodian or bank relationship. Issued by Indigo Protocol — Cardano's synthetic asset platform — it allows users to lock ada as collateral in a collateralized debt position (CDP) to mint iUSD.",
      }),
      translate({
        id: "stablecoins.iusd.body3",
        message:
          "For experienced DeFi participants, iUSD opens strategies that fiat-backed stablecoins can't maintain: ada exposure while generating stablecoin liquidity, or provide iUSD to lending protocols to earn yield on both sides.",
      }),
    ],
    metadata: [
      {
        label: translate({ id: "stablecoins.meta.type", message: "Type" }),
        value: "Synthetic CDP",
      },
      {
        label: translate({ id: "stablecoins.meta.issuer", message: "Issuer" }),
        value: "Indigo Protocol",
      },
    ],
    href: "https://indigoprotocol.io",
    learnMore: translate({
      id: "stablecoins.iusd.learnMore",
      message: "Learn more about iUSD",
    }),
  },
];

// Bridged stablecoins (originate elsewhere, accessible via bridge).
export const BRIDGED_STABLECOINS = [
  {
    id: "pyusd",
    name: "PYUSD",
    coingeckoId: "paypal-usd",
    logo: "/img/stablecoins/pyusd.png",
    accent: "blue",
    body: translate({
      id: "stablecoins.bridge.pyusd.body",
      message:
        "Backed by dollar deposits, US treasuries, and cash equivalents, PayPal gives its millions of users access to Cardano.",
    }),
    href: "https://www.paypal.com/pyusd",
  },
  {
    id: "usdc",
    name: "USDC",
    coingeckoId: "usd-coin",
    logo: "/img/stablecoins/usdc.png",
    accent: "blue",
    body: translate({
      id: "stablecoins.bridge.usdc.body",
      message:
        "Launched by Circle and Coinbase, fully regulated, redeemable 1:1 for U.S. dollars, and used on Cardano.",
    }),
    href: "https://www.circle.com/usdc",
  },
  {
    id: "eurc",
    name: "EURC",
    coingeckoId: "euro-coin",
    logo: "/img/stablecoins/eurc.png",
    accent: "blue",
    body: translate({
      id: "stablecoins.bridge.eurc.body",
      message:
        "Circle's professionalism, Cardano supported, but now redeemable 1:1 for euros.",
    }),
    href: "https://www.circle.com/eurc",
  },
  {
    id: "usdt",
    name: "USDT",
    coingeckoId: "tether",
    logo: "/img/stablecoins/usdt.png",
    accent: "teal",
    body: translate({
      id: "stablecoins.bridge.usdt.body",
      message:
        "The Tether tokens that pioneered the stablecoin model also have a bridge to Cardano.",
    }),
    href: "https://tether.to",
  },
  {
    id: "dai",
    name: "DAI",
    coingeckoId: "dai",
    logo: "/img/stablecoins/dai.png",
    accent: "gold",
    body: translate({
      id: "stablecoins.bridge.dai.body",
      message: "Soft-pegged to the US Dollar and supported on Cardano.",
    }),
    href: "https://makerdao.com",
  },
];

// Three categories used in the Explainer section.
// Order matches Figma: Fiat-backed → Crypto-backed → Synthetic.
export const TYPE_DEFINITIONS = [
  {
    id: "fiat-backed",
    title: translate({
      id: "stablecoins.type.fiatBacked.title",
      message: "Fiat-backed",
    }),
    body: translate({
      id: "stablecoins.type.fiatBacked.body",
      message:
        "The simplest kind. For every stablecoin in circulation, a real dollar is held in reserve at a regulated financial institution. When you hold a fiat-backed stablecoin, you're holding a claim on that real dollar. USDM, USDA, and USDCx on Cardano all work this way.",
    }),
  },
  {
    id: "crypto-backed",
    title: translate({
      id: "stablecoins.type.cryptoBacked.title",
      message: "Crypto-backed (overcollateralized)",
    }),
    body: translate({
      id: "stablecoins.type.cryptoBacked.body",
      message:
        "No bank is involved, so there is no custodian. Instead, the stablecoin is backed by cryptocurrency locked in a smart contract, usually above 100% collateral to absorb market volatility. On Cardano, DJED is overcollateralized, meaning every DJED is backed by significantly more ada than its face value. The maths is formally proven.",
    }),
  },
  {
    id: "synthetic",
    title: translate({
      id: "stablecoins.type.synthetic.title",
      message: "Synthetic (CDP)",
    }),
    body: translate({
      id: "stablecoins.type.synthetic.body",
      message:
        "Users lock collateral to mint a stablecoin that tracks the dollar's price through a combination of incentives and market mechanisms. iUSD on Cardano works this way through the Indigo Protocol.",
    }),
  },
];

// 4 callouts in the Why-Cardano section (2x2 grid).
export const WHY_CARDANO_REASONS = [
  {
    id: "native-tokens",
    title: translate({
      id: "stablecoins.whyCardano.nativeTokens.title",
      message: "Native tokens, not smart contracts",
    }),
    body: [
      translate({
        id: "stablecoins.whyCardano.nativeTokens.body1",
        message:
          "On other blockchains, stablecoins are second-class citizens. They depend on a smart contract that's not native to the network and doesn't benefit from the network's usual security. Every transfer executes code, all code can have bugs, and any bug can be exploited.",
      }),
      translate({
        id: "stablecoins.whyCardano.nativeTokens.body2",
        message:
          "On Cardano, stablecoins are native tokens. They live at the protocol level, treated by the ledger exactly like ada itself. A basic transfer doesn't run any code, and there's nothing to exploit.",
      }),
      translate({
        id: "stablecoins.whyCardano.nativeTokens.body3",
        message:
          "This fundamental design difference eliminates an entire category of risk. For anyone holding or moving significant value, that matters.",
      }),
    ],
  },
  {
    id: "predictable-fees",
    title: translate({
      id: "stablecoins.whyCardano.fees.title",
      message: "Fees you can predict before you pay",
    }),
    body: [
      translate({
        id: "stablecoins.whyCardano.fees.body1",
        message:
          "Nobody should be surprised by a transaction fee. Yet on congested networks, users routinely pay multiples of their intended fee — or watch transactions fail while still paying the cost.",
      }),
      translate({
        id: "stablecoins.whyCardano.fees.body2",
        message:
          "Cardano transactions are deterministic. Before you submit a transaction, you know exactly what it will cost. There are no hidden execution charges, no fee auctions, no failed transactions that still cost money.",
      }),
      translate({
        id: "stablecoins.whyCardano.fees.body3",
        message:
          "For businesses processing payroll, settlements, or high-volume payments, that predictability means assurance and peace of mind.",
      }),
    ],
  },
  {
    id: "zero-outages",
    title: translate({
      id: "stablecoins.whyCardano.outages.title",
      message: "Nine years, zero outages",
    }),
    body: [
      translate({
        id: "stablecoins.whyCardano.outages.body1",
        message:
          "Cardano's Mainnet has never gone down. Since launch in 2017, it has maintained continuous operation through every market cycle, network stress event, and technical upgrade.",
      }),
      translate({
        id: "stablecoins.whyCardano.outages.body2",
        message:
          "For institutional settlement, cross-border payment, or any application where availability isn't optional, this track record is not just unmatched in the industry but a key value proposition.",
      }),
    ],
  },
  {
    id: "governance-backed",
    title: translate({
      id: "stablecoins.whyCardano.governance.title",
      message: "Finance strategy backed by governance",
    }),
    body: [
      translate({
        id: "stablecoins.whyCardano.governance.body1",
        message:
          "In 2025, the Cardano community voted on-chain to allocate 70 million ada from the treasury to accelerate stablecoin adoption, bringing USDCx to Cardano. The decision wasn't made by a company, a board, or an opaque leadership in a closed meeting room. It was made by the ada holders themselves — transparently, on-chain, and with verifiable results.",
      }),
      translate({
        id: "stablecoins.whyCardano.governance.body2",
        message:
          "The stablecoin ecosystem on Cardano isn't shaped by a single entity's unilateral interests. It's backed by the community that uses it and aimed towards long-term longevity.",
      }),
    ],
  },
];

// Numbered steps in the Get Started section ("Starting from scratch").
export const GET_STARTED_STEPS = [
  {
    n: 1,
    title: translate({
      id: "stablecoins.step.1.title",
      message: "Set up a Cardano wallet",
    }),
    body: translate({
      id: "stablecoins.step.1.body",
      message:
        "You'll need a non-custodial wallet to hold and manage your stablecoins. Popular options: Eternl, Lace, Vespr.",
    }),
  },
  {
    n: 2,
    title: translate({
      id: "stablecoins.step.2.title",
      message: "Get some ada",
    }),
    body: translate({
      id: "stablecoins.step.2.body",
      message:
        "You'll need ada in your wallet to then purchase your chosen stablecoin, plus a small extra amount to cover fees. Acquire from Coinbase, Kraken, Binance, etc.",
    }),
  },
  {
    n: 3,
    title: translate({
      id: "stablecoins.step.3.title",
      message: "Swap the ada for stablecoins",
    }),
    body: translate({
      id: "stablecoins.step.3.body",
      message:
        "Use a decentralized exchange like Minswap, WingRiders, or MuesliSwap to swap ada for your preferred stablecoin.",
    }),
  },
  {
    n: 4,
    title: translate({ id: "stablecoins.step.4.title", message: "All done" }),
    body: translate({
      id: "stablecoins.step.4.body",
      message:
        "Your stablecoins sit in your wallet, under your control, ready to use, invest, or hold.",
    }),
  },
];

// Right-side panel of the Get Started section: direct mint / bridge links.
export const DIRECT_MINT_LINKS = [
  {
    id: "eth-sol-bridge",
    title: translate({
      id: "stablecoins.directMint.bridge.title",
      message: "From Ethereum or Solana",
    }),
    body: translate({
      id: "stablecoins.directMint.bridge.body",
      message:
        "Use a cross-chain bridge to bring USDC or USDT to Cardano and swap for USDCx or other stablecoins.",
    }),
  },
  {
    id: "mint-usdm",
    title: translate({
      id: "stablecoins.directMint.usdm.title",
      message: "Mint USDM directly",
    }),
    href: "https://moneta.global",
    body: translate({
      id: "stablecoins.directMint.usdm.body",
      message:
        "Go to moneta.global to mint USDM with fiat via bank transfer (available in eligible jurisdictions).",
    }),
  },
  {
    id: "mint-usda",
    title: translate({
      id: "stablecoins.directMint.usda.title",
      message: "Mint USDA",
    }),
    href: "https://anzens.com",
    body: translate({
      id: "stablecoins.directMint.usda.body",
      message: "Access Anzens.com to onramp directly to USDA.",
    }),
  },
  {
    id: "mint-djed",
    title: translate({
      id: "stablecoins.directMint.djed.title",
      message: "Mint DJED",
    }),
    href: "https://djed.xyz",
    body: translate({
      id: "stablecoins.directMint.djed.body",
      message: "Visit djed.xyz to deposit ada as collateral and mint DJED.",
    }),
  },
];
