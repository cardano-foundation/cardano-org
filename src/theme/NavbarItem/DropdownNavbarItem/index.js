import React from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import OriginalDropdownNavbarItem from '@theme-original/NavbarItem/DropdownNavbarItem';
import {useWindowSize} from '@docusaurus/theme-common';

export default function DropdownNavbarItem({mobile = false, ...props}) {
  const windowSize = useWindowSize();
  const isMobile = mobile || windowSize === 'mobile';

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
      data-column-count={columnCount}>
      {/* Top level trigger */}
      <button className="navbar__link megaMenuTrigger" type="button">
        {props.label}
      </button>

      {/* Mega menu panel */}
      <div className="megaMenuPanel">
        <div className="megaMenuInner">
          {columns.map((col) => (
            <div className="megaMenuColumn" key={col.title}>
              <div className="megaMenuColumnTitle">{col.title}</div>
              <ul className="megaMenuColumnList">
                {col.items.map((item) => (
                  <li className="megaMenuItem" key={item.label}>
                    <Link
                      className="megaMenuItemLink"
                      to={item.to}
                      href={item.href}>
                      <span className="megaMenuItemLabel">{item.label}</span>
                      {item.description && (
                        <span className="megaMenuItemDescription">
                          {item.description}
                        </span>
                      )}
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