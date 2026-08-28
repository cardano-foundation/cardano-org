import React, { useState, useEffect, useRef } from 'react';
import {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';

const RESET_DELAY = 2000;

// Each tier links to its own prebuilt share page (its own OG image), so a
// shared Gold result at least previews as Gold instead of the generic hub.
const TIER_SHARE_PATHS = {
  bronze: '/quiz/share/bronze',
  silver: '/quiz/share/silver',
  gold: '/quiz/share/gold',
};

function defaultShareUrl(tierKey) {
  return `https://cardano.org${TIER_SHARE_PATHS[tierKey] || '/quiz'}`;
}

// Wordle-style emoji row: one filled circle per correct answer, in order.
export function buildEmojiGrid(results) {
  return results.map((r) => (r ? '🔵' : '⚪')).join('');
}

export function buildShareText({ quizTitle, results, score, total, tierLabel, url }) {
  const grid = buildEmojiGrid(results);
  const headline = translate({id: 'quiz.share.headline', message: 'Cardano Quiz: {quizTitle}'}, {quizTitle});
  const cta = translate({id: 'quiz.share.cta', message: 'Can you get gold? {url}'}, {url});
  return `${headline}\n${grid} ${score}/${total}, ${tierLabel}\n${cta}`;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const STATUS_LABEL = {
  idle: () => translate({id: 'quiz.share.button', message: 'Share your result'}),
  pending: () => translate({id: 'quiz.share.pending', message: 'Sharing...'}),
  imageCopied: () => translate({id: 'quiz.share.imageCopied', message: 'Image copied!'}),
  downloaded: () => translate({id: 'quiz.share.downloaded', message: 'Downloaded!'}),
  copiedText: () => translate({id: 'quiz.share.copied', message: 'Copied!'}),
};

// Hands the already-rendered result badge (PNG) to the best sharing path
// the browser supports: the native share sheet with a real image file on
// mobile, a clipboard image paste on desktop, or a plain download as the
// last resort before falling back to the original text-only share.
//
// getBadgeBlob reuses the single render the result screen already produced
// (see Quiz/index.js) instead of rendering a second badge here.
const QuizShare = ({ quizTitle, results, score, total, tierKey, tierLabel, url = defaultShareUrl(tierKey), getBadgeBlob }) => {
  const [status, setStatus] = useState('idle');
  const text = buildShareText({ quizTitle, results, score, total, tierLabel, url });
  const resetTimeoutRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(resetTimeoutRef.current);
  }, []);

  const showStatus = (next) => {
    setStatus(next);
    // Clear any earlier reset still pending, otherwise it can fire after
    // this one and flip a later 'pending' share back to 'idle' mid-flight.
    clearTimeout(resetTimeoutRef.current);
    resetTimeoutRef.current = setTimeout(() => setStatus('idle'), RESET_DELAY);
  };

  // The original text-only path, kept as the fallback for whenever badge
  // generation or every image-sharing route fails.
  const shareTextOnly = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ text });
        setStatus('idle');
        return;
      } catch (e) {
        if (e && e.name === 'AbortError') {
          setStatus('idle');
          return;
        }
        // fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      showStatus('copiedText');
    } catch (e) {
      // Clipboard unavailable (permissions, http): nothing sensible to do
      setStatus('idle');
    }
  };

  const handleShare = async () => {
    if (status === 'pending') return;
    setStatus('pending');

    let blob;
    try {
      // The badge promise comes from the result screen, which starts the
      // render as soon as it appears. Awaiting it here reuses that single
      // render instead of producing a second badge image.
      const badgePromise = getBadgeBlob && getBadgeBlob();
      if (!badgePromise) throw new Error('Badge is not ready to share');
      blob = await badgePromise;
    } catch (e) {
      // Badge rendering failed (fonts, canvas, image load) or was not ready
      // yet: fall back to the text-only share rather than leaving the user
      // stuck.
      await shareTextOnly();
      return;
    }

    const file = new File([blob], 'cardano-quiz-badge.png', { type: 'image/png' });

    if (
      typeof navigator !== 'undefined' &&
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({ files: [file], text });
        setStatus('idle');
        return;
      } catch (e) {
        if (e && e.name === 'AbortError') {
          setStatus('idle');
          return;
        }
        // fall through to the desktop fallback chain below
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof window !== 'undefined' && window.ClipboardItem) {
      try {
        const textBlob = new Blob([text], { type: 'text/plain' });
        await navigator.clipboard.write([
          new window.ClipboardItem({ 'image/png': blob, 'text/plain': textBlob }),
        ]);
        showStatus('imageCopied');
        return;
      } catch (e) {
        // Clipboard image write unavailable or blocked: fall through to download.
      }
    }

    try {
      downloadBlob(blob, 'cardano-quiz-badge.png');
      try {
        await navigator.clipboard.writeText(text);
      } catch (e) {
        // Best effort only, the download already gave the user something.
      }
      showStatus('downloaded');
    } catch (e) {
      // Download itself failed: last resort is the original text-only share.
      await shareTextOnly();
    }
  };

  return (
    <div className={styles.share}>
      <button onClick={handleShare} disabled={status === 'pending'} className={styles.shareButton} aria-live="polite">
        {STATUS_LABEL[status]()}
      </button>
    </div>
  );
};

export default QuizShare;
