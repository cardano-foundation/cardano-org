import React from 'react';
import Survey from '../Survey';
import Modal from '@site/src/components/Modal';

const SurveyModal = ({ surveyData, buttonText = "Start", questionCount, buttonClassName }) => (
  <Modal label="Survey" buttonText={buttonText} buttonClassName={buttonClassName}>
    <Survey surveyData={surveyData} questionCount={questionCount} />
  </Modal>
);

export default SurveyModal;
