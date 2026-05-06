//
// Shared regex parser for src/data/apps.js. Used by build scripts that need to read
// the Showcases array without invoking the React/webpack module system.
//

function parseStringValue(s) {
  if (s === 'null') return null;
  return s.replace(/^"|"$/g, '').replace(/\\"/g, '"').replace(/\\n/g, ' ');
}

function parseShowcases(source) {
  const startMatch = source.match(/export const Showcases = \[/);
  if (!startMatch) throw new Error('Cannot find Showcases array');
  const blockStart = startMatch.index + startMatch[0].length;
  const closeIdx = source.indexOf('\n];', blockStart);
  if (closeIdx < 0) throw new Error('Cannot find end of Showcases array');
  const block = source.slice(blockStart, closeIdx);

  const entryRegex = /\{\s*\n\s*title:\s*"((?:[^"\\]|\\.)+)",[\s\S]*?(?:description:\s*(?:\n\s*)?"((?:[^"\\]|\\.)*)"[\s\S]*?)?(?:tagline:\s*"((?:[^"\\]|\\.)*)",[\s\S]*?)?(?:icon:\s*"([^"]+)",[\s\S]*?)?(?:statsLabel:\s*"([^"]+)",[\s\S]*?)?(?:metadataLabel:\s*(\d+),[\s\S]*?)?website:\s*"([^"]+)"[\s\S]*?source:\s*(null|"[^"]+"),[\s\S]*?category:\s*"([^"]+)",[\s\S]*?properties:\s*\[([^\]]*)\],[\s\S]*?maintainerPick:\s*(true|false),[\s\S]*?beginnerFriendly:\s*(true|false),[\s\S]*?(?:x:\s*"([^"]+)",[\s\S]*?)?(?:spotlight:\s*\{\s*url:\s*"([^"]+)",\s*title:\s*"((?:[^"\\]|\\.)+)",\s*date:\s*"([^"]+)",?\s*\},?[\s\S]*?)?\n\s*\},?/g;

  // Preview is a webpack require() expression — not captured by the main regex
  // because group ordering is too brittle to extend. Searched per-entry so missing
  // preview lines yield null instead of misaligning the array.
  const previewLineRegex = /preview:\s*require\(["']\.\/app-screenshots\/([^"']+)["']\)/;
  const extraPreviewsRegex = /extraPreviews:\s*\[([^\]]*)\]/;
  const extraPreviewItemRegex = /require\(["']\.\/app-screenshots\/([^"']+)["']\)/g;

  const apps = [];
  let m;
  while ((m = entryRegex.exec(block)) !== null) {
    const entrySlice = block.slice(m.index, entryRegex.lastIndex);
    const previewMatch = entrySlice.match(previewLineRegex);
    const extraMatch = entrySlice.match(extraPreviewsRegex);
    const extraPreviewFiles = [];
    if (extraMatch) {
      extraPreviewItemRegex.lastIndex = 0;
      let item;
      while ((item = extraPreviewItemRegex.exec(extraMatch[1])) !== null) {
        extraPreviewFiles.push(item[1]);
      }
    }
    apps.push({
      title: parseStringValue(`"${m[1]}"`),
      description: m[2]
        ? parseStringValue(`"${m[2]}"`).replace(/\s+/g, ' ').trim()
        : '',
      tagline: m[3] ? parseStringValue(`"${m[3]}"`) : null,
      icon: m[4] || null,
      statsLabel: m[5] || null,
      metadataLabel: m[6] ? Number(m[6]) : null,
      website: m[7],
      source: parseStringValue(m[8]),
      category: m[9],
      properties: m[10]
        .split(',')
        .map((t) => t.trim().replace(/^"|"$/g, ''))
        .filter(Boolean),
      maintainerPick: m[11] === 'true',
      beginnerFriendly: m[12] === 'true',
      x: m[13] || null,
      spotlight: m[14]
        ? {
            url: m[14],
            title: parseStringValue(`"${m[15]}"`),
            date: m[16],
          }
        : null,
      previewFile: previewMatch ? previewMatch[1] : null,
      extraPreviewFiles,
    });
  }

  return { apps, block };
}

function assertEntryCountMatches(apps, block) {
  // Only count entry-level title lines (4-space indent). Nested objects like
  // `spotlight: { title: "..." }` use deeper indentation and must be excluded.
  const titleCount = (block.match(/^ {4}title:\s*"/gm) || []).length;
  if (apps.length < titleCount) {
    throw new Error(
      `Parsed ${apps.length} apps but found ${titleCount} title: lines — regex missed entries.`
    );
  }
}

module.exports = { parseShowcases, assertEntryCountMatches };
