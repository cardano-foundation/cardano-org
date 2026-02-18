import {translate} from '@docusaurus/Translate';
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";

export default function AmbassadorProgramSection({}) {
  return (
    <div>
       <Divider text={translate({id: 'ambassadors.program.divider', message: 'Ambassador Program'})} id="program"/>
        <TitleWithText
          title={translate({id: 'ambassadors.program.title', message: 'The Cardano Community Ambassador Program'})}
          description={[
              translate({id: 'ambassadors.program.description1', message: 'The Cardano community is privileged to have committed members who actively contribute to the growth and decentralization of the ecosystem. These dedicated individuals, known as Cardano Ambassadors, play a crucial role in expanding awareness and engagement through their impactful efforts.'}),
              translate({id: 'ambassadors.program.description2', message: 'The Ambassadors come from diverse backgrounds, ages, and professions, representing countries from around the world. They contribute valuable content in more than 17 languages. New Ambassadors are welcomed through a review process that highlights individuals who consistently contribute with impact, dedication, and a commitment to strengthening the ecosystem.'}),
              translate({id: 'ambassadors.program.description3', message: 'Since its inception in 2018, the Ambassador Program has gone through a number of updates. The latest phase now focuses on impact and transparency. This change ensures that contributions are fairly measured and recognized. Ambassadors contributions are recognized through both monetary rewards, and non-financial incentives, including early access to educational resources, networking opportunities, and increased visibility within the community.'})
          ]}
          titleType="black"
          headingDot={true}
        />
    </div>
  );
}
