import React, { useEffect, useRef } from 'react';
import { translate } from '@docusaurus/Translate';
import { usePluralForm } from '@docusaurus/theme-common';
import { GROUPS } from './groups.js';
import { groupLabel } from './groupLabels.js';
import { splitPath } from './nodeText.js';
import styles from './explorer.module.css';

const OFFSET = 14;
const MARGIN = 8;

// The repository state of the month on screen, so the link opens the file as it
// looked back then instead of on the current default branch. Paths keep their
// slashes but everything else is encoded, a hash or a question mark in a name
// would otherwise cut the URL short.
function githubUrl(repo, commit, node) {
  if (!repo || !commit) return null;
  if (node.path === '/') return `https://github.com/${repo}/tree/${commit}`;
  return `https://github.com/${repo}/${node.isDir ? 'tree' : 'blob'}/${commit}/${encodeURI(node.path)}`;
}

// The pinned node keeps a card instead of the hover label. It follows the node
// the same way, but stays fully inside the explorer so its link is reachable.
export default function NodeCard({ node, childCount, target, containerRef, repo, commit, onClose }) {
  const ref = useRef(null);
  const { selectMessage } = usePluralForm();
  const id = node.id;
  useEffect(() => {
    const el = ref.current;
    const box = containerRef.current;
    if (!el || !box) return undefined;
    // Reading the layout forces a reflow, and neither box changes size while
    // the same node is pinned, so both are measured once here and again when
    // something actually resizes.
    let cardW = 0;
    let cardH = 0;
    let boxW = 0;
    let boxH = 0;
    const measure = () => {
      cardW = el.offsetWidth;
      cardH = el.offsetHeight;
      boxW = box.clientWidth;
      boxH = box.clientHeight;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    observer.observe(el);
    let raf = 0;
    const update = () => {
      const p = target.current?.project(id);
      if (p) {
        const maxX = Math.max(MARGIN, boxW - cardW - MARGIN);
        const maxY = Math.max(MARGIN, boxH - cardH - MARGIN);
        const x = Math.min(Math.max(MARGIN, p.x + OFFSET), maxX);
        const y = Math.min(Math.max(MARGIN, p.y - OFFSET), maxY);
        el.style.transform = `translate(${x}px, ${y}px)`;
        el.style.visibility = 'visible';
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [id, target, containerRef]);

  const { dir, name } = splitPath(node.path);
  const url = githubUrl(repo, commit, node);
  const items = node.isDir
    ? selectMessage(
      childCount,
      translate({ id: 'medusa.node.items', message: '{count} item|{count} items' }, { count: childCount }),
    )
    : null;
  // currentColor drives the dot glow, so the era color has to be set as the
  // text color too, not only as the background.
  const eraColor = GROUPS[node.group]?.color;

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
        <span className={styles.labelDot} style={{ background: eraColor, color: eraColor }} />
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
        {items && <span className={styles.nodeCount}>{items}</span>}
      </p>
      {url && (
        <a className={styles.nodeLink} href={url} target="_blank" rel="noopener noreferrer">
          {translate({ id: 'medusa.node.github', message: 'View on GitHub at this month' })}
        </a>
      )}
    </div>
  );
}
