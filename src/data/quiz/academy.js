// Academy funnel targets. Course URLs verified against the live academy
// catalog (see vault note, research date 2026-08-24). Falls back to the
// academy landing page for topics without a matching course.
import {translate} from '@docusaurus/Translate';

const ACADEMY_LANDING = 'https://cardanofoundation.org/en/academy';

// Filled from the research in step 1 (see .superpowers/sdd/quiz-hub-phase1-plan/
// task-7-report.md for the full course catalog). Landing page is the safe
// default. security and wallets: no course in the current catalog covers
// personal wallet custody, seed phrases, or key security, so both stay on
// the landing page. basics, staking, governance, and technical match real
// courses. landing: the generic Academy catalog, used by the hub banner CTA
// which is not tied to any single quiz or course.
const COURSE_URLS = {
  security: ACADEMY_LANDING,
  basics: 'https://cardanofoundation.org/en/academy/course/blockchain-fundamentals',
  staking: 'https://cardanofoundation.org/en/academy/course/staking-rewards-calculation',
  wallets: ACADEMY_LANDING,
  governance: 'https://cardanofoundation.org/en/academy/course/intro-cardano-governance',
  technical: 'https://cardanofoundation.org/en/academy/course/aiken-eutxo-smart-contracts-cardano',
  landing: ACADEMY_LANDING,
};

export function getAcademyCta(academyKey, quizId) {
  const url = new URL(COURSE_URLS[academyKey] || ACADEMY_LANDING);
  url.searchParams.set('utm_source', 'cardano_org');
  url.searchParams.set('utm_medium', 'quiz');
  url.searchParams.set('utm_campaign', 'quiz_hub');
  url.searchParams.set('utm_content', quizId);
  return {
    href: url.toString(),
    // Short label for the result screen link, where the surrounding card
    // already makes the destination context clear. ariaLabel names the
    // destination explicitly for assistive tech, since the link leaves the
    // site and the short visible text alone does not say where it goes.
    label: translate({id: 'quiz.academy.cta', message: 'Go deeper'}),
    ariaLabel: translate({id: 'quiz.academy.ctaAriaLabel', message: 'Go deeper at the Cardano Academy'}),
  };
}
