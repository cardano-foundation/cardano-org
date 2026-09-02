import React, {useEffect, useLayoutEffect, useId, useMemo, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import OriginalDropdownNavbarItem from '@theme-original/NavbarItem/DropdownNavbarItem';
import {useWindowSize} from '@docusaurus/theme-common';
import {useLocation} from '@docusaurus/router';
import {translate} from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';

const HOVER_OPEN_DELAY = 80;
const HOVER_CLOSE_DELAY = 120;
// Keep in sync with the panel's max-width in src/css/custom.css, which
// reserves the same margin via calc(100vw - 32px), 32 = 2 * VIEWPORT_MARGIN.
const VIEWPORT_MARGIN = 16;

function FeaturedTile({featured}) {
  const image = useBaseUrl(featured.image);
  return (
    <Link className="megaMenuFeatured" to={featured.to} href={featured.href}>
      <img src={image} alt="" className="megaMenuFeaturedArt" decoding="async" />
      <div className="megaMenuFeaturedBody">
        <span className="megaMenuFeaturedTitle">
          {translate({id: `navbar.mega.featured.title.${featured.title}`, message: featured.title})}
        </span>
        <span className="megaMenuFeaturedDescription">
          {translate({id: `navbar.mega.featured.description.${featured.title}`, message: featured.description})}
        </span>
        <span className="megaMenuFeaturedCta">
          {translate({id: `navbar.mega.featured.cta.${featured.title}`, message: featured.cta})}
        </span>
      </div>
    </Link>
  );
}

function MegaColumn({column}) {
  return (
    <div className="megaMenuColumn">
      <div className="megaMenuColumnTitle">
        {translate({id: `navbar.mega.column.${column.title}`, message: column.title})}
      </div>
      <ul className="megaMenuColumnList">
        {column.items.map((item) => (
          <li className="megaMenuItem" key={item.label}>
            <Link className="megaMenuItemLink" to={item.to} href={item.href}>
              <span className="megaMenuItemContent">
                <span className="megaMenuItemLabel">
                  {translate({id: `navbar.mega.label.${item.label}`, message: item.label})}
                </span>
                {item.description && (
                  <span className="megaMenuItemDescription">
                    {translate({id: `navbar.mega.description.${item.label}`, message: item.description})}
                  </span>
                )}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MegaDropdownNavbarItem({label, className, customProps}) {
  const {featured, columns} = customProps;
  const [open, setOpen] = useState(false);
  // The panel contents mount on the first open and stay mounted. While no
  // panel content exists, its links cannot sit (invisibly) inside the
  // viewport, so Docusaurus does not prefetch all their route chunks and
  // tile images on every page load.
  const [everOpened, setEverOpened] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const hoverTimer = useRef(null);
  const location = useLocation();
  const panelId = useId();

  // Close when navigating, and clean pending timers on unmount.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  // While open: close on click outside, and on Escape regardless of where
  // focus sits (hover-opening never focuses the trigger, so a handler on
  // the item itself would not hear the key).
  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onPointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  // The panel centers on its trigger; near the viewport edges that center
  // position would push it off-screen, so compute a corrective shift the
  // transform picks up. The geometry comes from the untransformed trigger
  // plus the panel's layout width, never from the panel's own rect: the
  // panel animates its transform, so a rect read while that transition is
  // still running would fold the previous shift into the new one and make
  // the panel drift a little further on every reopen.
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const root = rootRef.current;
    if (!open || !panel || !root) {
      return;
    }
    const trigger = root.getBoundingClientRect();
    const width = panel.offsetWidth;
    const centeredLeft = trigger.left + trigger.width / 2 - width / 2;
    const centeredRight = centeredLeft + width;
    let shift = 0;
    if (centeredLeft < VIEWPORT_MARGIN) {
      shift = VIEWPORT_MARGIN - centeredLeft;
    } else if (centeredRight > window.innerWidth - VIEWPORT_MARGIN) {
      shift = window.innerWidth - VIEWPORT_MARGIN - centeredRight;
    }
    panel.style.setProperty('--mega-menu-shift', `${shift}px`);
  }, [open]);

  // Hover-intent opening is a mouse behavior; on touch the synthetic
  // mouseenter that precedes each tap would re-arm the open timer and
  // fight the click toggle. Only ever called from event handlers, so the
  // timer ref is never touched during render.
  const armHoverIntent = (event, next, delay) => {
    if (event.pointerType !== 'mouse') {
      return;
    }
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => {
      setOpen(next);
      if (next) {
        setEverOpened(true);
      }
    }, delay);
  };

  // The menu definition is a build-time constant, so build the subtree once.
  const inner = useMemo(() => {
    const tile = featured ? <FeaturedTile featured={featured} /> : null;
    const atEnd = featured?.placement === 'end';
    return (
      <div className="megaMenuInner">
        {!atEnd && tile}
        {columns.map((column) => (
          <MegaColumn key={column.title} column={column} />
        ))}
        {atEnd && tile}
      </div>
    );
  }, [featured, columns]);

  return (
    <li
      ref={rootRef}
      className={clsx('navbar__item', 'navbar__item--mega', className)}
      data-open={open || undefined}
      data-columns={columns.length}
      onPointerEnter={(event) => armHoverIntent(event, true, HOVER_OPEN_DELAY)}
      onPointerLeave={(event) => armHoverIntent(event, false, HOVER_CLOSE_DELAY)}>
      <button
        ref={triggerRef}
        className="navbar__link megaMenuTrigger"
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          clearTimeout(hoverTimer.current);
          const next = !open;
          setOpen(next);
          if (next) {
            setEverOpened(true);
          }
        }}>
        {label}
      </button>

      {/* Delegated convenience handler: closes the panel when any link in it
          is clicked. Keyboard users are covered because activating a link
          with Enter fires a click event, the div itself is not interactive. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        id={panelId}
        ref={panelRef}
        className="megaMenuPanel"
        onClick={(event) => {
          // Links to the current page produce no route change, which the
          // close-on-navigate effect cannot see.
          if (event.target.closest('a')) {
            setOpen(false);
          }
        }}>
        {(open || everOpened) && inner}
      </div>
    </li>
  );
}

export default function DropdownNavbarItem({mobile = false, ...props}) {
  const windowSize = useWindowSize();
  const isMobile = mobile || windowSize === 'mobile';

  const mega =
    props.mega &&
    props.customProps &&
    Array.isArray(props.customProps.columns);

  // On mobile or when not marked as mega, fall back to the original behavior
  // (the drawer consumes the flat `items` list derived in src/data/navbar.js).
  // Strip mega-specific props so they don't leak onto DOM elements.
  if (!mega || isMobile) {
    const {customProps, mega: _mega, ...passthroughProps} = props;
    return <OriginalDropdownNavbarItem mobile={mobile} {...passthroughProps} />;
  }

  return (
    <MegaDropdownNavbarItem
      label={props.label}
      className={props.className}
      customProps={props.customProps}
    />
  );
}
