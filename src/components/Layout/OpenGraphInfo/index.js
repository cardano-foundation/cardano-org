import React from 'react';
import Head from '@docusaurus/Head';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// open graph images needs to be in the "og" folder + .jpg
// we currently do not distinguish between og:image and twitter:image
//
// This component can be used to only add the open graph image like <OpenGraphInfo pageName="imagename" />
// Or with image and title and description <OpenGraphInfo pageName="imagename" title="Your title" description="The description.">
// Pages without a dedicated image can omit pageName and get the site-wide default image.
// Pass `image` (a site path like "/img/insights/supply.png") to use an image outside the "og" folder.
// Pass `type` to override og:type, which defaults to "website". Pass `type={null}` to leave it to the theme.

/**
 * Adds Open Graph and Twitter meta tags for the page image, URL, title, and description.
 *
 * @param {object} props
 * @param {string} [props.pageName="default"] File name without extension of the image in /img/og/ (a .jpg).
 * @param {string} [props.image] Site path of an image outside /img/og/. Takes precedence over pageName.
 * @param {string} [props.title] Title for og:title and twitter:title.
 * @param {string} [props.description] Description for og:description and twitter:description.
 * @param {string|null} [props.type="website"] Value of og:type. Pass null to leave it to the theme.
 */
const OpenGraphInfo = ({ pageName = 'default', image, title, description, type = 'website' }) => {
  const { siteConfig } = useDocusaurusContext();
  const { pathname } = useLocation();
  const siteUrl = siteConfig.url.replace(/\/$/, '');
  const imageUrl = `${siteUrl}${image || `/img/og/${pageName}.jpg`}`;
  const canonicalUrl = `${siteUrl}${pathname}`;

  return (
    <Head>
      <meta property="og:image" content={imageUrl} />
      {type && <meta property="og:type" content={type} />}
      <meta property="og:site_name" content={siteConfig.title} />
      <meta property="og:url" content={canonicalUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={imageUrl} />
      {/* Helmet ignores fragments, so each optional tag is its own child */}
      {title && <meta property="og:title" content={title} />}
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {description && <meta name="twitter:description" content={description} />}
    </Head>
  );
};

export default OpenGraphInfo;