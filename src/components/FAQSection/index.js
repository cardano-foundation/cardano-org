import React from "react";
import Divider from "@site/src/components/Layout/Divider";
import Accordion from "@site/src/components/Layout/Accordion";
import pineappleFAQ from "@site/src/data/pineappleFAQ.json";

//
// This component:
// shows the "FAQ" divider and an accordion filled from a data array or a registered json file.
// in the answers you can use markdown for urls, bold text and bullet points with "- this notation"

const faqData = {
  pineappleFAQ,
};

/**
 * FAQ heading with an expandable list of questions and answers.
 *
 * @param {object} props
 * @param {string} [props.jsonFileName] Key of a registered FAQ json file, used when `data` is missing.
 * @param {Array<{question: string, answer: string[]}>} [props.data] FAQ entries. Takes priority over `jsonFileName`.
 */
export default function FAQSection({ jsonFileName, data }) {
  const faqList = data || faqData[jsonFileName] || [];

  return (
    <div>
      <Divider headingLevel={2} text="FAQ" id="faq" />
      <Accordion items={faqList} allowMultiple />
    </div>
  );
}
