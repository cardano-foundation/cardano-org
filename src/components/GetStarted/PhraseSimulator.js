import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { translate } from '@docusaurus/Translate';
import Admonition from '@theme/Admonition';
import { DEMO_PHRASE, makeExercise } from '@site/src/utils/getStarted/demoPhrase.mjs';
import styles from './styles.module.css';

export default function PhraseSimulator({ passed, onPassed }) {
  // The exercise is created on click, never during render, so the server
  // and the first client render agree and no random value leaks into SSR.
  const [rounds, setRounds] = useState(null);
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState(null);

  const start = () => { setRounds(makeExercise()); setRound(0); setPicked(null); };
  const current = rounds ? rounds[round] : null;
  const isCorrect = current && picked !== null && picked === current.answer;
  const nextRef = useRef(null);

  // A correct pick disables the button that had focus, so focus moves on to
  // the button that continues the exercise.
  useEffect(() => {
    if (isCorrect) nextRef.current?.focus();
  }, [isCorrect]);

  const next = () => {
    if (round + 1 >= rounds.length) {
      onPassed();
      setRounds(null);
    } else {
      setRound(round + 1);
      setPicked(null);
    }
  };

  return (
    <div>
      <Admonition type="warning" title={translate({ id: 'getStarted.phrase.demoBanner', message: 'Demo only' })}>
        {translate({ id: 'getStarted.phrase.demoBannerText', message: 'cardano.org will never ask for a real phrase, and neither will anyone honest. These twelve words are not a real phrase.' })}
      </Admonition>
      <ol className={styles.phraseGrid} aria-label={translate({ id: 'getStarted.phrase.demoLabel', message: 'Demo recovery phrase' })}>
        {DEMO_PHRASE.map((word, i) => (
          <li key={word} className={styles.phraseWord}><small>{i + 1}</small>{word}</li>
        ))}
      </ol>

      {passed && !rounds && (
        <p className={styles.proof}>
          {translate({ id: 'getStarted.phrase.passed', message: 'Passed. Now do the same with your real phrase, on paper.' })}{' '}
          <button type="button" className="button button--link" onClick={start}>
            {translate({ id: 'getStarted.phrase.again', message: 'Practise again' })}
          </button>
        </p>
      )}
      {!passed && !rounds && (
        <button type="button" className="button button--primary" onClick={start}>
          {translate({ id: 'getStarted.phrase.start', message: 'Start the check' })}
        </button>
      )}

      {current && (
        <div role="group" aria-labelledby="phrase-question">
          <h3 id="phrase-question" className={styles.questionTitle}>
            {translate({ id: 'getStarted.phrase.question', message: 'Which is word {position}?' }, { position: current.position })}
          </h3>
          <div className={styles.options}>
            {current.options.map((word, i) => (
              <button
                key={word}
                type="button"
                className={clsx(styles.option, picked === i && (isCorrect ? styles.optionCorrect : styles.optionWrong))}
                aria-pressed={picked === i}
                disabled={isCorrect}
                onClick={() => setPicked(i)}
              >
                <span className={styles.optionLabel} aria-hidden="true">{String.fromCharCode(65 + i)}</span>
                <span>{word}</span>
              </button>
            ))}
          </div>
          <p aria-live="polite">
            {picked !== null && !isCorrect && translate({ id: 'getStarted.phrase.wrong', message: 'Not quite. Look at the numbered list above and try again.' })}
            {isCorrect && translate({ id: 'getStarted.phrase.right', message: 'Correct. {done} of {total} checked.' }, { done: round + 1, total: rounds.length })}
          </p>
          {isCorrect && (
            <button type="button" className="button button--primary" onClick={next} ref={nextRef}>
              {round + 1 >= rounds.length
                ? translate({ id: 'getStarted.phrase.finish', message: 'Finish' })
                : translate({ id: 'getStarted.phrase.next', message: 'Next word' })}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
