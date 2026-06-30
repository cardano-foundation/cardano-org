import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { createSlugger } from "@site/scripts/lib/constitution-toc.cjs";

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
  // One slugger per render, fed headings in document order. react-markdown
  // visits headings in document order, so this produces the same slug
  // sequence as extractToc(content) and the TOC anchors line up.
  const components = useMemo(() => {
    const slug = createSlugger();
    const heading = (Tag) => function Heading({ children }) {
      const id = slug(childrenToText(children));
      return <Tag id={id}>{children}</Tag>;
    };
    return { h1: heading("h1"), h2: heading("h2"), h3: heading("h3") };
  }, [content]);

  return <ReactMarkdown components={components}>{content}</ReactMarkdown>;
}
