import React, { useState } from "react";
import Divider from "@site/src/components/Layout/Divider";
import Collapsible from "react-collapsible";
import { renderAnswerArray } from "@site/src/utils/textUtils";
import pineappleFAQ from "@site/src/data/pineappleFAQ.json";

//
// This component:
// shows a collapsible menu filled from a data array or a registered json file.
// in the answers you can use markdown for urls, bold text and bullet points with "- this notation"

const faqData = {
  pineappleFAQ,
};

export default function FAQSection({ jsonFileName, data }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const faqList = data || faqData[jsonFileName] || [];

  return (
    <div>
      <Divider text="FAQ" id="faq" />
      {faqList.map((faq, index) => (
        <div
          key={index}
          className={`Collapsible ${index % 2 === 0 ? "even" : "odd"} ${
            activeIndex === index ? "active" : ""
          }`}
        >
          <Collapsible
            trigger={faq.question}
            tabIndex={0}
            onOpening={() => setActiveIndex(index)}
            onClosing={() => setActiveIndex((current) => (current === index ? null : current))}
          >
            <div>{renderAnswerArray(faq.answer)}</div>
          </Collapsible>
        </div>
      ))}
    </div>
  );
}
