import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import FollowCardano from '@site/src/components/FollowCardano';
 

function FollowCardanoSection() {
  return (
    <div className={styles.container}>  
      <FollowCardano 
        title ='Get Involved' />
    </div>
  );
}

export default FollowCardanoSection;
