import React from 'react';
import Quiz from '../Quiz';
import Modal from '@site/src/components/Modal';

const QuizModal = ({ quizData, buttonText = "Test Your Knowledge", questionCount = 5, allowRetry = true, passingScore = 60, onRecord = null, academyCta = null, buttonClassName }) => (
  <Modal label="Quiz" buttonText={buttonText} buttonClassName={buttonClassName}>
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
