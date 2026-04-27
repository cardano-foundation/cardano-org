//
// Shared regex parser for src/data/apps.js. Used by build scripts that need to read
// the Showcases array without invoking the React/webpack module system.
// Field order in apps.js entries matters: title → description → icon? → statsLabel? →
// website → source → category → properties → maintainerPick → beginnerFriendly.
// If field ordering changes in apps.js, update the regex below.
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

  const entryRegex = /\{\s*\n\s*title:\s*"((?:[^"\\]|\\.)+)",[\s\S]*?(?:description:\s*(?:\n\s*)?"((?:[^"\\]|\\.)*)"[\s\S]*?)?(?:icon:\s*"([^"]+)",[\s\S]*?)?(?:statsLabel:\s*"([^"]+)",[\s\S]*?)?website:\s*"([^"]+)"[\s\S]*?source:\s*(null|"[^"]+"),[\s\S]*?category:\s*"([^"]+)",[\s\S]*?properties:\s*\[([^\]]*)\],[\s\S]*?maintainerPick:\s*(true|false),[\s\S]*?beginnerFriendly:\s*(true|false),[\s\S]*?\n\s*\},?/g;

  const apps = [];
  let m;
  while ((m = entryRegex.exec(block)) !== null) {
    apps.push({
      title: parseStringValue(`"${m[1]}"`),
      description: m[2]
        ? parseStringValue(`"${m[2]}"`).replace(/\s+/g, ' ').trim()
        : '',
      icon: m[3] || null,
      statsLabel: m[4] || null,
      website: m[5],
      source: parseStringValue(m[6]),
      category: m[7],
      properties: m[8]
        .split(',')
        .map((t) => t.trim().replace(/^"|"$/g, ''))
        .filter(Boolean),
      maintainerPick: m[9] === 'true',
      beginnerFriendly: m[10] === 'true',
    });
  }

  return { apps, block };
}

function assertEntryCountMatches(apps, block) {
  const titleCount = (block.match(/^\s*title:\s*"/gm) || []).length;
  if (apps.length < titleCount) {
    throw new Error(
      `Parsed ${apps.length} apps but found ${titleCount} title: lines — regex missed entries.`
    );
  }
}

module.exports = { parseShowcases, assertEntryCountMatches };
