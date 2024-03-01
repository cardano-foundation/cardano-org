import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Divider from "@site/src/components/Layout/Divider"; 
import TitleWithText from "@site/src/components/Layout/TitleWithText"; 

export default function AmbassadorProgramSection({}) {
  const context = useDocusaurusContext();

  return (
    <div>
       <Divider text="Ambassador Program" id="program"/>
        <TitleWithText
          title="The Cardano Ambassador Program"
          description={[
              "The Cardano community is privileged to have committed members.",
              
              "These active individuals drive adoption by going above and beyond their duties by offering timely, \
              consistent and beneficial contributions to the project. These special people are Cardano Ambassadors.",
              "Currently, the program includes ambassadors of all ages and professions from many different countries \
              across the globe, with more individuals qualifying during each review cycle. Cumulatively, existing ambassadors \
              produce content in more than two dozen languages.",

              "In a bid to further strengthen the transparency and decentralization of the Cardano ecosystem, the Cardano \
              Foundation introduced Phase 2 of the program in 2020 to motivate and recognize ambassadors for adding \
              value to the community and enhancing Cardano’s brand. Phase 2 includes both monetary and non-financial \
              rewards. The newest phase of the program contributes towards driving the adoption of Cardano through various means."
          ]}
          titleType="black"
          headingDot={true}
        />
    </div>
  );
}
