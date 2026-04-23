import React, { useMemo, useState, useEffect, useRef } from 'react';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return isMobile;
}

function clamp(n, min, max) {
  if (Number.isNaN(n)) return NaN;
  return Math.min(Math.max(n, min), max);
}

export default function InsightsEpochNav({
  displayedEpoch,
  currentEpochNo,
  minEpoch,
  onGoEpoch,
}) {
  const isMobile = useIsMobile();

  const maxEpoch = currentEpochNo ?? displayedEpoch;
  const canGoPrev = displayedEpoch > minEpoch;
  const canGoNext = currentEpochNo != null && displayedEpoch < currentEpochNo;

  const [isJumpMode, setIsJumpMode] = useState(false);
  const [input, setInput] = useState(String(displayedEpoch));
  const inputRef = useRef(null);

  useEffect(() => { setInput(String(displayedEpoch)); }, [displayedEpoch]);

  useEffect(() => {
    if (isJumpMode && inputRef.current) setTimeout(() => inputRef.current?.focus(), 50);
  }, [isJumpMode]);

  useEffect(() => {
    const el = inputRef.current; if (!el) return;
    const onWheel = (e) => e.preventDefault();
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [isJumpMode]);

  const { parsed, isValid, clamped, hint } = useMemo(() => {
    const n = Number(input);
    if (Number.isNaN(n)) return { parsed: NaN, clamped: NaN, isValid: false, hint: 'Enter a number' };
    const min = Number(minEpoch);
    const max = Number(maxEpoch);
    const inRange = n >= min && n <= max;
    return { parsed: n, clamped: clamp(n, min, max), isValid: inRange, hint: inRange ? '' : `Allowed: ${min}–${max}` };
  }, [input, minEpoch, maxEpoch]);

  const go = () => {
    if (!isValid) return;
    setIsJumpMode(false);
    if (clamped !== displayedEpoch) onGoEpoch(clamped);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); go(); }
    if (e.key === 'Escape') { setIsJumpMode(false); }
  };

  return (
    <nav className={`epochNav ${isJumpMode ? 'is-jump' : ''}`}>
      {/* Main row */}
      <div className="epochNavMain">
        <div className="epochNavLeft">
          <button
            type="button"
            onClick={() => onGoEpoch(displayedEpoch - 1)}
            className="button button--sm button--secondary"
            disabled={!canGoPrev}
            aria-label={`Go to epoch ${displayedEpoch - 1}`}
            title={canGoPrev ? `Epoch ${displayedEpoch - 1}` : `Min epoch is ${minEpoch}`}
          >
            ← Prev
          </button>

          <div className="epochNavLabel" aria-live="polite">
            <span>Epoch</span>
            <strong>{displayedEpoch}</strong>
          </div>

          <button
            type="button"
            onClick={() => onGoEpoch(displayedEpoch + 1)}
            className="button button--sm button--primary"
            disabled={!canGoNext}
            aria-label={`Go to epoch ${displayedEpoch + 1}`}
            title={canGoNext ? `Epoch ${displayedEpoch + 1}` : (currentEpochNo == null ? 'Fetching latest epoch…' : `Max epoch is ${currentEpochNo}`)}
          >
            Next →
          </button>
        </div>

        {/* Desktop: show input+Go on the right; Mobile: show Jump… button */}
        {!isMobile ? (
          <div className="epochJump epochJump--desktop">
            <div className="epochJumpRow">
              <input
                ref={inputRef}
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                min={minEpoch}
                max={maxEpoch}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                className="epochJumpInput"
                aria-label="Jump to epoch"
                title={hint || 'Jump to epoch'}
              />
              <button
                type="button"
                onClick={go}
                className="button button--sm epochJumpGo"
                disabled={!isValid}
                title={isValid ? `Go to epoch ${parsed}` : hint}
              >
                Go
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="epochJumpLink"
            onClick={() => setIsJumpMode(true)}
            title="Jump to a specific epoch"
          >
            Jump…
          </button>
        )}
      </div>

      {/* Mobile jump mode: only input + Go + Cancel */}
      {isMobile && isJumpMode && (
        <div className="epochJump epochJump--mobile">
          <div className="epochJumpRow">
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min={minEpoch}
              max={maxEpoch}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              className="epochJumpInput"
              aria-label="Jump to epoch"
              title={hint || 'Jump to epoch'}
            />
            <button
              type="button"
              onClick={go}
              className="button button--sm epochJumpGo"
              disabled={!isValid}
              title={isValid ? `Go to epoch ${parsed}` : hint}
            >
              Go
            </button>
            <button
              type="button"
              onClick={() => setIsJumpMode(false)}
              className="button button--sm button--secondary epochJumpCancel"
              title="Cancel"
            >
              Cancel
            </button>
          </div>
          {!isValid && <span className="epochJumpHint is-invalid">{hint}</span>}
        </div>
      )}
    </nav>
  );
}