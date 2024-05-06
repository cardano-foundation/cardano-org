import React from 'react';
import Head from '@docusaurus/Head';

const OpenGraphImage = ({ pageName }) => {

  // open graph images needs to be in the "og" folder + .jpg
  // we currently do not distinguish between og:image and twitter:image
  
  const imageUrl = `https://cardano.org/img/og/${pageName}.jpg`;

  return (
    <Head>
      <meta property="og:image" content={imageUrl} />
      <meta property="twitter:image" content={imageUrl} />
    </Head>
  );
};

export default OpenGraphImage;