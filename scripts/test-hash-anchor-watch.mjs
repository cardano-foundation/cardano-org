import test from 'node:test';
import assert from 'node:assert/strict';
import { watchHashAnchor, WATCH_MS } from '../src/utils/hashAnchorWatch.mjs';

// Minimal browser stand-ins: a window with event listeners and a resize
// observer the test can trigger by hand.
function fakeEnv(hash = '#donate') {
  const listeners = new Map();
  const observers = [];
  const scrolls = [];
  const win = {
    location: { hash },
    addEventListener: (type, fn) => listeners.set(type, fn),
    removeEventListener: (type) => listeners.delete(type),
  };
  class FakeResizeObserver {
    constructor(cb) {
      this.cb = cb;
      this.active = false;
      observers.push(this);
    }
    observe() {
      this.active = true;
    }
    disconnect() {
      this.active = false;
    }
  }
  const doc = { body: {}, getElementById: (id) => ({ id }) };
  const resize = () => observers.forEach((o) => o.active && o.cb());
  return { win, doc, FakeResizeObserver, listeners, observers, scrolls, resize, scrollTo: (el) => scrolls.push(el.id) };
}

test('re-scrolls to the anchor after the page grows', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const env = fakeEnv();
  watchHashAnchor({ win: env.win, doc: env.doc, ResizeObserverImpl: env.FakeResizeObserver, scrollTo: env.scrollTo });
  env.resize();
  t.mock.timers.tick(200);
  assert.deepEqual(env.scrolls, ['donate']);
});

test('keeps watching longer than the 10 s API timeout', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const env = fakeEnv();
  watchHashAnchor({ win: env.win, doc: env.doc, ResizeObserverImpl: env.FakeResizeObserver, scrollTo: env.scrollTo });
  t.mock.timers.tick(10500);
  env.resize();
  t.mock.timers.tick(200);
  assert.deepEqual(env.scrolls, ['donate']);
  assert.ok(WATCH_MS > 10000);
});

test('a click or tap stops the watch', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const env = fakeEnv();
  watchHashAnchor({ win: env.win, doc: env.doc, ResizeObserverImpl: env.FakeResizeObserver, scrollTo: env.scrollTo });
  env.listeners.get('pointerdown')();
  env.resize();
  t.mock.timers.tick(200);
  assert.deepEqual(env.scrolls, []);
});

test('does nothing without a usable hash', () => {
  const env = fakeEnv('#%E0%A4%A');
  const stop = watchHashAnchor({ win: env.win, doc: env.doc, ResizeObserverImpl: env.FakeResizeObserver, scrollTo: env.scrollTo });
  assert.equal(env.observers.length, 0);
  assert.equal(typeof stop, 'function');
});
