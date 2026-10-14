import { translate } from "@docusaurus/Translate";

// FAQ for /stake-pool-operation as literal translate() calls so the strings
// reach Crowdin. Answer lines starting with "- " render as list items.
//
// FIXME: some answers seem to be very outdated, also needs more links
// FIXME: need to make clear that protocol distributes rewards and pools do not have custody
export function getOperationFAQ() {
  return [
    {
      question: translate({
        id: "stakePoolOperation.faq.profit.q",
        message: "How much money will a stake pool operator make? Will it be profitable?",
      }),
      answer: [
        translate({
          id: "stakePoolOperation.faq.profit.a",
          message:
            "You can use the [rewards calculator](/calculator) to get an idea of the rewards you will earn. It’s important to note that the calculator produces only reward estimates and shouldn’t be considered definitive or a guarantee of reward amounts. Over time, parameters may be changed that could affect reward margins. Amounts calculated are therefore subject to change, but represent a realistic and sensible level of return.",
        }),
      ],
    },
    {
      question: translate({
        id: "stakePoolOperation.faq.skills.q",
        message: "What skills do stake pool operators require?",
      }),
      answer: [
        translate({
          id: "stakePoolOperation.faq.skills.a1",
          message: "As a stake pool operator, you will typically have:",
        }),
        "- " + translate({
          id: "stakePoolOperation.faq.skills.a2",
          message: "Operational knowledge of how to run and maintain a Cardano node on a 24/7 basis.",
        }),
        "- " + translate({
          id: "stakePoolOperation.faq.skills.a3",
          message: "System operation skills.",
        }),
        "- " + translate({
          id: "stakePoolOperation.faq.skills.a4",
          message: "Experience of development and operations. (DevOps)",
        }),
        "- " + translate({
          id: "stakePoolOperation.faq.skills.a5",
          message: "Server administration skills. (operational and maintenance)",
        }),
      ],
    },
    {
      question: translate({
        id: "stakePoolOperation.faq.os.q",
        message: "Which operating system do you support?",
      }),
      answer: [
        translate({
          id: "stakePoolOperation.faq.os.a1",
          message:
            "We support Linux, Berkeley Software Distribution (BSD), Mac, and Windows platforms. The following versions are required:",
        }),
        "- " + translate({ id: "stakePoolOperation.faq.os.a2", message: "Linux (2.6.18 or later)" }),
        "- " + translate({
          id: "stakePoolOperation.faq.os.a3",
          message: "BSD (NetBSD 8.x and FreeBSD 12.x)",
        }),
        "- " + translate({ id: "stakePoolOperation.faq.os.a4", message: "OSX (10.7 Lion or later)" }),
        "- " + translate({ id: "stakePoolOperation.faq.os.a5", message: "Windows 10" }),
      ],
    },
    {
      question: translate({
        id: "stakePoolOperation.faq.private.q",
        message: "Can I run a private stake pool?",
      }),
      answer: [
        translate({
          id: "stakePoolOperation.faq.private.a",
          message:
            "Yes, this is technically possible. It can be achieved by registering a stake pool and setting the operator rewards percentage to 100%, so that anybody that delegates to your stake pool will not receive any rewards. This will disincentivize delegators from delegating to you, but provide you with the ability to stake your ada and singly reap the rewards, while testing your stake pool operations.",
        }),
      ],
    },
    {
      question: translate({
        id: "stakePoolOperation.faq.attract.q",
        message: "How should I attract ada holders to my pool?",
      }),
      answer: [
        translate({
          id: "stakePoolOperation.faq.attract.a1",
          message:
            "Stake pools will be ranked by performance, so it is important that your stake pool is online and active when it is elected to create blocks. Stake pool operators can also pledge, through delegation, their personal stake to their own pool. By providing a pledge address when they register the pool, users will be able to see which pools have been pledged to by their operator. Additionally, stake pool operators can inform users about:",
        }),
        "- " + translate({
          id: "stakePoolOperation.faq.attract.a2",
          message: "Security: details of how a stake pool has been secured against hackers",
        }),
        "- " + translate({
          id: "stakePoolOperation.faq.attract.a3",
          message: "Team: information on the operator’s team and experience in managing stake pools",
        }),
        "- " + translate({
          id: "stakePoolOperation.faq.attract.a4",
          message: "Communication and social media: regular updates and support for delegators",
        }),
        "- " + translate({
          id: "stakePoolOperation.faq.attract.a5",
          message: "Website: stake pool information and marketing",
        }),
      ],
    },
    {
      question: translate({ id: "stakePoolOperation.faq.pledging.q", message: "What is pledging?" }),
      answer: [
        translate({
          id: "stakePoolOperation.faq.pledging.a",
          message:
            "Pledging refers to stake pool owners’ ability to delegate personal stake to their pool. While there is no required minimum pledge amount, pool operators can optionally pledge some or all of their stake to their pool to make their pool more attractive. The higher the amount of ada pledged, the more rewards the pool will receive, which will attract more delegation. The a0 protocol parameter defines the influence of the pledge on the pool reward. [Read more on pledging on the IOHK blog](https://iohk.io/en/blog/posts/2020/05/12/how-pledging-encourages-a-healthy-decentralized-cardano-ecosystem/).",
        }),
      ],
    },
    {
      question: translate({
        id: "stakePoolOperation.faq.bugs.q",
        message: "How will my pool be affected by bugs?",
      }),
      answer: [
        translate({
          id: "stakePoolOperation.faq.bugs.a",
          message:
            "Stake pool operators will need to be available as much as possible to respond to any network or performance alerts. It is important that pools ensure their node is running the latest software. This will be important both for testnet and mainnet operations.",
        }),
      ],
    },
    {
      question: translate({
        id: "stakePoolOperation.faq.goodPool.q",
        message: "What makes a good stake pool?",
      }),
      answer: [
        translate({
          id: "stakePoolOperation.faq.goodPool.a",
          message:
            "Stake pools are ranked based on their overall performance and other key information. The performance metric is a calculation based on the number of blocks the pool was tasked to create compared with the number of blocks it actually created, and is recorded over time. We recommend that ada holders also do their own independent research when choosing where to delegate their stake.",
        }),
      ],
    },
    {
      question: translate({
        id: "stakePoolOperation.faq.notifications.q",
        message: "Will I be notified of network changes?",
      }),
      answer: [
        translate({
          id: "stakePoolOperation.faq.notifications.a",
          message:
            "Updates and releases for the network will follow proper release schedules. We recommend operators follow our social media accounts for the latest updates.",
        }),
      ],
    },
    {
      question: translate({
        id: "stakePoolOperation.faq.rewards.q",
        message: "Are rewards guaranteed?",
      }),
      answer: [
        translate({
          id: "stakePoolOperation.faq.rewards.a",
          message:
            "Rewards for delegation can be earned if you delegate to a stake pool that is sharing rewards. The amount you earn cannot be guaranteed and will ultimately depend on the stake pool, the amount of rewards shared, and its performance. It is worth noting that rewards will only begin to be granted from the end of the epoch in which the associated stake was delegated.",
        }),
      ],
    },
  ];
}
