import {translate} from '@docusaurus/Translate';

// Shared tier label map: Quiz uses all four (including the non-tier
// "learning" result), QuizHub only needs bronze/silver/gold for its
// saved-progress chips.
export function getTierLabels() {
  return {
    learning: translate({id: 'quiz.tier.learning', message: 'Keep learning'}),
    bronze: translate({id: 'quiz.tier.bronze', message: 'Bronze'}),
    silver: translate({id: 'quiz.tier.silver', message: 'Silver'}),
    gold: translate({id: 'quiz.tier.gold', message: 'Gold'}),
  };
}
