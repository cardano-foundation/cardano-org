import React, { useState } from 'react';
import {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';

export function buildShareText({ quizTitle, results, score, total, tierLabel, url }) {
  const grid = results.map((r) => (r ? '🔵' : '⚪')).join('');
  const headline = translate({id: 'quiz.share.headline', message: 'Cardano Quiz: {quizTitle}'}, {quizTitle});
  const cta = translate({id: 'quiz.share.cta', message: 'Can you get gold? {url}'}, {url});
  return `${headline}\n${grid} ${score}/${total}, ${tierLabel}\n${cta}`;
}

// Wordle-style share: one click copies a compact, spoiler-free summary.
// Uses the native share sheet where available (mobile), clipboard otherwise.
const QuizShare = ({ quizTitle, results, score, total, tierLabel, url = 'https://cardano.org/quiz' }) => {
  const [copied, setCopied] = useState(false);
  const text = buildShareText({ quizTitle, results, score, total, tierLabel, url });

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch (e) {
        if (e && e.name === 'AbortError') return;
        // fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // Clipboard unavailable (permissions, http): nothing sensible to do
    }
  };

  return (
    <div className={styles.share}>
      <button onClick={handleShare} className={styles.shareButton}>
        {copied
          ? translate({id: 'quiz.share.copied', message: 'Copied!'})
          : translate({id: 'quiz.share.button', message: 'Share your result'})}
      </button>
    </div>
  );
};

export default QuizShare;
