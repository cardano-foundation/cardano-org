import React from "react";
import Link from "@docusaurus/Link";

// Parse text and replace link markdown in actual html links
// Supports also **text** to mark things bold

export function parseMarkdownLikeText(contentArray) {
  // Ensure contentArray is always treated as an array
  const safeArray = Array.isArray(contentArray) ? contentArray : [contentArray];

  return safeArray.map((content, index) => {
    // If the content is a string, parse it for links and bold text
    if (typeof content === 'string') {
      // First split the string to isolate markdown links and bold syntax
      const parts = content.split(/(\[.*?\]\(.*?\)|\*\*.*?\*\*)/).map((part, partIndex) => {
        // Match and replace markdown-style links with <Link> tags
        const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          return <Link to={linkMatch[2]} key={`link-${index}-${partIndex}`}>{linkMatch[1]}</Link>;
        }
        // Match and replace markdown-style bold text with <strong> tags
        const boldMatch = part.match(/\*\*(.*?)\*\*/);
        if (boldMatch) {
          return <strong key={`bold-${index}-${partIndex}`}>{boldMatch[1]}</strong>;
        }
        return part; // Return the part unchanged if it's neither a link nor bold text
      });
      return <React.Fragment key={`fragment-${index}`}>{parts}</React.Fragment>;
    } else {
      // If the content is not a string (e.g., a React element), return it directly
      return React.cloneElement(content, { key: `element-${index}` });
    }
  });
}

