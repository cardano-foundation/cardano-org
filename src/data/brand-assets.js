import { translate } from "@docusaurus/Translate";

// Data for the /brand-assets page (the Cardano brand kit: logo, colors, type,
// and examples of the brand in use).
//
// Every user-facing string lives here so the page and its section components
// stay presentational. The copy comes from the Brand Hub Figma file
// (ZfAuRVCOZevM91nPOh4uDo, desktop frame 1:109, mobile frame 8:61), and the
// download links come from that file's Dev Mode annotations.
//
// DATA NOTES (resolve with the content owner):
// - Clarity lists "RGB 255, 177, 34" and Slate lists "RGB 85, 107, 133", as
//   in the design. Those values do not match their hex codes (#FFFAF3 would
//   be 255, 250, 243 and #5F6B85 would be 95, 107, 133).
// - The desktop design titles the starburst section "The Starbust" and the
//   mobile design "The Starburst"; the mobile spelling is used. The download
//   button keeps the design's "The Starbust Symbol".
// - The brandbook, the logo kit, the individual logos, and Chivo link to
//   Google Drive; "Colors on Figma" links to the Cardano Brand Kit Figma file.

const BRANDBOOK_URL =
  "https://drive.google.com/file/d/1JfkXievZVqvoIAAl67n4pfFHv05m1nh5/view";
const LOGO_KIT_URL =
  "https://drive.google.com/drive/folders/1OSvq6_kXkUgcoCMa4JYQ4C7PLuGg-6yL";
const HORIZONTAL_LOGO_URL =
  "https://drive.google.com/drive/folders/1i0T68ry1cmyh_LhZBOOFvm0xRVhJkut3";
const VERTICAL_LOGO_URL =
  "https://drive.google.com/drive/folders/1b-9yQTD1fjqp3m33eRED5ADrwFEmSMfd";
const STARBURST_URL =
  "https://drive.google.com/drive/folders/1qJEuBEzGTS5cPjCB2rcMry1__RoiMAjY";
const FIGMA_COLORS_URL =
  "https://www.figma.com/design/XxzZVmcnZNmHTr0c2u2EcE/Cardano-Brand-Kit--EXT-?node-id=0-1&t=cGks5KNYfnQhkjr8-1";
const CHIVO_URL =
  "https://drive.google.com/drive/folders/1Mho-eJBfktXjHv_z87qf73EXnfmrFfuw";

// Search title, description, keywords, and share image are carried over from
// the previous /brand-assets page so the page keeps its search listing.
export const META = {
  title: translate({
    id: "brandAssets.layout.title",
    message: "Cardano Logo Download: Brand Assets, Colors and Guidelines",
  }),
  description: translate({
    id: "brandAssets.layout.description",
    message:
      "Download the official Cardano logo in SVG format. Starburst icon, stacked and horizontal wordmarks in multiple colors, plus brand colors, typography and usage guidelines.",
  }),
  keywords:
    "Cardano logo, Cardano logo download, Cardano logo SVG, Cardano starburst, Cardano brand assets, Cardano brand guidelines, Cardano colors, Cardano typography",
};

// Section anchors. The hero tiles link to these.
export const ANCHORS = {
  logo: "logo",
  colors: "colors",
  font: "font",
  inUse: "brand-in-use",
};

export const HERO = {
  title: translate({ id: "brandAssets.hero.heading", message: "Brand Kit" }),
  subtitle: translate({
    id: "brandAssets.hero.subtitle",
    message: "Making the brand work better for all.",
  }),
  body: translate({
    id: "brandAssets.hero.body",
    message:
      "An evolving resource library capturing Cardano's unique visual and verbal style. Unified design, voice, and essence that foster familiarity and confidence across all touchpoints.",
  }),
  button: {
    label: translate({
      id: "brandAssets.hero.button",
      message: "Download the Brandbook",
    }),
    href: BRANDBOOK_URL,
  },
  // Each tile links to its section. `art` picks the tile artwork in
  // src/components/BrandAssets/Hero.
  tiles: [
    {
      art: "logo",
      label: translate({ id: "brandAssets.hero.tile.logo", message: "Logo" }),
      anchor: ANCHORS.logo,
    },
    {
      art: "colors",
      label: translate({ id: "brandAssets.hero.tile.colors", message: "Colors" }),
      anchor: ANCHORS.colors,
    },
    {
      art: "type",
      label: translate({ id: "brandAssets.hero.tile.type", message: "Type" }),
      anchor: ANCHORS.font,
    },
    {
      art: "inUse",
      label: translate({ id: "brandAssets.hero.tile.inUse", message: "In Use" }),
      anchor: ANCHORS.inUse,
    },
  ],
};

export const INTRO = {
  title: translate({
    id: "brandAssets.intro.title",
    message: "Creating trust infrastructure for all.",
  }),
  lines: [
    translate({
      id: "brandAssets.intro.line1",
      message: "Where research-backed technology solidifies trust.",
    }),
    translate({
      id: "brandAssets.intro.line2",
      message: "Where security is upheld year after year.",
    }),
    translate({
      id: "brandAssets.intro.line3",
      message: "Where businesses, governments, and citizens come together.",
    }),
  ],
};

export const TONE = {
  eyebrow: translate({ id: "brandAssets.tone.eyebrow", message: "Cardano is..." }),
  traits: [
    {
      word: translate({ id: "brandAssets.tone.farsighted.word", message: "Farsighted" }),
      meaning: translate({
        id: "brandAssets.tone.farsighted.meaning",
        message: "Driven by long-term purpose.",
      }),
    },
    {
      word: translate({ id: "brandAssets.tone.undaunted.word", message: "Undaunted" }),
      meaning: translate({
        id: "brandAssets.tone.undaunted.meaning",
        message: "Unafraid to reimagine the world.",
      }),
    },
    {
      word: translate({ id: "brandAssets.tone.conscious.word", message: "Conscious" }),
      meaning: translate({
        id: "brandAssets.tone.conscious.meaning",
        message: "Committed to building trust.",
      }),
    },
    {
      word: translate({ id: "brandAssets.tone.rigorous.word", message: "Rigorous" }),
      meaning: translate({
        id: "brandAssets.tone.rigorous.meaning",
        message: "Sound by design.",
      }),
    },
  ],
};

export const LOGO = {
  title: translate({ id: "brandAssets.logo.title", message: "Logo" }),
  primary: {
    title: translate({ id: "brandAssets.logo.primary.title", message: "The Cardano Logo" }),
    paragraphs: [
      translate({
        id: "brandAssets.logo.primary.paragraph1",
        message:
          "The Cardano logo is made up of two elements: the starburst and the wordmark. Together, they make Cardano instantly recognizable, while forming just one part of its multi-faceted brand identity.",
      }),
      translate({
        id: "brandAssets.logo.primary.paragraph2",
        message:
          "The horizontal logo, shown here, is the primary version and should always be the preferred choice.",
      }),
      translate({
        id: "brandAssets.logo.primary.paragraph3",
        message: "View and download all available logo variations on this page.",
      }),
    ],
    button: {
      label: translate({
        id: "brandAssets.logo.primary.button",
        message: "Download Cardano Logo Kit",
      }),
      href: LOGO_KIT_URL,
    },
    imageAlt: translate({
      id: "brandAssets.logo.primary.imageAlt",
      message: "The horizontal Cardano logo: the starburst icon next to the CARDANO wordmark",
    }),
    iconLabelPrefix: translate({ id: "brandAssets.logo.primary.iconLabelPrefix", message: "Icon:" }),
    iconLabel: translate({ id: "brandAssets.logo.primary.iconLabel", message: "The Star Burst" }),
    wordmarkLabel: translate({
      id: "brandAssets.logo.primary.wordmarkLabel",
      message: "The Wordmark",
    }),
  },
  safety: {
    title: translate({ id: "brandAssets.logo.safety.title", message: "Safety Area" }),
    paragraphs: [
      translate({
        id: "brandAssets.logo.safety.paragraph1",
        message:
          "For a logo that's easy to read and never visually compromised, make sure there is always adequate clear space between the wordmark + icon combo and other elements that may share a space with it.",
      }),
      translate({
        id: "brandAssets.logo.safety.paragraph2",
        message:
          "Apply the following process to define the safety area: Use the center six dots of the starburst as the minimum clear space on all sides of the logo.",
      }),
    ],
    imageAlt: translate({
      id: "brandAssets.logo.safety.imageAlt",
      message:
        "The horizontal Cardano logo inside a grid that marks the minimum clear space on each side, sized by the center six dots of the starburst",
    }),
  },
  starburst: {
    title: translate({ id: "brandAssets.logo.starburst.title", message: "The Starburst" }),
    body: translate({
      id: "brandAssets.logo.starburst.body",
      message:
        "In small areas where the full logo cannot be showcased, the starburst icon can be used to represent the brand. In that case, it is recommended to use it in the iconic Cardano Cobalt blue (or, if not possible, in Clarity). The Starburst can exist on its own, but the wordmark can never exist without the icon.",
    }),
    imageAlt: translate({
      id: "brandAssets.logo.starburst.imageAlt",
      message: "The Cardano starburst icon in Cardano Blue",
    }),
  },
};

export const ASSETS = {
  title: translate({
    id: "brandAssets.assets.title",
    message: "Looking for a specific asset? Download individual logos here.",
  }),
  links: [
    {
      label: translate({ id: "brandAssets.assets.horizontal", message: "Horizontal Logo" }),
      href: HORIZONTAL_LOGO_URL,
    },
    {
      label: translate({ id: "brandAssets.assets.vertical", message: "Vertical Logo" }),
      href: VERTICAL_LOGO_URL,
    },
    {
      label: translate({ id: "brandAssets.assets.starburst", message: "The Starbust Symbol" }),
      href: STARBURST_URL,
    },
  ],
};

// Swatch tone: "light" swatches carry Obsidian text, "dark" swatches carry
// Clarity text, as in the design.
export const COLORS = {
  title: translate({ id: "brandAssets.colors.title", message: "Colors" }),
  primary: {
    title: translate({ id: "brandAssets.colors.primary.title", message: "Primary colors" }),
    paragraphs: [
      translate({
        id: "brandAssets.colors.primary.paragraph1",
        message: "Cardano color system is built on clarity and balance.",
      }),
      translate({
        id: "brandAssets.colors.primary.paragraph2",
        message:
          "Clarity (white) and Obsidian (black) act as the primary foundation, making up the majority of each composition to keep the content clean, legible and consistent.",
      }),
    ],
    button: {
      label: translate({ id: "brandAssets.colors.primary.button", message: "Colors on Figma" }),
      href: FIGMA_COLORS_URL,
    },
    swatches: [
      { name: translate({ id: "brandAssets.colors.name.cardanoBlue", message: "Cardano Blue" }), hex: "#0033AD", tone: "dark" },
      { name: translate({ id: "brandAssets.colors.name.clarity", message: "Clarity" }), hex: "#FFFAF3", tone: "light" },
      { name: translate({ id: "brandAssets.colors.name.obsidian", message: "Obsidian" }), hex: "#000629", tone: "dark" },
      { name: translate({ id: "brandAssets.colors.name.photonSignal", message: "Photon Signal" }), hex: "#FFB122", tone: "light" },
      { name: translate({ id: "brandAssets.colors.name.lavenderGrey", message: "Lavender Grey" }), hex: "#968CC3", tone: "light" },
    ],
  },
  extended: {
    title: translate({ id: "brandAssets.colors.extended.title", message: "Extended palette" }),
    paragraphs: [
      translate({
        id: "brandAssets.colors.extended.paragraph1",
        message: "Cardano color system is built on clarity and balance.",
      }),
      translate({
        id: "brandAssets.colors.extended.paragraph2",
        message:
          "Clarity (white) and Obsidian (black) act as the primary foundation, making up the majority of each composition to keep the content clean, legible and consistent.",
      }),
      translate({
        id: "brandAssets.colors.extended.paragraph3",
        message:
          "Cobalt Blue serves as the core brand color, used to anchor layouts and reinforce recognition. Supporting tones like Lavender Grey and Photon Signal are used as accents to highlight key moments and add warmth.",
      }),
      translate({
        id: "brandAssets.colors.extended.paragraph4",
        message:
          "By keeping a strong neutral base and using color with intention, the system remains flexible, focused, and distinctly Cardano.",
      }),
    ],
    // Row order of the phone grid (two columns). On wider screens the grid
    // has three columns and Teal starts a new row, which gives the design's
    // layout.
    swatches: [
      { name: translate({ id: "brandAssets.colors.name.cardanoBlue", message: "Cardano Blue" }), hex: "#0033AD", rgb: "RGB 0, 51, 173", cmyk: "CMYK 100, 80, 0, 20", pantone: "Pantone 286 C", tone: "dark" },
      { name: translate({ id: "brandAssets.colors.name.clarity", message: "Clarity" }), hex: "#FFFAF3", rgb: "RGB 255, 177, 34", cmyk: "CMYK 0, 1, 4, 0", pantone: "Pantone Bright White", tone: "light" },
      { name: translate({ id: "brandAssets.colors.name.obsidian", message: "Obsidian" }), hex: "#000629", rgb: "RGB 0, 6, 41", cmyk: "CMYK 100, 94, 52, 70", pantone: "Pantone 2767 C", tone: "dark" },
      { name: translate({ id: "brandAssets.colors.name.deepBlue", message: "Deep Blue" }), hex: "#06187D", rgb: "RGB 6, 24, 125", cmyk: "CMYK 100, 96, 18, 14", pantone: "Pantone 2575 C", tone: "dark" },
      { name: translate({ id: "brandAssets.colors.name.neutralGrey", message: "Neutral Grey" }), hex: "#ACA6A6", rgb: "RGB 172, 166, 166", cmyk: "CMYK 35, 31, 30, 0", pantone: "Pantone Cool Gray 4", tone: "light" },
      { name: translate({ id: "brandAssets.colors.name.slate", message: "Slate" }), hex: "#5F6B85", rgb: "RGB 85, 107, 133", cmyk: "CMYK 68, 55, 32, 9", pantone: "Pantone 7545 C", tone: "dark" },
      { name: translate({ id: "brandAssets.colors.name.photonSignal", message: "Photon Signal" }), hex: "#FFB122", rgb: "RGB 255, 177, 34", cmyk: "CMYK 0, 35, 92, 0", pantone: "Pantone 137 C", tone: "light" },
      { name: translate({ id: "brandAssets.colors.name.lavender", message: "Lavender" }), hex: "#968CC3", rgb: "RGB 150, 140, 195", cmyk: "CMYK 43, 45, 0, 0", pantone: "Pantone 7446 C", tone: "light" },
      { name: translate({ id: "brandAssets.colors.name.teal", message: "Teal" }), hex: "#2FB7A8", rgb: "RGB 47, 183, 168", cmyk: "CMYK 72, 2, 42, 0", pantone: "Pantone 3262 C", tone: "light" },
      { name: translate({ id: "brandAssets.colors.name.pedal", message: "Pedal" }), hex: "#C7C2E6", rgb: "RGB 199, 194, 230", cmyk: "CMYK 20, 22, 0, 0", pantone: "Pantone 7443 C", tone: "light" },
    ],
  },
};

const ALPHABET = [
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "abcdefghijklmnopqrstuvwxyz",
  "1234567890",
];

export const FONT = {
  title: translate({ id: "brandAssets.font.title", message: "Font" }),
  name: "Chivo",
  body: translate({
    id: "brandAssets.font.body",
    message:
      "The typeface, Chivo, embodies clarity, restraint, and intention. Across its range of weights, Chivo Light is the preferred voice. Its slender strokes and generous spacing are in line with Cardano's clear communication style.",
  }),
  button: {
    label: translate({ id: "brandAssets.font.button", message: "Download Chivo" }),
    href: CHIVO_URL,
  },
  specimenLabel: translate({ id: "brandAssets.font.specimenLabel", message: "Primary Typeface" }),
  weightsBody: translate({
    id: "brandAssets.font.weightsBody",
    message:
      "When heavier weights are needed for hierarchy or emphasis, the broader Chivo family maintains consistency with our visual language, always precise and never loud. Together, these weights ensure every word feels considered and every layout has room to breathe.",
  }),
  weights: [
    { name: "Chivo Light", weight: 300, lines: ALPHABET },
    { name: "Chivo Regular", weight: 400, lines: ALPHABET },
  ],
};

export const IN_USE = {
  title: translate({ id: "brandAssets.inUse.title", message: "The brand-in-use" }),
  hero: {
    src: "/img/brand-assets/in-use-billboard.webp",
    width: 2640,
    height: 1236,
    alt: translate({
      id: "brandAssets.inUse.hero.alt",
      message:
        'A Cardano poster reading "Build the future you want to live in." on a digital screen in a train station',
    }),
  },
  intro: [
    translate({
      id: "brandAssets.inUse.intro1",
      message:
        "Examples of the Cardano brand applied across various formats, demonstrating its visual and verbal identity in action.",
    }),
    translate({
      id: "brandAssets.inUse.intro2",
      message:
        "Consistent style and tone help build recognition and trust, on all channels and display settings.",
    }),
  ],
  // `slot` places each card in the desktop mosaic (MOSAIC_COLUMNS in
  // src/pages/brand-assets.js). The array order is the phone order.
  cards: [
    {
      slot: "fairerWorld",
      src: "/img/brand-assets/in-use-fairer-world.webp",
      width: 923,
      height: 518,
      alt: translate({
        id: "brandAssets.inUse.card.fairerWorld",
        message: 'Cardano card reading "The operating system for a fairer world."',
      }),
    },
    {
      slot: "buildTheFuture",
      src: "/img/brand-assets/in-use-build-the-future.webp",
      width: 906,
      height: 484,
      alt: translate({
        id: "brandAssets.inUse.card.buildTheFuture",
        message: 'Cardano card reading "Build the future you want to live in."',
      }),
    },
    {
      slot: "roadmap",
      src: "/img/brand-assets/in-use-roadmap.webp",
      width: 757,
      height: 1019,
      alt: translate({
        id: "brandAssets.inUse.card.roadmap",
        message:
          'Cardano Foundation Roadmap cover reading "Cardano Foundation delegates ADA to community DReps to strengthen decentralized governance."',
      }),
    },
    {
      slot: "decentralization",
      src: "/img/brand-assets/in-use-decentralization.webp",
      width: 905,
      height: 508,
      alt: translate({
        id: "brandAssets.inUse.card.decentralization",
        message:
          'Cardano card reading "Strengthening decentralization. Decentralization is not a destination. It is a continuous commitment."',
      }),
    },
    {
      slot: "changeBegins",
      src: "/img/brand-assets/in-use-change-begins.webp",
      width: 924,
      height: 458,
      alt: translate({
        id: "brandAssets.inUse.card.changeBegins",
        message:
          'Cardano banner reading "Change begins with what you build. Build it with Cardano."',
      }),
    },
  ],
  examples: [
    {
      title: translate({ id: "brandAssets.inUse.event.title", message: "Event" }),
      body: translate({
        id: "brandAssets.inUse.event.body",
        message:
          "Brand materials can be adapted for a wide range of events, including conferences, meetups, hackathons, workshops, and community activations. To ensure brand consistency and alignment with current campaign priorities, please consult the Cardano Communications Team before creating or producing event-specific materials. They can provide guidance on approved assets, messaging, branding applications, and event requirements.",
      }),
      image: {
        src: "/img/brand-assets/in-use-event.webp",
        width: 1522,
        height: 932,
        alt: translate({
          id: "brandAssets.inUse.event.alt",
          message: "A conference stage dressed in Cardano brand graphics, with an audience in front",
        }),
      },
    },
    {
      title: translate({ id: "brandAssets.inUse.social.title", message: "Social" }),
      body: translate({
        id: "brandAssets.inUse.social.body",
        message:
          "Our brand is represented across multiple social platforms and content formats. For access to approved templates and social media assets, please contact the Communications Team.",
      }),
      image: {
        src: "/img/brand-assets/in-use-social.webp",
        width: 1518,
        height: 936,
        alt: translate({
          id: "brandAssets.inUse.social.alt",
          message: "A collage of Cardano social media posts and event announcements",
        }),
      },
    },
  ],
};
