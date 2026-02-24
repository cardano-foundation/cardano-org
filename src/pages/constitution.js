import React, { useState, useEffect } from 'react';
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import TermExplainer from "@site/src/components/TermExplainer";
import {translate} from '@docusaurus/Translate';

// Any fetch problem will result in showing a local copy, we will then let the user know
const localConstitutionUrl = require('!!file-loader!@site/src/data/constitution-541.md').default;
const localConstitutionContent = require('!!raw-loader!@site/src/data/constitution-541.md').default;

const ConstitutionList = () => {
  const [proposals, setProposals] = useState([]);
  const [error, setError] = useState(null);

  const [docContent, setDocContent] = useState('');
  const [docError, setDocError] = useState(null);

  // Read environment variables via Docusaurus customFields
  const { siteConfig: { customFields } } = useDocusaurusContext();
  const API_URL = customFields.CARDANO_ORG_API_URL;
  const API_KEY = customFields.CARDANO_ORG_API_KEY;

  useEffect(() => {
    if (!proposals.length) return;
    // Only fetch the latest enacted constitution for embedding
    const enactedProposals = proposals.filter(p => p.enactedEpoch);
    if (!enactedProposals.length) return;
    const latestEnacted = enactedProposals[0];
    const url = latestEnacted.contents.anchor.url.startsWith('ipfs://')
      ? latestEnacted.contents.anchor.url.replace('ipfs://', 'https://ipfs.io/ipfs/')
      : latestEnacted.contents.anchor.url;
    axios
      .get(url, { responseType: 'text' })
      .then(res => setDocContent(res.data))
      .catch(err => {
        console.error('Error loading enacted constitution:', err);
        setDocError(err.message);
      });
  }, [proposals]);

  useEffect(() => {
    if (!API_URL || !API_KEY) {
      setError('API URL or API Key is missing!');
      return;
    }
    const fetchConstitutions = async () => {
      try {
        const response = await axios({
          method: 'get',
          baseURL: API_URL,
          // Thank you Koios Team for providing this 
          url: '/proposal_list?proposal_type=eq.NewConstitution&ratified_epoch=not.is.null&select=proposal_type,enacted_epoch,ratified_epoch,proposal_description->contents->1',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`
          }
        });
        // Map API response to usable format
        const data = response.data.map(item => ({
          type: item.proposal_type,
          enactedEpoch: item.enacted_epoch,
          ratifiedEpoch: item.ratified_epoch,
          contents: item.contents
        }));
        // Sort by ratification epoch descending
        data.sort((a, b) => b.ratifiedEpoch - a.ratifiedEpoch);
        setProposals(data);
      } catch (err) {
        console.error('Error fetching constitutions:', err);
        setError(err.message);
      }
    };

    fetchConstitutions();
  }, [API_URL, API_KEY]);

  if (error) {
    return (
      <section>
        <h2>
          {translate({id: 'constitution.error.title', message: 'Current Enacted Constitution'})}&nbsp;<small>{translate({id: 'constitution.error.localCopy', message: '(Local Copy)'})}</small>
        </h2>
        <p style={{ color: 'crimson' }}>
          {translate({id: 'constitution.error.fetchError', message: 'Could not fetch from data.cardano.org:'})} {error}. {translate({id: 'constitution.error.showingLocal', message: 'Showing local copy below.'})}
        </p>
        <div style={{ marginBottom: '1rem' }}>
          <a href={localConstitutionUrl} download>
            {translate({id: 'constitution.link.download', message: 'Download Constitution'})}
          </a>{' '}
          |{' '}
          <a
            href={localConstitutionUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {translate({id: 'constitution.link.viewRawMarkdown', message: 'View Raw Markdown'})}
          </a>
        </div>
        <div
          style={{ maxHeight: '600px', overflow: 'auto', marginBottom: '1rem' }}
        >
          <ReactMarkdown>{localConstitutionContent}</ReactMarkdown>
        </div>
      </section>
    );
  }

  if (!proposals.length) {
    return <p>{translate({id: 'constitution.loading.versions', message: 'Loading constitution versions...'})}</p>;
  }

  // Determine if there is an enacted constitution to embed
  const enactedProposals = proposals.filter(p => p.enactedEpoch);
  const hasEnacted = enactedProposals.length > 0;
  const latestEnacted = hasEnacted ? enactedProposals[0] : null;
  const fileUrl = hasEnacted
    ? (latestEnacted.contents.anchor.url.startsWith('ipfs://')
        ? latestEnacted.contents.anchor.url.replace('ipfs://', 'https://ipfs.io/ipfs/')
        : latestEnacted.contents.anchor.url)
    : null;

  return (
    <div>
      {hasEnacted && (
        <section>
          <TitleWithText
          title={translate({id: 'constitution.enacted.title', message: 'Current Enacted Cardano Constitution'})}
          description={[
            translate({id: 'constitution.enacted.description', message: 'Discover the Cardano Constitution: the governance framework of the Cardano blockchain. Read the current enacted charter, explore its ratification history, and download the full text via IPFS.'})
          ]}
          headingDot
        />
          <div style={{ marginBottom: '1rem' }}>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" download>
              {translate({id: 'constitution.link.download', message: 'Download Constitution'})}
            </a>{' '}
            |{' '}
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              {translate({id: 'constitution.link.viewOnIPFS', message: 'View on IPFS'})}
            </a>
          </div>
          {docError ? (
            <p style={{ color: 'red' }}>
              {translate({id: 'constitution.error.loadDocument', message: 'Could not load constitution document:'})} {docError}
            </p>
          ) : !docContent ? (
            <p>{translate({id: 'constitution.loading.document', message: 'Loading document...'})}</p>
          ) : (
            <div style={{ maxHeight: '600px', overflow: 'auto', marginBottom: '1rem' }}>
              <ReactMarkdown>{docContent}</ReactMarkdown>
            </div>
          )}
        </section>
      )}
      <TitleWithText
        title={translate({id: 'constitution.history.title', message: 'Constitution Ratification History'})}
        description={[
          translate({id: 'constitution.history.description', message: 'Below you can find the Cardano Constitution and its ratification history. Click any version to view the full text on IPFS.'})
        ]}
      />
      <ul>
        {proposals.map(proposal => (
          <li key={proposal.ratifiedEpoch}>
            <strong>{translate({id: 'constitution.history.versionRatified', message: 'Version ratified at epoch'})} {proposal.ratifiedEpoch}</strong>

            {proposal.enactedEpoch && (
              <span> ({translate({id: 'constitution.history.enactedAtEpoch', message: 'Enacted at epoch'})} {proposal.enactedEpoch})</span>
            )}

            <p style={{ fontSize: '0.9em', color: '#555' }}>
              {translate({id: 'constitution.history.hash', message: 'Hash:'})}{' '}<code>{proposal.contents.anchor.dataHash}</code>
            </p>
            {proposal.enactedEpoch && (
              <div>
                <a
                  href={
                    proposal.contents.anchor.url.startsWith('ipfs://')
                      ? proposal.contents.anchor.url.replace(
                          'ipfs://',
                          'https://ipfs.io/ipfs/'
                        )
                      : proposal.contents.anchor.url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {translate({id: 'constitution.link.viewOnIPFSHistory', message: 'View this constitution on IPFS'})}
                </a>
              </div>
            )}
            <SpacerBox size="small" />
          </li>
        ))}
      </ul>
    </div>
  );
};

function HomepageHeader() {
  return (
    <SiteHero
      title={translate({id: 'constitution.hero.title', message: 'The Cardano Constitution'})}
      description={translate({id: 'constitution.hero.description', message: 'Discover the Cardano Constitution: the governance framework of the Cardano blockchain.'})}
      bannerType="zoom"
    />
  );
}

export default function Home() {
  return (
    <Layout
      title={translate({id: 'constitution.layout.title', message: 'The Cardano Constitution | cardano.org'})}
      description={translate({id: 'constitution.layout.description', message: 'Discover the Cardano Constitution: the governance framework of the Cardano blockchain. Read the current enacted charter, explore its ratification history, and download the full text via IPFS.'})}
    >
      <OpenGraphInfo pageName="constitution" />
      <HomepageHeader />
      <main>
        <BackgroundWrapper backgroundType="zoom">
          <BoundaryBox>
            <ConstitutionList />
            <SpacerBox size="medium" />
          </BoundaryBox>
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={"gradientLight"}>
                  <BoundaryBox>
                    <TermExplainer category="governance" />
                  </BoundaryBox>
                </BackgroundWrapper>

      </main>
    </Layout>
  );
}
