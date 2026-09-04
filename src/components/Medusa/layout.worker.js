/**
 * Web Worker bridge around layout.js. Owns the simulation timer and posts
 * positions as transferable typed arrays about 30 times per second.
 */
import { createLayout } from './layout.js';

const TICK_MS = 33;
let layout = null;
let timer = null;

function send() {
  const { ids, xy } = layout.positions();
  self.postMessage({ type: 'positions', frameIndex: layout.graph.frameIndex, ids, xy }, [ids.buffer, xy.buffer]);
}

function start() {
  if (timer) return;
  timer = setInterval(() => {
    layout.tick(1);
    send();
  }, TICK_MS);
}

function stop() {
  if (!timer) return;
  clearInterval(timer);
  timer = null;
}

self.onmessage = (event) => {
  const msg = event.data;
  if (msg.type === 'init') {
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
