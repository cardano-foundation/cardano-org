import React, { useState, useEffect } from 'react';
import Quiz from '../Quiz';
import styles from './styles.module.css';

const QuizModal = ({ quizData, buttonText = "Test Your Knowledge", questionCount = 5, allowRetry = true, passingScore = 60 }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <button onClick={handleOpen} className={styles.startButton}>
        {buttonText}
      </button>

      {isOpen && (
        <div className={styles.modalOverlay} onClick={handleClose}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={handleClose} 
              className={styles.closeButton}
              aria-label="Close quiz"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
            <div className={styles.quizWrapper}>
              <Quiz 
                quizData={quizData} 
                questionCount={questionCount}
                allowRetry={allowRetry}
                passingScore={passingScore}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuizModal;
