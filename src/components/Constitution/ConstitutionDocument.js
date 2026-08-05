import React from "react";
import ReactMarkdown from "react-markdown";
import { createSlugger } from "@site/scripts/lib/constitution-toc.js";

// Flatten react-markdown heading children (which may be a <strong> wrapper
// because heading text is bold) down to plain text for slugging.
function childrenToText(children) {
  return React.Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") return String(child);
      if (child && child.props && child.props.children) return childrenToText(child.props.children);
      return "";
    })
    .join("");
}

export default function ConstitutionDocument({ content }) {
  // A FRESH slugger every render. react-markdown invokes the heading
  // components on every render, so a memoized/persisted slugger would keep
  // accumulating dedup state across re-renders and append -2, -3 to every
  // id, desyncing from the TOC anchors. Recreating it per render keeps each
  // pass clean; extractToc uses the same slugify over the same heading
  // sequence, so the ids match the TOC. Override h1-h6 so every heading
  // react-markdown renders consumes the slugger in document order.
  const slug = createSlugger();
  const heading = (Tag) => function Heading({ children }) {
    return <Tag id={slug(childrenToText(children))}>{children}</Tag>;
  };
  const components = {
    h1: heading("h1"),
    h2: heading("h2"),
    h3: heading("h3"),
    h4: heading("h4"),
    h5: heading("h5"),
    h6: heading("h6"),
  };

  return <ReactMarkdown components={components}>{content}</ReactMarkdown>;
}
