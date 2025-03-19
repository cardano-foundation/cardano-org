import React from 'react';
import Head from '@docusaurus/Head';

// open graph images needs to be in the "og" folder + .jpg
// we currently do not distinguish between og:image and twitter:image
//
// This component can be used to only add the open graph image like <OpenGraphInfo pageName="imagename" />
// Or with image and title and description <OpenGraphInfo pageName="imagename" title="Your title" description="The description.">

const OpenGraphInfo = ({ pageName, title, description }) => {
  const imageUrl = `https://cardano.org/img/og/${pageName}.jpg`;

  return (
    <Head>
      <meta property="og:image" content={imageUrl} />
      <meta property="twitter:image" content={imageUrl} />
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