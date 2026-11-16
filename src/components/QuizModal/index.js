import React from 'react';
import Quiz from '../Quiz';
import Modal from '@site/src/components/Layout/Modal';
import { translate } from "@docusaurus/Translate";

/**
 * Button that opens a Quiz in a modal.
 *
 * @param {object} props
 * @param {object} props.quizData Quiz data passed on to Quiz.
 * @param {string} [props.buttonText="Test Your Knowledge"] Label of the open button, translated by default.
 * @param {number} [props.questionCount=5] Number of questions per run.
 * @param {boolean} [props.allowRetry=true] Shows a retry button after a wrong answer.
 * @param {number} [props.passingScore=60] Percentage needed for the success result.
 * @param {Function} [props.onRecord=null] Called with `(score, total)` after a scored run. Turns on hub mode.
 * @param {object} [props.academyCta=null] Academy link shown in hub mode, see Quiz.
 * @param {string} [props.buttonClassName] Extra class on the open button.
 */
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
