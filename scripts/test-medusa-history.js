/**
 * Tests for scripts/lib/medusa-history-core.js (pure frame building) and,
 * when present, invariants of the generated src/data/medusa/ledger-history.json.
 * Run with `node`, no framework.
 */
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const core = require('./lib/medusa-history-core.js');

const DATA = path.join(__dirname, '..', 'src', 'data', 'medusa', 'ledger-history.json');

let passed = 0;
const check = (name, fn) => {
  try {
    fn();
  } catch (err) {
    err.message = `FAIL: ${name}\n${err.message}`;
    throw err;
  }
  passed += 1;
  console.log(`  ok - ${name}`);
};

const groupOf = (p) => (p.includes('shelley') ? 1 : 0);

check('monthsBetween is inclusive and crosses years', () => {
  assert.deepStrictEqual(core.monthsBetween('2018-11', '2019-02'), ['2018-11', '2018-12', '2019-01', '2019-02']);
  assert.deepStrictEqual(core.monthsBetween('2020-05', '2020-05'), ['2020-05']);
});

check('expandTree adds root and every directory prefix', () => {
  const { paths, dirs } = core.expandTree(['a/b/c.hs', 'a/d.hs', 'README.md']);
  assert.deepStrictEqual([...paths].sort(), ['/', 'README.md', 'a', 'a/b', 'a/b/c.hs', 'a/d.hs']);
  assert.deepStrictEqual([...dirs].sort(), ['/', 'a', 'a/b']);
});

check('pruneFiles drops golden and test data files only', () => {
  const kept = core.pruneFiles(['eras/alonzo/test-suite/golden/x.cbor', 'libs/x/test/data/y.json', 'a/b.golden', 'eras/alonzo/impl/src/A.hs']);
  assert.deepStrictEqual(kept, ['eras/alonzo/impl/src/A.hs']);
});

check('buildHistory emits parents before children and children before parents on removal', () => {
  const trees = {
    '2019-01': ['byron/a.hs'],
    '2019-02': ['byron/a.hs', 'shelley/x/b.hs'],
    '2019-03': ['byron/a.hs'],
  };
  const out = core.buildHistory({
    months: Object.keys(trees),
    treeFor: (m) => trees[m],
    commitFor: (m) => `sha-${m}`,
    groupIndexForPath: groupOf,
    limit: 3000,
  });
  assert.strictEqual(out.frames.length, 3);
  const f0 = out.frames[0];
  assert.deepStrictEqual(f0.add, [[0, -1, 0, 1], [1, 0, 0, 1], [2, 1, 0, 0]]);
  assert.deepStrictEqual(out.paths.slice(0, 3), ['/', 'byron', 'byron/a.hs']);
  const f1 = out.frames[1];
  assert.deepStrictEqual(f1.add, [[3, 0, 1, 1], [4, 3, 1, 1], [5, 4, 1, 0]]);
  assert.deepStrictEqual(f1.rm, []);
  const f2 = out.frames[2];
  assert.deepStrictEqual(f2.add, []);
  assert.deepStrictEqual(f2.rm, [5, 4, 3]);
  assert.strictEqual(f2.commit, 'sha-2019-03');
});

check('a month without commit repeats the previous state as an empty frame', () => {
  const out = core.buildHistory({
    months: ['2019-01', '2019-02'],
    treeFor: (m) => (m === '2019-01' ? ['a.hs'] : null),
    commitFor: (m) => (m === '2019-01' ? 'sha' : null),
    groupIndexForPath: groupOf,
    limit: 3000,
  });
  assert.deepStrictEqual(out.frames[1], { date: '2019-02', commit: null, add: [], rm: [] });
});

check('ids are never reused after removal', () => {
  const trees = { '2019-01': ['a.hs'], '2019-02': [], '2019-03': ['a.hs'] };
  const out = core.buildHistory({
    months: Object.keys(trees),
    treeFor: (m) => trees[m],
    commitFor: () => 'sha',
    groupIndexForPath: groupOf,
    limit: 3000,
  });
  assert.deepStrictEqual(out.frames[2].add, [[2, 0, 0, 0]]);
  assert.strictEqual(out.paths[2], 'a.hs');
});

check('stats report peak and largest churn', () => {
  const trees = { '2019-01': ['a.hs', 'b.hs'], '2019-02': ['c.hs', 'd.hs'] };
  const out = core.buildHistory({
    months: Object.keys(trees),
    treeFor: (m) => trees[m],
    commitFor: () => 'sha',
    groupIndexForPath: groupOf,
    limit: 3000,
  });
  assert.strictEqual(out.stats.peak, 3);
  assert.strictEqual(out.stats.peakMonth, '2019-01');
  assert.deepStrictEqual(out.stats.largestChurn, { month: '2019-02', added: 2, removed: 2 });
});

if (fs.existsSync(DATA)) {
  const data = JSON.parse(fs.readFileSync(DATA, 'utf8'));
  check('generated data: frames are consecutive months', () => {
    const months = core.monthsBetween(data.frames[0].date, data.frames[data.frames.length - 1].date);
    assert.deepStrictEqual(data.frames.map((f) => f.date), months);
    assert.strictEqual(data.frames[0].date, '2018-09');
  });
  check('generated data: ids unique, parents alive, removals alive, limit respected', () => {
    const alive = new Map();
    const seen = new Set();
    data.frames.forEach((f) => {
      f.add.forEach(([id, parent, group, isDir]) => {
        assert.ok(!seen.has(id), `duplicate id ${id}`);
        seen.add(id);
        assert.ok(typeof data.paths[id] === 'string', `missing path for ${id}`);
        assert.ok(parent === -1 || alive.has(parent), `parent ${parent} of ${id} not alive in ${f.date}`);
        assert.ok(group >= 0 && group < data.groups.length);
        assert.ok(isDir === 0 || isDir === 1);
        alive.set(id, parent);
      });
      f.rm.forEach((id) => {
        assert.ok(alive.has(id), `removal of dead node ${id} in ${f.date}`);
        alive.delete(id);
      });
      assert.ok(alive.size <= data.limit, `${alive.size} nodes in ${f.date} exceed ${data.limit}`);
    });
    assert.strictEqual(seen.size, data.paths.length);
  });
} else {
  console.log('  skip - src/data/medusa/ledger-history.json not generated yet');
}

console.log(`\n${passed} medusa history tests passed`);
