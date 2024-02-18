import React from "react";


// Parse text and replace link markdown in actual html links
// Quite useful if you just want to allow (trusted) links in text that is passed into 
// components to avoid dangerouslySetInnerHTML.
export function parseTextWithLinks(contentArray) {

  // Ensure contentArray is always treated as an array
  const safeArray = Array.isArray(contentArray) ? contentArray : [contentArray];

  return safeArray.map((content, index) => {
    // If the content is a string, parse it for links
    if (typeof content === 'string') {
      // Split the string into parts and replace markdown-style links with <a> tags
      const parts = content.split(/(\[.*?\]\(.*?\))/).map((part, partIndex) => {
        const match = part.match(/\[(.*?)\]\((.*?)\)/);
        return match ? <a href={match[2]} key={`link-${index}-${partIndex}`}>{match[1]}</a> : part;
      });
      return <React.Fragment key={`fragment-${index}`}>{parts}</React.Fragment>;
    } else {
      // If the content is not a string (e.g., a React element), return it directly
      return React.cloneElement(content, { key: `element-${index}` });
    }
  });
}
