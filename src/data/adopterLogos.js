// Organizations shown in the logo bar of the homepage "Cardano in use"
// section. Every logo needs a sign-off from the organization before it goes
// live, and `source` should point to a public reference for the relationship
// (news post, case study, press release). Entries without a source render as
// plain logos without a link.
//
// Logo files: static/img/adopters/<id>.svg in the original brand colours on a
// transparent background, the bar renders them monochrome. The viewBox is
// cropped tight to the visible logo, `ratio` is its width / height and drives
// the optical sizing in the component (re-measure when a file changes).
export const ADOPTERS = [
  { id: "cob", name: "Brazilian Olympic Committee", source: null, ratio: 0.67 },
  { id: "petrobras", name: "Petrobras", source: null, ratio: 4.72 },
  { id: "uzh", name: "University of Zurich", source: null, ratio: 2.83 },
  { id: "unb", name: "University of Brasília", source: null, ratio: 1.08 },
  { id: "serviceplan", name: "Serviceplan", source: null, ratio: 3.51 },
  { id: "undp", name: "UNDP", source: null, ratio: 0.5 },
  { id: "unhcr", name: "UNHCR", source: null, ratio: 3.96 },
  { id: "mastercard", name: "Mastercard", source: null, ratio: 1.28 },
  // Traced from the foundation's PNG logo, no official SVG was available.
  { id: "syngenta-foundation-india", name: "Syngenta Foundation India", source: null, ratio: 4.12 },
];
