import { getQuizCatalog } from '@site/src/data/quiz/catalog';

// Aggregate numbers derived straight from the quiz catalog, computed fresh
// on every call. Nothing here reads localStorage or touches React state, so
// the same numbers come out on the server and on the client, which keeps
// the hero stat strip and the progress band's catalog maximum from ever
// drifting out of sync with the actual quiz data.
export function getCatalogStats() {
  const quizzes = getQuizCatalog().map((entry) => entry.getData());
  const quizCount = quizzes.length;
  const totalPoolQuestions = quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);
  const totalRunQuestions = quizzes.reduce((sum, quiz) => sum + quiz.questionCount, 0);
  // Round to the nearest 5 minutes so the hero number stays a clean read.
  const estimatedMinutes = Math.round((totalRunQuestions * 30) / 60 / 5) * 5;
  return { quizCount, totalPoolQuestions, totalRunQuestions, estimatedMinutes };
}

// Per-quiz time estimate for the card badge row, rounded to the nearest
// minute (unlike the coarser 5-minute rounding used for the hero total).
export function estimateQuizMinutes(questionCount) {
  return Math.max(1, Math.round((questionCount * 30) / 60));
}
