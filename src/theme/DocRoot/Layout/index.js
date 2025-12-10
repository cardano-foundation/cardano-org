import React, {useState} from 'react';
import {useDocsSidebar} from '@docusaurus/plugin-content-docs/client';
import {useLocation} from '@docusaurus/router';
import BackToTopButton from '@theme/BackToTopButton';
import DocRootLayoutSidebar from '@theme/DocRoot/Layout/Sidebar';
import DocRootLayoutMain from '@theme/DocRoot/Layout/Main';
import SiteHero from "@site/src/components/Layout/SiteHero";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import styles from './styles.module.css';

export default function DocRootLayout({children}) {
  const sidebar = useDocsSidebar();
  const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);
  const location = useLocation();
  
  // Simple path-based hero configuration
  let heroTitle = 'Get Involved';
  let heroDescription = 'Whether you are a developer, designer, writer, project builder, or just someone passionate about Cardano.';
  let heroBannerType = 'braidBlack';
  
  // Check path and set custom hero
  if (location.pathname.includes('/communities')) {
    heroTitle = 'Online Communities';
    heroDescription = 'Connect with fellow Cardano community members around the world through various social channels.';
    heroBannerType = 'braidBlue';
  }
  
  return (
    <>
      <SiteHero
        title={heroTitle}
        description={heroDescription}
        bannerType={heroBannerType}
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
