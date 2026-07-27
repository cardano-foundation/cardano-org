import React from 'react';
import Quiz from '../Quiz';
import Modal from '@site/src/components/Modal';

const QuizModal = ({ quizData, buttonText = "Test Your Knowledge", questionCount = 5, allowRetry = true, passingScore = 60 }) => (
  <Modal label="Quiz" buttonText={buttonText}>
    <Quiz
      quizData={quizData}
      questionCount={questionCount}
      allowRetry={allowRetry}
      passingScore={passingScore}
    />
  </Modal>
);

export default QuizModal;
