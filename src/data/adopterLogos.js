// Organizations shown in the logo bar of the homepage "Cardano in use"
// section. Every logo needs a sign-off from the organization before it goes
// live, and `source` should point to a public reference for the relationship
// (news post, case study, press release). Entries without a source render as
// plain logos without a link.
//
// Logo files: static/img/adopters/<id>.svg in the original brand colours on a
// transparent background, the bar renders them monochrome.
export const ADOPTERS = [
  { id: "cob", name: "Brazilian Olympic Committee", source: null },
  { id: "petrobras", name: "Petrobras", source: null },
  { id: "uzh", name: "University of Zurich", source: null },
  { id: "unb", name: "University of Brasília", source: null },
  { id: "serviceplan", name: "Serviceplan", source: null },
  { id: "undp", name: "UNDP", source: null },
  { id: "unhcr", name: "UNHCR", source: null },
  { id: "mastercard", name: "Mastercard", source: null },
  // Placeholder until the foundation's own logo is available, the Syngenta
  // group logo would be the wrong organization.
  { id: "syngenta-foundation-india", name: "Syngenta Foundation India", source: null },
];
