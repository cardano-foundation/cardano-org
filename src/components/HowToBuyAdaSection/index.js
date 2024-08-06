import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import FeaturedTitleWithText from "@site/src/components/Layout/FeaturedTitleWithText";

export default function HowToBuyAdaSection() {
  return (
    <section className={styles.container}>
      <div className={styles.backgroundImageContainer}>
        {/* FeaturedTitleWithText */}
        <div className="container">
          <div className="row">
            <div className={clsx("col col--6", styles.leftColumn)}>
              <h1 className="headingDot">How Do I Buy/Sell Ada?</h1>
            </div>
            <div className={clsx("col col--6", styles.rightColumn)}>
              <p>
               There are many ways to obtain ada to use the Cardano blockchain. 
                Find out on <Link to="/where-to-get-ada">where to get ada?</Link>
              </p>
              <p>
                As an ada holder, it is important to keep your funds secure, and
                that means you need to keep your private keys private. It is
                highly recommended to avoid keeping your cryptocurrency in an
                exchange longer than necessary, and instead to use a
                cryptocurrency wallet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
