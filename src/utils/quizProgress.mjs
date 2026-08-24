// Pure quiz progress logic, dependency-free on purpose:
// used by the React hooks in the browser bundle and by node:test directly.
// The checksum is casual tamper detection, NOT a signature and NOT security:
// the salt ships in the public bundle and anyone can recompute the hash.
// It only discards hand-edited localStorage values on load.

const SALT = 'cardano-quiz-v1';
const TIERS = ['learning', 'bronze', 'silver', 'gold'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function computeTier(correct, total) {
  if (!total) return 'learning';
  const pct = (correct / total) * 100;
  if (pct === 100) return 'gold';
  if (pct >= 80) return 'silver';
  if (pct >= 60) return 'bronze';
  return 'learning';
}

function djb2(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i += 1) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0;
  }
  return hash.toString(36);
}

// Every persisted field takes part in the checksum. Adding a field to the
// stored shape means adding it here, otherwise it becomes silently editable.
function canonical(quizzes) {
  const keys = Object.keys(quizzes).sort();
  return JSON.stringify(
    keys.map((k) => {
      const q = quizzes[k];
      return [k, q.best, q.outOf, q.tier, q.attempts, q.lastPlayed];
    }),
  );
}

function withChecksum(progress) {
  return { ...progress, check: djb2(SALT + canonical(progress.quizzes)) };
}

export function emptyProgress() {
  return withChecksum({ v: 1, quizzes: {} });
}

function isValidEntry(q) {
  return (
    q !== null &&
    typeof q === 'object' &&
    !Array.isArray(q) &&
    Number.isInteger(q.best) &&
    Number.isInteger(q.outOf) &&
    q.best >= 0 &&
    q.outOf > 0 &&
    q.best <= q.outOf &&
    TIERS.includes(q.tier) &&
    q.tier === computeTier(q.best, q.outOf) &&
    Number.isInteger(q.attempts) &&
    q.attempts >= 1 &&
    typeof q.lastPlayed === 'string' &&
    DATE_RE.test(q.lastPlayed)
  );
}

export function isValidProgress(progress) {
  if (progress === null || typeof progress !== 'object' || Array.isArray(progress)) return false;
  if (progress.v !== 1) return false;
  const { quizzes } = progress;
  if (quizzes === null || typeof quizzes !== 'object' || Array.isArray(quizzes)) return false;
  if (!Object.values(quizzes).every(isValidEntry)) return false;
  return progress.check === djb2(SALT + canonical(quizzes));
}

export function recordResult(progress, quizId, correct, total, dateStr) {
  const prev = progress.quizzes[quizId];
  const best = prev ? Math.max(prev.best, correct) : correct;
  return withChecksum({
    ...progress,
    quizzes: {
      ...progress.quizzes,
      [quizId]: {
        best,
        outOf: total,
        tier: computeTier(best, total),
        attempts: (prev ? prev.attempts : 0) + 1,
        lastPlayed: dateStr,
      },
    },
  });
}

export function totalPoints(progress) {
  return Object.values(progress.quizzes).reduce(
    (acc, q) => ({ scored: acc.scored + q.best, possible: acc.possible + q.outOf }),
    { scored: 0, possible: 0 },
  );
}
