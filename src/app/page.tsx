import HeroLanding from "@/components/sections/HeroLanding";
import ProblemSection from "@/components/sections/ProblemSection";
import RTOExplainer from "@/components/sections/RTOExplainer";
import PathwayCards from "@/components/sections/PathwayCards";
import DPAccelerator from "@/components/sections/DPAccelerator";
import ConsTechSection from "@/components/sections/ConsTechSection";
import TrackRecord from "@/components/sections/TrackRecord";
import PersonaCards from "@/components/sections/PersonaCards";
import LeadCaptureSection from "@/components/sections/LeadCaptureSection";
import EcosystemPreview from "@/components/sections/EcosystemPreview";
import FAQSection from "@/components/sections/FAQSection";

export default function Home() {
  return (
    <>
      <HeroLanding />
      <ProblemSection />
      <RTOExplainer />
      <PathwayCards />
      <DPAccelerator />
      <ConsTechSection />
      <TrackRecord />
      <PersonaCards />
      <LeadCaptureSection />
      <EcosystemPreview />
      <FAQSection />
    </>
  );
}
