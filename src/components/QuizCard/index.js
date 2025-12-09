import React from 'react';
import QuizModal from '../QuizModal';
import styles from './styles.module.css';

/**
 * QuizCard - A call-to-action card component for quizzes
 * 
 * @param {Object} props
 * @param {Object} props.quizData - Quiz data object
 * @param {string} props.title - Card title (default: 'Test Your Knowledge')
 * @param {string} props.description - Card description
 * @param {string} props.buttonText - Button text (default: 'Start Quiz')
 * @param {number} props.questionCount - Number of questions (default: 5)
 * @param {number} props.passingScore - Passing score percentage (default: 60)
 * @param {boolean} props.allowRetry - Allow retry on incorrect answers (default: true)
 * @param {boolean} props.showDot - Show animated attention dot (default: false)
 */
const QuizCard = ({ 
  quizData,
  title = 'Test Your Knowledge',
  description,
  buttonText = 'Start Quiz',
  questionCount = 5,
  passingScore = 60,
  allowRetry = true,
  showDot = false
}) => {
  return (
    <div className={styles.card}>
      {showDot && (
        <>
          <div className={`${styles.dot} ${styles.dot1}`} />
          <div className={`${styles.dot} ${styles.dot2}`} />
          <div className={`${styles.dot} ${styles.dot3}`} />
        </>
      )}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      <QuizModal 
        quizData={quizData} 
        buttonText={buttonText}
        questionCount={questionCount} 
        passingScore={passingScore} 
        allowRetry={allowRetry}
      />
    </div>
  );
};

export default QuizCard;
