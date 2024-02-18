import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import FeaturedTitleWithText from '@site/src/components/FeaturedTitleWithText';

function HowToBuyAdaSection() {
  return (
    <section className={styles.container}>  
      <div className={styles.backgroundImageContainer}>

        {/* FeaturedTitleWithText */}
        <div className="container">
          <div className="row">
            <div className={clsx('col col--6', styles.leftColumn)}>
              <h1 className={styles.headingDot}>
              How Do I Buy/Sell Ada?
              </h1>
              
            </div>
            <div className={clsx('col col--6', styles.rightColumn)}>
            <p>You can buy or sell ada for fiat or other cryptocurrencies using cryptocurrency exchanges.  
            Visit <a href="https://coinmarketcap.com/">coinmarketcap</a> to see the list of exchanges that support ada.</p>
            <p>As an ada holder, it is important to keep your funds secure, and that means you need to keep your 
            private keys private. It is highly recommended to avoid keeping your cryptocurrency in an exchange 
            longer than necessary, and instead to use a cryptocurrency wallet.</p>
              
            </div>
          </div> 
      </div>  
      </div>
    </section>
  );
}

export default HowToBuyAdaSection;
