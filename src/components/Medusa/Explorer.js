import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { translate } from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Medusa from './index.js';
import DevPanel from './DevPanel.js';
import Controls from './Controls.js';
import Legend from './Legend.js';
import HoverLabel from './HoverLabel.js';
import MilestoneCard from './MilestoneCard.js';
import useMedusaKeys from './useMedusaKeys.js';
import { MILESTONES, HARD_FORK_KEYS } from '@site/src/data/medusa/milestones.js';
import { GROUPS } from './groups.js';
import { canRunWebGL, medusaFlag } from './webgl.js';
import styles from './explorer.module.css';

const SPEEDS = [1, 2, 4];
const HASH = /^#(\d{4}-\d{2})$/;

export default function Explorer() {
  const ref = useRef(null);
  const containerRef = useRef(null);
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
  const [card, setCard] = useState(null);
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

  const onReady = useCallback(({ frameDates: dates }) => {
    setFrameDates(dates);
    if (initialDate) ref.current?.seekToDate(initialDate);
  }, [initialDate]);

  const onFrame = useCallback((info) => {
    setState({ index: info.index, date: info.date, paused: info.paused, speed: info.speed });
    const graph = ref.current?.getGraph();
    if (graph) {
      const groups = new Set();
      for (const node of graph.alive()) groups.add(node.group);
      setPresent(new Set([...groups].map((i) => GROUPS[i].key)));
    }
    if (info.date) window.history.replaceState(null, '', `#${info.date}`);
  }, []);

  const onMilestone = useCallback((m) => {
    setCard((current) => (cardsEnabled ? m : current));
  }, [cardsEnabled]);

  const onSelect = useCallback((id) => {
    const graph = ref.current?.getGraph();
    if (id === null || !graph) {
      setPinned(null);
      ref.current?.setHighlightSet(null);
      return;
    }
    setPinned(id);
    ref.current?.setHighlightSet(graph.subtree(id));
  }, []);

  const jumpToMilestone = useCallback((n) => {
    const key = HARD_FORK_KEYS[n];
    const m = MILESTONES.find((x) => x.key === key);
    if (!m) return;
    ref.current?.seekToDate(m.date);
    ref.current?.pause();
    setCard(m);
  }, []);

  const fullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    else containerRef.current?.requestFullscreen?.();
  }, []);

  const handlers = useMemo(() => ({
    toggle: () => ref.current?.toggle(),
    step: (d) => {
      ref.current?.pause();
      ref.current?.step(d);
    },
    speed: (dir) => {
      const i = SPEEDS.indexOf(ref.current?.getState()?.speed ?? 1);
      const next = SPEEDS[Math.max(0, Math.min(SPEEDS.length - 1, i + dir))];
      ref.current?.setSpeed(next);
      setState((s) => ({ ...s, speed: next }));
    },
    milestone: jumpToMilestone,
    toggleLabels: () => setLabels((v) => !v),
    fullscreen,
    toggleUi: () => setUiHidden((v) => !v),
    toggleCards: () => setCardsEnabled((v) => !v),
    clear: () => onSelect(null),
  }), [jumpToMilestone, fullscreen, onSelect]);
  useMedusaKeys(handlers);

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
  // render that needs a path is driven by hover or pin state, so reading the
  // graph here always sees the live instance.
  // eslint-disable-next-line react-hooks/refs
  const graph = ref.current?.getGraph();
  const labelId = pinned ?? (labels ? hovered : null);
  const labelPath = labelId !== null && graph ? graph.get(labelId)?.path : null;

  return (
    <div ref={containerRef} className={clsx(styles.explorer, uiHidden && styles.uiHidden)}>
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
      {labelPath && <HoverLabel id={labelId} path={labelPath} target={ref} pinned={pinned !== null} />}
      {card && cardsEnabled && <MilestoneCard milestone={card} onDismiss={() => setCard(null)} />}
      <div className={styles.ui} hidden={uiHidden}>
        <Legend present={present} active={highlightGroup} onToggle={(key) => setHighlightGroup((k) => (k === key ? null : key))} />
        <Controls
          frameDates={frameDates}
          index={state.index}
          paused={state.paused}
          speed={state.speed}
          onSeek={(i) => {
            ref.current?.pause();
            ref.current?.seekTo(i);
          }}
          onToggle={handlers.toggle}
          onStep={handlers.step}
          onSpeed={(s) => {
            ref.current?.setSpeed(s);
            setState((st) => ({ ...st, speed: s }));
          }}
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
