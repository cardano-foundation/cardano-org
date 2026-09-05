import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import styles from './explorer.module.css';

function shorten(path, max = 40) {
  if (path.length <= max) return path;
  const keep = Math.floor((max - 3) / 2);
  return `${path.slice(0, keep)}...${path.slice(-keep)}`;
}

// Follows a node on screen. Position is read from the engine every animation
// frame so the label sticks to the moving point. It stays invisible until the
// first projection, otherwise it would flash in the top left corner.
export default function HoverLabel({ id, path, target, pinned }) {
  const ref = useRef(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const p = target.current?.project(id);
      if (ref.current && p) {
        ref.current.style.transform = `translate(${p.x + 10}px, ${p.y - 10}px)`;
        ref.current.style.visibility = 'visible';
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [id, target]);
  return (
    <div
      ref={ref}
      className={clsx(styles.label, pinned && styles.labelPinned)}
      style={{ visibility: 'hidden' }}
      aria-live={pinned ? 'polite' : undefined}
    >
      {shorten(path)}
    </div>
  );
}
