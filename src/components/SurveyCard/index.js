import React from 'react';
import SurveyModal from '../SurveyModal';
import styles from './styles.module.css';

const SurveyCard = ({
  surveyData,
  title = 'Not sure where to start?',
  description,
  buttonText = 'Find your role',
  questionCount,
}) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      <SurveyModal
        surveyData={surveyData}
        buttonText={buttonText}
        questionCount={questionCount}
      />
    </div>
  );
};

export default SurveyCard;
