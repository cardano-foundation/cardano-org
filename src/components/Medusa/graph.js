/**
 * Live node set built from the monthly delta frames in ledger-history.json.
 * Pure JavaScript, used on the main thread (labels, subtree highlight) and
 * inside layout.js (simulation). Ids are never reused across frames.
 */

export function createGraph(history) {
  const { frames, paths } = history;
  const nodes = new Map();
  let frameIndex = -1;

  function applyFrame(i) {
    const frame = frames[i];
    const removed = frame.rm.slice();
    removed.forEach((id) => nodes.delete(id));
    const added = frame.add.map(([id, parent, group, isDir]) => {
      const parentNode = parent === -1 ? null : nodes.get(parent);
      const node = {
        id,
        parent,
        group,
        isDir: isDir === 1,
        depth: parentNode ? parentNode.depth + 1 : 0,
        path: paths[id],
      };
      nodes.set(id, node);
      return node;
    });
    frameIndex = i;
    return { added, removed };
  }

  function step() {
    if (frameIndex >= frames.length - 1) throw new Error('already at the last frame');
    return applyFrame(frameIndex + 1);
  }

  function reset() {
    nodes.clear();
    frameIndex = -1;
  }

  return {
    get frameIndex() {
      return frameIndex;
    },
    get: (id) => nodes.get(id),
    alive: () => nodes.values(),
    aliveCount: () => nodes.size,
    step,
    seek(i) {
      if (i === frameIndex) return { added: [], removed: [] };
      if (i === frameIndex + 1) return step();
      const before = new Set(nodes.keys());
      reset();
      for (let k = 0; k <= i; k += 1) applyFrame(k);
      const added = [...nodes.values()].filter((n) => !before.has(n.id));
      const removed = [...before].filter((id) => !nodes.has(id));
      return { added, removed };
    },
    childCount(id) {
      let count = 0;
      nodes.forEach((n) => {
        if (n.parent === id) count += 1;
      });
      return count;
    },
    subtree(id) {
      const children = new Map();
      nodes.forEach((n) => {
        if (n.parent === -1) return;
        if (!children.has(n.parent)) children.set(n.parent, []);
        children.get(n.parent).push(n.id);
      });
      const set = new Set([id]);
      const stack = [id];
      while (stack.length) {
        const current = stack.pop();
        (children.get(current) || []).forEach((child) => {
          set.add(child);
          stack.push(child);
        });
      }
      return set;
    },
  };
}
