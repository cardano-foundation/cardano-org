import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import { getQuizCatalog } from '@site/src/data/quiz/catalog';
import styles from './styles.module.css';

function findQuestion(quizId, questionId) {
  const entry = getQuizCatalog().find((q) => q.id === quizId);
  if (!entry) return null;
  return entry.getData().questions.find((q) => q.id === questionId) || null;
}

// One curated question, no score, no storage. Mirrors the Quiz component's
// reveal rule: after answering, the picked option and the correct one stay.
export default function CheckQuestion({ quiz, id }) {
  const question = findQuestion(quiz, id);
  const [picked, setPicked] = useState(null);
  const explanationRef = useRef(null);

  // Answering disables the button that had focus, so focus moves to the
  // explanation, which is also where the answer is.
  useEffect(() => {
    if (picked !== null) explanationRef.current?.focus();
  }, [picked]);

  if (!question) return null;
  const answered = picked !== null;
  const groupId = `check-${id}`;

  return (
    <div role="group" aria-labelledby={groupId}>
      <p className={styles.fieldNote}>{translate({ id: 'getStarted.question.kicker', message: 'Quick check' })}</p>
      <h3 id={groupId} className={styles.questionTitle}>{question.question}</h3>
      <div className={styles.options}>
        {question.options.map((option, i) => {
          const correct = i === question.correctAnswer;
          if (answered && !correct && picked !== i) return null;
          return (
            <button
              key={i}
              type="button"
              className={clsx(styles.option, answered && correct && styles.optionCorrect, answered && picked === i && !correct && styles.optionWrong)}
              aria-pressed={picked === i}
              disabled={answered}
              onClick={() => setPicked(i)}
            >
              <span className={styles.optionLabel} aria-hidden="true">{String.fromCharCode(65 + i)}</span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>
      {/* Stays in the DOM while empty, a live region has to exist before it fills. */}
      <div className={styles.explanation} aria-live="polite" tabIndex={-1} ref={explanationRef}>
        {answered && (
          <>
            <p><strong>{picked === question.correctAnswer
              ? translate({ id: 'getStarted.question.correct', message: 'Correct.' })
              : translate({ id: 'getStarted.question.wrong', message: 'Not quite.' })}</strong>{' '}{question.explanation}</p>
            {question.sourceUrl && (
              <Link href={question.sourceUrl} target="_blank" rel="noopener noreferrer">
                {translate({ id: 'getStarted.question.source', message: 'Source' })}
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
