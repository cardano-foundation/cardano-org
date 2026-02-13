import React from 'react';
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

  const mega =
    props.mega &&
    props.customProps &&
    Array.isArray(props.customProps.columns);

  // On mobile or when not marked as mega, fall back to the original behavior
  if (!mega || isMobile) {
    return <OriginalDropdownNavbarItem mobile={mobile} {...props} />;
  }

  const columns = props.customProps.columns;
  const columnCount = props.customProps.columnCount || columns.length;

  return (
    <li
      className={clsx(
        'navbar__item',
        'navbar__item--mega',
        props.className,
      )}
      data-column-count={columnCount}
      onMouseEnter={(e) => {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.classList.contains('megaMenuTrigger')) {
          if (!e.currentTarget.contains(activeElement)) {
            activeElement.blur();
          }
        }
      }}>
      {/* Top level trigger */}
      <button className="navbar__link megaMenuTrigger" type="button">
        {props.label}
      </button>

      {/* Mega menu panel */}
      <div className="megaMenuPanel">
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