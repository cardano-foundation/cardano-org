import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import BlogSidebar from '@theme/BlogSidebar';
import SiteHero from "@site/src/components/Layout/SiteHero";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';

// Post, tag and author pages render their own h1 below the hero, so the hero
// is only the page title on the main list and the archive.
const HERO_IS_PAGE_TITLE = /\/news(\/page\/\d+|\/archive)?\/?$/;

function useHeroIsPageTitle() {
  return HERO_IS_PAGE_TITLE.test(useLocation().pathname);
}

export default function BlogLayout(props) {
  const {sidebar, toc, children, ...layoutProps} = props;
  const hasSidebar = sidebar && sidebar.items.length > 0;
  const heroIsPageTitle = useHeroIsPageTitle();
  return (
    <Layout {...layoutProps}>
      {/* Blog posts set og:type "article" through the theme, so leave it out here */}
      <OpenGraphInfo pageName="cardano-news" type={null} />
      <SiteHero
            title='Cardano News'
            description='Explore the stories below for curated news, stories, and inspiration from within the Cardano ecosystem.'
            bannerType ='waves'
            headingLevel={heroIsPageTitle ? 1 : 0}
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
