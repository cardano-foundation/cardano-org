/**
 * d3-force simulation for the medusa graph. Pure JavaScript, no Worker API,
 * so it runs in Node for tests and inside layout.worker.js in the browser.
 * The simulation is ticked manually, it never runs its own timer.
 */
import { forceSimulation, forceManyBody, forceLink, forceX, forceY } from 'd3-force';
import { createGraph } from './graph.js';
import { LAYOUT_DEFAULTS } from './defaults.js';

export { LAYOUT_DEFAULTS };

export function createLayout(history, params = {}) {
  const p = { ...LAYOUT_DEFAULTS, ...params };
  const graph = createGraph(history);
  const simNodes = [];
  const byId = new Map();
  let links = [];

  // Deterministic jitter so a given history always lays out the same way.
  let seed = 12345;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647 - 0.5;
  };

  const sim = forceSimulation([]).stop().alphaDecay(0.02).alphaMin(0.001);

  function applyForces() {
    sim
      .velocityDecay(p.velocityDecay)
      .force(
        'charge',
        forceManyBody()
          .strength((n) => (n.isDir ? p.chargeDir : p.chargeFile))
          .theta(p.theta)
          .distanceMax(p.distanceMax),
      )
      .force(
        'link',
        forceLink(links)
          .id((d) => d.id)
          .distance((l) => (l.target.isDir ? p.linkDir : p.linkFile))
          .strength((l) => 1 / (1 + 0.25 * l.target.depth)),
      )
      .force('x', forceX(0).strength(p.center))
      .force('y', forceY(0).strength(p.center));
  }

  const idOf = (x) => (typeof x === 'object' ? x.id : x);

  function addNode(node) {
    const parent = node.parent === -1 ? null : byId.get(node.parent);
    const d = {
      id: node.id,
      isDir: node.isDir,
      depth: node.depth,
      x: parent ? parent.x + rand() * p.spawnJitter : 0,
      y: parent ? parent.y + rand() * p.spawnJitter : 0,
      vx: 0,
      vy: 0,
    };
    simNodes.push(d);
    byId.set(d.id, d);
    if (parent) links.push({ source: d.id, target: parent.id });
  }

  function apply(delta, reheat) {
    delta.removed.forEach((id) => byId.delete(id));
    delta.added.forEach(addNode);
    const alive = simNodes.filter((n) => byId.has(n.id));
    simNodes.length = 0;
    simNodes.push(...alive);
    links = links.filter((l) => byId.has(idOf(l.source)) && byId.has(idOf(l.target)));
    sim.nodes(simNodes);
    applyForces();
    sim.alpha(Math.max(sim.alpha(), reheat));
  }

  return {
    graph,
    step() {
      apply(graph.step(), p.reheat);
    },
    seek(i) {
      if (i === graph.frameIndex) return;
      const incremental = i === graph.frameIndex + 1;
      const delta = graph.seek(i);
      apply(delta, incremental ? p.reheat : 1);
      if (!incremental) for (let k = 0; k < p.settleTicks; k += 1) sim.tick();
    },
    tick(n = 1) {
      for (let k = 0; k < n; k += 1) sim.tick();
    },
    positions() {
      const ids = new Int32Array(simNodes.length);
      const xy = new Float32Array(simNodes.length * 2);
      simNodes.forEach((n, i) => {
        ids[i] = n.id;
        xy[2 * i] = n.x;
        xy[2 * i + 1] = n.y;
      });
      return { ids, xy };
    },
    setParams(next) {
      Object.assign(p, next);
      applyForces();
      sim.alpha(Math.max(sim.alpha(), p.reheat));
    },
    count: () => simNodes.length,
  };
}
