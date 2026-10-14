#!/usr/bin/env node
/**
 * Builds src/data/medusa/ledger-history.json from a local git clone.
 *
 * Usage:
 *   node scripts/medusa-history.js <path-to-clone> [--branch master] [--out src/data/medusa/ledger-history.json]
 *
 * Recommended clone (trees without blobs, enough for ls-tree):
 *   git clone --filter=blob:none https://github.com/IntersectMBO/cardano-ledger ~/Workflows/medusa-data/cardano-ledger
 *
 * One frame per calendar month: the first commit on the branch at or after
 * the first of the month (commit date). Months without commits become empty
 * frames. If the peak node count exceeds the limit, generated test fixtures
 * are pruned in a second pass (never source code).
 */
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const core = require('./lib/medusa-history-core.js');

const LIMIT = 3000;
const REPO = 'IntersectMBO/cardano-ledger';

function parseArgs(argv) {
  const args = { branch: 'master', out: path.join('src', 'data', 'medusa', 'ledger-history.json') };
  const rest = [];
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--branch') args.branch = argv[++i];
    else if (argv[i] === '--out') args.out = argv[++i];
    else rest.push(argv[i]);
  }
  args.repoDir = rest[0];
  return args;
}

function git(repoDir, gitArgs) {
  return execFileSync('git', ['-C', repoDir, ...gitArgs], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
}

function firstCommitOfMonth(repoDir, branch, month) {
  const out = git(repoDir, [
    'rev-list', '--reverse',
    `--after=${month}-01T00:00:00Z`,
    `--before=${core.nextMonth(month)}-01T00:00:00Z`,
    branch,
  ]);
  const sha = out.split('\n').find(Boolean);
  return sha || null;
}

function filesAt(repoDir, sha) {
  return git(repoDir, ['ls-tree', '-r', '--name-only', '-z', sha]).split('\0').filter(Boolean);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.repoDir) {
    console.error('Usage: node scripts/medusa-history.js <path-to-clone> [--branch master] [--out file]');
    process.exit(1);
  }
  const { groupForPath, groupIndex, GROUPS } = await import('../src/components/Medusa/groups.js');
  const groupIndexForPath = (p) => groupIndex(groupForPath(p));

  const firstDate = git(args.repoDir, ['log', '--reverse', '--date=iso-strict', '--format=%cd', args.branch]).split('\n')[0];
  const firstMonth = firstDate.slice(0, 7);
  const lastMonth = new Date().toISOString().slice(0, 7);
  const months = core.monthsBetween(firstMonth, lastMonth);

  const commits = new Map(months.map((m) => [m, firstCommitOfMonth(args.repoDir, args.branch, m)]));
  const treeCache = new Map();
  const rawTreeFor = (m) => {
    const sha = commits.get(m);
    if (!sha) return null;
    if (!treeCache.has(m)) treeCache.set(m, filesAt(args.repoDir, sha));
    return treeCache.get(m);
  };
  const commitFor = (m) => commits.get(m);

  let result = core.buildHistory({ months, treeFor: rawTreeFor, commitFor, groupIndexForPath, limit: LIMIT });
  let pruned = false;
  if (result.stats.overLimit) {
    console.log(`peak ${result.stats.peak} in ${result.stats.peakMonth} exceeds ${LIMIT}, pruning test fixtures`);
    const prunedTreeFor = (m) => {
      const files = rawTreeFor(m);
      return files === null ? null : core.pruneFiles(files);
    };
    result = core.buildHistory({ months, treeFor: prunedTreeFor, commitFor, groupIndexForPath, limit: LIMIT });
    pruned = true;
  }
  if (result.stats.overLimit) {
    console.error(`peak ${result.stats.peak} in ${result.stats.peakMonth} still exceeds ${LIMIT} after pruning`);
    process.exit(1);
  }

  const data = {
    repo: REPO,
    branch: args.branch,
    generated: new Date().toISOString().slice(0, 10),
    limit: LIMIT,
    paths: result.paths,
    groups: GROUPS.map((g) => g.key),
    frames: result.frames,
  };
  fs.mkdirSync(path.dirname(args.out), { recursive: true });
  fs.writeFileSync(args.out, JSON.stringify(data));

  const s = result.stats;
  console.log(`frames: ${months.length} (${firstMonth} to ${lastMonth}), unique nodes: ${s.unique}`);
  console.log(`peak alive: ${s.peak} in ${s.peakMonth}${pruned ? ' (after pruning)' : ''}`);
  console.log(`largest churn: ${s.largestChurn.month} (+${s.largestChurn.added} / -${s.largestChurn.removed})`);
  console.log(`wrote ${args.out} (${(fs.statSync(args.out).size / 1024).toFixed(0)} KB)`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
