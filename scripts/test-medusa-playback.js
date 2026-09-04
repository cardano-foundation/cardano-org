/**
 * Tests for src/components/Medusa/playback.js (the clock that drives the
 * visualization) and the milestone data file. Run with `node`, no framework.
 */
const assert = require('node:assert');
const { createChecker } = require('./lib/medusa-test-check.js');

async function main() {
  const { createPlayback, frameIndexForDate } = await import('../src/components/Medusa/playback.js');
  const { MILESTONES, HARD_FORK_KEYS } = await import('../src/data/medusa/milestones.js');
  const { GROUPS } = await import('../src/components/Medusa/groups.js');

  const { check, done } = createChecker('medusa playback');

  const dates = ['2020-01', '2020-02', '2020-03', '2020-04'];
  const milestones = [{ key: 'm1', date: '2020-03-15', group: 'shelley', kind: 'hardfork', link: '/hardforks' }];
  const make = (mode, extra = {}) =>
    createPlayback({ frameDates: dates, milestones, mode, ambientDuration: 4, holdDuration: 1, fadeDuration: 1, fadeInDuration: 0.5, ...extra });

  check('frameIndexForDate maps a day to its month frame and -1 outside', () => {
    assert.strictEqual(frameIndexForDate(dates, '2020-03-15'), 2);
    assert.strictEqual(frameIndexForDate(dates, '2020-01-01'), 0);
    assert.strictEqual(frameIndexForDate(dates, '2019-12-31'), -1);
    assert.strictEqual(frameIndexForDate(dates, '2020-05-01'), -1);
  });

  check('ambient mode plays one frame per second here and emits step frames', () => {
    const p = make('ambient');
    const seen = [];
    p.on('frame', (i, meta) => seen.push([i, meta.kind]));
    p.tick(0.5);
    assert.strictEqual(p.getState().frameIndex, 0);
    p.tick(0.5);
    assert.strictEqual(p.getState().frameIndex, 1);
    p.tick(2);
    assert.strictEqual(p.getState().frameIndex, 3);
    assert.deepStrictEqual(seen, [[1, 'step'], [2, 'step'], [3, 'step']]);
  });

  check('ambient mode holds, fades, restarts at frame 0 and fades in', () => {
    const p = make('ambient');
    const phases = [];
    p.on('phase', (s) => phases.push(s.phase));
    const frames = [];
    p.on('frame', (i, meta) => frames.push([i, meta.kind]));
    p.tick(4);
    assert.strictEqual(p.getState().phase, 'hold');
    p.tick(1);
    assert.strictEqual(p.getState().phase, 'fade');
    p.tick(0.5);
    assert.ok(Math.abs(p.getState().opacity - 0.5) < 1e-6);
    p.tick(0.5);
    assert.strictEqual(p.getState().phase, 'fadein');
    assert.strictEqual(p.getState().frameIndex, 0);
    assert.deepStrictEqual(frames[frames.length - 1], [0, 'seek']);
    p.tick(0.5);
    assert.strictEqual(p.getState().phase, 'play');
    assert.strictEqual(p.getState().opacity, 1);
    assert.deepStrictEqual(phases, ['hold', 'fade', 'fadein', 'play']);
  });

  check('explore mode starts paused, ends paused and emits end once', () => {
    const p = make('explore');
    let ends = 0;
    p.on('end', () => (ends += 1));
    p.tick(10);
    assert.strictEqual(p.getState().frameIndex, 0);
    p.play();
    p.tick(10);
    assert.strictEqual(p.getState().frameIndex, 3);
    assert.strictEqual(p.getState().paused, true);
    p.tick(10);
    assert.strictEqual(ends, 1);
  });

  check('milestone fires once when its frame is reached by playing, never on seek', () => {
    const p = make('explore');
    const hits = [];
    p.on('milestone', (m) => hits.push(m.key));
    p.seekTo(2);
    assert.deepStrictEqual(hits, []);
    p.seekTo(0);
    p.play();
    p.tick(3);
    assert.deepStrictEqual(hits, ['m1']);
    p.tick(1);
    assert.deepStrictEqual(hits, ['m1']);
  });

  check('step clamps at the edges and reports step forward, seek backward', () => {
    const p = make('explore');
    const seen = [];
    p.on('frame', (i, meta) => seen.push([i, meta.kind]));
    p.step(-1);
    assert.strictEqual(p.getState().frameIndex, 0);
    p.step(1);
    p.step(1);
    p.step(-1);
    p.seekTo(3);
    p.step(1);
    assert.strictEqual(p.getState().frameIndex, 3);
    assert.deepStrictEqual(seen, [[1, 'step'], [2, 'step'], [1, 'seek'], [3, 'seek']]);
  });

  check('speed scales the clock and seekToDate uses the month', () => {
    const p = make('explore');
    p.setSpeed(2);
    p.play();
    p.tick(1);
    assert.strictEqual(p.getState().frameIndex, 2);
    p.seekToDate('2020-02-10');
    assert.strictEqual(p.getState().frameIndex, 1);
    p.seekToDate('2031-01-01');
    assert.strictEqual(p.getState().frameIndex, 1);
  });

  check('seek during hold returns to play with full opacity', () => {
    const p = make('ambient');
    p.tick(4.5);
    assert.strictEqual(p.getState().phase, 'hold');
    p.seekTo(1);
    assert.strictEqual(p.getState().phase, 'play');
    assert.strictEqual(p.getState().opacity, 1);
  });

  check('milestone data is well formed and sorted', () => {
    const keys = GROUPS.map((g) => g.key);
    let last = '';
    MILESTONES.forEach((m) => {
      assert.match(m.date, /^\d{4}-\d{2}-\d{2}$/, m.key);
      assert.ok(m.date >= last, `${m.key} out of order`);
      last = m.date;
      assert.ok(keys.includes(m.group), `${m.key} group`);
      assert.ok(['hardfork', 'repo'].includes(m.kind), `${m.key} kind`);
      assert.ok(typeof m.link === 'string' && m.link.length > 0, `${m.key} link`);
    });
    assert.deepStrictEqual(HARD_FORK_KEYS, ['shelley', 'allegra', 'mary', 'alonzo', 'vasil', 'chang', 'plomin', 'vanRossem']);
  });

  done();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
