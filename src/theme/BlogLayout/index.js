import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import BlogSidebar from '@theme/BlogSidebar';
import SiteHero from "@site/src/components/Layout/SiteHero";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import Link from '@docusaurus/Link';

export default function BlogLayout(props) {
  const {sidebar, toc, children, ...layoutProps} = props;
  const hasSidebar = sidebar && sidebar.items.length > 0;
  return (
    <Layout {...layoutProps}>
      <OpenGraphInfo pageName="cardano-news" />
      <SiteHero
            title='Cardano News'
            description='Explore the stories below for curated news, stories, and inspiration from within the Cardano ecosystem.'
            bannerType ='waves'
          />
      <div className="container margin-vert--lg">
        <div className="row">
          <BlogSidebar sidebar={sidebar} />
          <main
            className={clsx('col', {
              'col--7': hasSidebar,
              'col--9 col--offset-1': !hasSidebar,
            })}
            itemScope
            itemType="https://schema.org/Blog">
            {children}
            <div className="add-news-link" style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link to="/docs/get-involved/create-a-news-article">add news article</Link>
            </div>
          </main>
          {toc && <div className="col col--2">{toc}</div>}
        </div>
      </div>
    </Layout>
  );
}
