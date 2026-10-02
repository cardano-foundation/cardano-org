import React from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

// Inline renderer for the /programmable-tokens copy. Supports:
//   [^1]         a superscript footnote reference linking to #source-1 (the
//                list rendered by the Footnotes component)
//   [text](url)  a link; the text may itself contain _italic_ or **bold**.
//                External URLs open in a new tab (Docusaurus Link default).
//   _text_       italic, for publication titles
//   **text**     bold
//
// Footnote references are matched before links, so their brackets can never
// be mistaken for the start of a link.
//
// Props:
//   text - the translated string to render

const TOKEN = /(\[\^\d+\]|\[[^\]]+\]\([^)\s]+\)|\*\*[^*]+\*\*|_[^_]+_)/;

export function sourceId(number) {
  return `source-${number}`;
}

function FootnoteRef({ number }) {
  return (
    <sup className={styles.ref}>
      <a
        href={`#${sourceId(number)}`}
        id={`${sourceId(number)}-ref`}
        aria-label={translate(
          { id: "programmableTokens.footnotes.refLabel", message: "Source {number}" },
          { number }
        )}
      >
        {number}
      </a>
    </sup>
  );
}

function renderInline(text) {
  return text.split(TOKEN).map((part, index) => {
    if (!part) return null;
    const ref = part.match(/^\[\^(\d+)\]$/);
    if (ref) return <FootnoteRef key={index} number={Number(ref[1])} />;
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
