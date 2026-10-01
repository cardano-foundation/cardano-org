import { translate } from "@docusaurus/Translate";

// Role survey for /governance as literal translate() calls so the strings
// reach Crowdin. Outcome ids and scores drive the result and stay untranslated.
export function getGovernanceRoleSurvey() {
  return {
    outcomes: [
      {
        id: "delegate",
        title: translate({
          id: "governance.survey.outcome.delegate.title",
          message: "Delegate your voting power",
        }),
        description: translate({
          id: "governance.survey.outcome.delegate.description",
          message:
            "Delegation is the easiest way to participate. A DRep votes on proposals on your behalf while your ada stays safely in your wallet. It takes just a few minutes to set up and you can change your DRep at any time.",
        }),
        ctaText: translate({
          id: "governance.survey.outcome.delegate.ctaText",
          message: "Choose a DRep",
        }),
        ctaLink: "/governance/delegate",
      },
      {
        id: "drep",
        title: translate({ id: "governance.survey.outcome.drep.title", message: "Become a DRep" }),
        description: translate({
          id: "governance.survey.outcome.drep.description",
          message:
            "You have the time and motivation to actively shape Cardano. As a DRep you review governance proposals, vote on behalf of your delegators, and help steer the network's future. A refundable deposit of 500 ada is required.",
        }),
        ctaText: translate({
          id: "governance.survey.outcome.drep.ctaText",
          message: "Register as a DRep",
        }),
        ctaLink: "https://docs.gov.tools/about/what-is-cardano-govtool/govtool-functions/dreps/register-as-a-drep",
      },
      {
        id: "learn",
        title: translate({
          id: "governance.survey.outcome.learn.title",
          message: "Start by learning more",
        }),
        description: translate({
          id: "governance.survey.outcome.learn.description",
          message:
            "Governance is new to you and that's perfectly fine. Take your time to understand how it works, read the constitution, and explore governance actions before choosing your role.",
        }),
        ctaText: translate({
          id: "governance.survey.outcome.learn.ctaText",
          message: "Explore governance actions",
        }),
        ctaLink: "/insights/governance-actions/?category=General#charts",
      },
    ],
    questions: [
      {
        question: translate({
          id: "governance.survey.question.time",
          message: "How much time can you dedicate to Cardano governance?",
        }),
        options: [
          {
            text: translate({
              id: "governance.survey.question.time.option1",
              message: "A few minutes to set it up, then I'm done",
            }),
            scores: { delegate: 3, learn: 1 },
          },
          {
            text: translate({
              id: "governance.survey.question.time.option2",
              message: "I can check in occasionally",
            }),
            scores: { delegate: 2, learn: 1 },
          },
          {
            text: translate({
              id: "governance.survey.question.time.option3",
              message: "I want to stay informed and vote regularly",
            }),
            scores: { drep: 2 },
          },
          {
            text: translate({
              id: "governance.survey.question.time.option4",
              message: "I'm ready to make it a regular commitment",
            }),
            scores: { drep: 3 },
          },
        ],
      },
      {
        question: translate({
          id: "governance.survey.question.voteSelf",
          message: "Do you want to vote on every governance proposal yourself?",
        }),
        options: [
          {
            text: translate({
              id: "governance.survey.question.voteSelf.option1",
              message: "No, I'd rather have someone knowledgeable vote on my behalf",
            }),
            scores: { delegate: 3 },
          },
          {
            text: translate({
              id: "governance.survey.question.voteSelf.option2",
              message: "Not yet, I want to understand the process first",
            }),
            scores: { learn: 2, delegate: 1 },
          },
          {
            text: translate({
              id: "governance.survey.question.voteSelf.option3",
              message: "Yes, I want to review and vote on proposals myself",
            }),
            scores: { drep: 2 },
          },
          {
            text: translate({
              id: "governance.survey.question.voteSelf.option4",
              message: "Yes, and I want to represent others too",
            }),
            scores: { drep: 3 },
          },
        ],
      },
      {
        question: translate({
          id: "governance.survey.question.familiarity",
          message: "How familiar are you with Cardano's governance processes?",
        }),
        options: [
          {
            text: translate({
              id: "governance.survey.question.familiarity.option1",
              message: "I'm completely new to this",
            }),
            scores: { learn: 3 },
          },
          {
            text: translate({
              id: "governance.survey.question.familiarity.option2",
              message: "I understand the basics",
            }),
            scores: { delegate: 2, learn: 1 },
          },
          {
            text: translate({
              id: "governance.survey.question.familiarity.option3",
              message: "I'm comfortable with most governance concepts",
            }),
            scores: { drep: 1, delegate: 1 },
          },
          {
            text: translate({
              id: "governance.survey.question.familiarity.option4",
              message: "I have deep knowledge and can explain them to others",
            }),
            scores: { drep: 3 },
          },
        ],
      },
      {
        question: translate({
          id: "governance.survey.question.responsibility",
          message: "Would you be comfortable making decisions that affect the entire Cardano network?",
        }),
        options: [
          {
            text: translate({
              id: "governance.survey.question.responsibility.option1",
              message: "I'd rather leave that to people who know more",
            }),
            scores: { delegate: 3 },
          },
          {
            text: translate({
              id: "governance.survey.question.responsibility.option2",
              message: "Maybe in the future, once I learn more",
            }),
            scores: { learn: 2, delegate: 1 },
          },
          {
            text: translate({
              id: "governance.survey.question.responsibility.option3",
              message: "Yes, I'm ready to take on that responsibility",
            }),
            scores: { drep: 2 },
          },
          {
            text: translate({
              id: "governance.survey.question.responsibility.option4",
              message: "Yes, and I want to advocate for specific policy directions",
            }),
            scores: { drep: 3 },
          },
        ],
      },
      {
        question: translate({
          id: "governance.survey.question.motivation",
          message: "What motivates you most about Cardano governance?",
        }),
        options: [
          {
            text: translate({
              id: "governance.survey.question.motivation.option1",
              message: "Making sure my ada has a voice without extra effort",
            }),
            scores: { delegate: 3 },
          },
          {
            text: translate({
              id: "governance.survey.question.motivation.option2",
              message: "Understanding how decentralized decision-making works",
            }),
            scores: { learn: 3 },
          },
          {
            text: translate({
              id: "governance.survey.question.motivation.option3",
              message: "Actively shaping the future direction of Cardano",
            }),
            scores: { drep: 2 },
          },
          {
            text: translate({
              id: "governance.survey.question.motivation.option4",
              message: "Representing my community and building trust",
            }),
            scores: { drep: 3 },
          },
        ],
      },
    ],
  };
}
