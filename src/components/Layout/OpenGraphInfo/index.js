import React from 'react';
import Head from '@docusaurus/Head';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// open graph images needs to be in the "og" folder + .jpg
// we currently do not distinguish between og:image and twitter:image
//
// This component can be used to only add the open graph image like <OpenGraphInfo pageName="imagename" />
// Or with image and title and description <OpenGraphInfo pageName="imagename" title="Your title" description="The description.">

const OpenGraphInfo = ({ pageName, title, description }) => {
  const { siteConfig } = useDocusaurusContext();
  const { pathname } = useLocation();
  const siteUrl = siteConfig.url.replace(/\/$/, '');
  const imageUrl = `${siteUrl}/img/og/${pageName}.jpg`;
  const canonicalUrl = `${siteUrl}${pathname}`;

  return (
    <Head>
      <meta property="og:image" content={imageUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteConfig.title} />
      <meta property="og:url" content={canonicalUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={imageUrl} />
      {title && (
        <>
          <meta property="og:title" content={title} />
          <meta name="twitter:title" content={title} />
        </>
      )}
      {description && (
        <>
          <meta property="og:description" content={description} />
          <meta name="twitter:description" content={description} />
        </>
      )}
    </Head>
  );
};

export default OpenGraphInfo;