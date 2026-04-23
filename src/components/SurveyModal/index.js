import React, { useState, useEffect } from 'react';
import Survey from '../Survey';
import styles from './styles.module.css';

const SurveyModal = ({ surveyData, buttonText = "Start", questionCount, buttonClassName }) => {
  const [isOpen, setIsOpen] = useState(false);

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

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={buttonClassName || styles.startButton}
      >
        {buttonText}
      </button>

      {isOpen && (
        // Backdrop click-outside-to-close. Keyboard equivalent is the
        // document-level Escape handler above plus the dedicated close
        // button, both of which are accessible to keyboard users.
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
          className={styles.modalOverlay}
          onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
        >
          <div
            className={styles.modalContent}
            role="dialog"
            aria-modal="true"
            aria-label="Survey"
          >
            <button
              onClick={() => setIsOpen(false)}
              className={styles.closeButton}
              aria-label="Close survey"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
            <div className={styles.surveyWrapper}>
              <Survey surveyData={surveyData} questionCount={questionCount} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SurveyModal;
