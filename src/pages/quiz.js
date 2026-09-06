import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import SiteHero from '@site/src/components/Layout/SiteHero';
import BackgroundWrapper from '@site/src/components/Layout/BackgroundWrapper';
import BoundaryBox from '@site/src/components/Layout/BoundaryBox';
import SpacerBox from '@site/src/components/Layout/SpacerBox';
import OpenGraphInfo from '@site/src/components/Layout/OpenGraphInfo';
import QuizHub from '@site/src/components/QuizHub';
import { getAcademyCta } from '@site/src/data/quiz/academy';
import styles from './quiz.module.css';

// /quiz: the knowledge quiz hub. All progress lives in the visitor's
// localStorage, nothing is sent anywhere (see concept in the project notes).
export default function QuizPage() {
  const academy = getAcademyCta('landing', 'hub-banner');
  return (
    <Layout
      title={translate({id: 'quiz.page.title', message: 'Cardano Quiz: Test Your Knowledge'})}
      description={translate({id: 'quiz.page.description', message: 'How well do you know Cardano? Take free quizzes on the basics, wallets, security, staking, governance and the tech underneath. No sign-up, your progress stays in your browser.'})}
    >
      <OpenGraphInfo pageName="quiz" />
      <SiteHero
        title={translate({id: 'quiz.hero.title', message: 'Test your knowledge'})}
        description={translate({id: 'quiz.hero.description', message: 'How well do you know Cardano? Pick a quiz and find out. No sign-up needed, everything stays in your browser.'})}
        bannerType="starburst"
      />
      <BackgroundWrapper backgroundType="zoom">
        <BoundaryBox>
          <QuizHub />
          <SpacerBox size="medium" />
          <p className={styles.learnLink}>
            <Link to="/learn">
              {translate({id: 'quiz.hub.backToLearn', message: 'Back to the learning path'})}
            </Link>
          </p>
          <div className={styles.academyBanner}>
            <p>{translate({id: 'quiz.hub.academyBanner', message: 'Ready for the next step? The Cardano Academy offers free courses with real certificates.'})}</p>
            {/* The paragraph above already names the Academy, so the button
                stays short. aria-label carries the destination for anyone
                reading links out of context. */}
            <Link to={academy.href} className={styles.academyBannerButton} aria-label={academy.ariaLabel}>
              {translate({id: 'quiz.hub.academyBannerCta', message: 'Go deeper'})}
            </Link>
          </div>
        </BoundaryBox>
      </BackgroundWrapper>
    </Layout>
  );
}
