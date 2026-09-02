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

// Academy link with the site's UTM scheme. Every funnel into the Academy
// (quiz result screens, the learn hub) builds its URL here so the campaign
// parameters cannot drift between pages.
export function academyUrl(academyKey, {medium, campaign, content}) {
  const url = new URL(COURSE_URLS[academyKey] || ACADEMY_LANDING);
  url.searchParams.set('utm_source', 'cardano_org');
  url.searchParams.set('utm_medium', medium);
  url.searchParams.set('utm_campaign', campaign);
  if (content) {
    url.searchParams.set('utm_content', content);
  }
  return url.toString();
}

export function getAcademyCta(academyKey, quizId) {
  return {
    href: academyUrl(academyKey, {medium: 'quiz', campaign: 'quiz_hub', content: quizId}),
    // Short label for the result screen link, where the surrounding card
    // already makes the destination context clear. ariaLabel names the
    // destination explicitly for assistive tech, since the link leaves the
    // site and the short visible text alone does not say where it goes.
    label: translate({id: 'quiz.academy.cta', message: 'Go deeper'}),
    // Alternative label for a strong result. Someone who just answered
    // nearly everything correctly does not need the generic invitation to
    // learn more, so the CTA names the concrete payoff instead: the
    // Academy's courses end in a real certificate. Naming the destination
    // makes this label self-explanatory, so it needs no separate aria-label.
    certifiedLabel: translate({id: 'quiz.academy.ctaCertified', message: 'Get certified at the Cardano Academy'}),
    ariaLabel: translate({id: 'quiz.academy.ctaAriaLabel', message: 'Go deeper at the Cardano Academy'}),
  };
}
