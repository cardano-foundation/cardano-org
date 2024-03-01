import React, { useState, useEffect } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Divider from "@site/src/components/Layout/Divider";

import ThemedImage from "@theme/ThemedImage";
import Collapsible from "react-collapsible";
import { parseMarkdownLikeText } from "@site/src/utils/textUtils";

//
// This component:
// shows a collapsible menu and takes a json file to fill it. 
// in the json file you can use markdown for urls, bold text and bullet points with "- this notation"
// 
// FIXME: some answers seem to be very outdated, also needs more links
// FIXME: need to make clear that protocol distributes rewards and pools do not have custody

export default function FAQSection({ jsonFileName = "delegationFAQ" }) {
  // to maintain the alternating background we need to
  // manage the active state of each Collabsible on our own
  const [activeIndex, setActiveIndex] = useState(null);
  const [faqList, setFaqList] = useState([]);

  useEffect(() => {
    // Dynamically import the JSON file based on the prop
    import(`@site/src/data/${jsonFileName}.json`)
      .then((module) => {
        setFaqList(module.default);
      })
      .catch((error) => {
        console.error(`Could not load JSON data from ${jsonFileName}:`, error);
        setFaqList([]); // Set to empty array or handle as needed
      });
  }, [jsonFileName]); // This effect runs whenever the jsonFileName prop changes


  const handleClick = (index) => {
    // If the clicked index is already active, set it to null (closed)
    // Otherwise, set the active index to the clicked index
    setActiveIndex(activeIndex === index ? null : index);
  };


  // Function to handle list rendering (bullet points)
  function renderListItems(items) {
    return (
      <ul>
        {items.map((item, index) => (
          <li key={index}>{parseMarkdownLikeText(item)}</li>
        ))}
      </ul>
    );
  }

// Utility function to process answer into text and lists
function processAnswer(answerArray) {
  const contentElements = [];

  let currentList = []; // Track ongoing list items
  answerArray.forEach((text, idx) => {
    if (text.startsWith('- ')) { // Assumes list items start with '- '
      // Remove the '- ' marker and trim whitespace
      const listItem = text.substring(2).trim();
      currentList.push(listItem);
    } else {
      // If there's an ongoing list, end and push it before adding new paragraph
      if (currentList.length > 0) {
        // Wrap parsed list items in <li> tags
        const listElements = currentList.map((item, itemIdx) => {
          // Ensure list items are parsed for links and bold text
          const parsedListItem = parseMarkdownLikeText(item);
          return <li key={`item-${itemIdx}`}>{parsedListItem}</li>;
        });
        // Add the whole list to content elements
        contentElements.push(<ul key={`list-${idx}`}>{listElements}</ul>);
        currentList = []; // Reset the list
      }
      // Parse normal text for links and bold, then add as a paragraph
      const parsedText = parseMarkdownLikeText(text);
      contentElements.push(<div key={`text-${idx}`}>{parsedText}</div>); // Wrap in div for consistent React element structure
    }
  });

  // Check if there's an ongoing list after finishing all items
  if (currentList.length > 0) {
    const listElements = currentList.map((item, itemIdx) => {
      // Parse each list item for links and bold text
      const parsedListItem = parseMarkdownLikeText(item);
      return <li key={`item-${itemIdx}`}>{parsedListItem}</li>;
    });
    contentElements.push(<ul key={`list-end`}>{listElements}</ul>);
  }

  return contentElements;
}



const renderAnswer = (answerArray) => {
  // First, process the answer to separate text and list items
  const processedAnswer = processAnswer(answerArray);

  // Then, for each element in the processed answer, parse text with links if it's a string
  return (
    <div>
      {processedAnswer.map((element, idx) => {
        // Check if the element is a string or already an HTML element (like <ul>)
        if (typeof element === 'string') {
          // Parse text for links and bold formatting
          return parseMarkdownLikeText(element).map((parsedElement, parsedIdx) => (
            <React.Fragment key={`fragment-${idx}-${parsedIdx}`}>{parsedElement}</React.Fragment>
          ));
        } else {
          // If it's not a string, it should be an HTML element (like <ul>)
          // No need to parse for links, so just return it directly
          return element;
        }
      })}
    </div>
  );
};


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
