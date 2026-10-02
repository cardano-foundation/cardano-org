import { translate } from "@docusaurus/Translate";

// Data for the /programmable-tokens page (Cardano's CIP-0113 programmable
// tokens standard for regulated assets).
//
// Every user-facing string lives here so the page and its section components
// stay presentational. Brand, product, and language names (Cardano, Aiken,
// CIP-0113) are not translated.
//
// Inline formatting in the strings below, rendered by
// src/components/ProgrammableTokens/RichText:
//   [text](url)  link (external URLs open in a new tab)
//   _text_       italic, **text** bold
//
// DATA NOTES (resolve with the content owner):
// - Partner logos live in static/img/logos/ as <slug> and <slug>-dark, shared
//   with the rest of the site. Eternl and CardanoScan are PNGs until vector
//   versions are available. The BendingAI, GeroWallet, and CardanoScan dark
//   variants are the supplied logos with their text recolored white, pending
//   official light-text versions.
// - Both call-to-action buttons point to the Cardano Foundation contact page
//   until a dedicated implementation support form is confirmed.
// - The No Witness Labs audit reports back the audit statement in
//   COMPLIANCE.audit; the CMTA certification and the Anastasia Labs checks
//   have no published source yet.

const CF_CONTACT_URL = "https://cardanofoundation.org/contact";
const CIP113_REPO_URL = "https://github.com/cardano-foundation/cip113-programmable-tokens";

export const META = {
  title: translate({
    id: "programmableTokens.meta.title",
    message: "Programmable Tokens for Regulated Assets",
  }),
  description: translate({
    id: "programmableTokens.meta.description",
    message:
      "Cardano's open-source programmable tokens standard implements logic like KYC, AML, or transfer restrictions at the asset level and on a public ledger.",
  }),
};

export const HERO = {
  title: translate({
    id: "programmableTokens.hero.title",
    message: "Programmable Tokens for Regulated Assets",
  }),
  subtitle: translate({
    id: "programmableTokens.hero.subtitle",
    message:
      "Enforce KYC, AML, sanctions screening, freeze, and transfer restrictions natively at the asset level. Already available on Cardano's mainnet today.",
  }),
  body: translate({
    id: "programmableTokens.hero.body",
    message:
      "Major international bodies and standard setters — from the Bank for International Settlements to the International Monetary Fund or the Financial Stability Board — have suggested similar requirements or recommendations for the next generation of regulated financial assets: Compliance rules should execute automatically at the token level, on every transaction, enforced by the ledger itself rather than by a separate system or a custodian's policy manual. Cardano's programmable tokens solution delivers exactly that, without requiring a hard fork, wrapping assets in a secondary smart contract layer, or adding a point of failure by relying on third parties for enforcement. A state-of-the-art solution that reduces architectural and operational risks.",
  }),
  button: {
    label: translate({
      id: "programmableTokens.hero.button",
      message: "Plan Your Implementation",
    }),
    href: CF_CONTACT_URL,
  },
};

// Partner and user logo strip under the hero. Logos are shown without a
// visible name; `name` is the alt text and `href` the project's official site.
// `logoDark` is an optional variant for the dark theme.
export const PARTNERS = {
  ariaLabel: translate({
    id: "programmableTokens.partners.ariaLabel",
    message: "Partners and users of Cardano programmable tokens",
  }),
  items: [
    {
      name: "BendingAI",
      logo: "/img/logos/bendingai.svg",
      logoDark: "/img/logos/bendingai-dark.svg",
      href: "https://bending.ai",
    },
    {
      name: "CardanoScan",
      logo: "/img/logos/cardanoscan.png",
      logoDark: "/img/logos/cardanoscan-dark.png",
      href: "https://cardanoscan.io",
    },
    {
      name: "Eternl",
      logo: "/img/logos/eternl.png",
      logoDark: "/img/logos/eternl-dark.png",
      href: "https://eternl.io",
    },
    {
      name: "GeroWallet",
      logo: "/img/logos/gerowallet.svg",
      logoDark: "/img/logos/gerowallet-dark.svg",
      href: "https://gerowallet.io",
    },
    {
      name: "BloxBean",
      logo: "/img/logos/bloxbean.svg",
      logoDark: "/img/logos/bloxbean-dark.svg",
      href: "https://www.bloxbean.com",
    },
  ],
};

export const WHY = {
  title: translate({
    id: "programmableTokens.why.title",
    message: "Why Regulated Tokenization Requires Compliance at the Token Level",
  }),
  paragraphs: [
    translate({
      id: "programmableTokens.why.paragraph1",
      message:
        "For regulated financial assets — such as [stablecoins](/stablecoins), bonds, shares, or other securities — to realize the full potential of tokenization on public ledgers, the underlying infrastructure must support the integration of compliance mechanisms, enabling the programmatic enforcement of KYC and AML rules, ownership restrictions, or transfer controls throughout every asset movement.",
    }),
    translate({
      id: "programmableTokens.why.paragraph2",
      message:
        "The [January 2025 IMF Fintech Notes](https://www.elibrary.imf.org/view/journals/063/2025/001/063.2025.issue-001-en.xml) describes programmability as the ability to embed compliance conditions into the asset itself and execute them automatically. The [Bank for International Settlements' _Annual Economic Report_](https://www.bis.org/publ/arpdf/ar2025e.htm) of the same year framed tokenization as the integration of messaging, reconciliation, and asset transfer into a single seamless operation.",
    }),
  ],
  quote: translate({
    id: "programmableTokens.why.quote",
    message:
      "Seamlessness requires compliance that executes at the same layer as settlement, not after it.",
  }),
  context: [
    translate({
      id: "programmableTokens.why.context1",
      message:
        "Regulated instruments remain subject to complex requirements that differ across jurisdictions, markets, and asset types. Relevant frameworks around the world — such as [MiCA](https://eur-lex.europa.eu/eli/reg/2023/1114/oj/eng) and [MiFID II](https://eur-lex.europa.eu/eli/dir/2014/65/oj/eng) in the European Union, [Switzerland's DLT framework](https://www.sif.admin.ch/en/dlt-blockchain-en), the [GENIUS Act](https://www.congress.gov/bill/119th-congress/senate-bill/1582/text) for payment stablecoins in the United States, or global [FATF AML/CFT standards](https://www.fatf-gafi.org/en/topics/virtual-assets.html) for virtual assets — illustrate the breadth of requirements that issuers and market participants may need to address.",
    }),
    translate({
      id: "programmableTokens.why.context2",
      message:
        "Realizing the full potential of tokenization therefore requires more than putting an asset on-chain. It also requires the ability to translate relevant rules and conditions into the blockchain environment. Programmability supports this by turning these rules into logic that can be applied automatically at the asset and transaction level in a consistent and efficient manner.",
    }),
    translate({
      id: "programmableTokens.why.context3",
      message:
        "Cardano's new Programmable Tokens standard creates a flexible framework for doing so on the Cardano infrastructure. Rather than prescribing a single compliance model, it enables relevant controls — such as investor eligibility, transfer restrictions, freezes or other asset-specific conditions — to be implemented according to the requirements of the particular asset, jurisdiction and use case. Not a manual check and not a permissioned wrapper, but a rule the ledger enforces automatically.",
    }),
  ],
};

export const COMPLIANCE = {
  title: translate({
    id: "programmableTokens.compliance.title",
    message: "How Cardano's Programmable Tokens Standard Enables Compliance by Design",
  }),
  intro: translate({
    id: "programmableTokens.compliance.intro",
    message:
      "The Cardano Programmable Tokens standard attaches modular compliance logic directly to a Cardano native asset, so that the rules an issuer defines — like allow-listing, deny-listing, freeze, seize, or transfer restrictions — execute automatically every time the token is transferred, minted, or burned. All enforced by the ledger itself.",
  }),
  cards: [
    translate({
      id: "programmableTokens.compliance.card1",
      message:
        "Token issuers determine the rules their assets will have to follow and have full flexibility to customize each rule. The sets of rules get packaged into **modules**, giving companies the flexibility they need to address different use cases and scenarios, considering varying jurisdictions and regulatory frameworks. The Cardano Programmable Tokens standard also comes with integration guides for wallets, explorers, indexers, or general applications.",
    }),
    translate({
      id: "programmableTokens.compliance.card2",
      message:
        "Every single time, the Cardano network will recognize and process the token natively at the ledger level, just like any other Cardano native asset.",
    }),
    translate({
      id: "programmableTokens.compliance.card3",
      message:
        "By using a modular approach, this Cardano standard gives issuers access to define the compliance rules individually. They simply have to build or select the right module, then configure it according to their requirements, specifying under which conditions a token can be minted, burned, or transferred.",
    }),
    translate({
      id: "programmableTokens.compliance.card4",
      message:
        "Through the entire process, there's no need to adjust the general standard or the core protocol. And as regulations evolve, companies and institutions can independently add more modules or update existing ones.",
    }),
  ],
  audit: translate({
    id: "programmableTokens.compliance.audit",
    message:
      "The Cardano Programmable Token standard has been independently audited by No Witness Labs and has been certified under the CMTA framework, ensuring the availability of relevant compliance and technical functions. Anastasia Labs also performed several security checks.",
  }),
  resources: {
    title: translate({
      id: "programmableTokens.resources.title",
      message: "Cardano Programmable Tokens Resources",
    }),
    ariaLabel: translate({
      id: "programmableTokens.resources.ariaLabel",
      message: "Cardano programmable tokens resources",
    }),
    prevLabel: translate({
      id: "programmableTokens.resources.prev",
      message: "Previous resources",
    }),
    nextLabel: translate({
      id: "programmableTokens.resources.next",
      message: "Next resources",
    }),
    items: [
      {
        title: translate({
          id: "programmableTokens.resources.introduction",
          message: "An introduction to programmable tokens on Cardano",
        }),
        href: "https://cardanofoundation.org/blog/programmable-tokens-cardano",
      },
      {
        title: translate({
          id: "programmableTokens.resources.financialServices",
          message: "The importance of blockchain for financial services",
        }),
        href: "https://cardanofoundation.org/solutions/blockchain-financial-services",
      },
    ],
  },
};

export const CAPABILITIES = {
  title: translate({
    id: "programmableTokens.capabilities.title",
    message: "Programmable Token Capabilities for Institutional Asset Issuers",
  }),
  intro: [
    translate({
      id: "programmableTokens.capabilities.intro",
      message:
        "Cardano's Programmable Tokens framework has robust capabilities for several enterprise and financial institutional needs. Organizations can customize a module to include various types of logic according to their specific need.",
    }),
    translate({
      id: "programmableTokens.capabilities.examplesIntro",
      message: "Here are some examples of the rules a module can include.",
    }),
  ],
  items: [
    {
      title: translate({
        id: "programmableTokens.capabilities.kyc.title",
        message: "KYC and AML Enforcement",
      }),
      body: translate({
        id: "programmableTokens.capabilities.kyc.body",
        message:
          "Restrict token transfers to verified holders only. Including an allow-listing in a module gives issuers the ability to automatically enforce on-chain that only addresses that have passed KYC and AML verification are allowed to receive or send a token.",
      }),
    },
    {
      title: translate({
        id: "programmableTokens.capabilities.sanctions.title",
        message: "Sanctions Screening",
      }),
      body: translate({
        id: "programmableTokens.capabilities.sanctions.body",
        message:
          "Prevent transfers to or from sanctioned addresses. Modules can incorporate deny-lists that block token movements involving addresses on a sanctions list, executing the check at the ledger level without requiring an off-chain verification step.",
      }),
    },
    {
      title: translate({
        id: "programmableTokens.capabilities.freeze.title",
        message: "Freeze and Seize",
      }),
      body: translate({
        id: "programmableTokens.capabilities.freeze.body",
        message:
          "Respond to legal orders, or implement regulatory requirements by freezing specific token holdings or seizing assets. Freeze and seize functions allow issuers to halt transfers or recover tokens from designated addresses, fulfilling the enforcement requirements courts and regulators may impose.",
      }),
    },
    {
      title: translate({
        id: "programmableTokens.capabilities.transfer.title",
        message: "Transfer Restrictions",
      }),
      body: translate({
        id: "programmableTokens.capabilities.transfer.body",
        message:
          "Define jurisdiction-specific or instrument-specific transfer conditions. Issuers can configure rules governing which counterparties, geographies, or holding periods are permissible and so reflect the specific legal requirements of the instrument being tokenized.",
      }),
    },
  ],
  closing: translate({
    id: "programmableTokens.capabilities.closing",
    message: "Cardano's Programmable Tokens are modular and fully customizable.",
  }),
  button: {
    label: translate({
      id: "programmableTokens.capabilities.button",
      message: "Create Your Module",
    }),
    href: `${CIP113_REPO_URL}/blob/main/documentation/09-DEVELOPING-MODULES.md`,
  },
};

export const ARCHITECTURE = {
  title: translate({
    id: "programmableTokens.architecture.title",
    message: "The Technical Architecture of Cardano's Programmable Tokens Standard",
  }),
  diagram: {
    ariaLabel: translate({
      id: "programmableTokens.architecture.diagram.ariaLabel",
      message:
        "Architecture of the programmable tokens standard: wallets, indexers, explorers, and DApps integrate with the CIP-0113 core validator, which runs the issuer's modules on top of a shared script address and stake credentials.",
    }),
    integrations: [
      translate({ id: "programmableTokens.architecture.diagram.wallets", message: "Wallets" }),
      translate({ id: "programmableTokens.architecture.diagram.indexers", message: "Indexers" }),
      translate({ id: "programmableTokens.architecture.diagram.explorers", message: "Explorers" }),
      translate({ id: "programmableTokens.architecture.diagram.dapps", message: "DApps" }),
    ],
    core: {
      title: translate({
        id: "programmableTokens.architecture.diagram.core",
        message: "CIP-0113 core validator",
      }),
      chips: [
        "Aiken",
        translate({
          id: "programmableTokens.architecture.diagram.withdrawZero",
          message: "withdraw-zero pattern",
        }),
        translate({
          id: "programmableTokens.architecture.diagram.predictableCosts",
          message: "predictable costs",
        }),
        translate({
          id: "programmableTokens.architecture.diagram.noHardFork",
          message: "without a hard fork",
        }),
      ],
    },
    modules: {
      title: translate({
        id: "programmableTokens.architecture.diagram.modules",
        message: "Modules",
      }),
      chips: [
        translate({ id: "programmableTokens.architecture.diagram.allowlist", message: "Allow listing" }),
        translate({ id: "programmableTokens.architecture.diagram.denylist", message: "Deny listing" }),
        translate({ id: "programmableTokens.architecture.diagram.freeze", message: "Freeze" }),
        translate({ id: "programmableTokens.architecture.diagram.seize", message: "Seize" }),
        translate({
          id: "programmableTokens.architecture.diagram.transferRestrictions",
          message: "Transfer restrictions",
        }),
      ],
    },
    foundation: [
      translate({
        id: "programmableTokens.architecture.diagram.sharedScript",
        message: "shared script address",
      }),
      translate({
        id: "programmableTokens.architecture.diagram.stakeCredentials",
        message: "stake credentials",
      }),
    ],
  },
  paragraphs: [
    translate({
      id: "programmableTokens.architecture.paragraph1",
      message:
        "The Cardano Programmable Tokens standard relies on CIP-0113. It provides a modular, open-source reference implementation written in Aiken that enforces compliance logic on every transfer, mint, and burn, without needing a hard fork. The rules are evaluated once per transaction rather than once for every holding it touches, so costs stay predictable as transaction size grows. The standard uses a withdraw-zero pattern as well as a stake-credential-based ownership.",
    }),
    translate({
      id: "programmableTokens.architecture.paragraph2",
      message:
        "The architecture places programmable tokens in a shared, secure script address on the Cardano blockchain. Token ownership changes when the tokens are transacted, and owners can access them through their wallets, but the assets themselves never leave the shared script address. Ownership is determined by the stake credentials rather than the script itself.",
    }),
    translate({
      id: "programmableTokens.architecture.paragraph3",
      message:
        "Every time a token moves, a compliance script performs an automatic check to verify the rules. It guarantees no rule can be skipped. The check happens once for each transaction and is independent of how many tokens the transaction moves, which keeps execution costs predictable and provides fee efficiency.",
    }),
    translate({
      id: "programmableTokens.architecture.paragraph4",
      message:
        "Modules are a pluggable additional layer. Each module is an independent set of smart contracts that satisfy the validation interface CIP-0113 defines. Issuers select the module relevant to their use case. Anyone can write custom modules and integrate them into the framework without modifying the core validator.",
    }),
    translate({
      id: "programmableTokens.architecture.paragraph5",
      message:
        "The standard builds on the architectural foundations established in CIP-0143, developed by Philip DiSarro and Jann Müller from IOG. The Cardano Foundation rebuilt the implementation in Aiken and added in-place upgradeability so deployed compliance logic can be replaced without reissuing tokens. The Foundation also developed the off-chain infrastructure and preview platform, and drove the evolution to the more comprehensive CIP-0113 standard.",
    }),
  ],
  developer: {
    title: translate({
      id: "programmableTokens.developer.title",
      message: "Programmable Tokens Resources for Developers",
    }),
    links: [
      {
        label: translate({
          id: "programmableTokens.developer.repository",
          message: "CIP-0113 repository",
        }),
        href: `${CIP113_REPO_URL}/tree/main`,
      },
      {
        label: translate({
          id: "programmableTokens.developer.architecture",
          message: "Architecture deep-dive",
        }),
        href: `${CIP113_REPO_URL}/tree/main/documentation`,
      },
      {
        label: translate({
          id: "programmableTokens.developer.validators",
          message: "Validators",
        }),
        href: `${CIP113_REPO_URL}/tree/main/validators`,
      },
      {
        label: translate({
          id: "programmableTokens.developer.discussion",
          message: "Discussion",
        }),
        href: `${CIP113_REPO_URL}/issues`,
      },
    ],
  },
};

export const REGULATORY = {
  title: translate({
    id: "programmableTokens.regulatory.title",
    message:
      "Regulatory Context for Programmable Tokens – Global Technology, Different Rulebooks",
  }),
  intro: [
    translate({
      id: "programmableTokens.regulatory.intro2",
      message:
        "A token may move globally, but the rules governing it do not. The regulatory treatment of a tokenized asset depends on what the asset represents, where it is issued or offered, who interacts with it, and the activities being performed.",
    }),
    translate({
      id: "programmableTokens.regulatory.intro3",
      message:
        "There is no uniform regulatory approach to tokenization. Some jurisdictions apply established financial-market rules to tokenized versions of existing instruments, others have introduced dedicated regimes for particular categories of digital assets, and many combine both approaches. The result is an increasingly sophisticated — but fragmented — global regulatory landscape.",
    }),
    translate({
      id: "programmableTokens.regulatory.leadIn",
      message:
        "Some of the world's major financial markets illustrate these different approaches:",
    }),
  ],
  disclaimer: translate({
    id: "programmableTokens.regulatory.disclaimer",
    message:
      "This overview is provided for illustrative purposes only and is not intended to be comprehensive or to reflect all applicable or current regulatory aspects. Regulatory frameworks continue to evolve and may apply differently depending on the asset, activity and circumstances.",
  }),
  tabsAriaLabel: translate({
    id: "programmableTokens.regulatory.tabsAriaLabel",
    message: "Jurisdiction",
  }),
  // One tab per market, each with the market's overview.
  jurisdictions: [
    {
      id: "eu",
      label: translate({ id: "programmableTokens.jurisdiction.eu", message: "European Union" }),
      overview: translate({
        id: "programmableTokens.regulatory.eu.overview",
        message:
          "The EU generally follows a technology-neutral approach. Crypto-assets that qualify as financial instruments remain subject to [MiFID II](https://eur-lex.europa.eu/eli/dir/2014/65/oj), [MiFIR](https://eur-lex.europa.eu/eli/reg/2014/600/oj) and related securities legislation. The [DLT Pilot Regime](https://eur-lex.europa.eu/eli/reg/2022/858/oj) provides a regulatory sandbox for the trading and settlement of certain financial instruments using distributed ledger technology. Crypto-assets are generally covered by the [Markets in Crypto-Assets Regulation (MiCA)](https://eur-lex.europa.eu/eli/reg/2023/1114/oj), including its specific regimes for stablecoins and crypto-asset service providers.",
      }),
    },
    {
      id: "ch",
      label: translate({ id: "programmableTokens.jurisdiction.ch", message: "Switzerland" }),
      overview: translate({
        id: "programmableTokens.regulatory.ch.overview",
        message:
          "Switzerland integrates digital assets into its existing legal and financial-market framework while providing specific rules for DLT-based assets and infrastructure. The [DLT Act](https://www.fedlex.admin.ch/eli/fga/2020/2696/en) introduced ledger-based securities, enabling rights to be represented and transferred through qualifying electronic registers, while the general regulatory treatment of digital assets and related activities depends on their characteristics and function.",
      }),
    },
    {
      id: "uk",
      label: translate({ id: "programmableTokens.jurisdiction.uk", message: "United Kingdom" }),
      overview: translate({
        id: "programmableTokens.regulatory.uk.overview",
        message:
          "The UK builds on the existing [Financial Services and Markets Act 2000 (FSMA)](https://www.legislation.gov.uk/ukpga/2000/8/contents), while extending the regulatory perimeter to specified cryptoasset activities. The [FSMA 2000 (Cryptoassets) Regulations 2026](https://www.legislation.gov.uk/uksi/2026/102/contents) introduce regulated activities relating to qualifying cryptoassets and stablecoins, with the [FCA's new cryptoasset regime](https://www.fca.org.uk/firms/new-regime-cryptoasset-regulation) expected to apply from late 2027. Tokenized forms of existing regulated investments may remain subject to the rules applicable to the underlying type of investment.",
      }),
    },
    {
      id: "us",
      label: translate({ id: "programmableTokens.jurisdiction.usShort", message: "United States" }),
      overview: translate({
        id: "programmableTokens.regulatory.us.overview",
        message:
          "US regulation depends on the nature and structure of the asset. The [SEC's January 2026 statement on tokenized securities](https://www.sec.gov/newsroom/speeches-statements/corp-fin-statement-tokenized-securities-012826-statement-tokenized-securities) confirms that securities law continues to apply to securities represented on-chain and distinguishes issuer-sponsored and third-party tokenization models. A March 2026 [SEC/CFTC interpretation](https://www.sec.gov/files/rules/interp/2026/33-11412.pdf) introduced a five-category [crypto-asset taxonomy](https://www.sec.gov/newsroom/press-releases/2026-30-sec-clarifies-application-federal-securities-laws-crypto-assets), while the SEC's proposed [Regulation Crypto Assets](https://www.sec.gov/rules-regulations/2026/08/s7-2026-27) would create a tailored offering framework for certain crypto-asset investment contracts. Payment stablecoins are addressed separately under the federal [GENIUS Act](https://www.govinfo.gov/app/details/PLAW-119publ27).",
      }),
    },
    {
      id: "sg",
      label: translate({ id: "programmableTokens.jurisdiction.sg", message: "Singapore" }),
      overview: translate({
        id: "programmableTokens.regulatory.sg.overview",
        message:
          "Singapore largely applies its existing financial-services framework according to the nature of the asset and activity. Tokenized capital-markets products may fall within the [Securities and Futures Act 2001](https://sso.agc.gov.sg/Act/SFA2001), digital payment token services within the [Payment Services Act 2019](https://sso.agc.gov.sg/Act/PSA2019), and certain cross-border digital token services within the [Financial Services and Markets Act 2022](https://sso.agc.gov.sg/Act/FSMA2022). The [Monetary Authority of Singapore](https://www.mas.gov.sg/) (MAS) has actively supported institutional tokenization through initiatives such as [Project Guardian](https://www.mas.gov.sg/schemes-and-initiatives/project-guardian), which explores programmable infrastructure, including the integration of automated compliance checks into tokenized transactions.",
      }),
    },
    {
      id: "jp",
      label: translate({ id: "programmableTokens.jurisdiction.jp", message: "Japan" }),
      overview: translate({
        id: "programmableTokens.regulatory.jp.overview",
        message:
          "Japan distinguishes between categories of tokenized assets. Security tokens may be treated under the [Financial Instruments and Exchange Act (FIEA)](https://www.fsa.go.jp/en/policy/fiel/index.html) as electronically recorded transferable rights. Stablecoins (electronic payment instruments) and, until now, crypto-assets have been addressed under the Payment Services Act. [2026 amendments to the FIEA and the Payment Services Act](https://www.fsa.go.jp/common/diet/221/02/04.pdf) are set to move crypto-assets into the FIEA framework.",
      }),
    },
    {
      id: "br",
      label: translate({ id: "programmableTokens.jurisdiction.br", message: "Brazil" }),
      overview: translate({
        id: "programmableTokens.regulatory.br.overview",
        message:
          "Brazil applies different regulatory frameworks depending on the nature of the digital asset and activity. Virtual asset services are generally overseen by the Banco Central do Brasil under the country's [virtual asset framework](https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/L14478.htm), while tokens that qualify as securities may instead fall within the remit of the Comissão de Valores Mobiliários (CVM), as reflected in [CVM Guidance Opinion No. 40](https://conteudo.cvm.gov.br/legislacao/pareceres-orientacao/pare040.html).",
      }),
    },
    {
      id: "global",
      label: translate({ id: "programmableTokens.jurisdiction.global", message: "Global standard setters — FATF, FSB, IOSCO and the Basel Committee" }),
      overview: translate({
        id: "programmableTokens.regulatory.global.overview",
        message:
          "National regimes are also shaped by international standards. [FATF Recommendation 15](https://www.fatf-gafi.org/en/topics/virtual-assets) extends AML/CFT standards, including the Travel Rule, to virtual assets and VASPs; the [FSB's global framework](https://www.fsb.org/2025/10/thematic-review-on-fsb-global-regulatory-framework-for-crypto-asset-activities/) promotes the principle of “same activity, same risk, same regulation”; and [IOSCO](https://www.iosco.org/library/pubdocs/pdf/IOSCOPD747.pdf) and the [Basel Committee](https://www.bis.org/bcbs/publ/d545.htm) address, respectively, crypto-asset market regulation and banks' prudential exposures.",
      }),
    },
  ],
  conclusion: [
    translate({
      id: "programmableTokens.regulatory.conclusion1",
      message:
        "**There is no single global rulebook for tokenized assets — and therefore no single compliance configuration that works for every token.** A scalable tokenization standard needs the flexibility to accommodate different assets, markets, and regulatory requirements without requiring a different technological foundation for each.",
    }),
    translate({
      id: "programmableTokens.regulatory.conclusion2",
      message:
        "Cardano's Programmable Tokens standard provides that flexible foundation, enabling relevant rules and controls to be configured for specific assets and use cases while building on a common framework.",
    }),
  ],
};

export const CTA = {
  label: translate({
    id: "programmableTokens.cta.button",
    message: "Get Implementation Support",
  }),
  href: CF_CONTACT_URL,
};

export const FAQ = {
  title: translate({
    id: "programmableTokens.faq.title",
    message: "Programmable Tokens: Frequently Asked Questions",
  }),
  items: [
    {
      question: translate({
        id: "programmableTokens.faq.what.question",
        message: "What are programmable tokens?",
      }),
      answer: [
        translate({
          id: "programmableTokens.faq.what.answer",
          message:
            "Programmable tokens are digital assets on a blockchain whose transfer, minting, and burning conditions are governed by rules encoded directly into the asset itself and enforced automatically by the ledger on every transaction. Unlike conventional on-chain tokens, programmable tokens can restrict transfers to verified holders, respond to legal orders, and enforce sanctions screening without requiring a separate off-chain compliance layer.",
        }),
      ],
    },
    {
      question: translate({
        id: "programmableTokens.faq.cip.question",
        message: "What is CIP-0113?",
      }),
      answer: [
        translate({
          id: "programmableTokens.faq.cip.answer1",
          message:
            "CIP-0113 is an open source Cardano standard for tokenized assets such as stablecoins and real-world assets (RWAs). It enables token issuers to attach modular compliance logic directly to native Cardano assets and have it enforced by the ledger on every transfer, mint, or burn. It lets enterprises implement KYC allow lists, AML deny lists, freeze functions, and transfer restrictions, among other options.",
        }),
        translate({
          id: "programmableTokens.faq.cip.answer2",
          message:
            "The full implementation is written in Aiken, a Cardano smart contract language, and is available as open source in the Cardano Foundation's GitHub repository, along with integration guidance for wallet developers, DApp builders, indexers, and explorers.",
        }),
      ],
    },
    {
      question: translate({
        id: "programmableTokens.faq.how.question",
        message: "How do programmable tokens work?",
      }),
      answer: [
        translate({
          id: "programmableTokens.faq.how.answer",
          message:
            "CIP-0113 attaches a shared compliance validator to a token using a withdraw-zero pattern, so that defined rules execute automatically on every token transfer without the script holding any funds. Compliance conditions are specified in pluggable modules chosen or designed by the issuer. The token remains a first-class native Cardano asset — visible in compatible wallets and explorers — with compliance logic running transparently at the ledger level.",
        }),
      ],
    },
    {
      question: translate({
        id: "programmableTokens.faq.compliance.question",
        message: "What is token-level compliance?",
      }),
      answer: [
        translate({
          id: "programmableTokens.faq.compliance.answer",
          message:
            "Token-level compliance means that certain compliance-related conditions and transfer restrictions can be enforced directly through the token's on-chain logic, supporting controls and verifications, for example, for KYC, AML, and sanctions compliance purposes. Cardano's Programmable Tokens standard implements token-level compliance features on Cardano, embedding those controls directly into the asset so they execute automatically. The code has been independently audited, including its upgradeability. The transaction model used also inherits Cardano's characteristics, ensuring costs stay predictable as transaction size grows.",
        }),
      ],
    },
    {
      question: translate({
        id: "programmableTokens.faq.kyc.question",
        message: "How does blockchain enforce KYC and AML compliance?",
      }),
      answer: [
        translate({
          id: "programmableTokens.faq.kyc.answer",
          message:
            "The Cardano blockchain supports KYC and AML compliance through programmable modules attached directly to the token. For example, a securities implementation could leverage a list of addresses that have been put on an allow list. Such users would not be allowed to hold, send, or receive the security. Alongside it, a deny list would specify previously authorized users who have now been forbidden to transact the security, although they might still hold it. This is particularly relevant for the case of sanctions or orders to freeze an asset. In any case, checks would execute automatically on-chain for every transaction and be enforced by the Cardano ledger itself rather than by an off-chain intermediary.",
        }),
      ],
    },
  ],
};
