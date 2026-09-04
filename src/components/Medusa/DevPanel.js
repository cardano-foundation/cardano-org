import React, { useEffect, useState } from 'react';
import { ENGINE_DEFAULTS, LAYOUT_DEFAULTS } from './defaults.js';
import { medusaFlag } from './webgl.js';
import styles from './styles.module.css';

const ENGINE_SLIDERS = [
  ['pointSizeFile', 1, 8, 0.1],
  ['pointSizeDir', 2, 16, 0.1],
  ['pointAlpha', 0.1, 1, 0.01],
  ['lineAlpha', 0, 0.6, 0.01],
  ['trailDamp', 0.5, 0.98, 0.01],
  ['cameraDistance', 500, 2600, 10],
  ['dimFactor', 0.02, 0.6, 0.01],
  ['zSpread', 0, 400, 5],
];

const LAYOUT_SLIDERS = [
  ['chargeDir', -200, -5, 1],
  ['chargeFile', -60, -1, 1],
  ['linkDir', 10, 120, 1],
  ['linkFile', 4, 60, 1],
  ['center', 0, 0.1, 0.001],
  ['velocityDecay', 0.1, 0.9, 0.01],
];

// Tuning panel for the look, only rendered with ?medusa=panel. Values are
// copied into ENGINE_DEFAULTS and LAYOUT_DEFAULTS by hand once they feel right.
export default function DevPanel({ target }) {
  const [visible, setVisible] = useState(false);
  const [engine, setEngine] = useState({ ...ENGINE_DEFAULTS });
  const [layout, setLayout] = useState({ ...LAYOUT_DEFAULTS });

  useEffect(() => {
    // Client only: the query string is not known during server rendering.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(medusaFlag('panel'));
  }, []);

  if (!visible) return null;

  const updateEngine = (key, value) => {
    const next = { ...engine, [key]: value };
    setEngine(next);
    target.current?.setParams({ [key]: value });
  };
  const updateLayout = (key, value) => {
    const next = { ...layout, [key]: value };
    setLayout(next);
    target.current?.setLayoutParams(next);
  };

  return (
    <div className={styles.devPanel}>
      <strong>engine</strong>
      {ENGINE_SLIDERS.map(([key, min, max, step]) => (
        <label key={key}>
          {key}
          <input type="range" min={min} max={max} step={step} value={engine[key]} onChange={(e) => updateEngine(key, Number(e.target.value))} />
          {engine[key]}
        </label>
      ))}
      <label>
        background
        <input type="color" value={engine.background} onChange={(e) => updateEngine('background', e.target.value)} />
      </label>
      <strong>layout</strong>
      {LAYOUT_SLIDERS.map(([key, min, max, step]) => (
        <label key={key}>
          {key}
          <input type="range" min={min} max={max} step={step} value={layout[key]} onChange={(e) => updateLayout(key, Number(e.target.value))} />
          {layout[key]}
        </label>
      ))}
      <button type="button" onClick={() => console.log(JSON.stringify({ engine, layout }, null, 2))}>
        log params
      </button>
    </div>
  );
}
