import React from 'react';
import styles from './styles.module.css';

/**
 * TwoColumnLayout - A responsive two-column layout component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Main content for the left column
 * @param {React.ReactNode} props.sidebar - Content for the right sidebar
 * @param {boolean} props.sidebarSticky - Whether the sidebar should stick on scroll (default: true)
 * @param {string} props.sidebarTop - Top offset for sticky sidebar (default: '2rem')
 * @param {string} props.ratio - Column ratio, e.g., '2:1' or '3:1' (default: '2:1')
 */
const TwoColumnLayout = ({ 
  children, 
  sidebar, 
  sidebarSticky = true, 
  sidebarTop = '2rem',
  ratio = '2:1'
}) => {
  // Parse ratio (e.g., '2:1' -> [2, 1])
  const [leftRatio, rightRatio] = ratio.split(':').map(Number);
  
  return (
    <div className={styles.container}>
      <div 
        className={styles.grid}
        style={{
          gridTemplateColumns: `minmax(0, ${leftRatio}fr) minmax(0, ${rightRatio}fr)`
        }}
      >
        <div className={styles.mainContent}>
          {children}
        </div>
        
        <div 
          className={`${styles.sidebar} ${sidebarSticky ? styles.sticky : ''}`}
          style={sidebarSticky ? { top: sidebarTop } : {}}
        >
          {sidebar}
        </div>
      </div>
    </div>
  );
};

export default TwoColumnLayout;
