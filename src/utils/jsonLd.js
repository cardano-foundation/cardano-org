// Serialize a JSON-LD object for safe embedding inside a <script> element.
//
// react-helmet-async (used by Docusaurus <Head>) writes <script> children
// verbatim, so a "</script>" sequence inside any string value would terminate
// the script tag early and let following markup execute. Escaping "<" to its
// JSON unicode form is enough to prevent that. The browser's JSON-LD parser
// decodes < transparently, so the structured data is unchanged.
export function jsonLdString(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

// FAQPage structured data for the FAQSection shape ({question, answer[]}).
// Structured data must be plain text, so markdown links in answers are
// reduced to their label before joining.
export function faqJsonLd(faq) {
  return jsonLdString({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer.join(" ").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"),
      },
    })),
  });
}
