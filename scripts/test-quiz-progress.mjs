import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeTier,
  emptyProgress,
  recordResult,
  isValidProgress,
  totalPoints,
} from '../src/utils/quizProgress.mjs';

test('tier boundaries', () => {
  assert.equal(computeTier(0, 5), 'learning');
  assert.equal(computeTier(2, 5), 'learning'); // 40 percent
  assert.equal(computeTier(3, 5), 'bronze');   // 60 percent
  assert.equal(computeTier(4, 5), 'silver');   // 80 percent
  assert.equal(computeTier(5, 5), 'gold');     // gold only at 100 percent
  assert.equal(computeTier(0, 0), 'learning'); // guard against empty runs
});

test('empty progress is valid', () => {
  const p = emptyProgress();
  assert.equal(p.v, 1);
  assert.ok(isValidProgress(p));
});

test('recordResult keeps the best score and counts attempts', () => {
  let p = emptyProgress();
  p = recordResult(p, 'security', 4, 5, '2026-08-24');
  p = recordResult(p, 'security', 2, 5, '2026-08-25');
  assert.equal(p.quizzes.security.best, 4);
  assert.equal(p.quizzes.security.attempts, 2);
  assert.equal(p.quizzes.security.tier, 'silver');
  assert.equal(p.quizzes.security.lastPlayed, '2026-08-25');
  assert.ok(isValidProgress(p));
});

test('tampering with any persisted field fails validation', () => {
  let p = emptyProgress();
  p = recordResult(p, 'security', 3, 5, '2026-08-24');
  const tamper = (patch) => ({
    ...p,
    quizzes: { security: { ...p.quizzes.security, ...patch } },
  });
  assert.equal(isValidProgress(tamper({ best: 5, tier: 'gold' })), false);
  assert.equal(isValidProgress(tamper({ tier: 'gold' })), false);      // tier no longer matches best/outOf
  assert.equal(isValidProgress(tamper({ attempts: 99 })), false);      // attempts is canonicalized too
  assert.equal(isValidProgress(tamper({ lastPlayed: '2020-01-01' })), false);
});

test('structurally invalid progress fails validation', () => {
  assert.equal(isValidProgress(null), false);
  assert.equal(isValidProgress({}), false);
  assert.equal(isValidProgress([]), false);
  assert.equal(isValidProgress({ v: 1, quizzes: [], check: 'x' }), false);   // array is not a valid map
  assert.equal(isValidProgress({ v: 1, quizzes: null, check: 'x' }), false);
  const good = recordResult(emptyProgress(), 'a', 3, 5, '2026-08-24');
  const bestOverOutOf = { ...good, quizzes: { a: { ...good.quizzes.a, best: 9 } } };
  assert.equal(isValidProgress(bestOverOutOf), false); // best must stay <= outOf
});

test('totalPoints sums best over outOf', () => {
  let p = emptyProgress();
  p = recordResult(p, 'a', 3, 5, '2026-08-24');
  p = recordResult(p, 'b', 5, 5, '2026-08-24');
  assert.deepEqual(totalPoints(p), { scored: 8, possible: 10 });
});
