import React from 'react';
import Layout from '@theme/Layout';
import BoundaryBox from '@site/src/components/Layout/BoundaryBox';
import SiteHero from '@site/src/components/Layout/SiteHero';

// Import translation files
import enCode from '@site/i18n/en/code.json';
import deCode from '@site/i18n/de/code.json';
import jaCode from '@site/i18n/ja/code.json';

// Calculate translation stats for a locale
function calculateStats(sourceMessages, targetMessages) {
  const sourceKeys = Object.keys(sourceMessages);
  const total = sourceKeys.length;

  let translated = 0;
  const untranslatedKeys = [];

  sourceKeys.forEach(key => {
    const sourceMsg = sourceMessages[key]?.message || sourceMessages[key];
    const targetMsg = targetMessages[key]?.message || targetMessages[key];

    // Consider translated if message differs from source
    if (targetMsg && targetMsg !== sourceMsg) {
      translated++;
    } else {
      untranslatedKeys.push(key);
    }
  });

  return {
    total,
    translated,
    untranslated: total - translated,
    percentage: Math.round((translated / total) * 100),
    untranslatedKeys,
  };
}

function ProgressBar({ percentage }) {
  return (
    <div style={{
      width: '100%',
      backgroundColor: '#e0e0e0',
      borderRadius: '4px',
      overflow: 'hidden',
      height: '24px',
    }}>
      <div style={{
        width: `${percentage}%`,
        backgroundColor: percentage === 100 ? '#4caf50' : '#2196f3',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '14px',
        transition: 'width 0.3s ease',
      }}>
        {percentage}%
      </div>
    </div>
  );
}

function LocaleCard({ locale, label, stats, showDetails }) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: 'var(--ifm-card-background-color)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0 }}>{label} ({locale})</h3>
        <span style={{ fontSize: '14px', color: '#666' }}>
          {stats.translated} / {stats.total} strings
        </span>
      </div>

      <ProgressBar percentage={stats.percentage} />

      {showDetails && stats.untranslatedKeys.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: 'none',
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            {expanded ? '▼' : '▶'} {stats.untranslated} untranslated strings
          </button>

          {expanded && (
            <div style={{
              marginTop: '12px',
              maxHeight: '300px',
              overflow: 'auto',
              backgroundColor: 'var(--ifm-code-background)',
              padding: '12px',
              borderRadius: '4px',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}>
              {stats.untranslatedKeys.map(key => (
                <div key={key} style={{ marginBottom: '4px' }}>{key}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TranslationsPage() {
  const deStats = calculateStats(enCode, deCode);
  const jaStats = calculateStats(enCode, jaCode);

  const locales = [
    { locale: 'de', label: 'Deutsch', stats: deStats },
    { locale: 'ja', label: '日本語', stats: jaStats },
  ];

  const overallTranslated = deStats.translated + jaStats.translated;
  const overallTotal = deStats.total + jaStats.total;
  const overallPercentage = Math.round((overallTranslated / overallTotal) * 100);

  return (
    <Layout
      title="Help Translate Cardano.org"
      description="Join the community of translators and help make Cardano accessible worldwide."
    >
      <SiteHero
        title="Help Translate Cardano.org"
        description="Join the community of translators and help make Cardano accessible worldwide."
        bannerType="starburst"
      />
      <BoundaryBox>
        <div style={{ padding: '40px 0' }}>
          <div style={{
            backgroundColor: 'var(--ifm-card-background-color)',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '32px',
          }}>
            <h3 style={{ marginTop: 0 }}>Overall Progress</h3>
            <ProgressBar percentage={overallPercentage} />
            <p style={{ marginTop: '12px', marginBottom: 0, color: '#666' }}>
              {overallTranslated} of {overallTotal} strings translated across all languages
            </p>
          </div>

          <h2>Languages</h2>
          {locales.map(({ locale, label, stats }) => (
            <LocaleCard
              key={locale}
              locale={locale}
              label={label}
              stats={stats}
              showDetails={true}
            />
          ))}

          <div style={{ marginTop: '40px', padding: '24px', backgroundColor: 'var(--ifm-card-background-color)', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2 style={{ marginTop: 0 }}>Want to help translate?</h2>
            <p>
              We welcome translation contributions from the community! Translating cardano.org helps
              make Cardano accessible to people around the world.
            </p>

            <div style={{
              marginBottom: '24px',
              padding: '16px',
              backgroundColor: 'var(--ifm-color-info-contrast-background)',
              borderRadius: '4px',
              border: '1px solid var(--ifm-color-info-dark)',
            }}>
              <strong>Coordinate with other translators:</strong>{' '}
              Join the discussion and track progress in{' '}
              <a href="https://github.com/cardano-foundation/cardano-org/issues/XXX" target="_blank" rel="noopener noreferrer">
                Issue #XXX (FIXME)
              </a>.
            </div>

            <h3>How to contribute</h3>
            <p>
              The easiest way to contribute translations is through our Crowdin project.
              No technical knowledge required!
            </p>
            <ol style={{ lineHeight: '1.8' }}>
              <li>
                <strong>Sign up on Crowdin</strong> – Create a free account at{' '}
                <a href="https://crowdin.com" target="_blank" rel="noopener noreferrer">
                  crowdin.com
                </a>.
              </li>
              <li>
                <strong>Join our project</strong> – Visit the{' '}
                <a href="https://crowdin.com/project/cardano-org" target="_blank" rel="noopener noreferrer">
                  cardano-org Crowdin project
                </a>{' '}
                and request access to your language.
              </li>
              <li>
                <strong>Start translating</strong> – Use Crowdin's user-friendly editor to translate
                strings. Your translations will be reviewed and merged automatically.
              </li>
            </ol>

            <div style={{
              marginTop: '16px',
              marginBottom: '24px',
              padding: '16px',
              backgroundColor: 'var(--ifm-code-background)',
              borderRadius: '4px',
              border: '1px solid #ddd',
            }}>
              <strong>For developers:</strong> If you're comfortable with Git, you can also contribute
              directly via{' '}
              <a href="https://github.com/cardano-foundation/cardano-org" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>. Translation files are located in <code>i18n/[locale]/code.json</code>.
            </div>

            <h3>Tips for translators</h3>
            <ul style={{ lineHeight: '1.8' }}>
              <li>Keep the same tone and style as the original English text.</li>
              <li>Don't translate brand names, technical terms, or code examples.</li>
              <li>Preserve any placeholders like <code>{'{'}count{'}'}</code> or HTML tags.</li>
              <li>When in doubt, check how other blockchain projects translate similar terms.</li>
            </ul>

            <h3>Adding a new language</h3>
            <p>
              Want to add a language that's not listed yet? Request it on{' '}
              <a href="https://crowdin.com/project/cardano-org/discussions" target="_blank" rel="noopener noreferrer">
                Crowdin Discussions
              </a>{' '}
              or open an{' '}
              <a href="https://github.com/cardano-foundation/cardano-org/issues/new" target="_blank" rel="noopener noreferrer">
                issue on GitHub
              </a>.
              We'll help you get started!
            </p>

            <div style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: 'var(--ifm-code-background)',
              borderRadius: '4px',
              borderLeft: '4px solid var(--ifm-color-primary)',
            }}>
              <strong>Questions?</strong> Feel free to reach out on{' '}
              <a href="https://discord.gg/cardano" target="_blank" rel="noopener noreferrer">Discord</a>{' '}
              or open a GitHub issue. We appreciate every contribution!
            </div>
          </div>
        </div>
      </BoundaryBox>
    </Layout>
  );
}
