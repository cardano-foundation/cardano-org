import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import DottedImageWithText from "@site/src/components/Layout/DottedImageWithText";
import SpacerBox from "@site/src/components/Layout/SpacerBox";

//
// This component:
// Proof of stake and proof of work section

export default function ProofOfStakeSection() {
  return (
    <BackgroundWrapper backgroundType="solidGrey">
      <BoundaryBox>
        <Divider text="Proof of stake" />
        <TitleWithText
          title="Proof of stake and proof of work"
          description={[
            "There are two main blockchain protocols: proof-of-stake (PoS) and proof-of-work (PoW). These protocols are consensus \
            algorithms for distributed networks: rulesets that dictate how networks – made up of thousands of nodes – agree on \
            new additions (blocks) in a permissionless setting.",
          ]}
          headingDot={true}
        />

        <DottedImageWithText
          imageName="proof-of-work"
          text={[
            "Proof-of-work is the blockchain protocol used by bitcoin. Proof-of-work began a revolution: it enabled the creation of \
              secure, permissionless, distributed networks. But to achieve consensus for each new block, proof-of-work requires an \
              enormous amount of energy: an amount so large that the supported blockchains struggle to sustain and scale to the \
              performance requirements of global networks.",
          ]}
        />

        <TitleWithText
          description={[
            "Proof-of-stake answers the performance and energy-use challenges of proof-of-work, and arrives at a more sustainable \
            solution. Instead of relying on 'miners' to solve computationally complex equations to create new blocks – and rewarding \
            the first to do so – proof of stake selects participants (in the case of Cardano, stake pools) to create new blocks based \
            on the stake they control in the network.",
          ]}
        />

        <DottedImageWithText
          imageName="proof-of-stake"
          text={[
            "This enables networks to scale horizontally, increasing performance by incorporating additional nodes, rather than \
              vertically, through the addition of more powerful hardware. The resulting difference in energy use can be analogized \
              to that between a household and a small country. PoS is positioned scale to the mass market; PoW is not.",
          ]}
        />

        <SpacerBox size="medium" />

        <TitleWithText title="How Ouroboros Works" headingDot={true} />
        <DottedImageWithText
          imageName="chains"
          text={[
            "Ouroboros processes transaction blocks by dividing chains into epochs, which are further divided into time slots. \
              A slot leader is elected for each time slot and is responsible for adding a block to the chain. To protect against \
              adversarial attempts to subvert the protocol, each new slot leader is required to consider the last few blocks of the \
              received chain as transient: only the chain that precedes a prespecified number of transient blocks is considered \
              settled. This is also referred to as the settlement delay, and is the mechanism through which the ledger is securely \
              passed between participants.",
          ]}
        />

        <DottedImageWithText
          imageName="innovation"
          text={[
            "Ouroboros is a meld of innovative technology and philosophy. Its research explores how we behave as a society, \
              to discover an ideal balance - defined through game theory - between individual and collective interests. \
              Ouroboros’ incentive mechanism rewards participants for their honest participation, and disincentivizes dishonest \
              actors. It is a stable and sustainable foundation for permission networks that are built to endure: the infrastructure \
              of the future.",
          ]}
        />

        <div className={styles.buttonWrap}>
          <Link
            to="/research#byron"
            className={clsx(
              "button button--primary button--lg",
              styles.buttonLink
            )}
          >
            Learn more
          </Link>
        </div>

        <SpacerBox size="medium" />
        
      </BoundaryBox>
    </BackgroundWrapper>

  );
}
