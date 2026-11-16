import { translate } from "@docusaurus/Translate";

// FAQ for /stake-pool-operation as literal translate() calls so the strings
// reach Crowdin. Answer lines starting with "- " render as list items.
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
            "Income depends on how much stake your pool attracts, how many blocks it produces and the fees you set. Every pool charges a fixed fee per epoch of at least the [protocol minimum](/glossary/min-pool-cost), plus an optional margin, and both come out of the pool's rewards before the rest goes to delegators. Small pools may not produce a block in every epoch, so their income varies a lot. Registering a pool also takes a refundable 500 ada [deposit](/glossary/stake-pool-deposit). The [rewards calculator](/calculator) gives estimates only, never a guarantee.",
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
        message: "Which operating systems can run a stake pool?",
      }),
      answer: [
        translate({
          id: "stakePoolOperation.faq.os.a1",
          message:
            "Block producers and relays are supported on 64-bit Linux only. The node also runs on Windows and macOS, but only as a desktop client. The [cardano-node release notes](https://github.com/IntersectMBO/cardano-node/releases) list the supported distributions and the minimum hardware.",
        }),
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
            "Yes, this is technically possible. Register a stake pool and set its margin to 100%, so delegators to your pool receive no rewards and have no reason to join. You can still stake your own ada and test your stake pool operations.",
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
            "Delegators compare pools by their block production, fees, pledge and saturation, so keep your pool online and producing the blocks it is elected for. Your [pledge](/glossary/pledge), the ada you commit to your own pool, is visible to everyone. Additionally, stake pool operators can inform users about:",
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
            "Pledging means committing your own ada to your pool. There is no required minimum, but the pool owners must delegate at least the declared pledge to the pool, or it earns no rewards for that epoch. All else being equal and up to saturation, a higher pledge slightly increases the pool's rewards, and the [a0](/glossary/a0) protocol parameter sets by how much. [Read more on pledging on the IOHK blog](https://iohk.io/en/blog/posts/2020/05/12/how-pledging-encourages-a-healthy-decentralized-cardano-ecosystem/).",
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
            "Stake pool operators need to stay available to respond to network or performance alerts and keep their node on a supported release. New node versions and required upgrades are published on the [cardano-node release page](https://github.com/IntersectMBO/cardano-node/releases).",
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
            "Wallets and pool explorers show each pool's performance, which compares the blocks it actually made with the blocks it was expected to make given its stake. Delegators also look at fees, pledge and saturation. We recommend that ada holders also do their own independent research when choosing where to delegate their stake.",
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
            "Yes, if you sign up for [stake pool operator updates](/signal-operator-notification). New node versions are also published on the [cardano-node release page](https://github.com/IntersectMBO/cardano-node/releases).",
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
            "No. Rewards depend on how many blocks the pool produces, which follows its stake but also involves luck, and on the fees it charges. The protocol pays rewards directly to the operator and the delegators, and a pool never holds delegated ada. Rewards also start with a delay: stake delegated in epoch N becomes active in epoch N+2, and the first rewards are paid at the start of epoch N+4.",
        }),
      ],
    },
  ];
}
