import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';
import { createEngine } from './engine.js';
import { createPlayback, frameIndexForDate } from './playback.js';
import { createGraph } from './graph.js';
import { LAYOUT_DEFAULTS } from './defaults.js';
import { groupIndex } from './groups.js';
import { prefersReducedMotion, medusaFlag, isSmallViewport } from './webgl.js';
import { MILESTONES } from '@site/src/data/medusa/milestones.js';
import styles from './styles.module.css';

// The engine takes -1 for "no era highlighted".
const highlightIndexOf = (key) => (key === null ? -1 : groupIndex(key));

// The only React component that knows about the engine, the worker and the
// clock. Everything else talks to it through props and the ref API.
const MedusaCanvas = forwardRef(function MedusaCanvas(
  { mode = 'ambient', startDate = null, className, ariaLabel, onFrame, onHover, onSelect, onMilestone, onReady, highlightGroup = null, interactive = false },
  ref,
) {
  const canvasRef = useRef(null);
  const apiRef = useRef(null);
  const callbacks = useRef({});
  callbacks.current = { onFrame, onHover, onSelect, onMilestone, onReady };
  const highlightRef = useRef(highlightGroup);
  highlightRef.current = highlightGroup;
  const reducedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    let disposed = false;
    let raf = 0;
    let last = performance.now();
    let api = null;
    let suspended = false;
    let offscreen = false;
    let resumeOnWake = false;
    let workerPaused = false;
    const still = medusaFlag('still');
    const reduced = (prefersReducedMotion() && !medusaFlag('panel')) || still;
    reducedRef.current = reduced;
    // In reduced motion the loop keeps running but only draws while something
    // can still change: the settle after new positions, a resize, the flash of
    // freshly born nodes.
    let renderUntil = performance.now() + 2500;
    const keepDrawing = () => {
      renderUntil = performance.now() + 2500;
    };

    // Combines the two reasons to stop rendering: the tab is hidden, or the
    // canvas has scrolled out of the viewport. Transitions exactly once per
    // change so the two sources cannot double pause or resume a clock the
    // user paused themselves.
    const updateSuspended = () => {
      if (!api) return;
      const next = document.hidden || offscreen;
      if (next === suspended) return;
      suspended = next;
      if (suspended) {
        resumeOnWake = !api.playback.getState().paused;
        api.playback.pause();
        api.worker.postMessage({ type: 'pause' });
      } else {
        if (!reduced) api.worker.postMessage({ type: 'resume' });
        if (resumeOnWake) api.playback.play();
        last = performance.now();
      }
    };

    import('@site/src/data/medusa/ledger-history.json').then((mod) => {
      if (disposed) return;
      const history = mod.default;
      const frameDates = history.frames.map((f) => f.date);
      const engine = createEngine({ canvas, mode, reducedMotion: reduced });
      engine.resize();
      const graph = createGraph(history);
      // Reduced motion shows the final state, otherwise the optional start date
      // lets the ambient header skip the erratic first months of the repository.
      const playback = createPlayback({
        frameDates,
        milestones: MILESTONES,
        mode,
        startIndex: reduced ? frameDates.length - 1 : startDate ? frameIndexForDate(frameDates, startDate) : 0,
      });
      // The clock clamps the start frame, so it is the single source for it.
      const startIndex = playback.getState().frameIndex;
      // Classic worker on purpose: the bundler splits d3-force into a vendor
      // chunk that the worker pulls in with importScripts, which a module
      // worker refuses to run.
      const worker = new Worker(new URL('./layout.worker.js', import.meta.url));
      worker.onerror = (e) => console.error('medusa layout worker', e.message);
      api = { engine, playback, graph, worker, frameDates };
      apiRef.current = api;

      const applyDelta = (delta) => {
        delta.removed.forEach((id) => engine.removeNode(id));
        delta.added.forEach((node) => engine.addNode(node));
      };
      const report = (index) => {
        callbacks.current.onFrame?.({ index, date: frameDates[index], ...playback.getState() });
      };

      // A non incremental seek settles the simulation synchronously in the
      // worker, and the worker handles messages in order. Dragging the slider
      // would queue one such seek per pixel, so only one seek is in flight at
      // a time and the newest target replaces the waiting one.
      let awaitingSeek = null;
      let pendingSeek = null;
      const postSeek = (index) => {
        if (awaitingSeek !== null) {
          pendingSeek = index;
          return;
        }
        worker.postMessage({ type: 'seek', frameIndex: index });
        awaitingSeek = index;
      };

      applyDelta(graph.seek(startIndex));
      playback.seekTo(startIndex);
      if (reduced) playback.pause();
      worker.postMessage({
        type: 'init',
        history,
        params: LAYOUT_DEFAULTS,
        frameIndex: startIndex,
        // Small viewports get a slower tick, the layout is offscreen or tiny
        // often enough on mobile that the extra precision is not worth the cost.
        tickMs: isSmallViewport() ? 50 : 33,
      });
      const startedAt = performance.now();
      worker.onmessage = (event) => {
        if (event.data.type !== 'positions') return;
        engine.updatePositions(event.data.ids, event.data.xy);
        keepDrawing();
        if (awaitingSeek === null || event.data.frameIndex !== awaitingSeek) return;
        awaitingSeek = null;
        if (pendingSeek !== null) {
          const next = pendingSeek;
          pendingSeek = null;
          postSeek(next);
        }
      };

      playback.on('frame', (index, meta) => {
        const incremental = meta.kind === 'step';
        // A seek throws the old tree away, so the fades of the removed nodes
        // must not keep holding on to their slots.
        if (!incremental) engine.flushFading();
        applyDelta(graph.seek(index));
        // The worker must not step from a frame it has not reached yet, so a
        // step during an unacknowledged seek becomes a seek as well.
        if (incremental && awaitingSeek === null) worker.postMessage({ type: 'step' });
        else postSeek(index);
        report(index);
      });
      playback.on('phase', (state) => report(state.frameIndex));
      // The clock stops itself at the end of the timeline without a frame, so
      // the paused state has to be reported on its own.
      playback.on('end', () => report(frameDates.length - 1));
      playback.on('milestone', (m) => callbacks.current.onMilestone?.(m));
      engine.setHighlightGroup(highlightIndexOf(highlightRef.current));
      report(startIndex);
      callbacks.current.onReady?.({ frameDates });
      // Apply whatever suspension state already accumulated (hidden tab or
      // an offscreen canvas) while the ledger history was still loading.
      updateSuspended();

      const loop = (now) => {
        if (disposed) return;
        const dt = Math.min(0.1, (now - last) / 1000);
        last = now;
        playback.tick(dt);
        engine.setOpacity(playback.getState().opacity);
        // Reduced motion: once the layout has settled, stop the worker so it
        // no longer keeps the render window alive, then let the loop idle.
        if (reduced && !workerPaused && performance.now() > startedAt + 3000) {
          worker.postMessage({ type: 'pause' });
          workerPaused = true;
        }
        if (!suspended && (!reduced || now < renderUntil)) engine.render(dt);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });

    const observer = new ResizeObserver(() => {
      if (!api) return;
      api.engine.resize();
      keepDrawing();
    });
    observer.observe(canvas);

    // The hero scrolls out of view while the reader keeps scrolling the page,
    // so a canvas that is not on screen must pause just like a hidden tab.
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        offscreen = !entry.isIntersecting;
        updateSuspended();
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(canvas);

    const onVisibility = () => updateSuspended();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      if (api) {
        api.worker.terminate();
        api.engine.dispose();
      }
      apiRef.current = null;
    };
  }, [mode, startDate]);

  useEffect(() => {
    const api = apiRef.current;
    if (api) api.engine.setHighlightGroup(highlightIndexOf(highlightGroup));
  }, [highlightGroup]);

  // Pointer handling: parallax always, hover, click, wheel zoom, drag pan and
  // pinch zoom only when interactive.
  useEffect(() => {
    const canvas = canvasRef.current;
    const pointers = new Map();
    let hovered = null;
    let dragged = false;
    let pinchStart = 0;
    let pinchDistance = 0;

    const local = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height };
    };
    // Pointer capture is best effort, a stale or already released id throws.
    const capture = (id) => {
      try {
        canvas.setPointerCapture(id);
      } catch (err) {
        void err;
      }
    };
    const release = (id) => {
      try {
        canvas.releasePointerCapture(id);
      } catch (err) {
        void err;
      }
    };

    const onMove = (e) => {
      const api = apiRef.current;
      if (!api) return;
      const p = local(e);
      if (!reducedRef.current) api.engine.setPointer((p.x / p.w) * 2 - 1, -((p.y / p.h) * 2 - 1));
      if (!interactive) return;
      const prev = pointers.get(e.pointerId);
      if (prev) pointers.set(e.pointerId, p);
      if (pointers.size === 1 && e.buttons === 1) {
        // movementX/Y is missing on touch derived events, so the delta comes
        // from the previous point of this pointer.
        if (!prev) return;
        const view = api.engine.getView();
        const worldPerPx = (2 * view.distance * Math.tan((45 * Math.PI) / 360)) / p.h;
        const dx = p.x - prev.x;
        const dy = p.y - prev.y;
        api.engine.setView({ panX: view.panX - dx * worldPerPx, panY: view.panY + dy * worldPerPx });
        dragged = true;
        return;
      }
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchDistance) api.engine.setView({ distance: pinchStart * (pinchDistance / d) });
        else {
          pinchDistance = d;
          pinchStart = api.engine.getView().distance;
        }
        dragged = true;
        return;
      }
      const id = api.engine.pick(p.x, p.y);
      if (id !== hovered) {
        hovered = id;
        callbacks.current.onHover?.(id);
      }
    };
    const onDown = (e) => {
      pointers.set(e.pointerId, local(e));
      dragged = false;
      pinchDistance = 0;
      // The ambient hero neither pans nor picks, so it must not swallow the
      // pointer of a page scroll or a click on the buttons above it.
      if (interactive) capture(e.pointerId);
    };
    const onUp = (e) => {
      release(e.pointerId);
      pointers.delete(e.pointerId);
      pinchDistance = 0;
      const api = apiRef.current;
      if (!api || !interactive || dragged) return;
      const p = local(e);
      callbacks.current.onSelect?.(api.engine.pick(p.x, p.y));
    };
    const onLeave = () => {
      pointers.clear();
      pinchDistance = 0;
      const api = apiRef.current;
      if (api) api.engine.setPointer(0, 0);
      if (hovered !== null) {
        hovered = null;
        callbacks.current.onHover?.(null);
      }
    };
    const onWheel = (e) => {
      const api = apiRef.current;
      if (!api || !interactive) return;
      e.preventDefault();
      const view = api.engine.getView();
      api.engine.setView({ distance: view.distance * (1 + e.deltaY * 0.001) });
    };

    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('wheel', onWheel);
    };
  }, [interactive]);

  useImperativeHandle(ref, () => ({
    play: () => apiRef.current?.playback.play(),
    pause: () => apiRef.current?.playback.pause(),
    toggle: () => apiRef.current?.playback.toggle(),
    seekTo: (i) => apiRef.current?.playback.seekTo(i),
    seekToDate: (iso) => apiRef.current?.playback.seekToDate(iso),
    step: (d) => apiRef.current?.playback.step(d),
    setSpeed: (n) => apiRef.current?.playback.setSpeed(n),
    getState: () => apiRef.current?.playback.getState() ?? null,
    project: (id) => apiRef.current?.engine.project(id) ?? null,
    getGraph: () => apiRef.current?.graph ?? null,
    setHighlightSet: (set) => apiRef.current?.engine.setHighlightSet(set),
    setParams: (p) => apiRef.current?.engine.setParams(p),
    setLayoutParams: (p) => apiRef.current?.worker.postMessage({ type: 'params', params: p }),
  }), []);

  return (
    <canvas
      ref={canvasRef}
      className={clsx(styles.canvas, interactive && styles.canvasInteractive, className)}
      role="img"
      aria-label={ariaLabel}
    />
  );
});

export default MedusaCanvas;
