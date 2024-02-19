import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import FollowCardano from '@site/src/components/FollowCardano';
import Divider from '@site/src/components/Divider';

function FollowCardanoSection() {
  return (
    <section className={styles.container}>  

    <div class="container">
      <div className={styles.header}>
        <h6>Social</h6>
        <div className={styles.horizontalBar}></div>
      </div>
    </div>

      <FollowCardano 
        title ='Get Involved'
        iconForegroundColor="#0136AE"
        iconBackgroundColor="#ffffff" 
      />
      
    </section>
  );
}

export default FollowCardanoSection;
