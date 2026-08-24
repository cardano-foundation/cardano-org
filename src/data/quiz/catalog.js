import { getQuizData as getSecurityQuiz } from './generated/security';

// Every quiz shown on the /quiz hub. questionCount and difficulty live in
// the quiz data itself (via the generator), this list only wires ids to
// data and academy targets. New quizzes are added here once their questions
// have passed the documented double fact-check.
export function getQuizCatalog() {
  return [
    { id: 'security', getData: getSecurityQuiz, academyKey: 'security' },
  ];
}
