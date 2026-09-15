import { translate } from "@docusaurus/Translate";

// Data for /grants-funding. The card shows tagline, audience, and funding;
// the dialog adds who runs it, a description that does not repeat the card,
// and the link. Nothing dated except the optional `window`, so entries do
// not go stale. Brand names are not translated. Field reference in
// docs/get-involved/add-funding-venue.md.

const REVIEWED = "September 2026";

// The three groups, in tab order. `key` is also the URL anchor (#grants).
export function getFundingGroups() {
  return [
    {
      key: "grants",
      persona: translate({ id: "funding.group.grants.persona", message: "I have an idea" }),
      title: translate({ id: "funding.group.grants.title", message: "Grants and early funding" }),
      intro: translate({ id: "funding.group.grants.intro", message: "Grants and first checks for getting an idea off the ground." }),
    },
    {
      key: "accelerators",
      persona: translate({ id: "funding.group.accelerators.persona", message: "I have a product" }),
      title: translate({ id: "funding.group.accelerators.title", message: "Accelerators and investment" }),
      intro: translate({ id: "funding.group.accelerators.intro", message: "Programs and capital for teams with something to show." }),
    },
    {
      key: "contributors",
      persona: translate({ id: "funding.group.contributors.persona", message: "I contribute to open source" }),
      title: translate({ id: "funding.group.contributors.title", message: "For contributors" }),
      intro: translate({ id: "funding.group.contributors.intro", message: "Get paid to maintain the software Cardano runs on, or build something at a hackathon." }),
    },
  ];
}

// Tag on the card: what kind of money it is.
export const FundingTypes = {
  treasury: translate({ id: "funding.type.treasury", message: "Treasury proposal" }),
  grant: translate({ id: "funding.type.grant", message: "Grant" }),
  retainer: translate({ id: "funding.type.retainer", message: "Retainer" }),
  accelerator: translate({ id: "funding.type.accelerator", message: "Accelerator" }),
  venture: translate({ id: "funding.type.venture", message: "Venture capital" }),
  event: translate({ id: "funding.type.event", message: "Hackathon" }),
};

// Button label in the dialog unless the entry sets its own.
export const defaultLinkLabel = () => translate({ id: "funding.link.default", message: "Program page" });

// Can I apply today? Derived from `cadence` and the optional `window` against
// the build date, so a label never goes stale by hand. Returns the pill tone
// and label.
//   Opens <date>         a window that has not opened yet
//   Open until <date>    inside a window; the closing day counts
//   Open                 rolling: apply any time
//   Recurring            recurring: rounds or cohorts, between windows
export function describeStatus(venue, today, formatDate) {
  const w = venue.window || {};
  if (w.opens && w.opens > today) {
    return { tone: "warning", label: translate({ id: "funding.status.opens", message: "Opens {date}" }, { date: formatDate(w.opens) }) };
  }
  if (w.closes && w.closes >= today) {
    return { tone: "success", label: translate({ id: "funding.status.openUntil", message: "Open until {date}" }, { date: formatDate(w.closes) }) };
  }
  if (venue.cadence === "rolling") {
    return { tone: "success", label: translate({ id: "funding.status.open", message: "Open" }) };
  }
  return { tone: "info", label: translate({ id: "funding.status.recurring", message: "Recurring" }) };
}

// Cards keep the order of this list: the most accessible program first.
export function getFundingVenues() {
  return [
    {
      key: "catalyst",
      group: "grants",
      type: "grant",
      name: "Project Catalyst",
      logo: "/img/funding/project-catalyst.png",
      cadence: "recurring",
      tagline: translate({ id: "funding.venue.catalyst.tagline", message: "Grants from Cardano's community innovation fund" }),
      audience: translate({ id: "funding.venue.catalyst.audience", message: "Builders at any stage, per the round's brief" }),
      description: translate({
        id: "funding.venue.catalyst.description",
        message:
          "Cardano's innovation fund, paid from the treasury. Each round sets its own rules for who can apply and how proposals are chosen, from ada-holder votes to expert panels, and funded projects deliver against milestones.",
      }),
      runBy: "Cardano Foundation",
      link: { href: "https://projectcatalyst.io/" },
    },
    {
      key: "genesis",
      group: "grants",
      type: "accelerator",
      name: "Genesis Pre-Accelerator",
      logo: "/img/funding/orion-fund.jpg",
      cadence: "recurring",
      tagline: translate({ id: "funding.venue.genesis.tagline", message: "Four weeks in Silicon Valley to turn a concept into a product" }),
      audience: translate({ id: "funding.venue.genesis.audience", message: "Early-stage technical builders" }),
      funding: translate({ id: "funding.venue.genesis.funding", message: "Up to $20,000 per team" }),
      description: translate({
        id: "funding.venue.genesis.description",
        message:
          "A residency at Draper University for technical founders at the concept stage: build and validate a product, learn to think like a founder, and pitch angels and early-stage funds on a Demo Day. The investment is made for a target of 2% equity, and graduates can go on to Apex, the growth accelerator.",
      }),
      runBy: "Draper University",
      link: { href: "https://draperuniversity.com/cardanoprograms" },
    },
    {
      key: "alphagrowth-prime",
      group: "grants",
      type: "grant",
      name: "Cardano PRIME",
      logo: "/img/funding/alpha-growth.jpg",
      cadence: "rolling",
      tagline: translate({ id: "funding.venue.prime.tagline", message: "Grants and incentives for DeFi protocols" }),
      audience: translate({ id: "funding.venue.prime.audience", message: "Live DeFi protocols on Cardano" }),
      funding: translate({ id: "funding.venue.prime.funding", message: "$5.6M in ecosystem grants" }),
      description: translate({
        id: "funding.venue.prime.description",
        message:
          "A 12-month program to grow DeFi liquidity on Cardano: an audit and gap-analysis phase, then milestone-based grants, liquidity provider incentives, and marketing support for qualifying protocols. Eligibility criteria are on the program page.",
      }),
      runBy: "AlphaGrowth",
      link: { label: translate({ id: "funding.venue.prime.link", message: "Apply for a grant" }), href: "https://alphagrowth.typeform.com/to/mcF9pnCF" },
    },
    {
      key: "treasury",
      group: "grants",
      type: "treasury",
      name: translate({ id: "funding.venue.treasury.name", message: "Cardano Treasury" }),
      logo: "/img/brand-assets/cardano-starburst-blue.svg",
      logoDark: "/img/brand-assets/cardano-starburst-white.svg",
      cadence: "rolling",
      tagline: translate({ id: "funding.venue.treasury.tagline", message: "Larger projects, funded by on-chain vote" }),
      audience: translate({ id: "funding.venue.treasury.audience", message: "Mature projects and shared infrastructure" }),
      funding: translate({ id: "funding.venue.treasury.funding", message: "100,000 ada deposit, refunded after the vote" }),
      description: translate({
        id: "funding.venue.treasury.description",
        message:
          "The on-chain treasury funds work directly through governance actions under CIP-1694. A withdrawal proposal is submitted on-chain, DReps and the Constitutional Committee vote, and approved funds are disbursed, usually through an administrator such as Intersect that handles contracts and milestones.",
      }),
      runBy: translate({ id: "funding.venue.treasury.runBy", message: "Cardano's on-chain governance" }),
      link: { label: translate({ id: "funding.venue.treasury.link", message: "Open GovTool" }), href: "https://gov.tools/" },
    },
    {
      key: "cap",
      group: "accelerators",
      type: "accelerator",
      name: "Cardano Accelerator Program",
      logo: "/img/funding/cardano-foundation.png",
      cadence: "recurring",
      tagline: translate({ id: "funding.venue.cap.tagline", message: "A cohort, mentorship, and a Demo Day for early startups" }),
      audience: translate({ id: "funding.venue.cap.audience", message: "Registered startups with a live product" }),
      description: translate({
        id: "funding.venue.cap.description",
        message:
          "A cohort program for early-stage startups building on Cardano: technical sessions, go-to-market and regulatory guidance, mentorship from operators and investors, and a Demo Day in front of investors. Each team receives a milestone-based contribution alongside hands-on support.",
      }),
      runBy: "Cardano Foundation",
      link: { href: "https://cardanofoundation.org/venture-hub/cardano-accelerator-program" },
    },
    {
      key: "apex",
      group: "accelerators",
      type: "accelerator",
      name: "Apex Growth Accelerator",
      logo: "/img/funding/orion-fund.jpg",
      cadence: "recurring",
      tagline: translate({ id: "funding.venue.apex.tagline", message: "Ten weeks in Silicon Valley, up to $70,000" }),
      audience: translate({ id: "funding.venue.apex.audience", message: "Founders with a live product" }),
      funding: translate({ id: "funding.venue.apex.funding", message: "Up to $70,000 per team" }),
      description: translate({
        id: "funding.venue.apex.description",
        message:
          "A residency at Draper University for Cardano startups that want to become investor-ready: mentorship, fundraising and go-to-market support, access to the Orion Fund, and a Demo Day with investors. The investment is made for a target of 3.5% equity.",
      }),
      runBy: "Draper University",
      link: { href: "https://draperuniversity.com/cardanoprograms" },
    },
    {
      key: "sdg-accelerator",
      group: "accelerators",
      type: "accelerator",
      name: "SDG Blockchain Accelerator",
      logo: "/img/funding/sdg-accelerator.png",
      cadence: "recurring",
      window: { closes: "2026-09-30" },
      tagline: translate({ id: "funding.venue.sdg.tagline", message: "Put your solution to work with UNDP country teams" }),
      audience: translate({ id: "funding.venue.sdg.audience", message: "Working solutions for public-sector needs" }),
      description: translate({
        id: "funding.venue.sdg.description",
        message:
          "Connects UN teams facing development challenges with technology partners. Selected solutions are matched to UNDP country offices and deployed with technical expertise and implementation support. Suitable projects can also receive catalytic funding.",
      }),
      runBy: "UNDP AltFinLab",
      link: { href: "https://innovation.eurasia.undp.org/sdg-blockchain-accelerator-c3/" },
    },
    {
      key: "orion",
      group: "accelerators",
      type: "venture",
      name: "Orion Fund",
      logo: "/img/funding/orion-fund.jpg",
      cadence: "rolling",
      tagline: translate({ id: "funding.venue.orion.tagline", message: "An $80M fund investing from acceleration to Series A" }),
      audience: translate({ id: "funding.venue.orion.audience", message: "Startups ready to raise" }),
      description: translate({
        id: "funding.venue.orion.description",
        message:
          "An ecosystem fund for Cardano-native and Cardano-integrated startups, aimed at the $500K to $5M gap between grants and Series A, with a focus on real-world assets, DeFi, and bringing Bitcoin liquidity to Cardano. The Cardano Foundation is constitutional administrator and takes no part in investment decisions; returns flow back to the Cardano Treasury. There is no application form; founders come in through Draper's accelerator cohorts.",
      }),
      runBy: "Draper Dragon",
      link: { label: translate({ id: "funding.venue.orion.link", message: "Fund dashboard" }), href: "https://orion.draperdragon.com/" },
    },
    {
      key: "maintainer-retainer",
      group: "contributors",
      type: "retainer",
      name: translate({ id: "funding.venue.retainer.name", message: "Maintainer Retainer Program" }),
      logo: "/img/funding/intersect.png",
      cadence: "rolling",
      tagline: translate({ id: "funding.venue.retainer.tagline", message: "Ongoing pay for the people who maintain core repositories" }),
      audience: translate({ id: "funding.venue.retainer.audience", message: "Maintainers of established tools" }),
      description: translate({
        id: "funding.venue.retainer.description",
        message:
          "Part of Intersect's Paid Open Source Model. Ongoing funding, per maintainer role, for the people who maintain the repositories the ecosystem depends on, with core and community maintainer roles overseen by the Open Source and Technical Steering committees.",
      }),
      runBy: "Intersect",
      link: { href: "https://opensourcecommittee.docs.intersectmbo.org/about/paid-open-source-model-posm/maintainer-retainer" },
    },
    {
      key: "hackathons",
      group: "contributors",
      type: "event",
      name: translate({ id: "funding.venue.hackathons.name", message: "Hackathons and bounties" }),
      logo: "/img/brand-assets/cardano-starburst-blue.svg",
      logoDark: "/img/brand-assets/cardano-starburst-white.svg",
      cadence: "rolling",
      tagline: translate({ id: "funding.venue.hackathons.tagline", message: "Build something in a weekend and win prizes" }),
      audience: translate({ id: "funding.venue.hackathons.audience", message: "Individuals and small teams" }),
      description: translate({
        id: "funding.venue.hackathons.description",
        message:
          "Hackathons, builder festivals, and bounty programs run through the year, and prizes vary by event. Winning teams get introduced to the accelerators and funds on this page and a chance to pitch them. A fast way to ship something and meet other builders.",
      }),
      runBy: translate({ id: "funding.venue.hackathons.runBy", message: "Cardano Foundation, Intersect, and community organizers" }),
      link: { label: translate({ id: "funding.venue.hackathons.link", message: "Get hackathon alerts" }), href: "https://developers.cardano.org/talent/" },
    },
  ];
}

export function getVenuesByGroup(group) {
  return getFundingVenues().filter((venue) => venue.group === group);
}

// Headline figures, static strings rounded down and reviewed by hand. The
// first carries the breakdown shown in its info dialog.
export function getFundingStats() {
  return [
    {
      key: "total",
      value: "$200M+",
      label: translate({ id: "funding.stats.total", message: "in grants and funding" }),
      breakdown: {
        title: translate({ id: "funding.stats.breakdown.title", message: "How we count" }),
        intro: translate({
          id: "funding.stats.breakdown.intro",
          message: "The headline number adds up what has actually been paid out or committed to builders, rounded down so it stays accurate as the sources update.",
        }),
        items: [
          {
            name: "Project Catalyst",
            text: translate({ id: "funding.stats.breakdown.catalyst", message: "About $160M awarded across 2,200+ funded proposals since 2020, $135M of it paid out so far." }),
            source: { label: "projectcatalyst.io/funds", href: "https://projectcatalyst.io/funds" },
          },
          {
            name: translate({ id: "funding.stats.breakdown.treasury.name", message: "Cardano Treasury" }),
            text: translate({
              id: "funding.stats.breakdown.treasury",
              message: "About 800 million ada committed through on-chain withdrawal actions since governance went live in 2025, valued at a conservative ada price. Part of it funds programs listed here, such as Cardano PRIME and Catalyst rounds.",
            }),
            source: { label: translate({ id: "funding.stats.breakdown.treasury.source", message: "Enacted governance actions" }), href: "/insights/supply/summary/#treasury" },
          },
        ],
        reviewed: translate({ id: "funding.stats.breakdown.reviewed", message: "Reviewed {date}." }, { date: REVIEWED }),
      },
    },
    { key: "projects", value: "2,200+", label: translate({ id: "funding.stats.projects", message: "projects funded" }) },
    { key: "programs", value: String(getFundingVenues().length), label: translate({ id: "funding.stats.programs", message: "programs to apply to" }) },
  ];
}

export function getApplySteps() {
  return [
    {
      title: translate({ id: "funding.steps.pick.title", message: "Pick a program that fits" }),
      text: translate({ id: "funding.steps.pick.text", message: "Ideas go to Catalyst or a hackathon, products to an accelerator, and infrastructure work to Intersect or the treasury." }),
    },
    {
      title: translate({ id: "funding.steps.prepare.title", message: "Plan your milestones and budget" }),
      text: translate({ id: "funding.steps.prepare.text", message: "Every program here pays against results, so be clear about what you'll ship, when, and what it costs." }),
    },
    {
      title: translate({ id: "funding.steps.apply.title", message: "Apply on the official site" }),
      text: translate({ id: "funding.steps.apply.text", message: "Only use the links in the program details. No real program will ever ask for your recovery phrase." }),
    },
  ];
}

export function getFundingFAQ() {
  return [
    {
      question: translate({ id: "funding.faq.complete.q", message: "Is anything missing?" }),
      answer: [
        translate({
          id: "funding.faq.complete.a",
          message:
            "Possibly. This page lists the programs we know about, and terms change, so always confirm the details on the program's own site. If something is missing or out of date, [open an issue or a pull request](/docs/get-involved).",
        }),
      ],
    },
    {
      question: translate({ id: "funding.faq.equity.q", message: "Do I have to give up equity?" }),
      answer: [
        translate({
          id: "funding.faq.equity.a",
          message:
            "Not for grants, Catalyst, treasury proposals, retainers, or bounties. Venture funds and some accelerators do take equity. Where the terms are public they are in the program details, for example Apex's $70,000 for about 3.5%.",
        }),
      ],
    },
    {
      question: translate({ id: "funding.faq.decides.q", message: "Who decides what gets funded?" }),
      answer: [
        translate({
          id: "funding.faq.decides.a",
          message:
            "It depends on the program. Catalyst rounds are decided by ada-holder vote or, as in the current pilot, by a panel of community experts. Treasury proposals go to DReps and the Constitutional Committee under the [constitution](/constitution). Accelerators, funds, and Intersect committees have their own selection processes, described on their pages.",
        }),
      ],
    },
  ];
}
