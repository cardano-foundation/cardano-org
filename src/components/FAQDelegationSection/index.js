import React, { useState } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Divider from "@site/src/components/Layout/Divider";

import ThemedImage from "@theme/ThemedImage";
import Collapsible from "react-collapsible";
import { parseTextWithLinks } from "@site/src/utils/textUtils";

//
// This component:
// delegation faq.
// FIXME: some answers seem to be very outdated, also needs more links
// FIXME: need to make clear that protocol distributes rewards and pools do not have custody

import faqList from "@site/src/data/delegationFAQ.json";

export default function FAQDelegationSection() {
  // to maintain the alternating background we need to
  // manage the active state of each Collabsible on our own
  const [activeIndex, setActiveIndex] = useState(null);

  const handleClick = (index) => {
    // If the clicked index is already active, set it to null (closed)
    // Otherwise, set the active index to the clicked index
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Render each answer as a series of paragraphs
  const renderAnswer = (answerArray) => (
    <div>
      {parseTextWithLinks(answerArray).map((element, idx) => (
        // Each element is now a React.Fragment with text and <Link> components
        <p key={idx}>{element}</p>
      ))}
    </div>
  );

  return (
    <div>
      <Divider text="FAQ" id="faq" />
      {faqList.map((faq, index) => (
        <div
          key={index}
          className={`Collapsible ${index % 2 === 0 ? "even" : "odd"} ${
            activeIndex === index ? "active" : ""
          }`}
          onClick={() => handleClick(index)}
        >
          <Collapsible trigger={faq.question}>{renderAnswer(faq.answer)}</Collapsible>
        </div>
      ))}
    </div>
  );
}
