import ScrollExpandHero from "@/components/sections/ScrollExpandHeroSection";
import ProblemSection from "@/components/home/ProblemSection";
import ServiceCards from "@/components/home/ServiceCards";
import ProofStats from "@/components/home/ProofStats";
import LogoMarquee from "@/components/home/LogoMarquee";
import FaqTestimonials from "@/components/home/FaqTestimonials";
import ClosingCta from "@/components/home/ClosingCta";

// Beranda = etalase. Tugasnya memilah pengunjung ke tiga layanan dalam sekali gulir (PRD Website v1).
// Urutan: Hero, Masalah, Tiga layanan, Bukti angka, Logo bergerak, Testimoni + FAQ, Ajakan penutup.
export default function Home() {
  return (
    <>
      <ScrollExpandHero />
      <ProblemSection />
      <ServiceCards />
      <ProofStats />
      <LogoMarquee />
      <FaqTestimonials />
      <ClosingCta />
    </>
  );
}
