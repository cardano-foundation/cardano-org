import React from 'react';
import Quiz from '../Quiz';
import Modal from '@site/src/components/Layout/Modal';
import { translate } from "@docusaurus/Translate";

const QuizModal = ({ quizData, buttonText = translate({ id: "quizModal.buttonText", message: "Test Your Knowledge" }), questionCount = 5, allowRetry = true, passingScore = 60, onRecord = null, academyCta = null, buttonClassName }) => (
  <Modal label={translate({ id: "quizModal.label", message: "Quiz" })} buttonText={buttonText} buttonClassName={buttonClassName}>
    <Quiz
      quizData={quizData}
      questionCount={questionCount}
      allowRetry={allowRetry}
      passingScore={passingScore}
      onRecord={onRecord}
      academyCta={academyCta}
    />
  </Modal>
);

export default QuizModal;
