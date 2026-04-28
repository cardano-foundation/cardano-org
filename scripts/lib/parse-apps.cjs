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

  const entryRegex = /\{\s*\n\s*title:\s*"((?:[^"\\]|\\.)+)",[\s\S]*?(?:description:\s*(?:\n\s*)?"((?:[^"\\]|\\.)*)"[\s\S]*?)?(?:tagline:\s*"((?:[^"\\]|\\.)*)",[\s\S]*?)?(?:icon:\s*"([^"]+)",[\s\S]*?)?(?:statsLabel:\s*"([^"]+)",[\s\S]*?)?website:\s*"([^"]+)"[\s\S]*?source:\s*(null|"[^"]+"),[\s\S]*?category:\s*"([^"]+)",[\s\S]*?properties:\s*\[([^\]]*)\],[\s\S]*?maintainerPick:\s*(true|false),[\s\S]*?beginnerFriendly:\s*(true|false),[\s\S]*?(?:spotlight:\s*\{\s*url:\s*"([^"]+)",\s*title:\s*"((?:[^"\\]|\\.)+)",\s*date:\s*"([^"]+)",?\s*\},?[\s\S]*?)?\n\s*\},?/g;

  const apps = [];
  let m;
  while ((m = entryRegex.exec(block)) !== null) {
    apps.push({
      title: parseStringValue(`"${m[1]}"`),
      description: m[2]
        ? parseStringValue(`"${m[2]}"`).replace(/\s+/g, ' ').trim()
        : '',
      tagline: m[3] ? parseStringValue(`"${m[3]}"`) : null,
      icon: m[4] || null,
      statsLabel: m[5] || null,
      website: m[6],
      source: parseStringValue(m[7]),
      category: m[8],
      properties: m[9]
        .split(',')
        .map((t) => t.trim().replace(/^"|"$/g, ''))
        .filter(Boolean),
      maintainerPick: m[10] === 'true',
      beginnerFriendly: m[11] === 'true',
      spotlight: m[12]
        ? {
            url: m[12],
            title: parseStringValue(`"${m[13]}"`),
            date: m[14],
          }
        : null,
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
