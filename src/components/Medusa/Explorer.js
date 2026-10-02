import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { translate } from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Medusa from './index.js';
import DevPanel from './DevPanel.js';
import Controls from './Controls.js';
import Legend from './Legend.js';
import HoverLabel from './HoverLabel.js';
import NodeCard from './NodeCard.js';
import MilestoneCard from './MilestoneCard.js';
import useMedusaKeys from './useMedusaKeys.js';
import { MILESTONES, HARD_FORK_KEYS } from '@site/src/data/medusa/milestones.js';
import { GROUPS } from './groups.js';
import { canRunWebGL, medusaFlag, prefersReducedMotion } from './webgl.js';
import { frameIndexForDate, SPEEDS } from './playback.js';
import styles from './explorer.module.css';

const HASH = /^#(\d{4}-\d{2})$/;

function sameSet(a, b) {
  if (a.size !== b.size) return false;
  for (const key of b) if (!a.has(key)) return false;
  return true;
}
const HASH_DELAY = 250;

export default function Explorer() {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const hashTimer = useRef(0);
  const lastHash = useRef(null);
  const [supported, setSupported] = useState(true);
  const [frameDates, setFrameDates] = useState([]);
  const [state, setState] = useState({ index: 0, date: '', paused: true, speed: 1 });
  const [present, setPresent] = useState(new Set());
  const [highlightGroup, setHighlightGroup] = useState(null);
  const [labels, setLabels] = useState(true);
  const [uiHidden, setUiHidden] = useState(() => medusaFlag('still'));
  const [cardsEnabled, setCardsEnabled] = useState(true);
  const [hovered, setHovered] = useState(null);
  const [pinned, setPinned] = useState(null);
  // The frame callback never rerenders with fresh state, so it reads the pin
  // from a ref that every write to the state keeps in sync.
  const pinnedRef = useRef(null);
  // The open chapter card, by milestone key. Scrubbing into another chapter
  // folds the card on its own because the key no longer matches.
  const [expandedKey, setExpandedKey] = useState(null);
  // The first frame report already rewrites the hash, so the shared date has to
  // be read before the canvas mounts.
  const [initialDate] = useState(() => {
    if (typeof window === 'undefined') return null;
    const m = HASH.exec(window.location.hash);
    return m ? `${m[1]}-01` : null;
  });
  const fallbackImage = useBaseUrl('/img/hero-header-medusa-fallback.jpg');

  useEffect(() => {
    // Client only checks, the server renders the supported branch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(canRunWebGL());
  }, []);

  useEffect(() => () => clearTimeout(hashTimer.current), []);

  // The navbar is taller than --ifm-navbar-height and the closeable
  // announcement bar sits above it, so the space left for the explorer is
  // measured instead of guessed. Body and html are pinned to the viewport
  // height, so closing the bar only shows up as a resize of the app root.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    let frame = 0;
    const measure = () => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      el.style.setProperty('--explorer-top', `${Math.max(0, Math.round(top))}px`);
    };
    // The new height resizes the root again, so measuring inside the observer
    // callback would trip the ResizeObserver loop error.
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    const observer = new ResizeObserver(schedule);
    observer.observe(document.getElementById('__docusaurus') ?? document.body);
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, [supported]);

  const onReady = useCallback(({ frameDates: dates }) => {
    setFrameDates(dates);
    // A shared moment stays put, a plain visit starts the story right away.
    if (initialDate) {
      ref.current?.seekToDate(initialDate);
    } else if (!prefersReducedMotion() && !medusaFlag('still')) {
      ref.current?.play();
      setState((st) => ({ ...st, paused: false }));
    }
  }, [initialDate]);

  const onFrame = useCallback((info) => {
    setState({ index: info.index, date: info.date, paused: info.paused, speed: info.speed });
    const graph = ref.current?.getGraph();
    if (graph) {
      const groups = new Set();
      for (const node of graph.alive()) groups.add(node.group);
      const nextPresent = new Set([...groups].map((i) => GROUPS[i].key));
      // The eras rarely change from one frame to the next, and a fresh Set
      // every frame would rerender the legend sixty times a second.
      setPresent((prev) => (sameSet(prev, nextPresent) ? prev : nextPresent));
      // An era that is no longer in the frame has no chip left to switch off,
      // so its highlight would dim everything for good.
      setHighlightGroup((k) => (k !== null && !nextPresent.has(k) ? null : k));
      // A pinned file can be deleted a few months later. Without this the card
      // sticks to a node that is gone, together with its subtree highlight.
      if (pinnedRef.current !== null && !graph.get(pinnedRef.current)) {
        pinnedRef.current = null;
        setPinned(null);
        ref.current?.setHighlightSet(null);
      }
    }
    // Safari refuses more than about a hundred replaceState calls per half
    // minute, and a throw in the frame callback would stop the animation.
    if (info.date && info.date !== lastHash.current) {
      lastHash.current = info.date;
      clearTimeout(hashTimer.current);
      hashTimer.current = setTimeout(() => {
        try {
          window.history.replaceState(null, '', `#${info.date}`);
        } catch (err) {
          void err;
        }
      }, HASH_DELAY);
    }
  }, []);

  const markers = useMemo(
    () => MILESTONES.map((m) => ({ ...m, frame: frameIndexForDate(frameDates, m.date) })).filter((m) => m.frame >= 0),
    [frameDates],
  );
  // Seeks and backward steps emit no milestone event, so the chapter is read
  // from the frame index instead of collected from events.
  const chapter = markers.findLast((m) => m.frame <= state.index) ?? null;

  const onMilestone = useCallback((m) => {
    if (cardsEnabled) setExpandedKey(m.key);
  }, [cardsEnabled]);

  const expandCard = useCallback(() => setExpandedKey(chapter?.key ?? null), [chapter?.key]);
  const collapseCard = useCallback(() => setExpandedKey(null), []);

  const onSelect = useCallback((id) => {
    const graph = ref.current?.getGraph();
    if (id === null || !graph) {
      pinnedRef.current = null;
      setPinned(null);
      ref.current?.setHighlightSet(null);
      return;
    }
    pinnedRef.current = id;
    setPinned(id);
    ref.current?.setHighlightSet(graph.subtree(id));
  }, []);

  const clearPin = useCallback(() => onSelect(null), [onSelect]);

  // play(), pause() and the end of the timeline emit no frame, so the button
  // state is read back from the clock after every command that changes it.
  const syncPaused = useCallback(() => {
    const s = ref.current?.getState();
    if (s) setState((st) => ({ ...st, paused: s.paused }));
  }, []);

  const openMilestone = useCallback((m) => {
    ref.current?.pause();
    ref.current?.seekToDate(m.date);
    syncPaused();
    if (cardsEnabled) setExpandedKey(m.key);
  }, [syncPaused, cardsEnabled]);

  const jumpToMilestone = useCallback((n) => {
    const m = MILESTONES.find((x) => x.key === HARD_FORK_KEYS[n]);
    if (m) openMilestone(m);
  }, [openMilestone]);

  const fullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    else containerRef.current?.requestFullscreen?.();
  }, []);

  const seekTo = useCallback((i) => {
    ref.current?.pause();
    ref.current?.seekTo(i);
    syncPaused();
  }, [syncPaused]);

  const setSpeed = useCallback((n) => {
    ref.current?.setSpeed(n);
    setState((s) => ({ ...s, speed: n }));
  }, []);

  const handlers = useMemo(() => ({
    toggle: () => {
      ref.current?.toggle();
      syncPaused();
    },
    step: (d) => {
      ref.current?.pause();
      ref.current?.step(d);
      syncPaused();
    },
    speed: (dir) => {
      const i = SPEEDS.indexOf(ref.current?.getState()?.speed ?? 1);
      setSpeed(SPEEDS[Math.max(0, Math.min(SPEEDS.length - 1, i + dir))]);
    },
    milestone: jumpToMilestone,
    toggleLabels: () => setLabels((v) => !v),
    fullscreen,
    toggleUi: () => setUiHidden((v) => !v),
    toggleCards: () => {
      setCardsEnabled(!cardsEnabled);
      if (cardsEnabled) setExpandedKey(null);
    },
    clear: () => {
      onSelect(null);
      setHighlightGroup(null);
      // Escape also gives the keyboard back to the page, otherwise a control
      // button keeps the focus ring and swallows the next space.
      document.activeElement?.blur?.();
    },
  }), [jumpToMilestone, fullscreen, onSelect, syncPaused, setSpeed, cardsEnabled]);
  useMedusaKeys(handlers, supported, containerRef);

  if (!supported) {
    return (
      <div className={styles.explorer}>
        <img className={styles.fallback} src={fallbackImage} alt="" />
        <p className={styles.noWebgl}>
          {translate({ id: 'medusa.page.noWebgl', message: 'This visualization needs WebGL, which your browser or device does not provide.' })}{' '}
          <Link to="/hardforks">{translate({ id: 'medusa.page.noWebglLink', message: 'Read about the hard forks instead.' })}</Link>
        </p>
      </div>
    );
  }

  // The canvas fills the ref long before a hover or a pin can happen, and every
  // render that needs a node is driven by hover or pin state, so reading the
  // graph here always sees the live instance. The commit follows the frame,
  // which rerenders this component anyway.
  /* eslint-disable react-hooks/refs */
  const api = ref.current;
  const graph = api?.getGraph();
  const repo = api?.getRepo();
  const commit = api?.getFrameCommit();
  /* eslint-enable react-hooks/refs */
  const labelId = pinned ?? (labels ? hovered : null);
  const labelNode = labelId !== null && graph ? graph.get(labelId) : null;
  const childCount = labelNode?.isDir ? graph.childCount(labelNode.id) : 0;

  return (
    <div ref={containerRef} className={styles.explorer}>
      <Medusa
        ref={ref}
        mode="explore"
        interactive
        className={styles.canvas}
        highlightGroup={highlightGroup}
        onReady={onReady}
        onFrame={onFrame}
        onMilestone={onMilestone}
        onHover={setHovered}
        onSelect={onSelect}
        ariaLabel={translate({ id: 'medusa.page.canvasLabel', message: 'Interactive file tree of the cardano-ledger repository over time' })}
      />
      {labelNode && (pinned !== null ? (
        <NodeCard
          node={labelNode}
          childCount={childCount}
          target={ref}
          containerRef={containerRef}
          repo={repo}
          commit={commit}
          onClose={clearPin}
        />
      ) : (
        <HoverLabel node={labelNode} childCount={childCount} target={ref} />
      ))}
      {chapter && cardsEnabled && (
        <MilestoneCard milestone={chapter} expanded={expandedKey === chapter.key} onExpand={expandCard} onCollapse={collapseCard} />
      )}
      <div className={styles.ui} hidden={uiHidden}>
        <Legend present={present} active={highlightGroup} onToggle={(key) => setHighlightGroup((k) => (k === key ? null : key))} />
        <Controls
          frameDates={frameDates}
          markers={markers}
          chapterKey={chapter?.key}
          index={state.index}
          paused={state.paused}
          speed={state.speed}
          onSeek={seekTo}
          onToggle={handlers.toggle}
          onStep={handlers.step}
          onSpeed={setSpeed}
          onMilestone={openMilestone}
          onFullscreen={fullscreen}
        />
        <p className={styles.hint}>
          {translate({ id: 'medusa.page.hint', message: 'Space plays and pauses, arrows step, 1 to 9 jump to hard forks, L labels, F fullscreen, H hides this bar.' })}
        </p>
      </div>
      <DevPanel target={ref} />
    </div>
  );
}
