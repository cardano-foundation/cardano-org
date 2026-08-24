import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import { computeTier } from '@site/src/utils/quizProgress.mjs';
import QuizShare from '../QuizShare';
import styles from './styles.module.css';

// Unbiased Fisher-Yates shuffle (replaces the biased sort-by-random trick)
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const shuffleOptions = (question) => {
  const withIndex = question.options.map((option, index) => ({
    text: option,
    isCorrect: index === question.correctAnswer,
  }));
  const shuffled = shuffle(withIndex);
  return {
    ...question,
    options: shuffled.map((opt) => opt.text),
    correctAnswer: shuffled.findIndex((opt) => opt.isCorrect),
  };
};

const sampleQuestions = (quizData, questionCount) => {
  if (!quizData || !quizData.questions) return [];
  return shuffle(quizData.questions)
    .slice(0, Math.min(questionCount, quizData.questions.length))
    .map(shuffleOptions);
};

const tierLabel = (tier) =>
  ({
    learning: translate({id: 'quiz.tier.learning', message: 'Keep learning'}),
    bronze: translate({id: 'quiz.tier.bronze', message: 'Bronze'}),
    silver: translate({id: 'quiz.tier.silver', message: 'Silver'}),
    gold: translate({id: 'quiz.tier.gold', message: 'Gold'}),
  })[tier];

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
);

const CrossIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

const Quiz = ({
  quizData,
  questionCount = 5,
  allowRetry = true,
  passingScore = 60,
  onRecord = null,
  academyCta = null,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [answerResults, setAnswerResults] = useState([]);
  const [questions, setQuestions] = useState(() => sampleQuestions(quizData, questionCount));
  // 'normal' records progress in hub mode, 'practice' re-runs missed questions unscored.
  // After each practice run the remaining misses are recomputed, so the loop
  // continues until every missed question has been answered correctly once.
  const [mode, setMode] = useState('normal');
  const [missedQuestions, setMissedQuestions] = useState([]);

  const isHubMode = typeof onRecord === 'function';
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const resetRunState = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsQuizComplete(false);
    setAnswerResults([]);
  };

  const handleAnswerSelect = (index) => {
    if (!isAnswered) {
      setSelectedAnswer(index);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setIsAnswered(true);
    if (isCorrect) {
      setScore(score + 1);
    }
    const newResults = [...answerResults];
    newResults[currentQuestionIndex] = isCorrect;
    setAnswerResults(newResults);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Recompute the miss list after every run (normal and practice),
      // that is what makes the mastery loop an actual loop.
      setMissedQuestions(questions.filter((_, i) => answerResults[i] === false));
      if (mode === 'normal' && isHubMode) {
        onRecord(score, totalQuestions);
      }
      setIsQuizComplete(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    const newResults = [...answerResults];
    newResults[currentQuestionIndex] = undefined;
    setAnswerResults(newResults);
  };

  const handleRestartQuiz = () => {
    if (isHubMode) {
      // Hub quizzes resample so replays stay challenging (gold must be earned
      // on a fresh draw). Classic embeds keep their original question set,
      // matching the behavior this component always had.
      setQuestions(sampleQuestions(quizData, questionCount));
    }
    setMode('normal');
    setMissedQuestions([]);
    resetRunState();
  };

  const handlePracticeMistakes = () => {
    setQuestions(missedQuestions.map(shuffleOptions));
    setMode('practice');
    resetRunState();
  };

  if (!quizData || questions.length === 0) {
    return (
      <div className={styles.quizContainer}>
        <p className={styles.noData}>{translate({id: 'quiz.ui.noQuestions', message: 'No quiz questions available.'})}</p>
      </div>
    );
  }

  if (isQuizComplete) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const isPassing = percentage >= passingScore;
    const tier = computeTier(score, totalQuestions);
    const isPractice = mode === 'practice';
    const practiceCleared = isPractice && missedQuestions.length === 0;
    const showSuccess = isPractice ? practiceCleared : isPassing;

    return (
      <div className={styles.quizContainer}>
        <div className={`${styles.resultCard} ${showSuccess ? styles.success : styles.failure}`}>
          <div className={styles.resultIcon}>
            {showSuccess ? <CheckIcon /> : <CrossIcon />}
          </div>
          <h2 className={styles.resultTitle}>
            {isPractice
              ? practiceCleared
                ? translate({id: 'quiz.ui.practiceCleared', message: 'All cleared!'})
                : translate({id: 'quiz.ui.practiceKeepGoing', message: 'Almost there!'})
              : isPassing
                ? translate({id: 'quiz.ui.greatJob', message: 'Great job!'})
                : translate({id: 'quiz.ui.keepLearning', message: 'Keep learning!'})}
          </h2>
          {isHubMode && !isPractice && (
            <div className={`${styles.tierBadge} ${styles[`tier_${tier}`]}`}>{tierLabel(tier)}</div>
          )}
          <div className={styles.scoreDisplay}>
            <span className={styles.scoreNumber}>{percentage}%</span>
            <span className={styles.scoreText}>
              {translate({id: 'quiz.ui.scoreText', message: 'You scored {score} out of {totalQuestions}'}, {score, totalQuestions})}
            </span>
          </div>
          {isHubMode && !isPractice && (
            <div className={styles.emojiGrid} aria-hidden="true">
              {answerResults.map((r) => (r ? '🔵' : '⚪')).join('')}
            </div>
          )}
          <div className={styles.resultActions}>
            {isHubMode && missedQuestions.length > 0 && (
              <button onClick={handlePracticeMistakes} className={styles.secondaryButton}>
                {isPractice
                  ? translate({id: 'quiz.ui.practiceRemaining', message: 'Review remaining mistakes'})
                  : translate({id: 'quiz.ui.practiceMistakes', message: 'Review your mistakes'})}
              </button>
            )}
            <button onClick={handleRestartQuiz} className={styles.primaryButton}>
              {isPractice
                ? translate({id: 'quiz.ui.backToQuiz', message: 'Take the full quiz again'})
                : translate({id: 'quiz.ui.tryAgain', message: 'Try again'})}
            </button>
          </div>
          {isHubMode && !isPractice && tier !== 'learning' && (
            <QuizShare
              quizTitle={quizData.title}
              results={answerResults}
              score={score}
              total={totalQuestions}
              tierLabel={tierLabel(tier)}
            />
          )}
          {isHubMode && !isPractice && academyCta && (
            <Link to={academyCta.href} className={styles.academyCta}>
              {academyCta.label}
            </Link>
          )}
        </div>
      </div>
    );
  }

  const isCorrect = isAnswered && selectedAnswer === currentQuestion.correctAnswer;
  const isIncorrect = isAnswered && selectedAnswer !== currentQuestion.correctAnswer;

  return (
    <div className={styles.quizContainer}>
      <div className={styles.quizHeader}>
        <h2 className={styles.quizTitle}>{quizData.title || 'Quiz'}</h2>
        {mode === 'practice' ? (
          <p className={styles.quizDescription}>
            {translate({id: 'quiz.ui.practiceIntro', message: 'Practice round: these are the questions you missed. This round does not change your score.'})}
          </p>
        ) : (
          quizData.description && <p className={styles.quizDescription}>{quizData.description}</p>
        )}
      </div>

      <div className={`${styles.questionCard} ${isCorrect ? styles.correct : ''} ${isIncorrect ? styles.incorrect : ''}`}>
        {isAnswered && (
          <div className={styles.statusMessage} role="status">
            <div className={styles.statusIcon}>{isCorrect ? <CheckIcon /> : <CrossIcon />}</div>
            {isCorrect ? translate({id: 'quiz.ui.correct', message: 'Correct!'}) : translate({id: 'quiz.ui.incorrect', message: 'Incorrect'})}
          </div>
        )}

        <div className={styles.progressBar}>
          {questions.map((_, index) => {
            const wasCorrect = answerResults[index] === true;
            const wasIncorrect = answerResults[index] === false;
            return (
              <div
                key={index}
                className={`${styles.progressSegment} ${
                  wasCorrect ? styles.correct :
                  wasIncorrect ? styles.incorrect :
                  index === currentQuestionIndex ? styles.active : ''
                }`}
              />
            );
          })}
        </div>

        <h3 className={styles.questionText}>{currentQuestion.question}</h3>

        <div className={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = index === currentQuestion.correctAnswer;
            const showAsCorrect = isAnswered && isCorrectOption;
            const showAsIncorrect = isAnswered && isSelected && !isCorrectOption;
            const shouldShow = !isAnswered || isSelected;
            if (!shouldShow) return null;
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
                aria-pressed={isSelected}
                className={`${styles.optionButton} ${
                  isSelected && !isAnswered ? styles.selected : ''
                } ${showAsCorrect ? styles.correctOption : ''} ${
                  showAsIncorrect ? styles.incorrectOption : ''
                }`}
              >
                <span className={styles.optionLabel}>{String.fromCharCode(65 + index)}</span>
                <span className={styles.optionText}>{option}</span>
              </button>
            );
          })}
        </div>

        {isAnswered && currentQuestion.explanation && (
          <div className={styles.explanation}>
            <h4 className={styles.explanationTitle}>{translate({id: 'quiz.ui.explanation', message: 'Explanation'})}</h4>
            <p className={styles.explanationText}>{currentQuestion.explanation}</p>
            {currentQuestion.sourceUrl && (
              <Link to={currentQuestion.sourceUrl} className={styles.sourceLink} target="_blank" rel="noopener noreferrer">
                {translate({id: 'quiz.ui.learnMore', message: 'Learn more'})}
              </Link>
            )}
          </div>
        )}

        <div className={styles.actionButtons}>
          {!isAnswered ? (
            <button onClick={handleCheckAnswer} disabled={selectedAnswer === null} className={styles.checkButton}>
              {translate({id: 'quiz.ui.checkAnswer', message: 'Check answer'})}
            </button>
          ) : (
            <>
              {isIncorrect && allowRetry && (
                <button onClick={handleTryAgain} className={styles.secondaryButton}>
                  {translate({id: 'quiz.ui.tryAgain', message: 'Try again'})}
                </button>
              )}
              <button onClick={handleNextQuestion} className={styles.primaryButton}>
                {currentQuestionIndex + 1 < totalQuestions
                  ? translate({id: 'quiz.ui.nextQuestion', message: 'Next question'})
                  : translate({id: 'quiz.ui.finishQuiz', message: 'Finish quiz'})}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
