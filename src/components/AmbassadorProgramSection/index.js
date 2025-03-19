import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Divider from "@site/src/components/Layout/Divider"; 
import TitleWithText from "@site/src/components/Layout/TitleWithText"; 

export default function AmbassadorProgramSection({}) {
  const context = useDocusaurusContext();

  return (
    <div>
       <Divider text="Ambassador Program" id="program"/>
        <TitleWithText
          title="The Cardano Community Ambassador Program"
          description={[
              "The Cardano community is privileged to have committed members who actively contribute to the growth and decentralization of the ecosystem. These dedicated individuals, known as Cardano Ambassadors, play a crucial role in expanding awareness and engagement through their impactful efforts.",
              
              "The Ambassadors come from diverse backgrounds, ages, and professions, representing countries from around the world. They contribute valuable content in more than 17 languages. New Ambassadors are welcomed through a review process that highlights individuals who consistently contribute with impact, dedication, and a commitment to strengthening the ecosystem.",

              "Since its inception in 2018, the Ambassador Program has gone through a number of updates. The latest phase now focuses on impact and transparency. This change ensures that contributions are fairly measured and recognized. Ambassadors contributions are recognized through both monetary rewards, and non-financial incentives, including early access to educational resources, networking opportunities, and increased visibility within the community."
          ]}
          titleType="black"
          headingDot={true}
        />
    </div>
  );
}
