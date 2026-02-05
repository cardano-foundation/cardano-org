import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useLocation} from '@docusaurus/router';
import {useAlternatePageUtils} from '@docusaurus/theme-common/internal';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';

// Import translation files for stats calculation
import enCode from '@site/i18n/en/code.json';
import deCode from '@site/i18n/de/code.json';
import jaCode from '@site/i18n/ja/code.json';
import viCode from '@site/i18n/vi/code.json';

// Calculate translation percentage
function calculatePercentage(sourceMessages, targetMessages) {
  const sourceKeys = Object.keys(sourceMessages);
  const total = sourceKeys.length;
  let translated = 0;

  sourceKeys.forEach(key => {
    const sourceMsg = sourceMessages[key]?.message || sourceMessages[key];
    const targetMsg = targetMessages[key]?.message || targetMessages[key];
    if (targetMsg && targetMsg !== sourceMsg) {
      translated++;
    }
  });

  return Math.round((translated / total) * 100);
}

// Pre-calculate stats
const translationStats = {
  en: 100,
  de: calculatePercentage(enCode, deCode),
  ja: calculatePercentage(enCode, jaCode),
  vi: calculatePercentage(enCode, viCode),
};

// Progress bar component
function MiniProgressBar({ percentage }) {
  return (
    <div style={{
      width: '100%',
      height: '3px',
      backgroundColor: 'var(--ifm-color-emphasis-300)',
      borderRadius: '2px',
      marginTop: '4px',
      overflow: 'hidden',
    }}>
      <div style={{
        width: `${percentage}%`,
        height: '100%',
        backgroundColor: percentage === 100 ? 'var(--ifm-color-success)' : percentage < 15 ? 'var(--ifm-color-emphasis-400)' : 'var(--ifm-color-primary)',
        transition: 'width 0.3s ease',
      }} />
    </div>
  );
}

export default function LocaleDropdownNavbarItem({
  mobile,
  dropdownItemsBefore = [],
  dropdownItemsAfter = [],
  queryString = '',
  ...props
}) {
  const {
    i18n: {currentLocale, locales, localeConfigs},
  } = useDocusaurusContext();
  const alternatePageUtils = useAlternatePageUtils();
  const {search, hash} = useLocation();

  const localeItems = locales.map((locale) => {
    const baseTo = `pathname://${alternatePageUtils.createUrl({
      locale,
      fullyQualified: false,
    })}`;
    const to = `${baseTo}${search}${hash}${queryString}`;
    const percentage = translationStats[locale] || 0;

    return {
      label: (
        <div style={{ minWidth: '120px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span>{localeConfigs[locale].label}</span>
            <span style={{
              fontSize: '0.75em',
              color: 'var(--ifm-color-emphasis-600)',
              fontWeight: 'normal',
            }}>
              {percentage}%
            </span>
          </div>
          <MiniProgressBar percentage={percentage} />
        </div>
      ),
      lang: localeConfigs[locale].htmlLang,
      to,
      target: '_self',
      autoAddBaseUrl: false,
      className: locale === currentLocale ? 'dropdown__link--active' : '',
      style: { padding: '8px 12px' },
    };
  });

  const items = [
    ...dropdownItemsBefore,
    ...localeItems,
    ...dropdownItemsAfter,
  ];

  return (
    <DropdownNavbarItem
      {...props}
      mobile={mobile}
      label={localeConfigs[currentLocale].label}
      items={items}
    />
  );
}
