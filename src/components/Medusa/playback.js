/**
 * The clock behind the medusa visualization. Pure JavaScript, no DOM, so it
 * runs in scripts/test-medusa-playback.js. Time is fed in through tick(dt).
 */

// Playback speeds the explorer offers, in the order the controls show them.
export const SPEEDS = [1, 2, 4];

export function frameIndexForDate(frameDates, isoDate) {
  const month = isoDate.slice(0, 7);
  return frameDates.indexOf(month);
}

export function createPlayback({
  frameDates,
  milestones = [],
  mode = 'ambient',
  ambientDuration = 90,
  holdDuration = 30,
  fadeDuration = 2,
  fadeInDuration = 1,
}) {
  const lastIndex = frameDates.length - 1;
  const frameDuration = ambientDuration / frameDates.length;
  const milestonesByFrame = new Map();
  milestones.forEach((m) => {
    const i = frameIndexForDate(frameDates, m.date);
    if (i === -1) return;
    if (!milestonesByFrame.has(i)) milestonesByFrame.set(i, []);
    milestonesByFrame.get(i).push(m);
  });

  const state = {
    frameIndex: 0,
    progress: 0,
    speed: 1,
    paused: mode === 'explore',
    phase: 'play',
    opacity: 1,
  };
  let phaseTime = 0;
  let ended = false;
  const listeners = { frame: [], milestone: [], phase: [], end: [] };

  const emit = (event, ...args) => listeners[event].forEach((cb) => cb(...args));
  const setPhase = (phase) => {
    state.phase = phase;
    phaseTime = 0;
    emit('phase', { ...state });
  };

  function advance() {
    state.frameIndex += 1;
    emit('frame', state.frameIndex, { kind: 'step' });
    (milestonesByFrame.get(state.frameIndex) || []).forEach((m) => emit('milestone', m));
  }

  function seekTo(index) {
    const target = Math.max(0, Math.min(lastIndex, index));
    state.frameIndex = target;
    state.progress = 0;
    state.opacity = 1;
    ended = false;
    if (state.phase !== 'play') setPhase('play');
    emit('frame', target, { kind: 'seek' });
  }

  function tickPlay(dt) {
    state.progress += (dt * state.speed) / frameDuration;
    while (state.progress >= 1) {
      state.progress -= 1;
      if (state.frameIndex >= lastIndex) {
        state.progress = 0;
        if (mode === 'ambient') {
          setPhase('hold');
        } else {
          state.paused = true;
          if (!ended) {
            ended = true;
            emit('end');
          }
        }
        return;
      }
      advance();
    }
  }

  function play() {
    state.paused = false;
    if (mode === 'explore' && state.frameIndex >= lastIndex) seekTo(0);
  }

  function pause() {
    state.paused = true;
  }

  return {
    play,
    pause,
    toggle() {
      if (state.paused) play();
      else pause();
    },
    seekTo,
    seekToDate(isoDate) {
      const i = frameIndexForDate(frameDates, isoDate);
      if (i !== -1) seekTo(i);
    },
    step(delta) {
      const target = Math.max(0, Math.min(lastIndex, state.frameIndex + delta));
      if (target === state.frameIndex) return;
      if (target === state.frameIndex + 1) {
        state.progress = 0;
        advance();
      } else {
        seekTo(target);
      }
    },
    setSpeed(n) {
      state.speed = n;
    },
    tick(dt) {
      if (state.paused) return;
      if (state.phase === 'play') {
        tickPlay(dt);
        return;
      }
      phaseTime += dt;
      if (state.phase === 'hold' && phaseTime >= holdDuration) {
        setPhase('fade');
      } else if (state.phase === 'fade') {
        state.opacity = Math.max(0, 1 - phaseTime / fadeDuration);
        if (phaseTime >= fadeDuration) {
          state.frameIndex = 0;
          state.progress = 0;
          emit('frame', 0, { kind: 'seek' });
          setPhase('fadein');
          state.opacity = 0;
        }
      } else if (state.phase === 'fadein') {
        state.opacity = Math.min(1, phaseTime / fadeInDuration);
        if (phaseTime >= fadeInDuration) {
          state.opacity = 1;
          setPhase('play');
        }
      }
    },
    getState() {
      return { ...state };
    },
    on(event, cb) {
      listeners[event].push(cb);
      return () => {
        listeners[event] = listeners[event].filter((x) => x !== cb);
      };
    },
  };
}
