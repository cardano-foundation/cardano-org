import { getQuizData as getBasicsQuiz } from './generated/basics';
import { getQuizData as getWalletsQuiz } from './generated/wallets';
import { getQuizData as getSecurityQuiz } from './generated/security';
import { getQuizData as getStakingQuiz } from './generated/staking';
import { getQuizData as getGovernanceQuiz } from './generated/governance';
import { getQuizData as getTechnicalQuiz } from './generated/technical';

// Every quiz shown on the /quiz hub. questionCount and difficulty live in
// the quiz data itself (via the generator), this list only wires ids to
// data and academy targets. New quizzes are added here once their questions
// have passed the documented double fact-check. Order is beginner topics
// first, then intermediate, then advanced.
export function getQuizCatalog() {
  return [
    { id: 'basics', getData: getBasicsQuiz, academyKey: 'basics' },
    { id: 'wallets', getData: getWalletsQuiz, academyKey: 'wallets' },
    { id: 'security', getData: getSecurityQuiz, academyKey: 'security' },
    { id: 'staking', getData: getStakingQuiz, academyKey: 'staking' },
    { id: 'governance', getData: getGovernanceQuiz, academyKey: 'governance' },
    { id: 'technical', getData: getTechnicalQuiz, academyKey: 'technical' },
  ];
}
