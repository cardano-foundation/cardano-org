import React from 'react';
import Layout from '@theme/Layout';
import BoundaryBox from '@site/src/components/Layout/BoundaryBox';
import SiteHero from '@site/src/components/Layout/SiteHero';

import progressData from '@site/src/data/translation-progress.json';

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
        backgroundColor: percentage === 100 ? '#4caf50' : percentage < 15 ? '#9e9e9e' : '#2196f3',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: percentage > 8 ? 'center' : 'flex-end',
        paddingRight: percentage <= 8 ? '6px' : 0,
        color: 'white',
        fontWeight: 'bold',
        fontSize: '14px',
        transition: 'width 0.3s ease',
        minWidth: percentage > 0 ? '32px' : 0,
      }}>
        {percentage}%
      </div>
    </div>
  );
}

function LocaleCard({ language }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: 'var(--ifm-card-background-color)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0 }}>{language.name} ({language.id})</h3>
        <span style={{ fontSize: '14px', color: '#666' }}>
          {language.phrases.translated} / {language.phrases.total} phrases
        </span>
      </div>

      <ProgressBar percentage={language.translationProgress} />

      {language.approvalProgress > 0 && (
        <div style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>
          {language.approvalProgress}% approved
        </div>
      )}
    </div>
  );
}

export default function TranslationsPage() {
  const { languages, lastUpdated } = progressData;
  const hasData = languages.length > 0;

  let overallPercentage = 0;
  let overallTranslated = 0;
  let overallTotal = 0;

  if (hasData) {
    overallTranslated = languages.reduce((sum, l) => sum + l.phrases.translated, 0);
    overallTotal = languages.reduce((sum, l) => sum + l.phrases.total, 0);
    overallPercentage = overallTotal > 0 ? Math.round((overallTranslated / overallTotal) * 100) : 0;
  }

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
          {hasData ? (
            <>
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
                  {overallTranslated} of {overallTotal} phrases translated across {languages.length} language{languages.length !== 1 && 's'}
                </p>
              </div>

              <h2>Languages</h2>
              {languages.map((language) => (
                <LocaleCard key={language.id} language={language} />
              ))}

              {lastUpdated && (
                <p style={{ fontSize: '13px', color: '#999', marginTop: '16px' }}>
                  Last updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short',
                  })}
                  {' · '}
                  Data from{' '}
                  <a href="https://crowdin.com/project/cardano-org" target="_blank" rel="noopener noreferrer">
                    Crowdin
                  </a>
                </p>
              )}
            </>
          ) : (
            <div style={{
              backgroundColor: 'var(--ifm-card-background-color)',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '32px',
              textAlign: 'center',
            }}>
              <p style={{ marginBottom: 0, color: '#666' }}>
                Translation progress data is not yet available. Check back soon or visit{' '}
                <a href="https://crowdin.com/project/cardano-org" target="_blank" rel="noopener noreferrer">
                  our Crowdin project
                </a>{' '}
                directly.
              </p>
            </div>
          )}

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
              </a>. Translation files are located in <code>i18n/[locale]/</code>.
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
              <strong>Questions?</strong> Feel free to reach out on GitHub
              or open a GitHub issue. We appreciate every contribution!
            </div>
          </div>
        </div>
      </BoundaryBox>
    </Layout>
  );
}
