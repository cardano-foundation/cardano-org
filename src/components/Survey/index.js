import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';

const Survey = ({ surveyData, questionCount }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [totalScores, setTotalScores] = useState({});

  const [questions] = useState(() => {
    if (!surveyData?.questions) return [];
    const all = [...surveyData.questions];
    if (questionCount && questionCount < all.length) {
      return all.sort(() => Math.random() - 0.5).slice(0, questionCount);
    }
    return all;
  });

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];

  const handleSelect = (index) => {
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const option = currentQuestion.options[selectedAnswer];
    const newScores = { ...totalScores };
    if (option.scores) {
      Object.entries(option.scores).forEach(([outcomeId, weight]) => {
        newScores[outcomeId] = (newScores[outcomeId] || 0) + weight;
      });
    }
    setTotalScores(newScores);

    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setIsComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsComplete(false);
    setTotalScores({});
  };

  if (!surveyData || questions.length === 0) {
    return null;
  }

  if (isComplete) {
    const winningId = Object.entries(totalScores).sort((a, b) => b[1] - a[1])[0]?.[0];
    const outcome = surveyData.outcomes.find((o) => o.id === winningId) || surveyData.outcomes[0];

    return (
      <div className={styles.surveyContainer}>
        <div className={styles.resultCard}>
          <h2 className={styles.resultTitle}>{outcome.title}</h2>
          <p className={styles.resultDescription}>{outcome.description}</p>
          <div className={styles.resultActions}>
            <Link className="button button--primary button--lg" to={outcome.ctaLink}>
              {outcome.ctaText}
            </Link>
            <button onClick={handleRestart} className={styles.restartButton}>
              {translate({id: 'survey.ui.startOver', message: 'Start over'})}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.surveyContainer}>
      <div className={styles.questionCard}>
        <div className={styles.progressBar}>
          {questions.map((_, index) => (
            <div
              key={index}
              className={`${styles.progressSegment} ${
                index < currentQuestionIndex ? styles.done :
                index === currentQuestionIndex ? styles.active : ''
              }`}
            />
          ))}
        </div>

        <h3 className={styles.questionText}>{currentQuestion.question}</h3>

        <div className={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className={`${styles.optionButton} ${selectedAnswer === index ? styles.selected : ''}`}
            >
              <span className={styles.optionLabel}>
                {String.fromCharCode(65 + index)}
              </span>
              <span className={styles.optionText}>{option.text}</span>
            </button>
          ))}
        </div>

        <div className={styles.actionButtons}>
          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className={styles.nextButton}
          >
            {currentQuestionIndex + 1 < totalQuestions
              ? translate({id: 'survey.ui.next', message: 'Next'})
              : translate({id: 'survey.ui.seeResult', message: 'See your result'})}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Survey;
