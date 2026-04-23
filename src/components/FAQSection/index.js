import React, { useState } from "react";
import Divider from "@site/src/components/Layout/Divider";
import Collapsible from "react-collapsible";
import { renderAnswerArray } from "@site/src/utils/textUtils";
import delegationFAQ from "@site/src/data/delegationFAQ.json";
import operationFAQ from "@site/src/data/operationFAQ.json";
import pineappleFAQ from "@site/src/data/pineappleFAQ.json";

//
// This component:
// shows a collapsible menu and takes a json file to fill it.
// in the json file you can use markdown for urls, bold text and bullet points with "- this notation"
//
// FIXME: some answers seem to be very outdated, also needs more links
// FIXME: need to make clear that protocol distributes rewards and pools do not have custody

const faqData = {
  delegationFAQ,
  operationFAQ,
  pineappleFAQ,
};

export default function FAQSection({ jsonFileName = "delegationFAQ", data }) {
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
