import React, { useState } from 'react';
import {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';

const Quiz = ({ quizData, questionCount = 5, allowRetry = true, passingScore = 60 }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [answerResults, setAnswerResults] = useState([]);

  // Select random questions and shuffle their answers
  const [questions] = useState(() => {
    if (!quizData || !quizData.questions) return [];
    const shuffled = [...quizData.questions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(questionCount, quizData.questions.length));
    
    // Shuffle answers for each question and track the new correct index
    return selected.map(question => {
      const optionsWithIndex = question.options.map((option, index) => ({
        text: option,
        isCorrect: index === question.correctAnswer
      }));
      
      // Shuffle the options
      const shuffledOptions = [...optionsWithIndex].sort(() => Math.random() - 0.5);
      
      return {
        ...question,
        options: shuffledOptions.map(opt => opt.text),
        correctAnswer: shuffledOptions.findIndex(opt => opt.isCorrect)
      };
    });
  });

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

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
    
    // Record the result for this question
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
      setIsQuizComplete(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    
    // Clear the result for this question since we're retrying
    const newResults = [...answerResults];
    newResults[currentQuestionIndex] = undefined;
    setAnswerResults(newResults);
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsQuizComplete(false);
    setAnswerResults([]);
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

    return (
      <div className={styles.quizContainer}>
        <div className={`${styles.resultCard} ${isPassing ? styles.success : styles.failure}`}>
          <div className={styles.resultIcon}>
            {isPassing ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            )}
          </div>
          <h2 className={styles.resultTitle}>
            {isPassing ? translate({id: 'quiz.ui.greatJob', message: 'Great job!'}) : translate({id: 'quiz.ui.keepLearning', message: 'Keep learning!'})}
          </h2>
          <div className={styles.scoreDisplay}>
            <span className={styles.scoreNumber}>{percentage}%</span>
            <span className={styles.scoreText}>
              {translate({id: 'quiz.ui.scoreText', message: 'You scored {score} out of {totalQuestions}'}, {score, totalQuestions})}
            </span>
          </div>
          <button onClick={handleRestartQuiz} className={styles.primaryButton}>
            {translate({id: 'quiz.ui.tryAgain', message: 'Try again'})}
          </button>
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
        {quizData.description && (
          <p className={styles.quizDescription}>{quizData.description}</p>
        )}
      </div>

      <div className={`${styles.questionCard} ${isCorrect ? styles.correct : ''} ${isIncorrect ? styles.incorrect : ''}`}>
        {/* Status Message */}
        {isAnswered && (
          <div className={styles.statusMessage}>
            <div className={styles.statusIcon}>
              {isCorrect ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              )}
            </div>
            {isCorrect ? translate({id: 'quiz.ui.correct', message: 'Correct!'}) : translate({id: 'quiz.ui.incorrect', message: 'Incorrect'})}
          </div>
        )}

        {/* Progress Bar */}
        <div className={styles.progressBar}>
          {questions.map((_, index) => {
            const isAnsweredQuestion = answerResults[index] !== undefined;
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

        {/* Question */}
        <h3 className={styles.questionText}>{currentQuestion.question}</h3>

        {/* Answer Options */}
        <div className={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = index === currentQuestion.correctAnswer;
            const showAsCorrect = isAnswered && isCorrectOption;
            const showAsIncorrect = isAnswered && isSelected && !isCorrectOption;
            
            // Only show selected answer when answered
            const shouldShow = !isAnswered || isSelected;
            
            if (!shouldShow) return null;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
                className={`${styles.optionButton} ${
                  isSelected && !isAnswered ? styles.selected : ''
                } ${showAsCorrect ? styles.correctOption : ''} ${
                  showAsIncorrect ? styles.incorrectOption : ''
                }`}
              >
                <span className={styles.optionLabel}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className={styles.optionText}>{option}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {isAnswered && currentQuestion.explanation && (
          <div className={styles.explanation}>
            <h4 className={styles.explanationTitle}>{translate({id: 'quiz.ui.explanation', message: 'Explanation'})}</h4>
            <p className={styles.explanationText}>{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          {!isAnswered ? (
            <button
              onClick={handleCheckAnswer}
              disabled={selectedAnswer === null}
              className={styles.checkButton}
            >
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
                {currentQuestionIndex + 1 < totalQuestions ? translate({id: 'quiz.ui.nextQuestion', message: 'Next question'}) : translate({id: 'quiz.ui.finishQuiz', message: 'Finish quiz'})}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
