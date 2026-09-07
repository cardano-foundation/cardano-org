import React, { useEffect, useRef } from 'react';
import { translate } from '@docusaurus/Translate';
import { GROUPS } from './groups.js';
import { splitPath } from './nodeText.js';
import styles from './explorer.module.css';

const DIR_MAX = 34;

// Shortens a directory from the left, dropping whole leading segments so the
// tail that actually tells you where you are stays readable.
function shortenLeft(dir, max = DIR_MAX) {
  if (dir.length <= max) return dir;
  const segments = dir.split('/').filter(Boolean);
  let tail = '';
  for (let i = segments.length - 1; i >= 0; i -= 1) {
    const next = `${segments[i]}/${tail}`;
    // The ellipsis prefix costs four characters.
    if (next.length + 4 > max) break;
    tail = next;
  }
  // A single segment longer than the budget still has to be cut somewhere.
  if (!tail) tail = dir.slice(-(max - 4));
  return `.../${tail}`;
}

function FolderGlyph() {
  return (
    <svg className={styles.labelIcon} width="12" height="12" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M1.5 2h3.7l1.4 1.8h7.9A1.5 1.5 0 0 1 16 5.3v7.2a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2z"
      />
    </svg>
  );
}

// Follows a node on screen. Position is read from the engine every animation
// frame so the label sticks to the moving point. It stays invisible until the
// first projection, otherwise it would flash in the top left corner.
export default function HoverLabel({ node, childCount, target }) {
  const ref = useRef(null);
  const id = node.id;
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
  const { dir, name } = splitPath(node.path);
  return (
    <div ref={ref} className={styles.label} style={{ visibility: 'hidden' }}>
      <span className={styles.labelDot} style={{ background: GROUPS[node.group]?.color }} />
      <span className={styles.labelBody}>
        {dir && <span className={styles.labelDir}>{shortenLeft(dir)}</span>}
        <span className={styles.labelName}>
          {node.isDir && <FolderGlyph />}
          {name}
        </span>
        {node.isDir && (
          <span className={styles.labelCount}>
            {translate({ id: 'medusa.node.files', message: '{count} files' }, { count: childCount })}
          </span>
        )}
      </span>
    </div>
  );
}
