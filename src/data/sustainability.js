import { translate } from "@docusaurus/Translate";

// Data for the /sustainability page (Cardano energy efficiency and the
// CCRI / MiCA sustainability indicators).
//
// Every user-facing string lives here so the page and its section components
// stay presentational. Brand and network names are not translated.
//
// Figures are kept as display strings so the exact formatting of the source
// (decimal places, thousands separators) is preserved. They are declared once
// in CCRI_FIGURES and reused wherever the same metric appears (hero, results,
// FAQ) so a correction only has to be made in one place.
//
// DATA NOTES (from the design hand-off, resolve with the content owner):
// - The source gives 392.28 MWh in the hero and 392.38 MWh in the results
//   table and FAQ for the same metric. 392.38 is used everywhere here.
// - The comparison table keeps the source values verbatim, including the
//   Cardano row (704,910 kWh / 0.00025073 Mt), which comes from the 2024
//   assessment rather than the 2026 figures used elsewhere on the page.
// - Polkadot and Algorand rows are intentionally blank, as in the source.
// - The network distribution figures are a static snapshot (epoch 633)
//   pending a live data source.
// - FAQ answers two to five are not in the design; they are drafted from the
//   figures on this page and must be replaced with the source copy.

export const CCRI_REPORT_URL =
  "https://cardanofoundation.org/blog/ccri-cardano-release-mica-sustainability-indicators";

export const NETWORK_DATASET_URL = "https://data.blockperf.cardanofoundation.org";

export const CCRI_FIGURES = {
  annualElectricityMwh: "392.38",
  annualCarbonT: "130.45",
  marginalPowerPerTpsW: "0.225",
  averagePowerPerNodeW: "21.01",
  networkPowerKw: "80.47",
  marginalCo2PerTxG: "0.000018987",
  carbonIntensityKgPerKwh: "0.332",
};

export const META = {
  title: translate({
    id: "sustainability.meta.title",
    message: "Cardano Sustainability: Energy Consumption and Carbon Footprint",
  }),
  description: translate(
    {
      id: "sustainability.meta.description",
      message:
        "Cardano's proof-of-stake network consumes {mwh} MWh of electricity per year with a carbon footprint of {tco2e} tCO2e, independently verified by the Crypto Carbon Ratings Institute (CCRI) and reported under MiCA.",
    },
    {
      mwh: CCRI_FIGURES.annualElectricityMwh,
      tco2e: CCRI_FIGURES.annualCarbonT,
    },
  ),
};

export const HERO = {
  tag: translate({ id: "sustainability.hero.tag", message: "Independently verified" }),
  title: translate({
    id: "sustainability.hero.title",
    message: "Cardano Among the Most Energy Efficient Blockchains by Right",
  }),
  description: translate(
    {
      id: "sustainability.hero.description",
      message:
        "Cardano's Ouroboros proof of stake was designed for low energy consumption from day one. It's a proven fact. The Crypto Carbon Ratings Institute (CCRI) verified the numbers and ranked Cardano's energy consumption among the lowest of any major layer 1 blockchains in operation: just {mwh} MWh per year, with a carbon footprint of {tco2e} tCO2e.",
    },
    {
      mwh: CCRI_FIGURES.annualElectricityMwh,
      tco2e: CCRI_FIGURES.annualCarbonT,
    },
  ),
  stats: [
    {
      value: `${CCRI_FIGURES.annualElectricityMwh} MWh`,
      label: translate({
        id: "sustainability.hero.stat.electricity",
        message: "annual network electricity consumption",
      }),
    },
    {
      value: `${CCRI_FIGURES.annualCarbonT} tCO2e`,
      label: translate({
        id: "sustainability.hero.stat.carbon",
        message: "annual network carbon footprint",
      }),
    },
    {
      value: `${CCRI_FIGURES.marginalPowerPerTpsW} W`,
      label: translate({
        id: "sustainability.hero.stat.perTps",
        message: "power per transaction/sec",
      }),
    },
    {
      value: `${CCRI_FIGURES.averagePowerPerNodeW} W`,
      label: translate({
        id: "sustainability.hero.stat.perNode",
        message: "average power per node",
      }),
    },
  ],
  statsAriaLabel: translate({
    id: "sustainability.hero.statsAriaLabel",
    message: "Key sustainability indicators",
  }),
  footnote: translate({
    id: "sustainability.hero.footnote",
    message:
      "Updated Network Assessment and MiCA Sustainability Indicators for ADA, Crypto Carbon Ratings Institute (CCRI), June 2026",
  }),
};

export const DIFFERENTIATION = {
  title: translate({
    id: "sustainability.differentiation.title",
    message: "How Cardano Achieves Low Energy Consumption",
  }),
  intro: [
    translate({
      id: "sustainability.differentiation.intro1",
      message: "Cardano's blockchain energy consumption is a property of the protocol itself.",
    }),
    translate({
      id: "sustainability.differentiation.intro2",
      message:
        "The network runs on Ouroboros, the first blockchain consensus mechanism based on peer-reviewed research. **Secure, sustainable, and scalable** to meet the needs of builders, companies, public institutions, and individual users.",
    }),
  ],
  cardsHeading: translate({
    id: "sustainability.differentiation.cardsHeading",
    message: "What Makes Cardano Different",
  }),
  cards: [
    {
      index: "01",
      title: translate({
        id: "sustainability.differentiation.card1.title",
        message: "Proof of stake instead of proof of work",
      }),
      body: translate({
        id: "sustainability.differentiation.card1.body",
        message:
          "Ouroboros energy efficiency was built into the protocol from the get-go. Cardano's proof-of-stake protocol selects validators based on the amount of tokens they have, not their processing power like proof-of-work networks. Ouroboros does away with the proof of work needs for increasingly higher energy consumption to ensure consensus, resulting in a more energy efficient blockchain and a better fit for scalable projects.",
      }),
    },
    {
      index: "02",
      title: translate({
        id: "sustainability.differentiation.card2.title",
        message: "Decentralized network, minimal energy footprint",
      }),
      body: translate(
        {
          id: "sustainability.differentiation.card2.body",
          message:
            "Cardano is secured by over 3000 operators running nodes and producing blocks across more than 70 countries. High decentralization increases security, and Cardano achieves it using just every day hardware and an average power consumption of {watts} W per node. Lower than a traditional incandescent bulb, and only a little above two typical LED bulbs.",
        },
        { watts: CCRI_FIGURES.averagePowerPerNodeW },
      ),
    },
    {
      index: "03",
      title: translate({
        id: "sustainability.differentiation.card3.title",
        message: "The EUTXO model brings transaction efficiency",
      }),
      body: translate({
        id: "sustainability.differentiation.card3.body",
        message:
          "Cardano created a special transaction model: the Extended UTXO (EUTXO), an improved version of the UTXO model first introduced by Bitcoin. Thanks to the EUTXO model, Cardano can batch multiple transactions into a single one, reducing costs as well as energy needs. And a growing ecosystem of scaling solutions increases performance even more.",
      }),
    },
  ],
};

// Annual electricity values are shown as formatted strings and, where a bar is
// drawn, also as numbers. Bars are scaled so the largest non-overflow row
// (Solana) fills the column; `overflow` rows draw a full-width faded bar to
// show they exceed the axis.
const COMPARISON_BAR_MAX_KWH = 8483906;

export const COMPARISON = {
  title: translate({
    id: "sustainability.comparison.title",
    message: "Blockchain Energy Consumption Comparison",
  }),
  subtitle: translate({
    id: "sustainability.comparison.subtitle",
    message:
      "The data is clear: Cardano belongs among the most sustainable and most energy efficient blockchains.",
  }),
  caption: translate({
    id: "sustainability.comparison.caption",
    message: "Annual energy consumption and emissions of major blockchain networks",
  }),
  columns: {
    network: translate({ id: "sustainability.comparison.col.network", message: "Network" }),
    consensus: translate({
      id: "sustainability.comparison.col.consensus",
      message: "Consensus Mechanism",
    }),
    electricity: translate({
      id: "sustainability.comparison.col.electricity",
      message: "Annual Electricity Consumption (kWh)",
    }),
    power: translate({ id: "sustainability.comparison.col.power", message: "Electric Power (kW)" }),
    co2: translate({
      id: "sustainability.comparison.col.co2",
      message: "Annual CO2 emissions (Mt)",
    }),
  },
  barMaxKwh: COMPARISON_BAR_MAX_KWH,
  rows: [
    {
      network: "Cardano",
      highlight: true,
      consensus: translate({
        id: "sustainability.comparison.consensus.pos",
        message: "Proof of Stake",
      }),
      electricity: "704,910",
      electricityKwh: 704910,
      power: "80.47",
      co2: "0.00025073",
    },
    {
      network: "Solana",
      consensus: translate({
        id: "sustainability.comparison.consensus.pohPos",
        message: "Proof of History & Proof of Stake",
      }),
      electricity: "8,483,906",
      electricityKwh: 8483906,
      power: "968.48",
      co2: "0.002671",
    },
    {
      network: "Polkadot",
      consensus: translate({
        id: "sustainability.comparison.consensus.npos",
        message: "Nominated Proof of Stake",
      }),
      electricity: null,
      electricityKwh: null,
      power: null,
      co2: null,
    },
    {
      network: "Algorand",
      consensus: translate({
        id: "sustainability.comparison.consensus.ppos",
        message: "Pure Proof of Stake",
      }),
      electricity: null,
      electricityKwh: null,
      power: null,
      co2: null,
    },
    {
      network: translate({
        id: "sustainability.comparison.network.ethereum",
        message: "Ethereum (post-merge)",
      }),
      consensus: translate({
        id: "sustainability.comparison.consensus.pos",
        message: "Proof of Stake",
      }),
      electricity: "2,600,863.27",
      electricityKwh: 2600863.27,
      power: "296.9",
      co2: "0.00086978",
    },
    {
      network: "Bitcoin",
      consensus: translate({
        id: "sustainability.comparison.consensus.pow",
        message: "Proof of Work",
      }),
      electricity: "138,000,000,000",
      electricityKwh: 138000000000,
      overflow: true,
      power: "15,753,425",
      co2: "39.8",
    },
  ],
  notAvailable: translate({
    id: "sustainability.comparison.notAvailable",
    message: "Not available",
  }),
};

// Static snapshot of block-producing nodes by country (epoch 633), pending a
// live feed. `code` is the ISO 3166-1 alpha-2 code used to place the country
// on the map (see src/data/countryCentroids.json).
export const NETWORK = {
  epoch: 633,
  countries: 22,
  pools: "1,193",
  stakeMAda: "21,189",
  titleLine1: translate(
    { id: "sustainability.network.titleLine1", message: "{count} countries." },
    { count: 22 },
  ),
  titleLine2: translate(
    { id: "sustainability.network.titleLine2", message: "{count} stake pools." },
    { count: "1,193" },
  ),
  scopeNote: translate(
    {
      id: "sustainability.network.scopeNote",
      message:
        "Block-producing nodes reported to the Cardano Foundation's monitoring project, by country, for epoch {epoch}. Hover any country or row to highlight it.",
    },
    { epoch: 633 },
  ),
  mapAriaLabel: translate({
    id: "sustainability.network.mapAriaLabel",
    message: "World map of Cardano stake pools by country",
  }),
  legend: {
    less: translate({ id: "sustainability.network.legend.less", message: "Less" }),
    more: translate({ id: "sustainability.network.legend.more", message: "More" }),
    ariaLabel: translate({
      id: "sustainability.network.legend.ariaLabel",
      message: "Shading from fewer to more stake pools",
    }),
  },
  tableEyebrow: translate({
    id: "sustainability.network.tableEyebrow",
    message: "Top 10 by stake pool count",
  }),
  columns: {
    country: translate({ id: "sustainability.network.col.country", message: "Country" }),
    pools: translate({ id: "sustainability.network.col.pools", message: "Pools" }),
    stake: translate({ id: "sustainability.network.col.stake", message: "Stake (M ADA)" }),
  },
  rows: [
    { code: "DE", name: translate({ id: "sustainability.network.country.DE", message: "Germany" }), pools: 568, stake: "8,215" },
    { code: "US", name: translate({ id: "sustainability.network.country.US", message: "United States" }), pools: 236, stake: "3,353" },
    { code: "JP", name: translate({ id: "sustainability.network.country.JP", message: "Japan" }), pools: 65, stake: "1,202" },
    { code: "FR", name: translate({ id: "sustainability.network.country.FR", message: "France" }), pools: 62, stake: "1,257" },
    { code: "NL", name: translate({ id: "sustainability.network.country.NL", message: "Netherlands" }), pools: 40, stake: "1,219" },
    { code: "FI", name: translate({ id: "sustainability.network.country.FI", message: "Finland" }), pools: 34, stake: "293" },
    { code: "IN", name: translate({ id: "sustainability.network.country.IN", message: "India" }), pools: 27, stake: "495" },
    { code: "CA", name: translate({ id: "sustainability.network.country.CA", message: "Canada" }), pools: 25, stake: "533" },
    { code: "KR", name: translate({ id: "sustainability.network.country.KR", message: "South Korea" }), pools: 25, stake: "914" },
    { code: "GB", name: translate({ id: "sustainability.network.country.GB", message: "United Kingdom" }), pools: 20, stake: "583" },
  ],
  totalLabel: translate(
    { id: "sustainability.network.totalLabel", message: "All {count} countries" },
    { count: 22 },
  ),
  sourceLabel: translate({ id: "sustainability.network.sourceLabel", message: "Source." }),
  source: translate(
    {
      id: "sustainability.network.source",
      message:
        "Cardano Foundation block-performance dataset ({dataset}), aggregated from monitoring nodes and participating community pools. Snapshot for epoch {epoch}.",
    },
    { dataset: "data.blockperf.cardanofoundation.org", epoch: 633 },
  ),
};

export const MICA = {
  title: translate({ id: "sustainability.mica.title", message: "The MiCA Framework" }),
  paragraphs: [
    translate({
      id: "sustainability.mica.p1",
      message:
        "Metrics for blockchain and crypto's environmental impact used to just talk about proof of work and Bitcoin's energy consumption. That's no longer the case. Proof of stake introduced much more energy efficient protocols, and the European Union's MiCA regulations ensured blockchains track and disclose their energy consumption.",
    }),
    translate({
      id: "sustainability.mica.p2",
      message:
        "Making the relevant data publicly available then added extra relevance for the public and enterprises: It increased transparency, letting users verify the information and enabling market participants to meet MiCA disclosure requirements efficiently while reducing compliance costs and barriers to market entry.",
    }),
    translate({
      id: "sustainability.mica.p3",
      message:
        "For Cardano, the MiCA environmental and sustainability indicators were made available almost half a year before the late 2024 deadline. Through an open API, everyone can access and use the data to ensure their compliance with MiCA's disclosure requirements. The reporting is clear, transparent and based on a robust methodology by one of the leading MiCA data providers: CCRI.",
    }),
  ],
  methodologyAriaLabel: translate({
    id: "sustainability.mica.methodologyAriaLabel",
    message: "CCRI methodology",
  }),
  methodology: [
    {
      index: "01",
      title: translate({ id: "sustainability.mica.m1.title", message: "Hardware selection" }),
      body: translate({
        id: "sustainability.mica.m1.body",
        message:
          "CCRI looked into Cardano's minimum hardware requirements. They used a survey of stake pool operators (SPOs), drawing on actual operational data from network participants, which reflects real-world conditions and provides a more representative and accurate picture of deployed hardware.",
      }),
    },
    {
      index: "02",
      title: translate({ id: "sustainability.mica.m2.title", message: "Hardware measurement" }),
      body: translate({
        id: "sustainability.mica.m2.body",
        message:
          "CCRI measured the electricity consumption of one Cardano node, plus gave upper and lower bounds for Cardano network nodes. They also adapted the variables to coincide with Cardano's block production times.",
      }),
    },
    {
      index: "03",
      title: translate({ id: "sustainability.mica.m3.title", message: "Electricity consumption" }),
      body: translate({
        id: "sustainability.mica.m3.body",
        message:
          "CCRI gathered information on the size of Cardano's network and calculated the network's full electricity consumption by taking into account those values, plus the hardware used by SPOs and the individual nodes' energy consumption.",
      }),
    },
    {
      index: "04",
      title: translate({ id: "sustainability.mica.m4.title", message: "Performance metrics" }),
      body: translate({
        id: "sustainability.mica.m4.body",
        message:
          "CCRI considered extra data like block formation and transactions processed to calculate a node's power demand as transaction volume changes.",
      }),
    },
    {
      index: "05",
      title: translate({ id: "sustainability.mica.m5.title", message: "Carbon footprint" }),
      body: translate({
        id: "sustainability.mica.m5.body",
        message:
          "CCRI takes into account the regional grid emissions that apply to the SPOs' locations and calculates Cardano's CO2 emissions by multiplying the network's electricity consumption by its carbon intensity.",
      }),
    },
  ],
};

export const RESULTS = {
  title: translate({ id: "sustainability.results.title", message: "Key Cardano CCRI Results" }),
  subtitle: translate({
    id: "sustainability.results.subtitle",
    message:
      "Cardano provides data for all mandatory sustainability indicators as required by the European Securities and Markets Authority (ESMA).",
  }),
  groups: [
    {
      letter: "A",
      label: translate({ id: "sustainability.results.groupA", message: "Electricity" }),
      indicators: [
        {
          label: translate({
            id: "sustainability.results.perNode",
            message: "Average electrical power per node",
          }),
          value: CCRI_FIGURES.averagePowerPerNodeW,
          unit: "W",
        },
        {
          label: translate({
            id: "sustainability.results.networkPower",
            message: "Electrical power of network",
          }),
          value: CCRI_FIGURES.networkPowerKw,
          unit: "kW",
        },
        {
          label: translate({
            id: "sustainability.results.annualElectricity",
            message: "Annualized electricity consumption",
          }),
          value: CCRI_FIGURES.annualElectricityMwh,
          unit: "MWh",
        },
        {
          label: translate({
            id: "sustainability.results.perTps",
            message: "Marginal power consumption per TPS",
          }),
          value: CCRI_FIGURES.marginalPowerPerTpsW,
          unit: "W",
        },
      ],
    },
    {
      letter: "B",
      label: translate({ id: "sustainability.results.groupB", message: "Carbon" }),
      indicators: [
        {
          label: translate({
            id: "sustainability.results.annualCo2",
            message: "Annualized CO2 emissions",
          }),
          value: CCRI_FIGURES.annualCarbonT,
          unit: "t",
        },
        {
          label: translate({
            id: "sustainability.results.perTx",
            message: "Marginal CO2 emissions per tx",
          }),
          value: CCRI_FIGURES.marginalCo2PerTxG,
          unit: "g",
        },
        {
          label: translate({
            id: "sustainability.results.intensity",
            message: "Applied CO2 emission intensity",
          }),
          value: CCRI_FIGURES.carbonIntensityKgPerKwh,
          unit: "kg/kWh",
        },
      ],
    },
  ],
};

export const RESOURCES = {
  title: translate({
    id: "sustainability.resources.title",
    message: "Cardano Sustainability Resources",
  }),
  ariaLabel: translate({
    id: "sustainability.resources.ariaLabel",
    message: "Sustainability resources",
  }),
  prevLabel: translate({ id: "sustainability.resources.prev", message: "Previous resources" }),
  nextLabel: translate({ id: "sustainability.resources.next", message: "Next resources" }),
  items: [
    {
      title: translate({
        id: "sustainability.resources.ouroboros.title",
        message: "What makes Ouroboros unique?",
      }),
      description: translate({
        id: "sustainability.resources.ouroboros.description",
        message: "How Cardano's consensus protocol achieves security with minimal energy",
      }),
      href: "/ouroboros",
    },
    {
      title: translate({
        id: "sustainability.resources.posPow.title",
        message: "Proof of stake and proof of work at a glance",
      }),
      description: translate({
        id: "sustainability.resources.posPow.description",
        message: "A side-by-side comparison of the two main consensus approaches",
      }),
      href: "https://cardanofoundation.org/blog/how-the-benefits-of-proof-of-stake-go-far-beyond-energy-consumption",
    },
    {
      title: translate({
        id: "sustainability.resources.posTypes.title",
        message: "The different types of proof-of-stake mechanisms",
      }),
      description: translate({
        id: "sustainability.resources.posTypes.description",
        message: "Understanding delegated, nominated, and bonded staking designs",
      }),
      href: "https://cardanofoundation.org/blog/introduction-proof-of-stake-blockchains",
    },
    {
      title: translate({
        id: "sustainability.resources.layer2.title",
        message: "Cardano's layer 2 solutions",
      }),
      description: translate({
        id: "sustainability.resources.layer2.description",
        message: "Scaling throughput without increasing the chain's energy footprint",
      }),
      href: "/layer-2",
    },
    {
      title: translate({
        id: "sustainability.resources.eutxo.title",
        message: "Core concepts: the EUTXO",
      }),
      description: translate({
        id: "sustainability.resources.eutxo.description",
        message: "Why Cardano's transaction model is both efficient and deterministic",
      }),
      href: "/glossary/eutxo",
    },
  ],
};

export const FAQ = {
  title: translate({
    id: "sustainability.faq.title",
    message: "Energy Efficient Blockchains: Frequently Asked Questions",
  }),
  items: [
    {
      question: translate({
        id: "sustainability.faq.q1",
        message: "Is Cardano environmentally friendly?",
      }),
      answer: [
        translate(
          {
            id: "sustainability.faq.a1",
            message:
              "Yes, Cardano is environmentally friendly by design. Cardano's Ouroboros proof-of-stake protocol consumes {mwh} MWh of electricity annually and has a carbon footprint of just {tco2e} tCO2e, both verified by the Crypto Carbon Ratings Institute (CCRI) in a 2026 report. These figures place Cardano among the lowest-impact layer 1 blockchains currently in operation.",
          },
          {
            mwh: CCRI_FIGURES.annualElectricityMwh,
            tco2e: CCRI_FIGURES.annualCarbonT,
          },
        ),
      ],
    },
    // TODO(content): answers two to five are drafts based on the figures on
    // this page. Replace them with the copy from the source document.
    {
      question: translate({
        id: "sustainability.faq.q2",
        message: "What is the carbon footprint of Cardano?",
      }),
      answer: [
        translate(
          {
            id: "sustainability.faq.a2",
            message:
              "The CCRI's 2026 network assessment puts the annualized carbon footprint of the Cardano network at {tco2e} tCO2e. It is calculated by multiplying the network's annual electricity consumption of {mwh} MWh by an applied emission intensity of {intensity} kg CO2 per kWh, which reflects the regional grids where stake pool operators run their nodes.",
          },
          {
            tco2e: CCRI_FIGURES.annualCarbonT,
            mwh: CCRI_FIGURES.annualElectricityMwh,
            intensity: CCRI_FIGURES.carbonIntensityKgPerKwh,
          },
        ),
      ],
    },
    {
      question: translate({
        id: "sustainability.faq.q3",
        message: "What is the energy consumption of proof of stake vs proof of work?",
      }),
      answer: [
        translate(
          {
            id: "sustainability.faq.a3",
            message:
              "Proof-of-work networks secure the chain through mining, a competition that rewards computing power and therefore electricity use. Proof-of-stake networks select block producers in proportion to the stake they hold, so ordinary hardware is enough. The comparison above shows the gap: Bitcoin's proof-of-work network is estimated at 138,000,000,000 kWh per year, while proof-of-stake networks such as Cardano ({mwh} MWh) and Ethereum (2,600,863 kWh) use several orders of magnitude less.",
          },
          { mwh: CCRI_FIGURES.annualElectricityMwh },
        ),
      ],
    },
    {
      question: translate({
        id: "sustainability.faq.q4",
        message: "What is the energy consumption of Cardano vs Bitcoin?",
      }),
      answer: [
        translate(
          {
            id: "sustainability.faq.a4",
            message:
              "Cardano's proof-of-stake network consumes {mwh} MWh of electricity per year, according to the CCRI. Bitcoin's proof-of-work network is estimated at 138,000,000,000 kWh (138 TWh) per year, with an electric power demand of 15,753,425 kW against Cardano's {networkKw} kW.",
          },
          {
            mwh: CCRI_FIGURES.annualElectricityMwh,
            networkKw: CCRI_FIGURES.networkPowerKw,
          },
        ),
      ],
    },
    {
      question: translate({
        id: "sustainability.faq.q5",
        message: "What is the energy consumption of Cardano vs Ethereum?",
      }),
      answer: [
        translate(
          {
            id: "sustainability.faq.a5",
            message:
              "Both networks run proof of stake. The CCRI assessed Cardano at {mwh} MWh of electricity per year, while Ethereum (post-merge) was assessed at 2,600,863 kWh per year, roughly six and a half times Cardano's consumption, with annual CO2 emissions of 0.00086978 Mt compared with Cardano's {tco2e} tCO2e.",
          },
          {
            mwh: CCRI_FIGURES.annualElectricityMwh,
            tco2e: CCRI_FIGURES.annualCarbonT,
          },
        ),
      ],
    },
  ],
};

export const CTA = {
  heading: translate({
    id: "sustainability.cta.heading",
    message: "Verified by CCRI. Backed by Science.",
  }),
  supporting: translate({
    id: "sustainability.cta.supporting",
    message: "Download the full sustainability report to see how Cardano measures up.",
  }),
  button: translate({ id: "sustainability.cta.button", message: "Read the CCRI Report" }),
  href: CCRI_REPORT_URL,
};
