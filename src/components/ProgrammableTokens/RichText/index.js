import React from "react";
import Link from "@docusaurus/Link";

// Inline renderer for the /programmable-tokens copy. Supports:
//   [text](url)  a link; the text may itself contain _italic_ or **bold**.
//                External URLs open in a new tab (Docusaurus Link default).
//   _text_       italic, for publication titles
//   **text**     bold
//
// Props:
//   text - the translated string to render

const TOKEN = /(\[[^\]]+\]\([^)\s]+\)|\*\*[^*]+\*\*|_[^_]+_)/;

function renderInline(text) {
  return text.split(TOKEN).map((part, index) => {
    if (!part) return null;
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      return (
        <Link key={index} to={link[2]}>
          {renderInline(link[1])}
        </Link>
      );
    }
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={index}>{bold[1]}</strong>;
    const italic = part.match(/^_([^_]+)_$/);
    if (italic) return <em key={index}>{italic[1]}</em>;
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

export default function RichText({ text }) {
  return renderInline(text);
}
