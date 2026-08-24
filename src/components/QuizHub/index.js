import React from 'react';
import {translate} from '@docusaurus/Translate';
import QuizModal from '@site/src/components/QuizModal';
import useQuizProgress from '@site/src/utils/useQuizProgress';
import { totalPoints } from '@site/src/utils/quizProgress.mjs';
import { getQuizCatalog } from '@site/src/data/quiz/catalog';
import { getAcademyCta } from '@site/src/data/quiz/academy';
import { getTierLabels } from '@site/src/data/quiz/tierLabels';
import styles from './styles.module.css';

// Only bronze/silver/gold ever appear here, "learning" progress is not
// tier-badged on the hub cards.
const difficultyLabels = () => ({
  beginner: translate({id: 'quiz.difficulty.beginner', message: 'Beginner'}),
  intermediate: translate({id: 'quiz.difficulty.intermediate', message: 'Intermediate'}),
  advanced: translate({id: 'quiz.difficulty.advanced', message: 'Advanced'}),
});

const ProgressPanel = ({ progress, onReset }) => {
  const points = totalPoints(progress);
  const played = Object.keys(progress.quizzes).length;
  if (played === 0) return null;
  return (
    <div className={styles.progressPanel}>
      <p className={styles.points}>
        {translate({id: 'quiz.hub.points', message: '{scored} of {possible} points earned'}, points)}
      </p>
      <button
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

// Owns the single quiz progress instance for the page. Every quiz gets a
// scoped record callback, so finishing a run updates the hub immediately
// (tier chips and points re-render without a reload).
const QuizHub = () => {
  const { progress, record, reset } = useQuizProgress();
  const catalog = getQuizCatalog();
  const tiers = getTierLabels();
  const difficulties = difficultyLabels();

  return (
    <div className={styles.hub}>
      <ProgressPanel progress={progress} onReset={reset} />
      <div className={styles.grid}>
        {catalog.map((entry) => {
          const data = entry.getData();
          const saved = progress.quizzes[entry.id];
          const savedTier = saved && saved.tier !== 'learning' ? saved.tier : null;
          return (
            <div key={entry.id} className={styles.card}>
              {savedTier && (
                <span className={`${styles.tierChip} ${styles[`tier_${savedTier}`]}`}>
                  {tiers[savedTier]}
                </span>
              )}
              <h3 className={styles.cardTitle}>{data.title}</h3>
              <p className={styles.cardMeta}>
                {difficulties[data.difficulty]}
                {' · '}
                {translate({id: 'quiz.hub.questionCount', message: '{count} questions'}, {count: data.questionCount})}
              </p>
              <p className={styles.cardDescription}>{data.description}</p>
              <QuizModal
                quizData={data}
                questionCount={data.questionCount}
                allowRetry={false}
                onRecord={(correct, total) => record(entry.id, correct, total)}
                academyCta={getAcademyCta(entry.academyKey, entry.id)}
                buttonText={translate({id: 'quiz.hub.start', message: 'Start quiz'})}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizHub;
