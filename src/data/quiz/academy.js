// Academy funnel targets. Course URLs verified against the live academy
// catalog (see vault note, research date 2026-08-24). Falls back to the
// academy landing page for topics without a matching course.
import {translate} from '@docusaurus/Translate';

const ACADEMY_LANDING = 'https://cardanofoundation.org/en/academy';

// Filled from the research in step 1. Landing page is the safe default.
// security: no course in the current catalog covers wallet/key security,
// so it stays on the landing page. basics and staking match real courses.
// landing: the generic Academy catalog, used by the hub banner CTA which
// is not tied to any single quiz or course.
const COURSE_URLS = {
  security: ACADEMY_LANDING,
  basics: 'https://cardanofoundation.org/en/academy/course/blockchain-fundamentals',
  staking: 'https://cardanofoundation.org/en/academy/course/staking-rewards-calculation',
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
    label: translate({id: 'quiz.academy.cta', message: 'Go deeper with the Cardano Academy'}),
  };
}
