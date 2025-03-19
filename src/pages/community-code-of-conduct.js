
import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="Community Code Of Conduct"
      description="The Cardano community consists of people from all over the world, who have come together to grow and safeguard the spirit and the future of Cardano."
      bannerType="braidBlack"
    />
  );
}

export default function Home() {

  return (
    <Layout
    title="Community Code of Conduct | cardano.org"
    description="The Cardano community consists of people from all over the world, who have come together to grow and safeguard the spirit and the future of Cardano."
    >
      <OpenGraphInfo pageName="community-code-of-conduct" />
      <HomepageHeader />
      <main>
        <BoundaryBox>
          <SpacerBox size="small" />
          <TitleWithText  
              description={[
                "The Cardano community consists of people from all over the world, who have come together to grow and safeguard \
                the spirit and the future of Cardano. All participants in the community are expected to act lawfully, honestly, \
                ethically and in the best interest of the project. This Code of Conduct offers rules and guidelines designed to \
                aid judgment within our community and keep it a clean and well-lighted place for civilised public discourse about \
                the project. By joining and participating in any of the official Cardano community channels, you confirm that you \
                agree to be bound by the Code of Conduct.",
              ]}
              titleType="black"
              headingDot={true}
            />

            <TitleWithText
              title = "Improve the discussion"    
              description={[
                "Help us make the community a great place for discussion by always working to improve the discussion in some way, \
                however small. If you are not sure your post adds to the conversation, think over what you want to say and try again \
                later. The topics discussed in the community matter to us, and we want you to act as if they matter to you, too. \
                Be respectful of the topics and the people discussing them, even if you disagree with some of what is being said.",

                "One way to improve the discussion is by discovering ones that are already happening. Spend some time to search the \
                community platform before replying and you'll have a better chance of meeting others who share your interests. Always \
                look to add value. Discussion should be healthy and informative and members should provide meaningful contribution \
                towards the development of Cardano. This means any content shared or uploaded online should be relevant to the \
                community. Please also refrain from posting or spread misinformation or fake news that attempt to create fear or \
                doubt.",
                
                "We also do not allow trading or shilling of ada or any other tokens, goods or services.",
              ]}
              titleType="black"
              headingDot={true}
            />

            <TitleWithText
              title = "Be agreeable, even when you disagree"    
              description={[
                "You may wish to respond to something by disagreeing with it. That's fine. But remember to criticise ideas, not \
                people. Please avoid:",
                
                {
                  list: [
                    "Name-calling",
                    "Ad hominem attacks",
                    "Responding to a post's tone instead of its actual content",
                    "Knee-jerk reaction",
                    "Caps Lock. We consider this as electronic shouting",
                  ],
                },

                "Instead, provide reasoned counter-arguments that improve the conversation. Please also remember the rule above \
                to add value and meaningful discussion. The Cardano community channels should not be used for personal disputes \
                between community members.",
              ]}
              titleType="black"
              headingDot={false}
            />

            <TitleWithText
              title = "Your participation counts"    
              description={[
                "The conversations we have in the community sets the tone for every new arrival. Help us influence the future of \
                this community by choosing to engage in discussions that make this forum an interesting place to be --- and avoiding \
                those that do not.",
    
              ]}
              titleType="black"
              headingDot={true}
            />

            <TitleWithText
              title = "If you see a problem, report it"    
              description={[
                "Moderators have special authority within the community; they are responsible for ensuring members adhere to this \
                conduct. But so are you. With your help, moderators can be community facilitators. When you see bad behaviour, don't \
                reply. It encourages the bad behaviour by acknowledging it, consumes your energy, and wastes everyone's time. Just \
                report it! Below are specific instructions on how to report violations in each channel.",
                
                {
                  list: [
                    "[Cardano Forum](https://forum.cardano.org): if you see a post that you think violates the Cardano Community Code of Conduct, click the options button \
                    and flag it as inappropriate or leave a more detailed message for the moderators.",
                    "[Reddit](https://www.reddit.com/r/cardano): you can report any post in Reddit by clicking on the 'Report' button underneath all posts. You are required \
                    to provide further information as to which rules or laws the post infringes. Reddit moderators will then review your request.",
                    "[Telegram](https://t.me/CardanoAnnouncements): any message can be reported by right clicking on it. This will go to the platform. There is also a \
                    [Report to Admin](https://t.me/CardanoReportToAdmin) channel, specifically for reporting offensive content or abusive users. You can also forward any messages in \
                    violation of the code in a DM to any of our admins.",
                    "[Facebook](https://www.facebook.com/groups/CardanoCommunity): you can report any post in our Facebook group by clicking the arrow in the top right corner of the post and \
                    selecting Report. This alerts the moderators and admins to review.",
                    "[Twitter](https://twitter.com/cardano): you can report any tweet directly to Twitter by clicking on the drop down menu on the tweet itself. Please \
                    note that reports on tweets will go directly to Twitter and not the Cardano moderating team.",
                  ],
                },

                "In order to maintain our community, moderators reserve the right to remove any content and any user account for any \
                reason at any time. Moderators do not preview new posts; the moderators and site operators take no responsibility for \
                any content posted by the community.",
                
                "And on the other hand, if you feel your content has been inaccurately removed, the Community team can perform a secondary \
                review. Please provide details of your post to community *at* cardano *dot* org. Please be aware that escalating to secondary review \
                should only be for serious concerns and it may take some time for the community team to respond.",
                
              ]}
              titleType="black"
              headingDot={false}
            />

            <TitleWithText
              title = "Always be civil"    
              description={[
                "Nothing sabotages a healthy conversation like rudeness:",
                
                {
                  list: [
                    "Be civil. Don't post anything that a reasonable person would consider offensive, abusive, or hate speech.",
                    "Keep it clean. Don't post anything obscene or sexually explicit.",
                    "Respect each other. Don't harass or grief anyone, impersonate people, or expose their private information.",
                    "Respect our community. Don't post spam or otherwise vandalise the forum.",
                    "We take harassment seriously. Harassment includes offensive verbal comments related to gender, age, sexual \
                    orientation, disability, physical appearance, body size, race, religion, but also includes deliberate intimidation, \
                    stalking, following, sustained disruption of conversation. Harassment of members, admins or moderators will not be tolerated.",
                    "Do not post another community member's personal information including but not limited to name, address, phone number, social-media accounts.",
                    "Do not repost removed or deleted information.",
                  ],
                },

                "These are not concrete terms with precise definitions --- avoid even the appearance of any of these things. If you're unsure, \
                ask yourself how you would feel if your post was featured on the front page of a global news website. This is a public community, \
                and search engines index these discussions. Keep the language, links, and images safe for family and friends.",

              ]}
              titleType="black"
              headingDot={false}
            />

            <TitleWithText
              title = "Keep it tidy"    
              description={[
                "Make the effort to put things in the right place, so that we can spend more time discussing and less cleaning up. A healthy \
                community requires conversations to be structured and categorized. So:",
                {
                  list: [
                    "Don't start a conversation in the wrong category or channel.",
                    "Don't cross-post the same thing in multiple channels.",
                  ],
                },
              ]}
              titleType="black"
              headingDot={false}
            />

            <TitleWithText
              title = "Post only your own stuff"    
              description={[
                "You may not post anything digital that belongs to someone else without permission. You may not post descriptions of, links to, \
                or methods for stealing someone's intellectual property (software, video, audio, images), or for breaking any other law. Credit \
                should always be attributed back to the original content producer.",
              ]}
              titleType="black"
              headingDot={false}
            />

            <TitleWithText
              title = "Multiple Accounts"    
              description={[
                "Multiple accounts by the same user will not be allowed. This helps foster a more human experience in the online world and \
                restricts spamming. Note that duplicate accounts may be investigated and removed.",
              ]}
              titleType="black"
              headingDot={false}
            />

            <TitleWithText
              title = "Violation of rules"    
              description={[
                "If any of the rules are broken, moderators will perform the following sanctions:",
                {
                  list: [
                    "First offence: warning is given and the user will be suspended from their account for 24 hours.",
                    "Second offence: warning is given and the user will be suspended for a period of up to 1 month depending on the severity \
                    of the violation.",
                    "Third and final offence: if the user continues to repeatedly break community rules, their account will be banned from \
                    the community platform. This penalty may be applied across all community channels if necessary.",
                  ],
                },
                "The community team reserves the right to deny access to the official Community channels to anyone who has violated the Cardano \
                Community Code of Conduct."
              ]}
              titleType="black"
              headingDot={false}
            />

            <TitleWithText
              title = "Powered by you"    
              description={[
                "This community is operated by the community staff and you, the community. If you have any further questions about how things \
                should work here, open a new topic in the [community feedback category](https://forum.cardano.org/c/english/community-feedback/16) of the forum and let's discuss! If there is ever a critical \
                or urgent issue please contact us directly at community *at* cardano *dot* org.",
              ]}
              titleType="black"
              headingDot={true}
            />
           <SpacerBox size="medium" />
        </BoundaryBox>
      </main>
    </Layout>
  );
}
