import ScrollExpandHero from "@/components/sections/ScrollExpandHeroSection";
import PickYourFit from "@/components/sections/PickYourFit";
import ProblemSection from "@/components/sections/ProblemSection";
import RTOExplainer from "@/components/sections/RTOExplainer";
import DPAccelerator from "@/components/sections/DPAccelerator";
import ConsTechSection from "@/components/sections/ConsTechSection";
import TrackRecord from "@/components/sections/TrackRecord";
import PersonaCards from "@/components/sections/PersonaCards";
import LeadCaptureSection from "@/components/sections/LeadCaptureSection";
import FAQSection from "@/components/sections/FAQSection";

export default function Home() {
  return (
    <>
      <ScrollExpandHero />
      <PickYourFit />
      <ProblemSection />
      <RTOExplainer />
      <DPAccelerator />
      <ConsTechSection />
      <TrackRecord />
      <PersonaCards />
      <LeadCaptureSection />
      <FAQSection />
    </>
  );
}
