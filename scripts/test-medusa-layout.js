/**
 * Tests for src/components/Medusa/layout.js, the d3-force simulation that the
 * worker wraps. Runs the simulation in Node without a Worker. No framework.
 */
const assert = require('node:assert');
const { createChecker } = require('./lib/medusa-test-check.js');

const history = {
  paths: ['/', 'a', 'a/x.hs', 'a/y.hs', 'b', 'b/z.hs'],
  groups: ['g'],
  frames: [
    { date: '2020-01', commit: 'c1', add: [[0, -1, 0, 1], [1, 0, 0, 1], [2, 1, 0, 0], [3, 1, 0, 0]], rm: [] },
    { date: '2020-02', commit: 'c2', add: [[4, 0, 0, 1], [5, 4, 0, 0]], rm: [] },
    { date: '2020-03', commit: 'c3', add: [], rm: [3] },
  ],
};

async function main() {
  const { createLayout, LAYOUT_DEFAULTS } = await import('../src/components/Medusa/layout.js');

  const { check, done } = createChecker('medusa layout');

  const finite = (xy) => xy.every((v) => Number.isFinite(v));

  check('seek(0) settles and returns finite positions for every alive node', () => {
    const l = createLayout(history);
    l.seek(0);
    const { ids, xy } = l.positions();
    assert.strictEqual(ids.length, 4);
    assert.strictEqual(xy.length, 8);
    assert.ok(finite(xy));
    assert.strictEqual(l.count(), 4);
  });

  check('new nodes spawn near their parent and files stay close to their directory', () => {
    const l = createLayout(history);
    l.seek(0);
    l.step();
    const { ids, xy } = l.positions();
    const pos = (id) => {
      const i = ids.indexOf(id);
      return [xy[2 * i], xy[2 * i + 1]];
    };
    const d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    assert.ok(d(pos(5), pos(4)) < LAYOUT_DEFAULTS.spawnJitter, 'spawn near parent');
    l.tick(200);
    const after = l.positions();
    assert.ok(finite(after.xy));
    const p = (id) => {
      const i = after.ids.indexOf(id);
      return [after.xy[2 * i], after.xy[2 * i + 1]];
    };
    assert.ok(d(p(5), p(4)) < 4 * LAYOUT_DEFAULTS.linkFile, 'file stays near its directory');
    assert.ok(d(p(1), p(4)) > LAYOUT_DEFAULTS.linkDir * 0.5, 'directories repel each other');
  });

  check('removed nodes leave the simulation', () => {
    const l = createLayout(history);
    l.seek(2);
    assert.strictEqual(l.count(), 5);
    assert.strictEqual(l.positions().ids.indexOf(3), -1);
  });

  check('seek backwards rebuilds, setParams keeps running', () => {
    const l = createLayout(history);
    l.seek(2);
    l.seek(0);
    assert.strictEqual(l.count(), 4);
    l.setParams({ chargeDir: -20, linkFile: 20 });
    l.tick(10);
    assert.ok(finite(l.positions().xy));
  });

  check('seek to the current frame is a no-op', () => {
    const l = createLayout(history);
    l.seek(0);
    const before = l.positions().xy.slice();
    l.seek(0);
    assert.deepStrictEqual(l.positions().xy, before);
    assert.strictEqual(l.count(), 4);
  });

  done();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
