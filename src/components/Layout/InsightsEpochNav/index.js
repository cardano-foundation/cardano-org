import Link from '@docusaurus/Link';
import React from 'react';

function EpochNav({ displayedEpoch, currentEpochNo, minEpoch, onGoEpoch }) {
  const canGoPrev = displayedEpoch > minEpoch;
  const canGoNext = currentEpochNo != null && displayedEpoch < currentEpochNo;

  return (
    <nav style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      {canGoPrev && (
        <button
          type="button"
          onClick={() => onGoEpoch(displayedEpoch - 1)}
          aria-label={`Go to epoch ${displayedEpoch - 1}`}
          className="button button--sm button--secondary"
        >
          ← {displayedEpoch - 1}
        </button>
      )} Epoch Navigation
      {canGoNext && (
        <button
          type="button"
          onClick={() => onGoEpoch(displayedEpoch + 1)}
          aria-label={`Go to epoch ${displayedEpoch + 1}`}
          className="button button--sm button--primary"
        >
          {displayedEpoch + 1} →
        </button>
      )}
    </nav>
  );
}

export default React.memo(EpochNav);