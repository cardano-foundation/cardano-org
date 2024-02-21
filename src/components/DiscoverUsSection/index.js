import React from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css";  
import Link from "@docusaurus/Link";
import useBaseUrl from '@docusaurus/useBaseUrl';

//
// See Us, Know Us, Join Us


function LogoLink({ imageName, to }) {
  const imageUrl = useBaseUrl(`/img/logos/${imageName}.svg`);
  
  return (
      <div className={styles.logoWrap}>
        <Link to={to}><img src={imageUrl} alt={imageName} /></Link>
      </div>
  );
}

 
function DiscoverUsSection({ }) {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <div class="container">
       
    <div className={clsx('container', styles.boxWrap)}>
      
        <div className={styles.leftColumn}>
          <p>See Us</p>
          <p>Know Us</p>
          <p>Join Us</p>
        </div>
        <div className={styles.rightColumn}>
          <p>We strive to deliver positive global change and, together, with our partners, 
            power a new age of possibility. </p>
        
          <p>A future that serves the many as well as the few, and which empowers individuals, societies, 
            and businesses to imagine and create new ways of transacting, interacting, creating, and governing.</p>


            <LogoLink imageName={'cardanofoundation-white'} to={'/partners/?tab=cardano-foundation#partners-section'} />
            <p>An independent standards body based in Switzerland with core responsibilities to oversee and supervise 
              the development of Cardano and its ecosystem. The Cardano Foundation works to drive adoption, shape blockchain 
              governance, set commercial standards, and support the community of Cardano users.</p>

              <LogoLink imageName={'emurgo-white'} to={'/partners/?tab=emurgo#partners-section'} />
            <p>EMURGO is the enterprise arm of Cardano, operating to boost the platform through commercial ventures. EMURGO 
              develops, supports, and incubates commercial opportunities and helps integrate businesses into our decentralized 
              blockchain system.</p>

              <LogoLink imageName={'iog-white'} to={'/partners/?tab=iog#partners-section'} />
            <p>This is the technology and engineering company contracted to design, build, and maintain the Cardano platform. 
              Founded by Charles Hoskinson and Jeremy Wood, IOG is committed to innovation through rigorous peer-to-peer 
              scientific review and the highest standards of assurance in software development.</p>
        </div>
    </div>
     
    </div>
  );
};

export default DiscoverUsSection;