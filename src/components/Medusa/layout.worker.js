/**
 * Web Worker bridge around layout.js. Owns the simulation timer and posts
 * positions as transferable typed arrays about 30 times per second.
 */
import { createLayout } from './layout.js';

let tickMs = 33;
// d3's alphaMin: below it the simulation no longer moves, so ticking and
// posting positions would only burn a core. Steps and seeks reheat.
const ALPHA_MIN = 0.001;
// Bounded settle for an incremental step that arrives while the timer is
// stopped, otherwise the new nodes would stay on top of their parent.
const PAUSED_STEP_TICKS = 120;
let layout = null;
let timer = null;

function send() {
  const { ids, xy } = layout.positions();
  self.postMessage({ type: 'positions', frameIndex: layout.graph.frameIndex, ids, xy }, [ids.buffer, xy.buffer]);
}

function start() {
  if (timer) return;
  timer = setInterval(() => {
    if (layout.alpha() < ALPHA_MIN) return;
    layout.tick(1);
    send();
  }, tickMs);
}

function stop() {
  if (!timer) return;
  clearInterval(timer);
  timer = null;
}

self.onmessage = (event) => {
  const msg = event.data;
  if (msg.type === 'init') {
    if (typeof msg.tickMs === 'number' && msg.tickMs > 0) tickMs = msg.tickMs;
    layout = createLayout(msg.history, msg.params);
    layout.seek(msg.frameIndex || 0);
    send();
    start();
    return;
  }
  if (!layout) return;
  switch (msg.type) {
    case 'step':
      layout.step();
      if (!timer) layout.tick(PAUSED_STEP_TICKS);
      send();
      break;
    case 'seek':
      layout.seek(msg.frameIndex);
      send();
      break;
    case 'params':
      layout.setParams(msg.params);
      break;
    case 'pause':
      stop();
      break;
    case 'resume':
      start();
      break;
    default:
      break;
  }
};
