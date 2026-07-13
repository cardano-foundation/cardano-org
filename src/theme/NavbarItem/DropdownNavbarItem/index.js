import React, { useState, useId } from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import OriginalDropdownNavbarItem from '@theme-original/NavbarItem/DropdownNavbarItem';
import {useWindowSize} from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {translate} from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function DropdownNavbarItem({mobile = false, ...props}) {
  const windowSize = useWindowSize();
  const isMobile = mobile || windowSize === 'mobile';

  const {siteConfig} = useDocusaurusContext();
  const megaMenuIconsEnabled = siteConfig?.themeConfig?.megaMenuIcons !== false;
  const megaMenuColumnIconsEnabled = siteConfig?.themeConfig?.megaMenuColumnIcons === true;

  const iconBasePath = useBaseUrl('/img/icons/');

  // Mirror the CSS-driven panel visibility (:hover / :focus-within) into state so
  // the trigger can expose an accurate aria-expanded. This does NOT drive
  // visibility (CSS still does), so it cannot regress the hover behavior.
  const panelId = useId();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const open = hovered || focused;

  const mega =
    props.mega &&
    props.customProps &&
    Array.isArray(props.customProps.columns);

  // On mobile or when not marked as mega, fall back to the original behavior.
  // Strip mega-specific props so they don't leak onto DOM elements.
  if (!mega || isMobile) {
    const {customProps, mega: _mega, ...passthroughProps} = props;
    return <OriginalDropdownNavbarItem mobile={mobile} {...passthroughProps} />;
  }

  const columns = props.customProps.columns;
  const columnCount = props.customProps.columnCount || columns.length;

  return (
    // The <li> hosts the Escape handler so it catches keydown bubbling from the
    // trigger and any focused panel link; the interactive controls inside remain
    // the button and links.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <li
      className={clsx(
        'navbar__item',
        'navbar__item--mega',
        props.className,
      )}
      data-column-count={columnCount}
      onMouseEnter={(e) => {
        setHovered(true);
        const activeElement = document.activeElement;
        if (activeElement && activeElement.classList.contains('megaMenuTrigger')) {
          if (!e.currentTarget.contains(activeElement)) {
            activeElement.blur();
          }
        }
      }}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setFocused(false);
        }
      }}
      onKeyDown={(e) => {
        // Escape collapses the panel for keyboard users (mirrors the blur the
        // hover handler already relies on) and syncs aria-expanded.
        if (e.key === 'Escape') {
          const active = document.activeElement;
          if (active && typeof active.blur === 'function') {
            active.blur();
          }
          setFocused(false);
        }
      }}>
      {/* Top level trigger */}
      <button
        className="navbar__link megaMenuTrigger"
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}>
        {props.label}
      </button>

      {/* Mega menu panel */}
      <div className="megaMenuPanel" id={panelId}>
        <div className="megaMenuInner">
          {columns.map((col) => (
            <div className="megaMenuColumn" key={col.title}>
              <div className="megaMenuColumnTitle">
                {megaMenuColumnIconsEnabled && col.icon && (
                  <img
                    src={`${iconBasePath}${col.icon}.svg`}
                    alt=""
                    className="megaMenuColumnIcon"
                    aria-hidden="true"
                  />
                )}
                {translate({id: `navbar.mega.column.${col.title}`, message: col.title})}
              </div>
              <ul className="megaMenuColumnList">
                {col.items.map((item) => (
                  <li className="megaMenuItem" key={item.label}>
                    <Link
                      className="megaMenuItemLink"
                      to={item.to}
                      href={item.href}>
                      {megaMenuIconsEnabled && item.icon && (
                        <img
                          src={`${iconBasePath}${item.icon}.svg`}
                          alt=""
                          className="megaMenuItemIcon"
                          aria-hidden="true"
                        />
                      )}
                      <div className="megaMenuItemContent">
                        <span className="megaMenuItemLabel">{translate({id: `navbar.mega.label.${item.label}`, message: item.label})}</span>
                        {item.description && (
                          <span className="megaMenuItemDescription">
                            {translate({id: `navbar.mega.description.${item.label}`, message: item.description})}
                          </span>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </li>
  );
}