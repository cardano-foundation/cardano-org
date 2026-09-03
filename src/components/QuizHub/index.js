import React from 'react';
import clsx from 'clsx';
import {translate} from '@docusaurus/Translate';
import QuizModal from '@site/src/components/QuizModal';
import useQuizProgress from '@site/src/utils/useQuizProgress';
import { totalPoints } from '@site/src/utils/quizProgress.mjs';
import { getQuizCatalog } from '@site/src/data/quiz/catalog';
import { getAcademyCta } from '@site/src/data/quiz/academy';
import { getTierLabels } from '@site/src/data/quiz/tierLabels';
import { getCatalogStats, estimateQuizMinutes } from './catalogStats';
import styles from './styles.module.css';

const difficultyLabels = () => ({
  beginner: translate({id: 'quiz.difficulty.beginner', message: 'Beginner'}),
  intermediate: translate({id: 'quiz.difficulty.intermediate', message: 'Intermediate'}),
  advanced: translate({id: 'quiz.difficulty.advanced', message: 'Advanced'}),
});

// Sits directly under the hero, above the card grid. Always renders (never
// null) so its footprint never appears out of nowhere: on the server and on
// the very first client render `progress` is the empty default from
// useLocalStorage, the real value swaps in after mount. The min-height on
// the wrapping styles.progressBand covers that swap without shifting the
// grid below it.
const ProgressBand = ({ progress, catalogStats, onReset }) => {
  const tiers = getTierLabels();
  const played = Object.keys(progress.quizzes).length;

  if (played === 0) {
    return (
      <div className={styles.progressBand}>
        <p className={styles.progressInvite}>
          {translate({id: 'quiz.hub.progressInvite', message: 'Play a quiz to start earning medals. Your progress stays in this browser.'})}
        </p>
      </div>
    );
  }

  const tierCounts = { gold: 0, silver: 0, bronze: 0 };
  Object.values(progress.quizzes).forEach((quiz) => {
    if (quiz.tier in tierCounts) tierCounts[quiz.tier] += 1;
  });
  const scored = totalPoints(progress).scored;

  return (
    <div className={styles.progressBand}>
      <div className={styles.medalRow}>
        <span className={clsx(styles.medal, styles.medal_gold)}>
          <span className={styles.medalDot} aria-hidden="true" />
          {translate({id: 'quiz.hub.medalsGold', message: '{count} gold'}, {count: tierCounts.gold})}
        </span>
        <span className={clsx(styles.medal, styles.medal_silver)}>
          <span className={styles.medalDot} aria-hidden="true" />
          {translate({id: 'quiz.hub.medalsSilver', message: '{count} silver'}, {count: tierCounts.silver})}
        </span>
        <span className={clsx(styles.medal, styles.medal_bronze)}>
          <span className={styles.medalDot} aria-hidden="true" />
          {translate({id: 'quiz.hub.medalsBronze', message: '{count} bronze'}, {count: tierCounts.bronze})}
        </span>
      </div>
      <p className={styles.progressSummary}>
        {translate(
          {id: 'quiz.hub.quizzesCompleted', message: '{count} of {total} quizzes completed'},
          {count: played, total: catalogStats.quizCount},
        )}
        {' · '}
        {translate(
          {id: 'quiz.hub.points', message: '{scored} of {possible} points earned'},
          {scored, possible: catalogStats.totalRunQuestions},
        )}
      </p>
      <button
        type="button"
        onClick={() => {
          if (window.confirm(translate({id: 'quiz.hub.resetConfirm', message: 'Delete your quiz progress? This cannot be undone.'}))) {
            onReset();
          }
        }}
        className={styles.resetButton}
      >
        {translate({id: 'quiz.hub.reset', message: 'Delete progress'})}
      </button>
    </div>
  );
};

const QuizCard = ({ entry, saved, tiers, difficulties, onRecord }) => {
  const data = entry.getData();
  // Only bronze/silver/gold ever appear as a tier chip here, "learning"
  // progress is not tier-badged on the hub cards.
  const savedTier = saved && saved.tier !== 'learning' ? saved.tier : null;
  const minutes = estimateQuizMinutes(data.questionCount);

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>{data.title}</h3>
      <div className={styles.badgeRow}>
        <span className={clsx(styles.badge, styles[`badge_${data.difficulty}`])}>
          {difficulties[data.difficulty]}
        </span>
        <span className={clsx(styles.badge, styles.badgeNeutral)}>
          {translate({id: 'quiz.hub.timeEstimate', message: '~{minutes} min'}, {minutes})}
        </span>
        <span className={clsx(styles.badge, styles.badgeNeutral)}>
          {translate({id: 'quiz.hub.questionCount', message: '{count} questions'}, {count: data.questionCount})}
        </span>
      </div>
      <p className={styles.cardDescription}>{data.description}</p>
      {saved && (
        <p className={styles.cardProgress}>
          {savedTier && (
            <span className={clsx(styles.tierChip, styles[`tier_${savedTier}`])}>
              {tiers[savedTier]}
            </span>
          )}
          {translate({id: 'quiz.hub.bestScore', message: 'Best {best} of {outOf}'}, {best: saved.best, outOf: saved.outOf})}
        </p>
      )}
      <QuizModal
        quizData={data}
        questionCount={data.questionCount}
        allowRetry={false}
        onRecord={onRecord}
        academyCta={getAcademyCta(entry.academyKey, entry.id)}
        buttonText={translate({id: 'quiz.hub.start', message: 'Start quiz'})}
        buttonClassName={styles.cardCta}
      />
    </div>
  );
};

// Owns the single quiz progress instance for the page. Every quiz gets a
// scoped record callback, so finishing a run updates the hub immediately
// (tier chips and points re-render without a reload).
const QuizHub = () => {
  const { progress, record, reset } = useQuizProgress();
  const catalog = getQuizCatalog();
  const catalogStats = getCatalogStats();
  const tiers = getTierLabels();
  const difficulties = difficultyLabels();

  return (
    <>
      <ProgressBand progress={progress} catalogStats={catalogStats} onReset={reset} />
      <div className={styles.grid}>
        {catalog.map((entry) => (
          <QuizCard
            key={entry.id}
            entry={entry}
            saved={progress.quizzes[entry.id]}
            tiers={tiers}
            difficulties={difficulties}
            onRecord={(correct, total) => record(entry.id, correct, total)}
          />
        ))}
      </div>
    </>
  );
};

export default QuizHub;
