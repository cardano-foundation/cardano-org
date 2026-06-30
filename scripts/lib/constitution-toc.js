// Pure helpers to slugify constitution headings and extract a table of
// contents from the markdown. CommonJS so it is unit-testable with plain
// node (the repo has no jest) and importable by the React page via webpack.
//
// The constitution markdown mixes Setext headings (a text line underlined
// with === for h1 or --- for h2) and ATX headings (### ...). Heading text
// is wrapped in **bold**. extractToc and the page's heading renderer both
// derive slugs from createSlugger() fed headings in document order, so the
// TOC anchors always match the rendered heading ids.

function stripBold(text) {
  // Remove markdown bold/italic markers and surrounding whitespace. This
  // assumes heading text is plain (bold) prose, which holds for the current
  // constitution. A future heading containing a link or inline code would
  // need richer flattening here to stay in sync with the document renderer's
  // childrenToText (which flattens any inline node to plain text).
  return text.replace(/\*\*/g, '').replace(/__/g, '').trim();
}

function slugify(text) {
  return stripBold(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function createSlugger() {
  const seen = new Map();
  return (text) => {
    const base = slugify(text);
    const count = seen.get(base) || 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  };
}

function extractToc(markdown) {
  const lines = markdown.split('\n');
  const slug = createSlugger();
  const headings = [];
  let inFence = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Toggle fenced code blocks (``` or ~~~). Headings inside are ignored.
    if (/^\s*(```|~~~)/.test(line)) { inFence = !inFence; continue; }
    if (inFence) continue;

    // ATX heading: 1-6 leading '#' then a space.
    const atx = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);
    if (atx) {
      const text = stripBold(atx[2]);
      headings.push({ level: atx[1].length, text, slug: slug(text) });
      continue;
    }

    // Setext heading: a non-blank text line followed by a line of only
    // '=' (h1) or '-' (h2). The text line must not itself be blank.
    const next = lines[i + 1];
    if (next && line.trim() !== '') {
      if (/^=+\s*$/.test(next)) {
        const text = stripBold(line);
        headings.push({ level: 1, text, slug: slug(text) });
        i++; // consume the underline
        continue;
      }
      if (/^-+\s*$/.test(next)) {
        const text = stripBold(line);
        headings.push({ level: 2, text, slug: slug(text) });
        i++;
        continue;
      }
    }
  }

  return headings;
}

module.exports = { slugify, createSlugger, extractToc };
