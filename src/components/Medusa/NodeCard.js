import React, { useEffect, useRef } from 'react';
import { translate } from '@docusaurus/Translate';
import { GROUPS } from './groups.js';
import { groupLabel } from './groupLabels.js';
import { splitPath } from './nodeText.js';
import styles from './explorer.module.css';

const OFFSET = 14;
const MARGIN = 8;

// The repository state of the month on screen, so the link opens the file as it
// looked back then instead of on the current default branch.
function githubUrl(repo, commit, node) {
  if (!repo || !commit) return null;
  if (node.path === '/') return `https://github.com/${repo}/tree/${commit}`;
  return `https://github.com/${repo}/${node.isDir ? 'tree' : 'blob'}/${commit}/${node.path}`;
}

// The pinned node keeps a card instead of the hover label. It follows the node
// the same way, but stays fully inside the explorer so its link is reachable.
export default function NodeCard({ node, childCount, target, containerRef, repo, commit, onClose }) {
  const ref = useRef(null);
  const id = node.id;
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const p = target.current?.project(id);
      const el = ref.current;
      const box = containerRef.current;
      if (el && p && box) {
        const maxX = Math.max(MARGIN, box.clientWidth - el.offsetWidth - MARGIN);
        const maxY = Math.max(MARGIN, box.clientHeight - el.offsetHeight - MARGIN);
        const x = Math.min(Math.max(MARGIN, p.x + OFFSET), maxX);
        const y = Math.min(Math.max(MARGIN, p.y - OFFSET), maxY);
        el.style.transform = `translate(${x}px, ${y}px)`;
        el.style.visibility = 'visible';
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [id, target, containerRef]);

  const { dir, name } = splitPath(node.path);
  const url = githubUrl(repo, commit, node);
  const files = node.isDir
    ? translate({ id: 'medusa.node.files', message: '{count} files' }, { count: childCount })
    : null;

  return (
    <div ref={ref} className={styles.nodeCard} style={{ visibility: 'hidden' }} role="status">
      <button
        type="button"
        className={styles.cardClose}
        onClick={onClose}
        aria-label={translate({ id: 'medusa.card.close', message: 'Dismiss' })}
      >
        ×
      </button>
      <div className={styles.nodeEra}>
        <span className={styles.labelDot} style={{ background: GROUPS[node.group]?.color }} />
        {groupLabel(GROUPS[node.group]?.key)}
      </div>
      <p className={styles.nodePath}>
        {dir}
        <strong>{name}</strong>
      </p>
      <p className={styles.nodeType}>
        {node.isDir
          ? translate({ id: 'medusa.node.folder', message: 'Folder' })
          : translate({ id: 'medusa.node.file', message: 'File' })}
        {files && <span className={styles.nodeCount}>{files}</span>}
      </p>
      {url && (
        <a className={styles.nodeLink} href={url} target="_blank" rel="noopener noreferrer">
          {translate({ id: 'medusa.node.github', message: 'View on GitHub at this month' })}
        </a>
      )}
    </div>
  );
}
