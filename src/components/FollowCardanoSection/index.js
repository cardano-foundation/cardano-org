import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import FollowCardano from "@site/src/components/Layout/FollowCardano";
import Divider from "@site/src/components/Layout/Divider";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import {translate} from '@docusaurus/Translate';

export default function FollowCardanoSection() {
  return (
    <BackgroundWrapper backgroundType={"gradientLight"}>
      <BoundaryBox>
        <Divider text={translate({id: 'home.follow.divider', message: 'Social'})} id="follow" white={true} />
        <div className={styles.container}>
          <FollowCardano
            title={translate({id: 'home.follow.title', message: 'Get Involved'})}
            iconForegroundColor="#0136AE"
            iconBackgroundColor="#ffffff"
          />
        </div>
        </BoundaryBox>
    </BackgroundWrapper>
  );
}
