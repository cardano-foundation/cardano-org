import React, { useState } from 'react';
import Quiz from '../Quiz';
import useModalA11y from '@site/src/utils/useModalA11y';
import styles from './styles.module.css';

const QuizModal = ({ quizData, buttonText = "Test Your Knowledge", questionCount = 5, allowRetry = true, passingScore = 60 }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  // Locks scroll, moves + traps + restores focus, and closes on Escape.
  const dialogRef = useModalA11y(isOpen, handleClose);

  return (
    <>
      <button onClick={handleOpen} className={styles.startButton}>
        {buttonText}
      </button>

      {isOpen && (
        // Backdrop click-outside-to-close. Keyboard equivalent is the
        // document-level Escape handler above plus the dedicated close
        // button, both of which are accessible to keyboard users.
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
          className={styles.modalOverlay}
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <div
            className={styles.modalContent}
            role="dialog"
            aria-modal="true"
            aria-label="Quiz"
            ref={dialogRef}
            tabIndex={-1}
          >
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
