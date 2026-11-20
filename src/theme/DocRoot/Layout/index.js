import React, {useState} from 'react';
import {useDocsSidebar} from '@docusaurus/plugin-content-docs/client';
import {useLocation} from '@docusaurus/router';
import BackToTopButton from '@theme/BackToTopButton';
import DocRootLayoutSidebar from '@theme/DocRoot/Layout/Sidebar';
import DocRootLayoutMain from '@theme/DocRoot/Layout/Main';
import SiteHero from "@site/src/components/Layout/SiteHero";
import styles from './styles.module.css';
import { translate } from '@docusaurus/Translate';

export default function DocRootLayout({children}) {
  const sidebar = useDocsSidebar();
  const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);
  const location = useLocation();
  
  // Simple path-based hero configuration
  let heroTitle = translate({ id: 'docs.hero.getInvolved.title', message: 'Get Involved' });
  let heroDescription = translate({ id: 'docs.hero.getInvolved.description', message: 'Whether you are a developer, designer, writer, project builder, or just someone passionate about Cardano.' });
  
  // Check path and set custom hero
  if (location.pathname.includes('/use-cases')) {
    heroTitle = translate({ id: 'docs.hero.useCases.title', message: 'Cardano Use Cases' });
    heroDescription = translate({ id: 'docs.hero.useCases.description', message: 'Explore how Cardano blockchain technology solves real-world problems across industries.' });
  }
  
  return (
    <>
      {/* The hero names the section, the doc's own title is the page's h1. */}
      <SiteHero
        title={heroTitle}
        description={heroDescription}
        bannerType="docs"
        headingLevel={0}
      />
      <div className={styles.docsWrapper}>
        <BackToTopButton />
        <div className={styles.docRoot}>
          {sidebar && (
            <DocRootLayoutSidebar
              sidebar={sidebar.items}
              hiddenSidebarContainer={hiddenSidebarContainer}
              setHiddenSidebarContainer={setHiddenSidebarContainer}
            />
          )}
          <DocRootLayoutMain hiddenSidebarContainer={hiddenSidebarContainer}>
            {children}
          </DocRootLayoutMain>
        </div>
      </div>
    </>
  );
}
