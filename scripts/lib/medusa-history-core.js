/**
 * Pure helpers for building the medusa history delta stream from monthly
 * file tree snapshots. No git, no filesystem, so scripts/test-medusa-history.js
 * can exercise everything with in-memory trees.
 */

const PRUNE_PATTERNS = [/(^|\/)golden\//, /(^|\/)test\/data\//, /\.golden$/];

function nextMonth(month) {
  const [y, m] = month.split('-').map(Number);
  return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`;
}

function monthsBetween(start, end) {
  const out = [];
  let cur = start;
  while (cur <= end) {
    out.push(cur);
    cur = nextMonth(cur);
  }
  return out;
}

function parentOf(p) {
  const i = p.lastIndexOf('/');
  return i === -1 ? '/' : p.slice(0, i);
}

function depthOf(p) {
  return p === '/' ? 0 : p.split('/').length;
}

// Returns every path in the tree (root, directories, files) plus the set of directories.
function expandTree(files) {
  const paths = new Set(['/']);
  const dirs = new Set(['/']);
  files.forEach((file) => {
    const parts = file.split('/');
    for (let i = 1; i < parts.length; i += 1) {
      const dir = parts.slice(0, i).join('/');
      paths.add(dir);
      dirs.add(dir);
    }
    paths.add(file);
  });
  return { paths, dirs };
}

// Parents must be born before their children and die after them, so additions
// go from the root down and removals from the leaves up.
const shallowestFirst = (a, b) => depthOf(a) - depthOf(b) || (a < b ? -1 : 1);
const deepestFirst = (a, b) => depthOf(b) - depthOf(a) || (a < b ? -1 : 1);

function pruneFiles(files) {
  return files.filter((f) => !PRUNE_PATTERNS.some((re) => re.test(f)));
}

function buildHistory({ months, treeFor, commitFor, groupIndexForPath, limit }) {
  const paths = [];
  const idByPath = new Map();
  const frames = [];
  let prev = new Set();
  const stats = { peak: 0, peakMonth: null, largestChurn: { month: null, added: 0, removed: 0 } };

  months.forEach((month) => {
    const files = treeFor(month);
    if (files === null || files === undefined) {
      frames.push({ date: month, commit: null, add: [], rm: [] });
      return;
    }
    const { paths: next, dirs } = expandTree(files);
    const added = [...next].filter((p) => !prev.has(p)).sort(shallowestFirst);
    const removed = [...prev].filter((p) => !next.has(p)).sort(deepestFirst);

    const rm = removed.map((p) => {
      const id = idByPath.get(p);
      idByPath.delete(p);
      return id;
    });
    const add = added.map((p) => {
      const id = paths.length;
      paths.push(p);
      const parentId = p === '/' ? -1 : idByPath.get(parentOf(p));
      if (parentId === undefined) throw new Error(`parent of ${p} missing in ${month}`);
      idByPath.set(p, id);
      return [id, parentId, groupIndexForPath(p), dirs.has(p) ? 1 : 0];
    });

    frames.push({ date: month, commit: commitFor(month), add, rm });
    if (idByPath.size > stats.peak) {
      stats.peak = idByPath.size;
      stats.peakMonth = month;
    }
    const churn = add.length + rm.length;
    if (churn > stats.largestChurn.added + stats.largestChurn.removed) {
      stats.largestChurn = { month, added: add.length, removed: rm.length };
    }
    prev = next;
  });

  stats.unique = paths.length;
  stats.overLimit = stats.peak > limit;
  return { frames, paths, stats };
}

module.exports = { monthsBetween, nextMonth, expandTree, pruneFiles, buildHistory, PRUNE_PATTERNS };
