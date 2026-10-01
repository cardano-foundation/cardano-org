// Organizations shown in the logo bar of the homepage "Cardano in use"
// section. Every logo needs a sign-off from the organization before it goes
// live, and `source` should point to a public reference for the relationship
// (news post, case study, press release). All sources were checked on
// 2026-10-01. Entries without a source render as plain logos without a link.
//
// Logo files: static/img/adopters/<id>.svg in the original brand colours on a
// transparent background, the bar renders them monochrome. The viewBox is
// cropped tight to the visible logo, `ratio` is its width / height and drives
// the optical sizing in the component (re-measure when a file changes).
export const ADOPTERS = [
  { id: "cob", name: "Brazilian Olympic Committee", source: "https://cardanofoundation.org/blog/may-2026-activities", ratio: 0.67 },
  { id: "petrobras", name: "Petrobras", source: "https://cardanofoundation.org/blog/cardano-foundation-announces-education-partnership-with-petrobras-1", ratio: 4.72 },
  { id: "uzh", name: "University of Zurich", source: "https://cardanofoundation.org/en/academy/educators", ratio: 2.83 },
  { id: "unb", name: "University of Brasília", source: "https://cardanofoundation.org/blog/may-2026-activities", ratio: 1.08 },
  { id: "serviceplan", name: "Serviceplan", source: "https://cardanofoundation.org/blog/q1-2025", ratio: 3.51 },
  { id: "undp", name: "UNDP", source: "https://innovation.eurasia.undp.org/undp-joins-forces-with-blockchain-for-good-alliance-and-emurgo-labs-to-launch-sdg-blockchain-accelerator/", ratio: 0.5 },
  // The documented relationship is with Switzerland for UNHCR, see the source.
  { id: "unhcr", name: "UNHCR", source: "https://cardanofoundation.org/blog/blockchain-for-sustainability", ratio: 3.96 },
  // Source: the Cardano Foundation's membership in Mastercard's crypto partner
  // program, not payment settlement on Cardano.
  { id: "mastercard", name: "Mastercard", source: "https://cardanofoundation.org/partners", ratio: 1.28 },
  // Traced from the foundation's PNG logo, no official SVG was available.
  { id: "syngenta-foundation-india", name: "Syngenta Foundation India", source: "https://cardanofoundation.org/blog/blockchain-for-sustainability", ratio: 4.12 },
];
