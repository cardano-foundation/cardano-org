/**
 * Web Worker bridge around layout.js. Owns the simulation timer and posts
 * positions as transferable typed arrays about 30 times per second.
 */
import { createLayout } from './layout.js';

let tickMs = 33;
// d3's alphaMin: below it the simulation no longer moves, so ticking and
// posting positions would only burn a core. Steps and seeks reheat.
const ALPHA_MIN = 0.001;
// Upper bound for settling a frame that arrives while the timer is stopped.
const MAX_SETTLE_TICKS = 120;
let layout = null;
let timer = null;

// A frame advanced while the timer is stopped would leave its new nodes on
// top of their parent, so settle it here instead, but only as far as needed.
function settleIfStopped() {
  if (timer) return;
  for (let i = 0; i < MAX_SETTLE_TICKS && layout.alpha() >= ALPHA_MIN; i += 1) layout.tick(1);
}

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
      settleIfStopped();
      send();
      break;
    case 'seek':
      layout.seek(msg.frameIndex);
      settleIfStopped();
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
