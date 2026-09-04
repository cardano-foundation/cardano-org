import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';
import { createEngine } from './engine.js';
import { createPlayback } from './playback.js';
import { createGraph } from './graph.js';
import { LAYOUT_DEFAULTS } from './layout.js';
import { groupIndex } from './groups.js';
import { prefersReducedMotion, medusaFlag } from './webgl.js';
import { MILESTONES } from '@site/src/data/medusa/milestones.js';
import styles from './styles.module.css';

// The only React component that knows about the engine, the worker and the
// clock. Everything else talks to it through props and the ref API.
const MedusaCanvas = forwardRef(function MedusaCanvas(
  { mode = 'ambient', className, ariaLabel, onFrame, onHover, onSelect, onMilestone, onReady, highlightGroup = null, interactive = false },
  ref,
) {
  const canvasRef = useRef(null);
  const apiRef = useRef(null);
  const callbacks = useRef({});
  callbacks.current = { onFrame, onHover, onSelect, onMilestone, onReady };
  const highlightRef = useRef(highlightGroup);
  highlightRef.current = highlightGroup;

  useEffect(() => {
    const canvas = canvasRef.current;
    let disposed = false;
    let raf = 0;
    let last = performance.now();
    let api = null;
    let hiddenPause = false;
    const still = medusaFlag('still');
    const reduced = (prefersReducedMotion() && !medusaFlag('panel')) || still;

    import('@site/src/data/medusa/ledger-history.json').then((mod) => {
      if (disposed) return;
      const history = mod.default;
      const frameDates = history.frames.map((f) => f.date);
      const engine = createEngine({ canvas, mode, reducedMotion: reduced });
      engine.resize();
      const graph = createGraph(history);
      const playback = createPlayback({ frameDates, milestones: MILESTONES, mode });
      const worker = new Worker(new URL('./layout.worker.js', import.meta.url), { type: 'module' });
      api = { engine, playback, graph, worker, frameDates };
      apiRef.current = api;

      const applyDelta = (delta) => {
        delta.removed.forEach((id) => engine.removeNode(id));
        delta.added.forEach((node) => engine.addNode(node));
      };
      const report = (index) => {
        callbacks.current.onFrame?.({ index, date: frameDates[index], ...playback.getState() });
      };

      const startIndex = reduced ? frameDates.length - 1 : 0;
      applyDelta(graph.seek(startIndex));
      playback.seekTo(startIndex);
      if (reduced) playback.pause();
      worker.postMessage({ type: 'init', history, params: LAYOUT_DEFAULTS, frameIndex: startIndex });
      worker.onmessage = (event) => {
        if (event.data.type === 'positions') engine.updatePositions(event.data.ids, event.data.xy);
      };

      playback.on('frame', (index, meta) => {
        applyDelta(graph.seek(index));
        worker.postMessage(meta.kind === 'step' ? { type: 'step' } : { type: 'seek', frameIndex: index });
        report(index);
      });
      playback.on('phase', (state) => report(state.frameIndex));
      playback.on('milestone', (m) => callbacks.current.onMilestone?.(m));
      const key = highlightRef.current;
      engine.setHighlightGroup(key === null ? -1 : groupIndex(key));
      report(startIndex);
      callbacks.current.onReady?.({ frameDates });

      const loop = (now) => {
        if (disposed) return;
        const dt = Math.min(0.1, (now - last) / 1000);
        last = now;
        playback.tick(dt);
        engine.setOpacity(playback.getState().opacity);
        engine.render(dt);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });

    const observer = new ResizeObserver(() => api && api.engine.resize());
    observer.observe(canvas);

    const onVisibility = () => {
      if (!api) return;
      if (document.hidden) {
        hiddenPause = !api.playback.getState().paused;
        api.playback.pause();
        api.worker.postMessage({ type: 'pause' });
      } else {
        api.worker.postMessage({ type: 'resume' });
        if (hiddenPause) api.playback.play();
        last = performance.now();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      if (api) {
        api.worker.terminate();
        api.engine.dispose();
      }
      apiRef.current = null;
    };
  }, [mode]);

  useEffect(() => {
    const api = apiRef.current;
    if (api) api.engine.setHighlightGroup(highlightGroup === null ? -1 : groupIndex(highlightGroup));
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

    const onMove = (e) => {
      const api = apiRef.current;
      if (!api) return;
      const p = local(e);
      api.engine.setPointer((p.x / p.w) * 2 - 1, -((p.y / p.h) * 2 - 1));
      if (!interactive) return;
      if (pointers.has(e.pointerId)) pointers.set(e.pointerId, p);
      if (pointers.size === 1 && e.buttons === 1) {
        const view = api.engine.getView();
        const worldPerPx = (2 * view.distance * Math.tan((45 * Math.PI) / 360)) / p.h;
        api.engine.setView({ panX: view.panX - e.movementX * worldPerPx, panY: view.panY + e.movementY * worldPerPx });
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
    };
    const onUp = (e) => {
      pointers.delete(e.pointerId);
      pinchDistance = 0;
      const api = apiRef.current;
      if (!api || !interactive || dragged) return;
      const p = local(e);
      callbacks.current.onSelect?.(api.engine.pick(p.x, p.y));
    };
    const onLeave = () => {
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
    getFrameDates: () => apiRef.current?.frameDates ?? [],
    setHighlightSet: (set) => apiRef.current?.engine.setHighlightSet(set),
    setParams: (p) => apiRef.current?.engine.setParams(p),
    setLayoutParams: (p) => apiRef.current?.worker.postMessage({ type: 'params', params: p }),
    getParams: () => apiRef.current?.engine.getParams() ?? null,
  }));

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
