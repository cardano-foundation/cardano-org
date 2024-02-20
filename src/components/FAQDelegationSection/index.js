import React, { useState }  from "react";
import clsx from "clsx";
import styles from './styles.module.css';
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Divider from '@site/src/components/Divider';
import ThemedImage from '@theme/ThemedImage';
import Collapsible from 'react-collapsible';

//
// This component:
// delegation faq

const faqList = [
  {
    question: "What is a stake pool?",
    answer: (
      <div>
        <p>
          Stake pools are run by stake pool operators. These are network participants with the skills to reliably ensure 
          consistent uptime of a node, which is essential in ensuring the success of the Ouroboros protocol and the 
          Cardano network as a whole.
        </p>
        <p>
          The protocol uses a probabilistic mechanism to select a leader for each slot, who will be expected to create 
          the next block in the chain. The chance of a stake pool node being selected as slot leader increases 
          proportionately to the amount of stake delegated to that node. Each time a stake pool node is selected as a 
          slot leader and successfully creates a block, it receives a reward, which is shared with the pool proportionate 
          to the amount each member has delegated. Stake pool operators can deduct their running costs from the awarded 
          ada, as well as specify a profit margin for providing the service.
        </p>
      </div>
    )
  },
  {
    question: "Can I re-delegate my stake to another pool?",
    answer: (
      <p>
        Yes. Delegated stake can be re-delegated to another pool at any time. Re-delegated stake will remain in the current
         pool until the epoch after next (from the point of re-delegation), after which your delegation preferences will be 
         updated on the chain and your stake moved to the new stake pool. Rewards are distributed from the end of each epoch, 
         so you’ll continue to receive rewards from your original stake pool for two epochs before your new delegation 
         preferences are applied.
      </p>
    )
  },
  {
    question: "Can I delegate to multiple stake pools?", // fixme: different wallets have support for this
    answer: (
      <div>
        <p>
          In Yoroi, it is possible to delegate to multiple pools using a single wallet, but not in Daedalus. To delegate to 
          multiple pools in Daedalus, you will need to create separate wallets. The stake associated with each wallet can then 
          be delegated to a specific stake pool.
        </p>
        <p>
          It is worth noting that multiple-pool delegation using a single wallet will not be supported on the mainnet.
        </p>
      </div>
    )
  },
  {
    question: "What is stake pool performance?", 
    answer: (
      <div>
        <p>
        The performance metric is an indicator of how well a stake pool is performing. Considering that the slot leader 
        election process is private, it is only possible to estimate how often the stake pool should be elected based on 
        the number of actually produced blocks. A pool can be nominated more often than expected based on its stake. 
        For example, if a pool only produces half the number of blocks that it was nominated for, its performance rating is 
        50%. This could happen because the pool has a poor network connection, or has been turned off by its operator.
        </p>
        <p>
        Performance ratings make more sense over a longer period of time. If a pool has not yet been selected to produce 
        a block in the current epoch, its performance rating will be 0%, even if it is likely to produce blocks later in 
        the epoch. Performance ratings of over 100% are possible if a pool creates more blocks than it was nominated to produce.
        </p>
        <p>
        In Daedalus and Yoroi, performance contributes to a stake pool’s ranking.
        </p>
      </div>
    )
  },
  {
    question: "What is stake pool saturation?", 
    answer: (
      <div>
        <p>
        Saturation is a term used to indicate that a particular stake pool has more stake delegated to it than is ideal for the 
        network, and once a pool reaches the point of saturation it will offer diminishing rewards. The saturation mechanism was 
        designed to prevent centralization by encouraging delegators to delegate to different stake pools, and operators to set 
        up alternative pools so that they can continue earning maximum rewards. Saturation, therefore, exists to preserve the 
        interests of both ada holders delegating their stake and stake pool operators.
        </p>
        <p>
        The goal is to avoid any single pool becoming too large – thereby disincentivizing delegation to other pools – and 
        receiving a disproportionate amount of the rewards. The health of the network is partly determined by having a high 
        number of active stake pools with a balanced amount of stake delegated to them. The more numerous and geographically 
        diverse the network’s pools, the better. Each stake pool’s saturation percentage is shown within the Daedalus stake pool 
        selection menu.
        </p>
      </div>
    )
  },
];

const FAQDelegationSection = ({ }) => {

  // to maintain the alternating background we need to 
  // manage the active state of each Collabsible on our own
  const [activeIndex, setActiveIndex] = useState(null);

  const handleClick = (index) => {
    // If the clicked index is already active, set it to null (closed)
    // Otherwise, set the active index to the clicked index
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="container">
      <Divider headline='FAQ' />
      {faqList.map((faq, index) => (
        <div 
          key={index} 
          className={`Collapsible ${index % 2 === 0 ? 'even' : 'odd'} ${activeIndex === index ? 'active' : ''}`}
          onClick={() => handleClick(index)}
        >
          <Collapsible trigger={faq.question}>
            {faq.answer}
          </Collapsible>
        </div>
      ))}
    </div> 
  );
};

export default FAQDelegationSection;