/**
 * Tests for src/components/Medusa/graph.js, the live node set built from the
 * monthly delta frames. Run with `node`, no framework.
 */
const assert = require('node:assert');

const history = {
  paths: ['/', 'a', 'a/x.hs', 'b', 'b/y.hs', 'a/z.hs'],
  groups: ['g'],
  frames: [
    { date: '2020-01', commit: 'c1', add: [[0, -1, 0, 1], [1, 0, 0, 1], [2, 1, 0, 0]], rm: [] },
    { date: '2020-02', commit: 'c2', add: [[3, 0, 0, 1], [4, 3, 0, 0]], rm: [] },
    { date: '2020-03', commit: 'c3', add: [[5, 1, 0, 0]], rm: [4, 3] },
  ],
};

async function main() {
  const { createGraph } = await import('../src/components/Medusa/graph.js');

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

  check('step applies frames in order with depth and path', () => {
    const g = createGraph(history);
    assert.strictEqual(g.frameIndex, -1);
    const d0 = g.step();
    assert.deepStrictEqual(d0.added.map((n) => [n.id, n.depth, n.path, n.isDir]), [[0, 0, '/', true], [1, 1, 'a', true], [2, 2, 'a/x.hs', false]]);
    assert.deepStrictEqual(d0.removed, []);
    assert.strictEqual(g.frameIndex, 0);
    g.step();
    const d2 = g.step();
    assert.deepStrictEqual(d2.added.map((n) => n.id), [5]);
    assert.deepStrictEqual(d2.removed, [4, 3]);
    assert.strictEqual(g.aliveCount(), 4);
    assert.strictEqual(g.get(3), undefined);
  });

  check('seek forward by one behaves like step, seek elsewhere rebuilds and reports the net change', () => {
    const g = createGraph(history);
    g.seek(1);
    assert.strictEqual(g.frameIndex, 1);
    assert.strictEqual(g.aliveCount(), 5);
    const back = g.seek(0);
    assert.deepStrictEqual(back.added, []);
    assert.deepStrictEqual(back.removed.sort(), [3, 4]);
    const jump = g.seek(2);
    assert.deepStrictEqual(jump.added.map((n) => n.id), [5]);
    assert.deepStrictEqual(jump.removed, []);
    assert.deepStrictEqual(g.seek(2), { added: [], removed: [] });
  });

  check('step past the last frame throws', () => {
    const g = createGraph(history);
    g.seek(2);
    assert.throws(() => g.step(), /last frame/);
  });

  check('subtree returns the node and all alive descendants', () => {
    const g = createGraph(history);
    g.seek(2);
    assert.deepStrictEqual([...g.subtree(1)].sort(), [1, 2, 5]);
    assert.deepStrictEqual([...g.subtree(0)].sort(), [0, 1, 2, 5]);
    assert.deepStrictEqual([...g.subtree(2)], [2]);
  });

  console.log(`\n${passed} medusa graph tests passed`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
